"use client";

import { useState } from "react";
import { ContactsTable } from "./table";
import { ContactsToolbar } from "./toolbar";
import { ContactDetails } from "./details";
import { ImportDialog } from "./import-dialog";
import { ContactStats } from "./stats";
import { useContacts } from "@/lib/hooks/use-contacts";
import { Contact } from "@/lib/types";

export function ContactManager() {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { contacts, isLoading } = useContacts();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Contacts</h1>
        <ContactStats />
      </div>

      <div className="bg-white rounded-lg shadow">
        <ContactsToolbar
          selectedCount={selectedContacts.length}
          onImport={() => setShowImportDialog(true)}
        />
        
        <div className="flex">
          <div className="flex-1">
            <ContactsTable
              contacts={contacts}
              isLoading={isLoading}
              selectedContacts={selectedContacts}
              onSelectionChange={setSelectedContacts}
              onContactClick={setSelectedContact}
            />
          </div>
          
          {selectedContact && (
            <div className="w-96 border-l">
              <ContactDetails
                contact={selectedContact}
                onClose={() => setSelectedContact(null)}
              />
            </div>
          )}
        </div>
      </div>

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
}
