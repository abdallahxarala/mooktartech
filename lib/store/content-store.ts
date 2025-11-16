import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TeamMember {
  id: string
  name: string
  role: string
  expertise: string
  description: string
  avatar: string
  order: number
}

export interface CompanyValue {
  id: string
  icon: string
  title: string
  description: string
  color: string
  order: number
}

export interface Stat {
  id: string
  value: string
  label: string
  icon: string
  order: number
}

export interface Milestone {
  id: string
  year: string
  title: string
  description: string
  order: number
}

export interface Certification {
  id: string
  name: string
  logo: string
  order: number
}

export interface AboutContent {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroBadge: string
  historyTitle: string
  historySubtitle: string
  valuesTitle: string
  valuesSubtitle: string
  teamTitle: string
  teamSubtitle: string
  certificationsTitle: string
  certificationsSubtitle: string
  ctaTitle: string
  ctaDescription: string
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
  city: string
  country: string
  postalCode: string
  mapUrl: string
  whatsapp: string
  facebook?: string
  instagram?: string
  linkedin?: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
}

interface ContentState {
  aboutContent: AboutContent
  teamMembers: TeamMember[]
  companyValues: CompanyValue[]
  stats: Stat[]
  milestones: Milestone[]
  certifications: Certification[]
  contactInfo: ContactInfo

  updateAboutContent: (content: Partial<AboutContent>) => void
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void
  deleteTeamMember: (id: string) => void

  addValue: (value: Omit<CompanyValue, 'id'>) => void
  updateValue: (id: string, value: Partial<CompanyValue>) => void
  deleteValue: (id: string) => void

  addStat: (stat: Omit<Stat, 'id'>) => void
  updateStat: (id: string, stat: Partial<Stat>) => void
  deleteStat: (id: string) => void

  addMilestone: (milestone: Omit<Milestone, 'id'>) => void
  updateMilestone: (id: string, milestone: Partial<Milestone>) => void
  deleteMilestone: (id: string) => void

  addCertification: (cert: Omit<Certification, 'id'>) => void
  updateCertification: (id: string, cert: Partial<Certification>) => void
  deleteCertification: (id: string) => void

  updateContactInfo: (info: Partial<ContactInfo>) => void
}

const defaultAboutContent: AboutContent = {
  heroTitle: 'Votre partenaire en identification pro',
  heroSubtitle: '',
  heroDescription:
    "Depuis 2015, nous équipons entreprises et administrations sénégalaises en solutions d'impression de badges et cartes professionnelles.",
  heroBadge: "Leader de l'identification professionnelle au Sénégal",
  historyTitle: "10 ans d'innovation",
  historySubtitle: 'De startup à leader du marché sénégalais',
  valuesTitle: 'Ce qui nous définit',
  valuesSubtitle: "Les principes qui guident notre action au quotidien",
  teamTitle: 'Des experts à votre service',
  teamSubtitle: 'Une équipe passionnée et compétente pour vous accompagner',
  certificationsTitle: 'Nos partenaires et certifications',
  certificationsSubtitle:
    "+Des partenariats avec les leaders mondiaux de l'industrie",
  ctaTitle: 'Prêt à démarrer votre projet ?',
  ctaDescription:
    "Contactez-nous dès aujourd'hui pour un devis gratuit et sans engagement. Notre équipe vous répond sous 2h.",
}

