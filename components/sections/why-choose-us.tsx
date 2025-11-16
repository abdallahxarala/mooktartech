import { Card } from "@/components/ui/card";
import { Shield, Clock, Headphones, Award } from "lucide-react";
const features = [
  {
    icon: Shield,
    title: "Expertise locale",
    description: "Plus de 10 ans d'expérience dans les solutions d'identification en Afrique de l'Ouest",
  },
  {
    icon: Clock,
    title: "Support 24/7",
    description: "Une équipe technique disponible à tout moment pour vous accompagner",
  },
  {
    icon: Headphones,
    title: "Service client",
    description: "Un accompagnement personnalisé dans votre langue",
  },
  {
    icon: Award,
    title: "Qualité garantie",
    description: "Des produits certifiés et garantis pour une durabilité maximale",
  },
];

const testimonials = [
  {
    name: "Amadou Diallo",
    role: "Directeur IT, Wave Sénégal",
    content: "Xarala Solutions nous a permis de moderniser notre système d'identification des agents avec une solution adaptée à nos besoins.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
  },
  {
    name: "Fatou Sow",
    role: "DRH, Orange Digital Center",
    content: "Un partenaire fiable qui comprend les enjeux locaux et propose des solutions innovantes.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 animate-fade-in-up">
      <div className="container mx-auto px-4 animate-fade-in-up">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Pourquoi choisir Xarala Solutions ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Une expertise locale au service de votre réussite
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in-up">
          {features.map((feature, index) => (
            <div key={feature.title}>
              <Card className="p-6 text-center animate-fade-in-up">
                <div className="h-12 w-12 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in-up">
                  <feature.icon className="h-6 w-6 text-primary-orange animate-fade-in-up" />
                </div>
                <h3 className="font-semibold mb-2 animate-fade-in-up">{feature.title}</h3>
                <p className="text-gray-600 text-sm animate-fade-in-up">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name}>
              <Card className="p-6 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-4 animate-fade-in-up">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover animate-fade-in-up"
                  />
                  <div>
                    <h4 className="font-semibold animate-fade-in-up">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 animate-fade-in-up">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic animate-fade-in-up">"{testimonial.content}"</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
