
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { TrendingUp, Play, DollarSign, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Crash = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [currentWin, setCurrentWin] = useState(0);
  
  const gameRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Génération du point de crash aléatoire
  const generateCrashPoint = () => {
    const random = Math.random();
    // Formule pour avoir plus de crashes bas que hauts
    return Math.max(1.01, Math.pow(1 / random, 0.5));
  };

  // Animation du multiplicateur
  useEffect(() => {
    if (isPlaying && !hasCashedOut) {
      gameRef.current = setInterval(() => {
        setMultiplier(prev => {
          const newMultiplier = prev + 0.01;
          
          // Vérifier si le jeu doit crasher
          if (newMultiplier >= crashPoint) {
            // Crash !
            setIsPlaying(false);
            setHasBet(false);
            setHasCashedOut(false);
            setGameHistory(prev => [crashPoint, ...prev.slice(0, 9)]);
            
            if (hasBet) {
              toast.error(`💥 Crash à ${crashPoint.toFixed(2)}x ! Vous avez perdu ${betAmount}€`);
              setBalance(prev => prev - betAmount);
            }
            
            return 1.00;
          }
          
          return newMultiplier;
        });
      }, 50);
    }

    return () => {
      if (gameRef.current) {
        clearInterval(gameRef.current);
      }
    };
  }, [isPlaying, crashPoint, hasCashedOut, hasBet, betAmount]);

  // Démarrer le jeu
  const startGame = () => {
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setMultiplier(1.00);
    setIsPlaying(true);
    setHasCashedOut(false);
    setCurrentWin(0);
    console.log('Nouveau crash point:', newCrashPoint.toFixed(2));
  };

  // Placer une mise
  const placeBet = () => {
    if (betAmount > balance) {
      toast.error('Solde insuffisant !');
      return;
    }
    
    if (betAmount < 1) {
      toast.error('Mise minimum : 1€');
      return;
    }

    setHasBet(true);
    toast.success(`Mise de ${betAmount}€ placée !`);
    
    if (!isPlaying) {
      startGame();
    }
  };

  // Encaisser
  const cashOut = () => {
    if (!hasBet || hasCashedOut || !isPlaying) return;
    
    const winAmount = betAmount * multiplier;
    setBalance(prev => prev + winAmount - betAmount);
    setCurrentWin(winAmount);
    setHasCashedOut(true);
    setHasBet(false);
    
    toast.success(`💰 Encaissé à ${multiplier.toFixed(2)}x ! +${(winAmount - betAmount).toFixed(2)}€`);
  };

  // Animation du graphique
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redimensionner le canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Nettoyer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner le graphique
    ctx.strokeStyle = isPlaying ? '#10b981' : '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const points = Math.floor((multiplier - 1) * 100);
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * canvas.width;
      const y = canvas.height - ((1 + i * 0.01 - 1) / (multiplier - 1)) * (canvas.height * 0.8);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  }, [multiplier, isPlaying]);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} balance={balance} username="Player" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Zone de jeu principale */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-primary" />
                    Crash
                  </div>
                  <Badge variant={isPlaying ? "default" : "secondary"}>
                    {isPlaying ? "En cours" : "En attente"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {/* Multiplicateur principal */}
                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold mb-2 ${
                    isPlaying ? 'text-primary animate-pulse' : 'text-muted-foreground'
                  }`}>
                    {multiplier.toFixed(2)}x
                  </div>
                  
                  {currentWin > 0 && (
                    <div className="text-2xl text-accent font-semibold">
                      +{(currentWin - betAmount).toFixed(2)}€
                    </div>
                  )}
                </div>

                {/* Graphique */}
                <div className="relative h-64 mb-6 bg-muted/20 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                  />
                  
                  {!isPlaying && !hasBet && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Placez votre mise pour commencer</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contrôles */}
                <div className="flex gap-4 justify-center">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      min="1"
                      max={balance}
                      className="w-24"
                      disabled={isPlaying}
                    />
                    <span className="text-sm text-muted-foreground">€</span>
                  </div>

                  {!hasBet && !isPlaying ? (
                    <Button 
                      onClick={placeBet}
                      className="glow-primary"
                      disabled={betAmount > balance}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Miser {betAmount}€
                    </Button>
                  ) : hasBet && isPlaying && !hasCashedOut ? (
                    <Button 
                      onClick={cashOut}
                      className="glow-accent bg-accent hover:bg-accent/90"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Encaisser {(betAmount * multiplier).toFixed(2)}€
                    </Button>
                  ) : (
                    <Button disabled>
                      En attente...
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Historique */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Historique</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {gameHistory.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Aucun historique
                    </p>
                  ) : (
                    gameHistory.map((crash, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-2 rounded bg-muted/20"
                      >
                        <span className="text-sm">#{gameHistory.length - index}</span>
                        <Badge 
                          variant={crash < 2 ? "destructive" : crash < 5 ? "secondary" : "default"}
                        >
                          {crash.toFixed(2)}x
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Solde</span>
                    <span className="font-medium">{balance.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Parties jouées</span>
                    <span className="font-medium">{gameHistory.length}</span>
                  </div>
                  {gameHistory.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dernier crash</span>
                      <Badge variant="outline">
                        {gameHistory[0].toFixed(2)}x
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crash;
