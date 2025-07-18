
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock } from 'lucide-react';

const PromotionBanner = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-primary/50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      <CardContent className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="h-5 w-5 text-accent" />
              <Badge className="bg-accent text-accent-foreground">
                BONUS EXCLUSIF
              </Badge>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Bonus de Bienvenue
            </h2>
            
            <p className="text-muted-foreground mb-4">
              Obtenez jusqu'à <span className="text-accent font-bold">500€</span> de bonus 
              + <span className="text-primary font-bold">200 tours gratuits</span> sur votre premier dépôt !
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Offre limitée
              </div>
              <div>
                Code: <span className="text-accent font-mono font-bold">WELCOME500</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button size="lg" className="glow-accent bg-accent hover:bg-accent/90">
              Réclamer le Bonus
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Conditions générales applicables
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionBanner;
