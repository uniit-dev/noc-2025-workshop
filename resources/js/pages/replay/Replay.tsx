import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Replay',
        href: '/replay',
    },
];

type GameHistory = { game_id: string; user_id: string; fen: string; order: number }[];
export default function Replay({ replays }: { replays: Record<string, GameHistory> }) {
    console.log(replays);

    const chessboardWrapperRef = useRef<HTMLDivElement | null>(null);
    const gameIds = Object.keys(replays);
    const [currentGameId, setCurrentGameId] = useState(gameIds[0]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentGame = useMemo(() => replays[currentGameId], [currentGameId]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div id="chessboard" ref={chessboardWrapperRef} className="mx-auto w-full max-w-1/2 p-4">
                <Chessboard position={currentGame[currentIndex].fen} arePiecesDraggable={false} />
            </div>
            <div className="flex justify-center gap-4">
                <Button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} className="cursor-pointer">
                    <Icon iconNode={ArrowLeft} className="h-10 w-10" strokeWidth={5} />
                </Button>
                <Button
                    onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                    }}
                    disabled={currentIndex === currentGame.length - 1}
                    className="cursor-pointer"
                >
                    <Icon iconNode={ArrowRight} className="h-10 w-10" strokeWidth={5} />
                </Button>
            </div>
            <div className="grid gap-6 p-8">
                <div>
                    <span className="text-lg">Games:</span>
                    <ul className="flex flex-wrap gap-5">
                        {gameIds.map((gameId, index) => (
                            <li key={gameId} onClick={() => setCurrentGameId(gameId)}>
                                <Button variant={currentGameId === gameId ? 'default' : 'outline'}>Game {index + 1}</Button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <span className="text-lg">Moves:</span>
                    <ul className="flex gap-5">
                        {currentGame.map(({ order }) => (
                            <li
                                key={order}
                                className={`h-8 w-8 cursor-pointer rounded-md border p-1 text-center hover:border-black ${currentIndex === order ? 'bg-gray-200' : ''}`}
                                onClick={() => setCurrentIndex(order)}
                            >
                                {order + 1}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <span className="text-lg">Current Fen</span>
                    <p>{currentGame[currentIndex].fen}</p>
                </div>
            </div>
        </AppLayout>
    );
}
