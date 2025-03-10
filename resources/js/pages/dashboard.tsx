import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Chess } from 'chess.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'react-chessboard/dist/chessboard/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type MoveForm = {
    fen: string;
    color: string;
};

type DashboardProps = {
    fen?: string;
    message?: string;
};

export default function Dashboard({ fen, message }: DashboardProps) {
    const chessboardWrapperRef = useRef<HTMLDivElement | null>(null);
    const [game] = useState<Chess>(new Chess());

    const [status, setStatus] = useState<string | undefined>(undefined);

    const { data, setData, post, processing, errors, reset, transform } = useForm<Required<MoveForm>>({
        fen: '',
        color: '',
    });

    const handlePost = useCallback(
        (fen: string) => {
            transform((form) => {
                form.fen = fen ?? '';
                form.color = 'black';

                return form;
            });

            post(route('chess.move'), {
                onSuccess: (result) => console.log(result),
                onFinish: (result) => console.log(result),
            });
        },
        [post, transform],
    );

    const updateStatus = useCallback(() => {
        let status = '';

        let moveColor = 'White';
        if (game.turn() === 'b') {
            moveColor = 'Black';
        }

        // checkmate?
        if (game.isCheckmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (game.isDraw()) {
            status = 'Game over, drawn position';
        }

        // game still on
        else {
            status = moveColor + ' to move';

            // check?
            if (game.isCheck()) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        setStatus(status);

        if (moveColor === 'Black') {
            const fen = game.fen();
            handlePost(fen);
        }
    }, [game, handlePost]);

    useEffect(() => {
        if (fen && fen !== game.fen()) {
            game.load(fen);
        }
        if (message) {
            const response = JSON.parse(message);
            const requestedMove = response.candidates?.[0]?.content?.parts?.[0]?.text;
            const moveSquares = requestedMove.trim().split('-');
            if (moveSquares.length !== 2) {
                console.error('Failed parsing response');
                return;
            }

            try {
                const move = game.move({
                    from: moveSquares[0],
                    to: moveSquares[1],
                    promotion: 'q',
                });

                if (!move) {
                    console.error('Gemini tried an invalid move!');
                    return;
                }
                updateStatus();
            } catch (e) {
                console.error('Failed making move', e);
            }
        }
    }, [game, fen, message, updateStatus]);

    function onDrop(sourceSquare: Square, targetSquare: Square) {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return false;

        updateStatus();
        return true;
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-row gap-4 rounded-xl p-4">
                <div id="chessboard" ref={chessboardWrapperRef} className="w-1/2">
                    <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
                </div>
                <div>
                    <h2>Game Status</h2>
                    <p>{status}</p>
                    <h2>Fen</h2>
                    <p>{fen}</p>
                </div>
            </div>
        </AppLayout>
    );
}
