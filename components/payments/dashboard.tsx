"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentTransaction } from "@/lib/types/payment";
import { TransactionList } from "./transaction-list";
import { TransactionStats } from "./transaction-stats";
import { Search, Filter, Download } from "lucide-react";

const mockTransactions: PaymentTransaction[] = [
  {
    id: "1",
    orderId: "ORD-2024-001",
    amount: 29999,
    method: "orange-money",
    status: "completed",
    reference: "OM123456789",
    customerInfo: {
      name: "John Doe",
      phone: "+221 77 000 00 00",
      email: "john@example.com",
    },
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:01:00Z",
  },
  // Ajoutez plus de transactions de démonstration ici
];

export function PaymentDashboard() {
  const [transactions] = useState<PaymentTransaction[]>(mockTransactions);
  const [filter, setFilter] = useState("all");

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      <TransactionStats />

      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher une transaction..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Select
                value={filter}
                onValueChange={setFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Complétés</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échoués</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TransactionList transactions={transactions} />
      </Card>
    </div>
  );
}