const defaultContactInfo: ContactInfo = {
  phone: '+221 77 539 81 39',
  email: 'contact@xarala-solutions.com',
  address: 'Sicap Liberté 6, Villa N°123',
  city: 'Dakar',
  country: 'Sénégal',
  postalCode: '12500',
  mapUrl: 'https://maps.google.com/?q=Dakar,Senegal',
  whatsapp: '+221775398139',
  facebook: '',
  instagram: '',
  linkedin: '',
  hours: {
    weekdays: 'Lun-Ven: 8h00 - 18h00',
    saturday: 'Sam: 9h00 - 13h00',
    sunday: 'Dim: Fermé',
  },
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      aboutContent: defaultAboutContent,
      contactInfo: defaultContactInfo,

      teamMembers: [
        {
          id: '1',
          name: 'Amadou Diallo',
          role: 'Fondateur & CEO',
          expertise: "Expert en solutions d'identification professionnelle",
          description:
            "15 ans d'expérience dans l'industrie de l'impression de cartes et de l'identification sécurisée.",
          avatar: 'AD',
          order: 1,
        },
        {
          id: '2',
          name: 'Fatou Seck',
          role: 'Directrice Technique',
          expertise: 'Spécialiste systèmes RFID et NFC',
          description:
            'Formation certifiée HID Global et NXP. Experte en solutions sans contact et sécurité.',
          avatar: 'FS',
          order: 2,
        },
        {
          id: '3',
          name: 'Ibrahima Kane',
          role: 'Responsable Commercial',
          expertise: 'Solutions entreprises et administrations',
          description:
            'A équipé +100 entreprises au Sénégal en systèmes de badgeage professionnels.',
          avatar: 'IK',
          order: 3,
        },
      ],

      companyValues: [
        {
          id: '1',
          icon: 'Shield',
          title: 'Qualité Premium',
          description:
            'Nous ne proposons que des équipements de marques reconnues (Entrust, Datacard, HiTi) avec garantie constructeur.',
          color: 'from-blue-500 to-cyan-500',
          order: 1,
        },
        {
          id: '2',
          icon: 'Zap',
          title: 'Réactivité',
          description:
            'Livraison sous 24-48h à Dakar, installation rapide et formation incluse pour une prise en main immédiate.',
          color: 'from-orange-500 to-pink-500',
          order: 2,
        },
        {
          id: '3',
          icon: 'Users',
          title: 'Support Local',
          description:
            'Une équipe technique basée à Dakar, disponible pour le dépannage, la maintenance et les consommables.',
          color: 'from-purple-500 to-pink-500',
          order: 3,
        },
        {
          id: '4',
          icon: 'Heart',
          title: 'Satisfaction Client',
          description:
            '98% de nos clients nous recommandent. Nous mettons tout en œuvre pour votre réussite et votre satisfaction.',
          color: 'from-green-500 to-emerald-500',
          order: 4,
        },
      ],

      stats: [
        { id: '1', value: '500+', label: 'Clients satisfaits', icon: 'ThumbsUp', order: 1 },
        { id: '2', value: "10 ans", label: "D'expertise", icon: 'Award', order: 2 },
        { id: '3', value: '10K+', label: 'Badges imprimés', icon: 'Package', order: 3 },
        { id: '4', value: '24-48h', label: 'Livraison à Dakar', icon: 'Clock', order: 4 },
      ],

      milestones: [
        {
          id: '1',
          year: '2015',
          title: 'Création de Xarala Solutions',
          description:
            "Lancement de l'activité avec la distribution d'imprimantes de cartes à Dakar.",
          order: 1,
        },
        {
          id: '2',
          year: '2017',
          title: 'Partenariat Entrust',
          description: "Devenu revendeur officiel Entrust Datacard pour l'Afrique de l'Ouest.",
          order: 2,
        },
        {
          id: '3',
          year: '2019',
          title: 'Expansion services',
          description: 'Lancement des services de personnalisation de cartes et formation technique.',
          order: 3,
        },
        {
          id: '4',
          year: '2022',
          title: 'Innovation digitale',
          description: "Lancement de l'éditeur de cartes en ligne gratuit et cartes NFC digitales.",
          order: 4,
        },
        {
          id: '5',
          year: '2025',
          title: '500+ clients',
          description:
            "+Leader de l'identification professionnelle au Sénégal avec 500+ clients actifs.",
          order: 5,
        },
      ],

      certifications: [
        { id: '1', name: 'Revendeur Officiel Entrust', logo: 'E', order: 1 },
        { id: '2', name: 'Partenaire HiTi', logo: 'H', order: 2 },
        { id: '3', name: 'Distributeur NXP MIFARE', logo: 'N', order: 3 },
        { id: '4', name: 'Certifié ISO 9001', logo: 'ISO', order: 4 },
      ],

      updateAboutContent: (content) =>
        set((state) => ({ aboutContent: { ...state.aboutContent, ...content } })),

      addTeamMember: (member) =>
        set((state) => ({ teamMembers: [...state.teamMembers, { ...member, id: Date.now().toString() }] })),

      updateTeamMember: (id, member) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...member } : m)),
        })),

      deleteTeamMember: (id) =>
        set((state) => ({ teamMembers: state.teamMembers.filter((m) => m.id !== id) })),

      addValue: (value) =>
        set((state) => ({ companyValues: [...state.companyValues, { ...value, id: Date.now().toString() }] })),

      updateValue: (id, value) =>
        set((state) => ({
          companyValues: state.companyValues.map((v) => (v.id === id ? { ...v, ...value } : v)),
        })),

      deleteValue: (id) =>
        set((state) => ({ companyValues: state.companyValues.filter((v) => v.id !== id) })),

      addStat: (stat) =>
        set((state) => ({ stats: [...state.stats, { ...stat, id: Date.now().toString() }] })),

      updateStat: (id, stat) =>
        set((state) => ({ stats: state.stats.map((s) => (s.id === id ? { ...s, ...stat } : s)) })),

      deleteStat: (id) =>
        set((state) => ({ stats: state.stats.filter((s) => s.id !== id) })),

      addMilestone: (milestone) =>
        set((state) => ({ milestones: [...state.milestones, { ...milestone, id: Date.now().toString() }] })),

      updateMilestone: (id, milestone) =>
        set((state) => ({
          milestones: state.milestones.map((m) => (m.id === id ? { ...m, ...milestone } : m)),
        })),

      deleteMilestone: (id) =>
        set((state) => ({ milestones: state.milestones.filter((m) => m.id !== id) })),

      addCertification: (cert) =>
        set((state) => ({ certifications: [...state.certifications, { ...cert, id: Date.now().toString() }] })),

      updateCertification: (id, cert) =>
        set((state) => ({
          certifications: state.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)),
        })),

      deleteCertification: (id) =>
        set((state) => ({ certifications: state.certifications.filter((c) => c.id !== id) })),

      updateContactInfo: (info) =>
        set((state) => ({ contactInfo: { ...state.contactInfo, ...info } })),
    }),
    { name: 'content-storage' }
  )
)


