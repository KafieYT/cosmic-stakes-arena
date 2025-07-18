
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Coins } from 'lucide-react';

interface Winner {
  id: number;
  username: string;
  game: string;
  amount: number;
  multiplier: number;
  timestamp: Date;
}

const RecentWinners = () => {
  const [winners, setWinners] = useState<Winner[]>([]);

  // Simulation des gagnants fictifs
  useEffect(() => {
    const generateWinner = (): Winner => {
      const games = ['Mines', 'Crash', 'Dice', 'Roulette'];
      const usernames = ['Player123', 'LuckyGamer', 'CasinoKing', 'WinnerPro', 'BetMaster', 'SlotHero'];
      
      return {
        id: Math.random(),
        username: usernames[Math.floor(Math.random() * usernames.length)],
        game: games[Math.floor(Math.random() * games.length)],
        amount: Math.random() * 1000 + 10,
        multiplier: Math.random() * 50 + 1.1,
        timestamp: new Date()
      };
    };

    // Génération initiale
    const initialWinners = Array.from({ length: 8 }, generateWinner);
    setWinners(initialWinners);

    // Ajout périodique de nouveaux gagnants
    const interval = setInterval(() => {
      setWinners(prev => [generateWinner(), ...prev.slice(0, 7)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Trophy className="h-5 w-5 mr-2 text-accent" />
          Derniers Gagnants
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {winners.map((winner, index) => (
            <div 
              key={winner.id}
              className={`flex items-center justify-between p-4 border-b border-border/50 last:border-b-0 transition-all duration-500 ${
                index === 0 ? 'bg-primary/5 animate-pulse' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {winner.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-sm">{winner.username}</div>
                  <div className="text-xs text-muted-foreground">{winner.game}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-accent font-bold">
                  <Coins className="h-3 w-3 mr-1" />
                  {winner.amount.toFixed(2)}€
                </div>
                <Badge variant="secondary" className="text-xs">
                  {winner.multiplier.toFixed(2)}x
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentWinners;
