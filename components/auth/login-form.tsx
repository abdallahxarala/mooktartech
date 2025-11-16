'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('🖱️ Bouton Se connecter cliqué')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password ? '***masqué***' : 'vide')

    if (!email || !password) {
      console.error('❌ Email ou mot de passe manquant')
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    console.log('⏳ Début de la connexion...')

    try {
      const supabase = createSupabaseBrowserClient()
      console.log('✅ Client Supabase créé')

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      console.log('📊 Réponse Supabase:', { data, error })

      if (error) {
        console.error('❌ Erreur de connexion:', error)
        toast.error(error.message)
        return
      }

      console.log('✅ Connexion réussie !')
      toast.success('Connexion réussie !')

      router.push('/fr/badge-editor/events')
      router.refresh()
    } catch (error) {
      console.error('❌ Erreur inattendue:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">X</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Connexion
          </CardTitle>
          <p className="text-gray-600">
            Connectez-vous à votre compte Xarala Solutions
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link
                href="/auth/register"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
