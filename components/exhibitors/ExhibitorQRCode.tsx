import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExhibitorQRCodeProps {
  exhibitorUrl: string;
  companyName: string;
}

export function ExhibitorQRCode({ exhibitorUrl, companyName }: ExhibitorQRCodeProps) {
  const handleDownload = () => {
    // TODO: remplacer par une génération réelle du QR code (Librairie ou API)
    console.log("Téléchargement du QR code pour", exhibitorUrl);
  };

  return (
    <Card className="max-w-md border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          QR Code exposant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex h-60 w-60 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-100 text-slate-400">
          Aperçu QR Code
        </div>
        <p className="text-center text-sm text-slate-500">
          Partagez ce QR code sur le stand et les supports marketing pour rediriger les visiteurs vers
          la boutique digitale de l&apos;exposant.
        </p>
        <Button onClick={handleDownload} className="bg-orange-500 hover:bg-orange-600">
          Télécharger le QR code
        </Button>
      </CardContent>
    </Card>
  );
}

