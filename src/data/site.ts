export const site = {
  name: "Jonatan Reyes — Plomero Matriculado",
  shortName: "Jonatan Reyes Plomería",
  tagline: "Plomero matriculado en Zona Norte — urgencias, gas y reparaciones",
  description:
    "Plomero profesional en Zona Norte GBA. Destapaciones, pérdidas, gas, termotanques y reparaciones. Respuesta rápida, presupuesto sin cargo y trabajo con garantía.",
  url: "https://plomerojonatanreyes.com.ar",
  locale: "es_AR",
  owner: {
    name: "Jonatan Reyes",
    role: "Plomero matriculado",
  },
  contact: {
    phone: "+54 9 11 0000 0000",
    phoneDisplay: "11 0000-0000",
    whatsapp: "5491100000000",
    whatsappMessage: "Hola Jonatan, necesito un plomero.",
    email: "contacto@plomerojonatanreyes.com.ar",
    hours: "Lunes a Sábado · 8 a 20 hs · Urgencias 24/7",
  },
  address: {
    locality: "Vicente López",
    region: "Buenos Aires",
    country: "AR",
    areaServed: [
      "Vicente López", "Olivos", "Florida", "Munro",
      "San Isidro", "Martínez", "Acassuso", "Beccar",
      "Boulogne", "San Fernando", "Virreyes", "Victoria",
      "Tigre", "Nordelta", "Don Torcuato", "General Pacheco",
    ],
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
} as const;

export const waLink = (msg?: string) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(msg ?? site.contact.whatsappMessage)}`;

export const telLink = `tel:${site.contact.phone.replace(/\s|-/g, "")}`;
