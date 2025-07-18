
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { ArrowLeft, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlayingCard {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
  numericValue: number;
}

const Blackjack = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [playerCards, setPlayerCards] = useState<PlayingCard[]>([]);
  const [dealerCards, setDealerCards] = useState<PlayingCard[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [gameResult, setGameResult] = useState<string>('');
  const [showDealerCard, setShowDealerCard] = useState(false);

  // Créer un nouveau jeu de cartes
  const createDeck = (): PlayingCard[] => {
    const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: PlayingCard[] = [];

    suits.forEach(suit => {
      values.forEach(value => {
        let numericValue = parseInt(value);
        if (value === 'A') numericValue = 11;
        else if (['J', 'Q', 'K'].includes(value)) numericValue = 10;
        
        newDeck.push({ suit, value, numericValue });
      });
    });

    // Mélanger le jeu
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
  };

  // Calculer le score d'une main
  const calculateScore = (cards: PlayingCard[]): number => {
    let score = 0;
    let aces = 0;

    cards.forEach(card => {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else {
        score += card.numericValue;
      }
    });

    // Ajuster pour les As
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  // Démarrer une nouvelle partie
  const startGame = () => {
    if (bet > balance) return;

    const newDeck = createDeck();
    const playerHand = [newDeck[0], newDeck[2]];
    const dealerHand = [newDeck[1], newDeck[3]];
    
    setDeck(newDeck.slice(4));
    setPlayerCards(playerHand);
    setDealerCards(dealerHand);
    setPlayerScore(calculateScore(playerHand));
    setDealerScore(calculateScore([dealerHand[0]])); // Ne montrer qu'une carte du dealer
    setGameState('playing');
    setGameResult('');
    setShowDealerCard(false);
    setBalance(prev => prev - bet);
  };

  // Tirer une carte
  const hit = () => {
    if (deck.length === 0) return;
    
    const newCard = deck[0];
    const newPlayerCards = [...playerCards, newCard];
    const newScore = calculateScore(newPlayerCards);
    
    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);
    setDeck(deck.slice(1));
    
    if (newScore > 21) {
      setGameState('finished');
      setGameResult('Bust! Vous avez perdu.');
    }
  };

  // Rester
  const stand = () => {
    setGameState('dealer');
    setShowDealerCard(true);
    setDealerScore(calculateScore(dealerCards));
  };

  // IA du dealer
  useEffect(() => {
    if (gameState === 'dealer') {
      const dealerPlay = () => {
        const currentDealerScore = calculateScore(dealerCards);
        
        if (currentDealerScore < 17) {
          setTimeout(() => {
            if (deck.length > 0) {
              const newCard = deck[0];
              const newDealerCards = [...dealerCards, newCard];
              setDealerCards(newDealerCards);
              setDeck(deck.slice(1));
              setDealerScore(calculateScore(newDealerCards));
            }
          }, 1000);
        } else {
          // Déterminer le gagnant
          setTimeout(() => {
            const finalDealerScore = calculateScore(dealerCards);
            let result = '';
            let winnings = 0;

            if (finalDealerScore > 21) {
              result = 'Le dealer fait bust! Vous gagnez!';
              winnings = bet * 2;
            } else if (playerScore > finalDealerScore) {
              result = 'Vous gagnez!';
              winnings = bet * 2;
            } else if (playerScore < finalDealerScore) {
              result = 'Le dealer gagne.';
            } else {
              result = 'Égalité!';
              winnings = bet;
            }

            setGameResult(result);
            setBalance(prev => prev + winnings);
            setGameState('finished');
          }, 1000);
        }
      };

      dealerPlay();
    }
  }, [dealerCards, gameState, deck, playerScore, bet]);

  // Nouvelle partie
  const newGame = () => {
    setGameState('betting');
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameResult('');
    setShowDealerCard(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Blackjack</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de jeu principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dealer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Dealer</span>
                  <span className="text-lg">Score: {showDealerCard ? dealerScore : '?'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {dealerCards.map((card, index) => (
                    <div 
                      key={index}
                      className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-sm font-bold
                        ${(index === 1 && !showDealerCard) ? 'bg-primary text-primary-foreground' : 
                          card.suit === '♥' || card.suit === '♦' ? 'bg-card border-red-500 text-red-500' : 
                          'bg-card border-foreground text-foreground'}`}
                    >
                      {(index === 1 && !showDealerCard) ? '?' : (
                        <>
                          <span>{card.value}</span>
                          <span className="text-lg">{card.suit}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Joueur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Votre main</span>
                  <span className="text-lg">Score: {playerScore}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {playerCards.map((card, index) => (
                    <div 
                      key={index}
                      className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-sm font-bold
                        ${card.suit === '♥' || card.suit === '♦' ? 'bg-card border-red-500 text-red-500' : 
                          'bg-card border-foreground text-foreground'}`}
                    >
                      <span>{card.value}</span>
                      <span className="text-lg">{card.suit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                {gameState === 'betting' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label htmlFor="bet" className="font-medium">Mise:</label>
                      <Input
                        id="bet"
                        type="number"
                        value={bet}
                        onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max={balance}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">€</span>
                    </div>
                    <Button 
                      onClick={startGame} 
                      disabled={bet > balance}
                      className="w-full glow-primary"
                    >
                      Distribuer les cartes
                    </Button>
                  </div>
                )}

                {gameState === 'playing' && (
                  <div className="flex gap-4">
                    <Button onClick={hit} variant="default" className="flex-1">
                      Tirer une carte
                    </Button>
                    <Button onClick={stand} variant="outline" className="flex-1">
                      Rester
                    </Button>
                  </div>
                )}

                {gameState === 'dealer' && (
                  <div className="text-center">
                    <p className="text-lg">Le dealer joue...</p>
                  </div>
                )}

                {gameState === 'finished' && (
                  <div className="space-y-4 text-center">
                    <p className="text-xl font-bold">{gameResult}</p>
                    <Button onClick={newGame} className="glow-primary">
                      Nouvelle partie
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-accent" />
                  Solde
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{balance} €</div>
              </CardContent>
            </Card>

            {/* Règles */}
            <Card>
              <CardHeader>
                <CardTitle>Règles du Blackjack</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Le but est d'obtenir un score proche de 21 sans le dépasser</p>
                <p>• Les cartes 2-10 valent leur valeur nominale</p>
                <p>• Les figures (J, Q, K) valent 10 points</p>
                <p>• L'As vaut 11 ou 1 selon ce qui est le plus avantageux</p>
                <p>• Le dealer tire jusqu'à 17 minimum</p>
                <p>• Si vous dépassez 21, vous perdez (bust)</p>
              </CardContent>
            </Card>

            {/* Statistiques de la partie */}
            {gameState !== 'betting' && (
              <Card>
                <CardHeader>
                  <CardTitle>Partie en cours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mise actuelle:</span>
                    <span className="font-bold">{bet} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Votre score:</span>
                    <span className="font-bold">{playerScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score dealer:</span>
                    <span className="font-bold">{showDealerCard ? dealerScore : '?'}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blackjack;
