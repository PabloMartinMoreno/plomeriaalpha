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
  license: {
    active: false,
    number: "",
    authority: "",
    gasAuthority: "",
  },
  contact: {
    phone: "+54 9 11 0000 0000",
    phoneDisplay: "11 0000-0000",
    whatsapp: "5491100000000",
    whatsappMessage: "Hola, necesito un plomero de Plomería Alpha.",
    email: "contacto@plomeriaalpha.com.ar",
    hours: "Lunes a Sábado · 8 a 20 hs · Urgencias 24/7",
    openingHours: {
      weekdays: { opens: "08:00", closes: "20:00", days: [1, 2, 3, 4, 5, 6] },
    },
  },
  address: {
    locality: "Vicente López",
    region: "Buenos Aires",
    country: "AR",
    geo: { lat: -34.5268, lng: -58.4848 },
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
} as const;

export const services = [
  {
    slug: "urgencias",
    icon: "lucide:zap",
    title: "Urgencias 24/7",
    short: "Inundaciones, roturas y fugas fuera de horario. Llegamos en menos de 2 horas.",
    tag: "Respuesta inmediata",
    big: true,
    accent: true,
    meta: "Urgencias de plomería 24/7 en Zona Norte GBA con respuesta en menos de 2 horas.",
    longDesc:
      "Atendemos urgencias de plomería todos los días, incluidos feriados y horario nocturno. Cortes de agua por roturas de caños, inundaciones, pérdidas que afectan al vecino de abajo, cloacas desbordadas y fugas de gas. Llegamos con herramienta completa para resolver en la primera visita.",
    bullets: [
      "Llegada objetivo en menos de 2 horas dentro de zona",
      "Diagnóstico inmediato sin cargo",
      "Herramienta completa para resolver en el momento",
      "Presupuesto en el lugar antes de tocar nada",
    ],
  },
  {
    slug: "destapaciones",
    icon: "lucide:droplets",
    title: "Destapaciones",
    short: "Piletas, inodoros y cloacas obstruidas. Equipo profesional.",
    meta: "Destapaciones de cloacas, piletas, inodoros y bachas en Zona Norte con equipo profesional.",
    longDesc:
      "Destapaciones con equipo de sondas eléctricas y máquina rotativa. Trabajamos en viviendas, PH, edificios y comercios. Detectamos la obstrucción sin romper siempre que sea posible y dejamos el sistema limpio, no solo desbloqueado.",
    bullets: [
      "Sondas eléctricas y máquina rotativa",
      "Inspección con cámara cuando corresponde",
      "Limpieza de cámaras y rejillas incluida",
      "Sin romper pisos ni paredes siempre que sea posible",
    ],
  },
  {
    slug: "perdidas-filtraciones",
    icon: "lucide:waves",
    title: "Pérdidas y filtraciones",
    short: "Detección sin romper y reparación de caños rotos.",
    meta: "Detección de pérdidas de agua sin romper y reparación de filtraciones en Zona Norte.",
    longDesc:
      "Localizamos pérdidas con geófono acústico y cámara térmica antes de romper. Reparamos caños de termofusión, epoxi, hierro galvanizado y cobre. Dejamos reparado y probado con presión antes de cerrar la canilla principal.",
    bullets: [
      "Detección con geófono + cámara térmica",
      "Rotura mínima, reconstrucción prolija",
      "Reparación en termofusión / epoxi / cobre",
      "Prueba de presión antes de cerrar el trabajo",
    ],
  },
  {
    slug: "gas",
    icon: "lucide:flame",
    title: "Gas domiciliario",
    short: "Instalación, reparación y pruebas de hermeticidad. Matrícula vigente.",
    tag: "Matriculado",
    big: true,
    meta: "Instalaciones de gas, pruebas de hermeticidad y trámites ante distribuidora en Zona Norte.",
    longDesc:
      "Instalaciones nuevas y reformas de gas con matrícula activa. Pruebas de hermeticidad con planilla firmada, trámite ante la distribuidora y acompañamiento hasta la habilitación. Arreglo de pérdidas, cambios de rejilla y ventilaciones a norma.",
    bullets: [
      "Matrícula vigente y planilla firmada",
      "Trámite completo ante la distribuidora",
      "Pruebas de hermeticidad documentadas",
      "Ventilaciones y rejillas a norma",
    ],
  },
  {
    slug: "termotanques-calefones",
    icon: "lucide:thermometer",
    title: "Termotanques y calefones",
    short: "Instalación, service y recambio de piezas.",
    meta: "Instalación y reparación de termotanques y calefones eléctricos y a gas en Zona Norte.",
    longDesc:
      "Service, instalación y recambio de termotanques y calefones eléctricos o a gas. Trabajamos con marcas líderes (Peisa, Orbis, Sherman, Rheem) y conseguimos repuestos originales. Dejamos todo documentado y con garantía escrita.",
    bullets: [
      "Service y recambio de piezas originales",
      "Instalación a norma con ventilación correcta",
      "Trabajamos con marcas líderes",
      "Garantía escrita de mano de obra",
    ],
  },
  {
    slug: "banos-cocinas",
    icon: "lucide:bath",
    title: "Baños y cocinas",
    short: "Griferías, rejillas, inodoros, bachas y desagües.",
    meta: "Reformas y reparaciones de baños y cocinas: griferías, desagües, inodoros y bachas.",
    longDesc:
      "Reemplazo de griferías, inodoros, bidets, bachas y rejillas. Cambio de flexibles, rectificación de desagües, mejora de presiones y sellados anti-humedad. También coordinamos reformas completas de baño o cocina junto a albañiles y electricistas de confianza.",
    bullets: [
      "Griferías, inodoros, bachas y flexibles",
      "Mejora de presiones y regulación",
      "Sellados anti-humedad",
      "Reformas coordinadas con otros gremios",
    ],
  },
  {
    slug: "obra-refaccion",
    icon: "lucide:house-plug",
    title: "Obra y refacción",
    short: "Cañerías completas y coordinación con obra.",
    meta: "Cañerías completas de agua y cloaca, trabajos de obra y refacción en Zona Norte.",
    longDesc:
      "Tiradas completas de cañerías de agua fría, caliente y cloaca para obra nueva o refacciones. Trabajamos con plano, cronograma acordado y coordinación con el resto de los gremios. Presupuesto por etapa y documentación de lo ejecutado.",
    bullets: [
      "Cañerías agua fría / caliente / cloaca",
      "Planos y cronograma por etapa",
      "Coordinación con otros gremios",
      "Documentación de lo ejecutado",
    ],
  },
] as const;

