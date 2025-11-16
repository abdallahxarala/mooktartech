"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Palette, Users, ChevronRight } from 'lucide-react';
import { BusinessRole } from '@/lib/types/auth-roles';
import { useAuthStore } from '@/lib/store/auth';
import { cn } from '@/lib/utils';

interface RoleSwitcherProps {
  onRoleChange?: (role: BusinessRole | 'both') => void;
  activeRole?: BusinessRole | 'both';
}

/**
 * Composant pour basculer entre les rôles Buyer/Creator
 * Permet de gérer des comptes hybrides
 */
export function RoleSwitcher({ onRoleChange, activeRole }: RoleSwitcherProps) {
  const { isBuyer, isCreator } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<BusinessRole | 'both'>(activeRole || 'both');

  // Si l'utilisateur n'a qu'un seul rôle activé, on ne peut pas switcher
  if ((isBuyer && !isCreator) || (!isBuyer && isCreator)) {
    return null;
  }

  // Si l'utilisateur n'a aucun rôle, on ne peut pas afficher le switcher
  if (!isBuyer && !isCreator) {
    return null;
  }

  const handleRoleSelect = (role: BusinessRole | 'both') => {
    setSelectedRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  const roles = [
    {
      id: 'buyer' as const,
      label: 'Acheteur',
      icon: ShoppingCart,
      description: 'Commandes, favoris, adresses',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 border-blue-200',
      active: isBuyer,
    },
    {
      id: 'creator' as const,
      label: 'Créateur',
      icon: Palette,
      description: 'Designs, templates, exports',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 border-purple-200',
      active: isCreator,
    },
    {
      id: 'both' as const,
      label: 'Vue combinée',
      icon: Users,
      description: 'Toutes vos données',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50 border-orange-200',
      active: isBuyer && isCreator,
    },
  ];

  const activeConfig = roles.find(r => r.id === selectedRole);

  return (
    <div className="space-y-4">
      {/* Role Toggle Pills */}
      <div className="flex items-center justify-center space-x-2 p-1 bg-gray-100 rounded-lg">
        {roles.filter(r => r.active).map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                selectedRole === role.id
                  ? `bg-gradient-to-r ${role.color} text-white shadow-md`
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Role Badge */}
      {activeConfig && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={selectedRole}
        >
          <Card className={cn("border-2", activeConfig.bgColor)}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    activeConfig.color
                  )}>
                    <activeConfig.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Mode {activeConfig.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {activeConfig.description}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white">
                  Actif
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Composant compact pour afficher le rôle actif
 */
interface RoleBadgeProps {
  role: BusinessRole | 'both';
  size?: 'sm' | 'md' | 'lg';
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const roleConfig = {
    buyer: {
      icon: ShoppingCart,
      label: 'Acheteur',
      color: 'from-blue-500 to-cyan-500',
    },
    creator: {
      icon: Palette,
      label: 'Créateur',
      color: 'from-purple-500 to-pink-500',
    },
    both: {
      icon: Users,
      label: 'Hybride',
      color: 'from-orange-500 to-amber-500',
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs px-2 py-0.5',
    md: 'w-5 h-5 text-sm px-3 py-1',
    lg: 'w-6 h-6 text-base px-4 py-1.5',
  };

  return (
    <Badge className={cn(`bg-gradient-to-r ${config.color} text-white border-0`, sizeClasses[size])}>
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </Badge>
  );
}

