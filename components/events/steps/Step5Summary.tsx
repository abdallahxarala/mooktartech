interface Step5SummaryProps {
  data: any
}

export function Step5Summary({ data }: Step5SummaryProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="font-semibold">Informations générales</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Nom :</dt>
            <dd className="font-medium text-right">{data.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Type :</dt>
            <dd className="text-right">{data.type}</dd>
          </div>
          {data.description && (
            <div>
              <dt className="text-muted-foreground">Description :</dt>
              <dd className="mt-1 text-sm">{data.description}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold">Dates &amp; lieu</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Début :</dt>
            <dd className="text-right">
              {data.start_date
                ? new Date(data.start_date).toLocaleString('fr-FR')
                : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Fin :</dt>
            <dd className="text-right">
              {data.end_date
                ? new Date(data.end_date).toLocaleString('fr-FR')
                : '—'}
            </dd>
          </div>
          {data.location && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Lieu :</dt>
              <dd className="text-right">{data.location}</dd>
            </div>
          )}
          {data.location_address && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Adresse :</dt>
              <dd className="text-right">{data.location_address}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Ville :</dt>
            <dd className="text-right">{data.city || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Pays :</dt>
            <dd className="text-right">{data.country || '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold">Paramètres</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Capacité :</dt>
            <dd className="text-right">
              {data.max_attendees || 'Illimitée'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Inscription :</dt>
            <dd className="text-right">
              {data.registration_required ? 'Obligatoire' : 'Optionnelle'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Visibilité :</dt>
            <dd className="text-right">{data.is_public ? 'Public' : 'Privé'}</dd>
          </div>
        </dl>
      </section>

      {data.zones.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-semibold">
            Zones configurées ({data.zones.length})
          </h3>
          <div className="space-y-2 text-sm">
            {data.zones.map((zone: any, index: number) => (
              <div
                key={index}
                className="rounded border p-3 text-muted-foreground"
              >
                <p className="font-medium text-foreground">{zone.name}</p>
                <p>
                  Type : {zone.type} • Capacité : {zone.capacity ?? 'Illimitée'}
                </p>
                <p>Niveaux d&apos;accès : {zone.access_levels.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        Vérifiez les informations avant de créer l&apos;événement. Vous pourrez
        les modifier ultérieurement si nécessaire.
      </div>
    </div>
  )
}

