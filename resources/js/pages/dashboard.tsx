import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Chess } from 'chess.js';
import { useCallback, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'react-chessboard/dist/chessboard/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const chessboardWrapperRef = useRef<HTMLDivElement | null>(null);
    const [game] = useState<Chess>(new Chess());
    const [fen, setFen] = useState('');

    const [status, setStatus] = useState<string | undefined>(undefined);

    const handlePost = useCallback(async (fen: string) => {
        const response = await fetch('/api/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fen: fen ?? '', color: 'black' }),
        });
        const data = await response.json();

        const { fen: newFen, message } = data;
        setFen(newFen);

        updateGame(newFen, message);
    }, []);

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

    const updateGame = useCallback(
        (fen: string, message: any) => {
            if (fen && fen !== game.fen()) {
                game.load(fen);
            }
            if (message) {
                const requestedMove = message.candidates?.[0]?.content?.parts?.[0]?.text;
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
        },
        [game, updateStatus],
    );

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
