"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface LeadRow {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  notes?: string | null
  source?: string | null
  status: "new" | "contacted" | "archived"
  card?: {
    id: string
    title?: string | null
  } | null
  captured_by?: {
    id: string
    full_name?: string | null
    email?: string | null
  } | null
  created_at: string
}

interface LeadsTableProps {
  leads: LeadRow[]
  onChange?: () => void
}

export function LeadsTable({ leads, onChange }: LeadsTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | LeadRow["status"]>("all")

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" ? true : lead.status === statusFilter
      const query = search.toLowerCase()
      const matchesQuery =
        !query ||
        [lead.name, lead.email, lead.phone, lead.company, lead.captured_by?.full_name]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query))
      return matchesStatus && matchesQuery
    })
  }, [leads, search, statusFilter])

  const handleUpdateStatus = async (leadId: string, status: LeadRow["status"]) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.error ?? "Mise à jour impossible")
      }
      toast.success("Lead mis à jour")
      onChange?.()
    } catch (error: any) {
      toast.error(error.message ?? "Erreur lors de la mise à jour")
    }
  }

  const handleExport = () => {
    const rows = filtered.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      notes: lead.notes ?? "",
      status: lead.status,
      source: lead.source ?? "nfc_scan",
      card: lead.card?.title ?? lead.card?.id ?? "",
      captured_by: lead.captured_by?.full_name ?? lead.captured_by?.email ?? "",
      created_at: format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: fr }),
    }))

    const header = Object.keys(rows[0] ?? {}).join(",")
    const body = rows
      .map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n")
    const csvContent = [header, body].filter(Boolean).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.setAttribute("download", `leads-${Date.now()}.csv`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <Input
          placeholder="Rechercher un lead..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(value: any) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="new">Nouveau</SelectItem>
            <SelectItem value="contacted">Contacté</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto" onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {["Lead", "Contact", "Entreprise", "Carte", "Assigné à", "Statut", "Date", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white text-sm">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{lead.name}</td>
                <td className="px-6 py-4 text-slate-600">
                  <div>{lead.email ?? "—"}</div>
                  <div className="text-xs text-slate-400">{lead.phone ?? ""}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{lead.company ?? "—"}</td>
                <td className="px-6 py-4 text-slate-600">
                  {lead.card?.title ?? lead.card?.id ?? "—"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {lead.captured_by?.full_name ?? lead.captured_by?.email ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <Select
                    value={lead.status}
                    onValueChange={(value: LeadRow["status"]) =>
                      handleUpdateStatus(lead.id, value)
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nouveau</SelectItem>
                      <SelectItem value="contacted">Contacté</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {format(new Date(lead.created_at), "dd MMM yyyy HH:mm", { locale: fr })}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {lead.notes ?? "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">
                  Aucun lead à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

