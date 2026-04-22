export const site = {
  name: "Plomería Alpha — Zona Norte",
  shortName: "Plomería Alpha",
  tagline: "Plomería matriculada en Zona Norte — urgencias, gas y reparaciones",
  description:
    "Plomería Alpha: servicio profesional en Zona Norte GBA. Destapaciones, pérdidas, gas, termotanques y reparaciones. Respuesta rápida, presupuesto sin cargo y trabajo con garantía.",
  url: "https://plomeriaalpha.com.ar",
  locale: "es_AR",
  owner: {
    name: "Jonatan Reyes",
    role: "Plomero matriculado · Fundador",
  },
  contact: {
    phone: "+54 9 11 0000 0000",
    phoneDisplay: "11 0000-0000",
    whatsapp: "5491100000000",
    whatsappMessage: "Hola, necesito un plomero de Plomería Alpha.",
    email: "contacto@plomeriaalpha.com.ar",
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
