'use client'

import React, { useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { ProgressiveOnboarding, ProgressIndicator } from '@/components/auth/progressive-onboarding'
import { RoleBadge } from '@/components/auth/role-switcher'
import { useAuthProgressive } from '@/lib/hooks/use-auth-progressive'
import { User, ShoppingBag, Palette, LogOut, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestAuthPage() {
  const { user, isAuthenticated, clearUser, isBuyer, isCreator } = useAuthStore()
  const { buyerProgress, creatorProgress, activateBuyerRole, activateCreatorRole } = useAuthProgressive()
  const [showBuyerModal, setShowBuyerModal] = useState(false)
  const [showCreatorModal, setShowCreatorModal] = useState(false)

  // Simuler des données utilisateur pour le test
  const mockUser = {
    id: 'test-123',
    email: 'test@xarala.sn',
    full_name: 'Jean Dupont',
    first_name: 'Jean',
    last_name: 'Dupont',
    avatar_url: null,
    phone: '+221 77 123 45 67',
    company: 'Xarala Solutions',
    role: null,
    buyer_role_activated: isBuyer,
    creator_role_activated: isCreator,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const handleMockLogin = () => {
    useAuthStore.getState().setUser(mockUser as any)
  }

  const handleLogout = () => {
    clearUser()
  }

  // Simuler une progression
  const simulateProgression = (buyer: boolean) => {
    if (buyer) {
      // Simuler une commande de 60,000 FCFA
      setShowBuyerModal(true)
    } else {
      // Simuler 3 designs créés
      setShowCreatorModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 border-2 border-orange-200">
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              🧪 Test Système Buyer/Creator
            </h1>
            <p className="text-gray-600 text-lg">
              Interface de debug pour tester le système d'authentification à double niveau
            </p>
          </div>

          {/* État actuel */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-gray-900">
                État de l'authentification
              </CardTitle>
            </CardHeader>
            
            {isAuthenticated && user ? (
              <CardContent>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white font-black text-3xl flex items-center justify-center shadow-lg">
                      {user.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="text-xl font-black text-gray-900">
                        {user.full_name || 'Utilisateur'}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="bg-white rounded-xl p-4">
                      <span className="text-gray-600 block mb-1">Email:</span>
                      <span className="font-bold text-gray-900">{user.email}</span>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <span className="text-gray-600 block mb-1">Téléphone:</span>
                      <span className="font-bold text-gray-900">{user.phone || 'Non renseigné'}</span>
                    </div>
                  </div>

                  {/* Rôles activés */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <RoleBadge role={isBuyer ? 'buyer' : 'creator'} size="lg" />
                    {isBuyer && isCreator && <RoleBadge role="both" size="lg" />}
                    {!isBuyer && !isCreator && (
                      <div className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm">
                        Aucun rôle activé
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <div className="text-center text-gray-600 mb-4">
                    <XCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                    Aucun utilisateur connecté
                  </div>
                  <Button
                    onClick={handleMockLogin}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Connexion de test
                  </Button>
                </div>
              </CardContent>
            )}
          </div>

          {/* Progression des rôles */}
          {(buyerProgress || creatorProgress) && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {buyerProgress && (
                <ProgressIndicator
                  role="buyer"
                  progress={buyerProgress}
                  onActivate={async () => {
                    await activateBuyerRole()
                    setShowBuyerModal(false)
                  }}
                />
              )}
              {creatorProgress && (
                <ProgressIndicator
                  role="creator"
                  progress={creatorProgress}
                  onActivate={async () => {
                    await activateCreatorRole()
                    setShowCreatorModal(false)
                  }}
                />
              )}
            </div>
          )}

          {/* Boutons de test */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-gray-900 mb-2">
                Actions de test
              </CardTitle>
              <p className="text-gray-600">
                Simuler des événements pour tester l'activation progressive
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Activer Buyer */}
                <Card className="border-2 hover:border-blue-500 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-gray-900 mb-2 text-lg">
                          Activer rôle Acheteur
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          Simuler une commande de 60,000 FCFA (seuil atteint)
                        </div>
                        <Button
                          onClick={() => simulateProgression(true)}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white"
                          disabled={isBuyer}
                        >
                          {isBuyer ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Déjà activé
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Simuler commande
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activer Creator */}
                <Card className="border-2 hover:border-purple-500 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Palette className="w-7 h-7 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-gray-900 mb-2 text-lg">
                          Activer rôle Créateur
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          Simuler 3 designs créés (seuil atteint)
                        </div>
                        <Button
                          onClick={() => simulateProgression(false)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
                          disabled={isCreator}
                        >
                          {isCreator ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Déjà activé
                            </>
                          ) : (
                            <>
                              <Palette className="w-4 h-4 mr-2" />
                              Simuler designs
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
            <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
              📋 Instructions de test
            </h3>
            <ol className="space-y-4 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <span className="font-black text-blue-900">1.</span>
                <span>Clique sur "Connexion de test" pour simuler un utilisateur</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-blue-900">2.</span>
                <span>Utilise les boutons "Simuler commande" ou "Simuler designs"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-blue-900">3.</span>
                <span>La modal d'activation apparaît si le seuil est atteint</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-blue-900">4.</span>
                <span>Activez le rôle et vérifiez les badges mis à jour</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-blue-900">5.</span>
                <span>Testez la déconnexion/reconnexion pour vérifier la persistence</span>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-900 mb-1">Seuils configurés :</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Buyer : 50,000 FCFA minimum</li>
                    <li>• Creator : 3 designs minimum</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals d'activation */}
      {showBuyerModal && buyerProgress && (
        <ProgressiveOnboarding
          role="buyer"
          progress={buyerProgress}
          onComplete={() => setShowBuyerModal(false)}
          onSkip={() => setShowBuyerModal(false)}
        />
      )}
      
      {showCreatorModal && creatorProgress && (
        <ProgressiveOnboarding
          role="creator"
          progress={creatorProgress}
          onComplete={() => setShowCreatorModal(false)}
          onSkip={() => setShowCreatorModal(false)}
        />
      )}
    </div>
  )
}

