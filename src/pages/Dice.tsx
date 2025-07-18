
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, TrendingUp, Coins } from 'lucide-react';

const Dice = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'idle' | 'rolling' | 'result'>('idle');
  const [betAmount, setBetAmount] = useState('10.00');
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [threshold, setThreshold] = useState(3);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [multiplier, setMultiplier] = useState(2.0);
  const [balance] = useState(1000.00);
  const [isAnimating, setIsAnimating] = useState(false);

  const DiceIcon = ({ value }: { value: number }) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[value - 1] || Dice1;
    return <IconComponent className="h-16 w-16 text-primary" />;
  };

  const calculateMultiplier = () => {
    if (prediction === 'over') {
      const winChance = (6 - threshold) / 6;
      return winChance > 0 ? +(0.95 / winChance).toFixed(2) : 1;
    } else {
      const winChance = threshold / 6;
      return winChance > 0 ? +(0.95 / winChance).toFixed(2) : 1;
    }
  };

  const handleThresholdChange = (newThreshold: number) => {
    setThreshold(newThreshold);
    const newMultiplier = calculateMultiplier();
    setMultiplier(newMultiplier);
  };

  const handlePredictionChange = (newPrediction: 'over' | 'under') => {
    setPrediction(newPrediction);
    const newMultiplier = calculateMultiplier();
    setMultiplier(newMultiplier);
  };

  const rollDice = () => {
    setGameState('rolling');
    setIsAnimating(true);
    setDiceResult(null);
    setIsWin(null);

    // Animation du dé pendant 2 secondes
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      
      // Déterminer si c'est gagné
      const won = prediction === 'over' ? result > threshold : result <= threshold;
      setIsWin(won);
      
      setGameState('result');
      setIsAnimating(false);
    }, 2000);
  };

  const resetGame = () => {
    setGameState('idle');
    setDiceResult(null);
    setIsWin(null);
    setIsAnimating(false);
  };

  const currentWinnings = parseFloat(betAmount) * multiplier;
  const winChance = prediction === 'over' ? ((6 - threshold) / 6 * 100) : (threshold / 6 * 100);

  React.useEffect(() => {
    const newMultiplier = calculateMultiplier();
    setMultiplier(newMultiplier);
  }, [prediction, threshold]);

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
                    <Dice1 className="h-6 w-6 mr-2 text-accent" />
                    Dice
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    {gameState === 'result' && (
                      <Badge className={isWin ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}>
                        {isWin ? `Gagné ! +${currentWinnings.toFixed(2)}€` : `Perdu ! -${betAmount}€`}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Dice Display */}
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={`mb-8 transition-transform duration-200 ${isAnimating ? 'animate-spin' : ''}`}>
                    {diceResult ? (
                      <DiceIcon value={diceResult} />
                    ) : (
                      <Dice1 className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>

                  {diceResult && (
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold mb-2">{diceResult}</div>
                      <div className="text-muted-foreground">
                        Vous aviez parié: {prediction === 'over' ? 'Plus de' : 'Moins ou égal à'} {threshold}
                      </div>
                    </div>
                  )}

                  {/* Game Controls */}
                  <div className="flex justify-center">
                    {gameState === 'idle' && (
                      <Button 
                        onClick={rollDice}
                        className="glow-primary"
                        size="lg"
                      >
                        <Dice1 className="h-5 w-5 mr-2" />
                        Lancer le dé
                      </Button>
                    )}
                    
                    {gameState === 'rolling' && (
                      <Button 
                        disabled
                        className="glow-primary"
                        size="lg"
                      >
                        Lancement en cours...
                      </Button>
                    )}
                    
                    {gameState === 'result' && (
                      <Button 
                        onClick={resetGame}
                        className="glow-primary"
                        size="lg"
                      >
                        Nouveau lancer
                      </Button>
                    )}
                  </div>
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
                    disabled={gameState === 'rolling'}
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <Label>Prédiction</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={prediction === 'over' ? 'default' : 'outline'}
                      onClick={() => handlePredictionChange('over')}
                      disabled={gameState === 'rolling'}
                      className="w-full"
                    >
                      Plus de {threshold}
                    </Button>
                    <Button
                      variant={prediction === 'under' ? 'default' : 'outline'}
                      onClick={() => handlePredictionChange('under')}
                      disabled={gameState === 'rolling'}
                      className="w-full"
                    >
                      ≤ {threshold}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="threshold">Seuil: {threshold}</Label>
                  <div className="grid grid-cols-6 gap-1 mt-2">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <Button
                        key={num}
                        variant={threshold === num ? 'default' : 'outline'}
                        onClick={() => handleThresholdChange(num)}
                        disabled={gameState === 'rolling'}
                        className="aspect-square p-2 text-sm"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Multiplicateur</span>
                    <span className="font-bold text-primary">{multiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Chance de gagner</span>
                    <span className="font-bold text-accent">{winChance.toFixed(1)}%</span>
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
                <p>• Choisissez votre mise et un seuil (1-6)</p>
                <p>• Pariez si le dé sera "Plus de" ou "≤" ce seuil</p>
                <p>• Plus le pari est risqué, plus le multiplicateur est élevé</p>
                <p>• Lancez le dé pour voir si vous gagnez !</p>
                <p>• Les probabilités sont équitables (RTP 95%)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dice;
