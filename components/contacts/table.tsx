"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Contact } from "@/lib/types";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  selectedContacts: Contact[];
  onSelectionChange: (contacts: Contact[]) => void;
  onContactClick: (contact: Contact) => void;
}

export function ContactsTable({
  contacts,
  isLoading,
  selectedContacts,
  onSelectionChange,
  onContactClick,
}: ContactsTableProps) {
  const columns: ColumnDef<Contact>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Sélectionner tout"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Sélectionner la ligne"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "photo",
      header: "",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.original.photo} />
          <AvatarFallback>
            {row.original.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "company",
      header: "Entreprise",
    },
    {
      accessorKey: "tags",
      header: "Mots-clés",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "cardName",
      header: "Carte associée",
    },
    {
      accessorKey: "createdAt",
      header: "Date d'ajout",
      cell: ({ row }) => format(new Date(row.original.createdAt), "PP", { locale: fr }),
    },
  ];

  const table = useReactTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === "function"
        ? updater(table.getState().rowSelection)
        : updater;
      
      const selectedRows = table.getFilteredRowModel().rows.filter(
        (row) => newSelection[row.id]
      );
      onSelectionChange(selectedRows.map((row) => row.original));
    },
    state: {
      rowSelection: Object.fromEntries(
        selectedContacts.map((contact) => [
          table.getRowModel().rows.find((row) => row.original.id === contact.id)?.id || "",
          true,
        ])
      ),
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onContactClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}
