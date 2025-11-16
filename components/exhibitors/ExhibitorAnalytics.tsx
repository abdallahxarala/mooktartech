import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ExhibitorAnalytics() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Interactions visiteurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Branchez vos métriques Supabase ou vos outils d&apos;analytics pour afficher en temps réel
            le nombre d&apos;interactions : scans QR, vues de produits, demandes de contact, etc.
          </p>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-100/60 p-6 text-center text-slate-400">
            Graphique en aire (à intégrer)
          </div>
          <Separator />
          <ul className="space-y-2">
            <li>• Scans QR : <strong>134</strong></li>
            <li>• Vues produits : <strong>286</strong></li>
            <li>• Fiches favorites : <strong>42</strong></li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Performance commerciale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Visualisez le pipeline de prospects générés par vos exposants, comparez les taux de
            conversion sur la marketplace et alimentez votre CRM.
          </p>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-100/60 p-6 text-center text-slate-400">
            Diagramme radial (à intégrer)
          </div>
          <Separator />
          <p className="text-xs text-slate-500">
            Ces données sont simulées pour servir de base à l&apos;intégration. Connectez-vous aux tables
            `exhibitor_interactions` et aux webhooks Stripe pour afficher des métriques réelles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

