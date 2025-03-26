import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { Chess } from 'chess.js';
import { LoaderCircle } from 'lucide-react';
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
    const [aiMoving, setAiMoving] = useState(false);
    const [lastMoveValid, setLastMoveValid] = useState(true);

    const [status, setStatus] = useState<string | undefined>(undefined);

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
        setFen(game.fen());
    }, [game]);

    const aiMove = useCallback(
        (requestedMove: string) => {
            if (!requestedMove) return false;

            const moveSquares = requestedMove.trim().split('-');
            if (moveSquares.length !== 2) {
                console.error('Failed parsing response');
                return false;
            }

            try {
                const move = game.move({
                    from: moveSquares[0],
                    to: moveSquares[1],
                    promotion: 'q', // NOTE: always promote to a queen for example simplicity
                });

                // illegal move
                if (move === null) return false;

                updateStatus();
            } catch (e) {
                console.error('Failed moving AI piece', e);
                return false;
            }
            return true;
        },
        [game, updateStatus],
    );

    const handlePost = useCallback(
        async (fen: string) => {
            setAiMoving(true);
            try {
                const response = await fetch('/api/move', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fen: fen ?? '', color: 'black' }),
                });
                const data = await response.json();

                const { requestedMove } = data;
                console.info('Requested move: ', requestedMove);

                const validMove = aiMove(requestedMove);
                setLastMoveValid(validMove);
                setAiMoving(false);
            } catch (e) {
                console.error('Failed moving AI piece', e);
                setAiMoving(false);
                setLastMoveValid(false);
            }
        },
        [aiMove],
    );

    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        });

        // illegal move
        if (move === null) return false;

        updateStatus();

        handlePost(game.fen());
        return true;
    };

    const handleRetryMove = () => {
        handlePost(fen);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-row justify-center gap-4 rounded-xl p-4">
                <div id="chessboard" ref={chessboardWrapperRef} className="relative w-1/2">
                    <Chessboard position={game.fen()} onPieceDrop={onDrop} arePiecesDraggable={!aiMoving} />
                    <div
                        className={`${aiMoving ? 'flex' : 'hidden'} bg-accent/50 absolute top-0 right-0 bottom-0 left-0 h-full w-full items-center justify-center`}
                    >
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    </div>
                    {!aiMoving && !lastMoveValid && (
                        <div className="bg-accent/50 absolute top-0 right-0 bottom-0 left-0 flex h-full w-full items-center justify-center">
                            <div className="rounded-sm bg-[#FDFDFC] p-8 text-[#1b1b18]">
                                <h2 className="text-lg">AI tried an invalid move</h2>
                                <Button
                                    type="button"
                                    onClick={handleRetryMove}
                                    className="mt-4 w-full rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a]"
                                    disabled={lastMoveValid}
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid rounded-sm bg-[#FDFDFC] p-8 text-[#1b1b18] md:grid-cols-2">
                <div>
                    <h2 className="text-lg">Game Status</h2>
                    <p>{status}</p>
                </div>
                <div>
                    <h2 className="text-lg">Current Fen</h2>
                    <p>{fen}</p>
                </div>
            </div>
        </AppLayout>
    );
}