export const zones = [
  { slug: "vicente-lopez",    name: "Vicente López",    lead: "Centro histórico, Carapachay, Olivos límite y zona del Hospital Houssay." },
  { slug: "olivos",           name: "Olivos",           lead: "Barrio residencial sobre la ribera, cercano a Villa Adelina y La Lucila." },
  { slug: "florida",          name: "Florida",          lead: "Florida Oeste y Florida Vieja — PH y casas con cañerías antiguas frecuentes." },
  { slug: "munro",            name: "Munro",            lead: "Zona mixta residencial y comercial con mucha vivienda multifamiliar." },
  { slug: "san-isidro",       name: "San Isidro",       lead: "Casco histórico, Lomas de San Isidro y La Horqueta. Obras y refacciones frecuentes." },
  { slug: "martinez",         name: "Martínez",         lead: "Zona Bajo y Alto Martínez, con vivienda histórica y PH de altura." },
  { slug: "acassuso",         name: "Acassuso",         lead: "Residencial bajo y alto, muchas casas con termotanques y calefones a reemplazar." },
  { slug: "beccar",           name: "Beccar",           lead: "Zona residencial, PH y countries chicos. Trabajos de gas frecuentes." },
  { slug: "boulogne",         name: "Boulogne",         lead: "Zona mixta con vivienda de uno y dos plantas, comercios y talleres." },
  { slug: "san-fernando",     name: "San Fernando",     lead: "Casco y ribera, cañerías viejas y mucha humedad por cercanía al río." },
  { slug: "virreyes",         name: "Virreyes",         lead: "Zona residencial al oeste de San Fernando, obras y refacciones." },
  { slug: "victoria",         name: "Victoria",         lead: "Zona baja con casas sobre terreno inundable y sistemas de bombeo." },
  { slug: "tigre",            name: "Tigre",            lead: "Centro, Rincón de Milberg y barrios cerrados. Humedad y mucho trabajo de cloaca." },
  { slug: "nordelta",         name: "Nordelta",         lead: "Barrios cerrados: instalaciones modernas, service y emergencias programadas." },
  { slug: "don-torcuato",     name: "Don Torcuato",     lead: "Zona mixta vivienda-industria, reformas y trabajos de obra." },
  { slug: "general-pacheco",  name: "General Pacheco",  lead: "Casas familiares y barrios consolidados, trabajos de termotanque y gas." },
] as const;

export type Service = (typeof services)[number];
export type Zone = (typeof zones)[number];

export type WaContext = {
  service?: string;
  zone?: string;
  urgency?: "urgencia" | "programado";
  source?: string;
  notes?: string;
};

export const buildWaMessage = (ctx: WaContext = {}) => {
  if (!ctx.service && !ctx.zone && !ctx.urgency && !ctx.notes) {
    return site.contact.whatsappMessage;
  }
  const lines = ["Hola, consulta desde la web:"];
  if (ctx.service) lines.push(`· Servicio: ${ctx.service}`);
  if (ctx.zone) lines.push(`· Zona: ${ctx.zone}`);
  if (ctx.urgency) lines.push(`· Tipo: ${ctx.urgency === "urgencia" ? "Urgencia" : "Programado"}`);
  if (ctx.notes) lines.push(`· Detalle: ${ctx.notes}`);
  return lines.join("\n");
};

export const waLink = (msgOrCtx?: string | WaContext) => {
  const msg = typeof msgOrCtx === "string" ? msgOrCtx : buildWaMessage(msgOrCtx);
  const src = typeof msgOrCtx === "object" && msgOrCtx?.source ? `&utm_source=web&utm_content=${encodeURIComponent(msgOrCtx.source)}` : "";
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(msg)}${src}`;
};

export const telLink = `tel:${site.contact.phone.replace(/\s|-/g, "")}`;

export const licenseLabel = () =>
  site.license.active && site.license.number
    ? `Matrícula ${site.license.number}${site.license.authority ? ` · ${site.license.authority}` : ""}`
    : "Matriculación en trámite";

export const areaServedNames = () => zones.map((z) => z.name);

export const cta = {
  primary: "Resolver hoy",
  primaryUrgent: "Urgencia ahora",
  whatsapp: "WhatsApp directo",
  phone: "Llamar ahora",
  schedule: "Agendar visita",
  quote: "Pedir presupuesto",
  consult: "Consulta guiada",
} as const;
