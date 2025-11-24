import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ArrowRight } from 'lucide-react'
import { requireOrganization, listUserOrganizations } from '@/middleware/orgContext'
import type { Database } from '@/lib/types/database.types'
import { OrgSwitcher } from '@/components/org/OrgSwitcher'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function OrganizationDashboard({ params }: DashboardPageProps) {
  const context = await requireOrganization(params.slug)
  const organizations = await listUserOrganizations()

  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const [membersRes, cardsRes, templatesRes, leadsRes] = await Promise.all([
    supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', (context.organization as any).id),
    supabase
      .from('nfc_cards')
      .select('id, is_active, assigned_to')
      .eq('organization_id', (context.organization as any).id),
    supabase
      .from('organization_templates')
      .select('id, is_default')
      .eq('organization_id', (context.organization as any).id),
    supabase
      .from('leads')
      .select('id, status, created_at')
      .eq('organization_id', (context.organization as any).id)
  ])

  const membersCount = membersRes.data?.length ?? 0
  const cards = cardsRes.data ?? []
  const templates = templatesRes.data ?? []
  const leads = leadsRes.data ?? []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaysLeads = leads.filter(
    (lead) => new Date(lead.created_at) >= today
  ).length

  const activeCards = cards.filter((card) => card.is_active !== false).length
  const assignedCards = cards.filter((card) => !!card.assigned_to).length

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-6xl px-6 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Tableau de bord
            </p>
            <h1 className="text-4xl font-black text-slate-900">{(context.organization as any).name}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Gérez vos équipes, cartes NFC et templates de manière centralisée.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <OrgSwitcher
              organizations={organizations.map((org: any) => ({
                id: (org as any).id,
                name: (org as any).name,
                slug: (org as any).slug,
                logoUrl: (org as any).logo_url,
                plan: (org as any).plan
              }))}
              activeSlug={params.slug}
              onSelect={(org) => {
                if ((org as any).slug !== params.slug) {
                  window.location.href = `/org/${(org as any).slug}/dashboard`
                }
              }}
            />
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-white/80">
                Plan
              </CardTitle>
              <p className="text-2xl font-black">{context.limits.name}</p>
              <p className="text-xs text-white/80">
                {context.limits.features.join(' · ')}
              </p>
            </CardHeader>
          </Card>

          <Card className="border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-500">Membres</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-900">{membersCount}</p>
              <p className="text-xs text-slate-500">
                Limite {context.limits.maxUsers ?? 'illimitée'}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-500">Cartes actives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-900">{activeCards}</p>
              <p className="text-xs text-slate-500">{assignedCards} assignées</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-500">Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-900">{templates.length}</p>
              <p className="text-xs text-slate-500">
                {templates.filter((tpl) => tpl.is_default).length} par défaut
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-500">Leads capturés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-900">{leads.length}</p>
              <p className="text-xs text-slate-500">{todaysLeads} aujourd'hui</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Gestion des membres',
              description: 'Invitez vos collaborateurs et définissez leurs rôles.',
              href: `/org/${params.slug}/members`
            },
            {
              title: 'Cartes NFC',
              description: 'Assignez, désactivez et suivez les performances de vos cartes.',
              href: `/org/${params.slug}/cards`
            },
            {
              title: 'Leads CRM',
              description: 'Suivez vos opportunités et exportez vos contacts.',
              href: `/org/${params.slug}/leads`
            },
            {
              title: 'Templates personnalisés',
              description: 'Créez des modèles à l’image de votre entreprise.',
              href: `/org/${params.slug}/templates`
            }
          ].map((link) => (
            <Card key={link.href} className="border border-gray-100 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {link.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-slate-500">{link.description}</p>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  Accéder
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}

