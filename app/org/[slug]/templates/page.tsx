import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireOrganization, listUserOrganizations } from '@/middleware/orgContext'
import type { Database } from '@/lib/types/database.types'
import { OrgSwitcher } from '@/components/org/OrgSwitcher'
import { TemplateEditor } from '@/components/org/TemplateEditor'

interface TemplatesPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function OrganizationTemplatesPage({ params }: TemplatesPageProps) {
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

  const { data: templates } = await supabase
    .from('organization_templates')
    .select('*')
    .eq('organization_id', context.organization.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-5xl px-6 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Templates personnalisés</h1>
            <p className="mt-2 text-sm text-slate-500">
              Créez des modèles aux couleurs de votre entreprise pour toutes vos cartes NFC.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <OrgSwitcher
              organizations={organizations.map((org: any) => ({
                id: org.id,
                name: org.name,
                slug: org.slug,
                logoUrl: org.logo_url,
                plan: org.plan
              }))}
              activeSlug={params.slug}
              onSelect={(org) => {
                if (org.slug !== params.slug) {
                  window.location.href = `/org/${org.slug}/templates`
                }
              }}
            />
          </div>
        </div>

        <TemplateEditor
          organizationId={context.organization.id}
          plan={(context.organization.plan as any) ?? 'free'}
          role={context.membership.role}
          templates={
            templates?.map((template) => ({
              id: template.id,
              name: template.name,
              design_json: template.design_json ?? {},
              is_default: template.is_default ?? false,
              created_at: template.created_at
            })) ?? []
          }
        />
      </div>
    </div>
  )
}

