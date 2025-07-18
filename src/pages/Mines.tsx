
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bomb, Gem, TrendingUp, Coins } from 'lucide-react';

interface Cell {
  id: number;
  isRevealed: boolean;
  isMine: boolean;
  isDiamond: boolean;
}

const Mines = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<Cell[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [betAmount, setBetAmount] = useState('10.00');
  const [mineCount, setMineCount] = useState(3);
  const [revealedCount, setRevealedCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [balance] = useState(1000.00);

  const initializeGame = () => {
    const newGrid: Cell[] = [];
    
    // Créer la grille 5x5
    for (let i = 0; i < 25; i++) {
      newGrid.push({
        id: i,
        isRevealed: false,
        isMine: false,
        isDiamond: false
      });
    }

    // Placer les mines aléatoirement
    const minePositions = new Set<number>();
    while (minePositions.size < mineCount) {
      const randomPos = Math.floor(Math.random() * 25);
      minePositions.add(randomPos);
    }

    minePositions.forEach(pos => {
      newGrid[pos].isMine = true;
    });

    // Les autres cases sont des diamants
    newGrid.forEach(cell => {
      if (!cell.isMine) {
        cell.isDiamond = true;
      }
    });

    setGrid(newGrid);
    setGameState('playing');
    setRevealedCount(0);
    setMultiplier(1.0);
  };

  const handleCellClick = (cellId: number) => {
    if (gameState !== 'playing') return;

    const newGrid = [...grid];
    const cell = newGrid[cellId];
    
    if (cell.isRevealed) return;

    cell.isRevealed = true;

    if (cell.isMine) {
      // Game over - révéler toutes les mines
      newGrid.forEach(c => {
        if (c.isMine) c.isRevealed = true;
      });
      setGameState('lost');
    } else {
      // Diamant trouvé
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      
      // Calculer le nouveau multiplicateur
      const safeSpots = 25 - mineCount;
      const newMultiplier = Math.pow(safeSpots / (safeSpots - newRevealedCount), newRevealedCount);
      setMultiplier(newMultiplier);

      // Vérifier la victoire (toutes les cases sûres révélées)
      if (newRevealedCount === safeSpots) {
        setGameState('won');
      }
    }

    setGrid(newGrid);
  };

  const handleCashout = () => {
    if (gameState === 'playing' && revealedCount > 0) {
      setGameState('won');
      // Ici on ajouterait les gains au solde
    }
  };

  const resetGame = () => {
    setGrid([]);
    setGameState('idle');
    setRevealedCount(0);
    setMultiplier(1.0);
  };

  const currentWinnings = parseFloat(betAmount) * multiplier;

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} balance={balance} username="Player123" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Gem className="h-6 w-6 mr-2 text-accent" />
                    Mines
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    {gameState === 'playing' && (
                      <>
                        <Badge className="bg-primary/20 text-primary">
                          {revealedCount} diamants trouvés
                        </Badge>
                        <Badge className="bg-accent/20 text-accent">
                          {multiplier.toFixed(2)}x
                        </Badge>
                      </>
                    )}
                    {gameState === 'won' && (
                      <Badge className="bg-green-500/20 text-green-400">
                        Gagné ! +{currentWinnings.toFixed(2)}€
                      </Badge>
                    )}
                    {gameState === 'lost' && (
                      <Badge className="bg-destructive/20 text-destructive">
                        Perdu ! -{betAmount}€
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Game Grid */}
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-6">
                  {grid.length > 0 ? (
                    grid.map((cell) => (
                      <button
                        key={cell.id}
                        onClick={() => handleCellClick(cell.id)}
                        disabled={gameState !== 'playing' || cell.isRevealed}
                        className={`
                          aspect-square rounded-lg border-2 transition-all duration-200 relative overflow-hidden
                          ${cell.isRevealed 
                            ? cell.isMine 
                              ? 'bg-destructive border-destructive animate-pulse' 
                              : 'bg-primary border-primary glow-primary'
                            : 'bg-secondary border-border hover:border-primary/50 hover:bg-secondary/80'
                          }
                          ${gameState === 'playing' && !cell.isRevealed ? 'cursor-pointer' : 'cursor-default'}
                        `}
                      >
                        {cell.isRevealed && cell.isMine && (
                          <Bomb className="h-6 w-6 text-destructive-foreground absolute inset-0 m-auto" />
                        )}
                        {cell.isRevealed && cell.isDiamond && (
                          <Gem className="h-6 w-6 text-primary-foreground absolute inset-0 m-auto animate-pulse" />
                        )}
                        {!cell.isRevealed && (
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted/50" />
                        )}
                      </button>
                    ))
                  ) : (
                    // Grille vide avant le début du jeu
                    Array.from({ length: 25 }).map((_, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg bg-secondary border-2 border-border"
                      />
                    ))
                  )}
                </div>

                {/* Game Controls */}
                <div className="flex justify-center">
                  {gameState === 'idle' && (
                    <Button 
                      onClick={initializeGame}
                      className="glow-primary"
                      size="lg"
                    >
                      Commencer la partie
                    </Button>
                  )}
                  
                  {gameState === 'playing' && revealedCount > 0 && (
                    <Button 
                      onClick={handleCashout}
                      className="glow-accent bg-accent hover:bg-accent/90"
                      size="lg"
                    >
                      <Coins className="h-5 w-5 mr-2" />
                      Encaisser {currentWinnings.toFixed(2)}€
                    </Button>
                  )}
                  
                  {(gameState === 'won' || gameState === 'lost') && (
                    <Button 
                      onClick={resetGame}
                      className="glow-primary"
                      size="lg"
                    >
                      Nouvelle partie
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Settings */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Paramètres de jeu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="betAmount">Mise (€)</Label>
                  <Input
                    id="betAmount"
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    min="0.01"
                    max="1000"
                    step="0.01"
                    disabled={gameState === 'playing'}
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="mineCount">Nombre de mines</Label>
                  <select
                    id="mineCount"
                    value={mineCount}
                    onChange={(e) => setMineCount(parseInt(e.target.value))}
                    disabled={gameState === 'playing'}
                    className="w-full p-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} mine{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Multiplicateur actuel</span>
                    <span className="font-bold text-primary">{multiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gains potentiels</span>
                    <span className="font-bold text-accent">{currentWinnings.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Rules */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Comment jouer</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Cliquez sur les cases pour révéler des diamants</p>
                <p>• Évitez les mines qui mettent fin au jeu</p>
                <p>• Plus vous trouvez de diamants, plus le multiplicateur augmente</p>
                <p>• Encaissez vos gains quand vous le souhaitez</p>
                <p>• Le risque augmente avec le nombre de mines</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Mines;
