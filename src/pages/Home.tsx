
import React from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import RecentWinners from '@/components/RecentWinners';
import PromotionBanner from '@/components/PromotionBanner';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const popularGames = [
    {
      title: 'Mines',
      description: 'Découvrez les diamants cachés et évitez les bombes !',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
      isHot: true,
      multiplier: '24.75x',
      onClick: () => navigate('/mines')
    },
    {
      title: 'Crash',
      description: 'Misez et retirez vos gains avant le crash !',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      isNew: true,
      multiplier: '152.30x',
      onClick: () => navigate('/crash')
    },
    {
      title: 'Blackjack',
      description: 'Approchez-vous de 21 sans dépasser !',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      multiplier: '2.00x',
      onClick: () => navigate('/blackjack')
    },
    {
      title: 'Dice',
      description: 'Prédisez le résultat du dé et gagnez gros !',
      image: 'https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?w=400&h=250&fit=crop',
      multiplier: '98.76x',
      onClick: () => navigate('/dice')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Promotion Banner */}
        <div className="mb-8">
          <PromotionBanner />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Games Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Jeux Populaires</h2>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  Voir tous les jeux →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {popularGames.map((game, index) => (
                  <GameCard
                    key={index}
                    title={game.title}
                    description={game.description}
                    image={game.image}
                    isHot={game.isHot}
                    isNew={game.isNew}
                    multiplier={game.multiplier}
                    onClick={game.onClick}
                  />
                ))}
              </div>
            </section>

            {/* Live Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border text-center">
                <div className="text-3xl font-bold text-primary mb-2">2,847</div>
                <div className="text-sm text-muted-foreground">Joueurs en ligne</div>
              </div>
              <div className="bg-card p-6 rounded-lg border text-center">
                <div className="text-3xl font-bold text-accent mb-2">€1,234,567</div>
                <div className="text-sm text-muted-foreground">Gains du jour</div>
              </div>
              <div className="bg-card p-6 rounded-lg border text-center">
                <div className="text-3xl font-bold text-primary mb-2">€89,432</div>
                <div className="text-sm text-muted-foreground">Jackpot actuel</div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentWinners />
            
            {/* Quick Stats Card */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Statistiques Rapides</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plus grand gain (24h)</span>
                  <span className="font-bold text-accent">€15,432</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jeu le plus joué</span>
                  <span className="font-bold">Mines</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Multiplicateur record</span>
                  <span className="font-bold text-primary">1,247.5x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
