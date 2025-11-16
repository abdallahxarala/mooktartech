export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  photo: string;
  tags: string[];
  cardName: string;
  createdAt: string;
  history: Array<{
    date: string;
    description: string;
  }>;
  notes: Array<{
    date: string;
    content: string;
  }>;
}