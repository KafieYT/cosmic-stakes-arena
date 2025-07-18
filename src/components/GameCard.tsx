
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, TrendingUp } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  isHot?: boolean;
  isNew?: boolean;
  multiplier?: string;
  onClick: () => void;
}

const GameCard = ({ 
  title, 
  description, 
  image, 
  isHot, 
  isNew, 
  multiplier, 
  onClick 
}: GameCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {isHot && (
            <Badge className="bg-destructive text-destructive-foreground">
              🔥 Hot
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-primary text-primary-foreground">
              Nouveau
            </Badge>
          )}
        </div>

        {/* Multiplier */}
        {multiplier && (
          <div className="absolute top-2 right-2 flex items-center bg-accent/90 text-accent-foreground px-2 py-1 rounded text-sm font-bold">
            <TrendingUp className="h-3 w-3 mr-1" />
            {multiplier}
          </div>
        )}

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="lg" 
            className="glow-primary"
            onClick={onClick}
          >
            <Play className="h-5 w-5 mr-2" />
            Jouer
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default GameCard;
