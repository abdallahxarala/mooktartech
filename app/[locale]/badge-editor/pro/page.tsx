import { CardDesignerPro } from '@/components/card-designer-pro/CardDesignerPro'

export default async function BadgeDesignerProPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  return (
    <CardDesignerPro />
  )
}
