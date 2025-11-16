"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Palette, 
  CheckCircle, 
  ArrowRight, 
  Store,
  Sparkles,
  Gift,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuthProgressive } from '@/lib/hooks/use-auth-progressive';
import { BusinessRole, RoleProgressionStatus } from '@/lib/types/auth-roles';

interface ProgressiveOnboardingProps {
  role: BusinessRole;
  progress: RoleProgressionStatus;
  onComplete: () => void;
  onSkip?: () => void;
}

const roleConfig = {
  buyer: {
    icon: ShoppingCart,
    title: "Activez votre compte Acheteur",
    description: "Gérez vos commandes, suivez vos livraisons et sauvegardez vos produits favoris",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 border-blue-200",
    benefits: [
      "Historique des commandes complet",
      "Suivi en temps réel des livraisons",
      "Adresses sauvegardées",
      "Produits favoris",
      "Points de récompense",
    ],
    actionLabel: "Activer mon compte Acheteur",
  },
  creator: {
    icon: Palette,
    title: "Activez votre compte Créateur",
    description: "Créez, organisez et partagez vos designs professionnels",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 border-purple-200",
    benefits: [
      "Bibliothèque de designs illimitée",
      "Templates personnalisables",
      "Exports haute qualité",
      "Partage public de créations",
      "Statistiques détaillées",
    ],
    actionLabel: "Activer mon compte Créateur",
  },
};

export function ProgressiveOnboarding({ 
  role, 
  progress, 
  onComplete,
  onSkip 
}: ProgressiveOnboardingProps) {
  const [isActivating, setIsActivating] = useState(false);
  const { activateBuyerRole, activateCreatorRole } = useAuthProgressive();
  
  const config = roleConfig[role];
  const Icon = config.icon;

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      if (role === 'buyer') {
        await activateBuyerRole();
      } else {
        await activateCreatorRole();
      }
      onComplete();
    } catch (error) {
      console.error('Error activating role:', error);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <Card className={`w-full max-w-2xl ${config.bgColor} border-2`}>
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br p-0.5"
            >
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {config.title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {config.description}
              </CardDescription>
            </div>

            {/* Progress Bar */}
            {!progress.isActivated && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progression vers l'activation</span>
                  <Badge variant="outline" className="bg-white">
                    {Math.round(progress.progress)}%
                  </Badge>
                </div>
                <Progress value={progress.progress} className="h-2" />
                {progress.currentValue > 0 && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {role === 'buyer' 
                        ? `${Math.round(progress.currentValue / 1000)}k FCFA`
                        : `${progress.currentValue} designs`
                      }
                    </span>
                    <span>
                      {role === 'buyer'
                        ? `Sur ${Math.round(progress.threshold / 1000)}k FCFA requis`
                        : `Sur ${progress.threshold} designs requis`
                      }
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {config.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Special Badge for Reached Threshold */}
            {progress.isActivated && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white"
              >
                <Gift className="w-6 h-6" />
                <span className="font-semibold">Seuil atteint ! Prêt à activer</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {onSkip && (
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="w-full sm:flex-1"
                  disabled={isActivating}
                >
                  Plus tard
                </Button>
              )}
              <Button
                onClick={handleActivate}
                disabled={isActivating || (!progress.isActivated && progress.progress < 100)}
                className={`w-full sm:flex-1 bg-gradient-to-r ${config.color} hover:opacity-90 text-white`}
              >
                {isActivating ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <span>Activation en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{config.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>

            {/* Info Text */}
            {!progress.isActivated && (
              <p className="text-xs text-center text-gray-500">
                Continuez à utiliser le service pour atteindre automatiquement le seuil d'activation
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Composant compact pour afficher la progression dans le dashboard
 */
interface ProgressIndicatorProps {
  role: BusinessRole;
  progress: RoleProgressionStatus;
  onActivate?: () => void;
  compact?: boolean;
}

export function ProgressIndicator({ 
  role, 
  progress, 
  onActivate,
  compact = false 
}: ProgressIndicatorProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  if (progress.isActivated) {
    return (
      <Badge className={`bg-gradient-to-r ${config.color} text-white border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {role === 'buyer' ? 'Acheteur' : 'Créateur'} activé
      </Badge>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {Math.round(progress.progress)}%
          </span>
        </div>
        {progress.progress >= 100 && onActivate && (
          <Button 
            size="sm" 
            onClick={onActivate}
            className={`bg-gradient-to-r ${config.color} hover:opacity-90`}
          >
            Activer
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={`${config.bgColor} border`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Compte {role === 'buyer' ? 'Acheteur' : 'Créateur'}
              </h4>
              <p className="text-sm text-gray-600">
                {progress.remainingActions === 0 
                  ? 'Prêt à activer'
                  : `${progress.remainingActions} action${progress.remainingActions > 1 ? 's' : ''} restante${progress.remainingActions > 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
        </div>

        <Progress value={progress.progress} className="h-3 mb-3" />

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>
            {role === 'buyer'
              ? `${Math.round(progress.currentValue / 1000)}k / ${Math.round(progress.threshold / 1000)}k FCFA`
              : `${progress.currentValue} / ${progress.threshold} designs`
            }
          </span>
          <span>{Math.round(progress.progress)}%</span>
        </div>

        {progress.progress >= 100 && onActivate && (
          <Button 
            className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white`}
            onClick={onActivate}
          >
            Activer maintenant
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

