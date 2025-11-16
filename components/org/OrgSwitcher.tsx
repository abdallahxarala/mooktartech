'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

export interface SwitcherOrganization {
  id: string
  name: string
  slug: string
  logoUrl?: string | null
  plan?: string | null
}

interface OrgSwitcherProps {
  organizations: SwitcherOrganization[]
  activeSlug: string
  onCreate?: () => void
  onSelect?: (organization: SwitcherOrganization) => void
}

export function OrgSwitcher({
  organizations,
  activeSlug,
  onCreate,
  onSelect
}: OrgSwitcherProps) {
  const [open, setOpen] = useState(false)

  const activeOrganization = useMemo(
    () => organizations.find((org) => org.slug === activeSlug) ?? organizations[0],
    [organizations, activeSlug]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full items-center justify-between gap-3 rounded-full border-2 border-orange-100 px-4 py-2 text-left font-semibold"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/10 to-pink-500/10 text-sm font-bold text-orange-500">
              {activeOrganization?.name?.[0]?.toUpperCase() ?? 'O'}
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                {activeOrganization?.name ?? 'Organisation'}
              </span>
              <span className="block text-xs text-slate-500">
                {activeOrganization?.plan?.toUpperCase() ?? 'FREE'}
              </span>
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher une organisation..." />
          <CommandEmpty>Aucune organisation trouvée.</CommandEmpty>
          <CommandList>
            <CommandGroup heading="Vos organisations">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.slug}
                  onSelect={() => {
                    setOpen(false)
                    onSelect?.(org)
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {org.name[0]?.toUpperCase()}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold">{org.name}</span>
                        <span className="text-xs text-slate-500">{org.plan ?? 'free'}</span>
                      </span>
                    </span>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        activeSlug === org.slug ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="border-t border-slate-100 p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm text-orange-600 hover:text-orange-700"
            onClick={() => {
              setOpen(false)
              onCreate?.()
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Créer une organisation
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

