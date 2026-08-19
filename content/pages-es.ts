import { relaunchCopy } from "@/content/relaunch-copy";
import { cookieSectionsEs, imprintSectionsEs, privacySectionsEs } from "@/content/legal-es";
import type { FaqItem, HomeContent, PageContent, Playbook } from "@/content/pages";
import type { PageKey } from "@/lib/i18n";

export const playbooksEs: Playbook[] = [
  {
    key: "developer",
    title: "Playbook para promotores inmobiliarios",
    subtitle: "Un mapa práctico para convertir el interés por una promoción en conversaciones cualificadas con compradores.",
    learns: [
      "Cómo estructurar el recorrido comercial antes de aumentar la inversión en medios",
      "Dónde filtrar la intención de compra antes del traspaso al equipo comercial",
      "Qué contexto necesita su equipo antes de la primera llamada"
    ]
  },
  {
    key: "agent",
    title: "Playbook de captación para agencias inmobiliarias",
    subtitle: "Una guía para agencias que quieren generar demanda propia de vendedores y compradores más allá de los portales.",
    learns: [
      "Cómo reducir la dependencia de portales mediante demanda propia",
      "Qué filtros permiten cualificar la intención de vendedores y compradores",
      "Cómo un seguimiento estructurado protege las oportunidades reales"
    ]
  }
];

const hardFaqEs: FaqItem[] = [
  {
    question: "¿Por qué debería confiar en NovaLure si todavía no hay referencias públicas?",
    answer: "Porque no inventamos referencias. Mostramos ejemplos de traspaso, extractos del análisis y la lógica real de trabajo. Valore el sistema por su funcionamiento, no por una colección de logotipos sin verificar."
  },
  {
    question: "¿Ya trabajan con clientes?",
    answer: "Solo identificamos a un cliente cuando existe una autorización clara. Sin ella no mostramos nombres, logotipos ni referencias indirectas. Por eso utilizamos ejemplos y sistemas de demostración en lugar de pruebas ficticias."
  },
  {
    question: "¿Por qué no muestran logotipos de clientes?",
    answer: "Porque su uso exige una autorización expresa. Es preferible no mostrar una colección de logotipos que utilizar referencias sin una base clara."
  },
  {
    question: "¿NovaLure es una agencia de marketing?",
    answer: "No en el sentido clásico. Las campañas pueden formar parte del sistema, pero el objetivo no es la publicidad por sí sola. El objetivo es conectar la presencia de la promoción, la demanda, el seguimiento y el traspaso preparado al equipo comercial."
  },
  {
    question: "¿Garantiza NovaLure un número concreto de oportunidades?",
    answer: "No. Un volumen serio depende del mercado, la promoción, el presupuesto, la oferta, el momento y la ejecución comercial. NovaLure no vende cifras imaginarias; estructura un sistema para mejorar la calidad, priorización y entrega de las solicitudes."
  },
  {
    question: "¿Por qué no hay precios públicos?",
    answer: "Porque el alcance, los activos existentes, el tipo de promoción, la situación comercial y el trabajo continuo varían de forma relevante. La capacidad presupuestaria se aclara antes del análisis para evitar pérdidas de tiempo."
  },
  {
    question: "¿Cuánto cuesta aproximadamente un sistema de este tipo?",
    answer: "NovaLure no publica una tarifa cerrada. Antes del análisis se comprueba si existe presupuesto para implantación, operación y, cuando proceda, inversión en medios. Sin capacidad presupuestaria, el análisis no resulta útil."
  },
  {
    question: "¿Qué ocurre si la calidad de las solicitudes es baja?",
    answer: "Revisamos el origen, la presentación del proyecto, el formulario, la cualificación, el activo, el mercado, el presupuesto y el seguimiento. No existe una garantía de volumen, pero sí una lógica clara de mejora."
  },
  {
    question: "¿Necesitamos un equipo comercial propio?",
    answer: "No necesariamente. Si ya existe, NovaLure ayuda a que clasifique menos contactos sin filtrar y converse antes con oportunidades cualificadas. Si aún no hay una estructura clara, podemos ayudar a implantar el proceso, la cualificación, el seguimiento y el traspaso."
  },
  {
    question: "¿Qué necesitamos antes de empezar?",
    answer: "Una promoción o mercado concreto, público objetivo, activos disponibles, proceso actual, responsable de decisión, capacidad presupuestaria y una persona de contacto."
  },
  {
    question: "¿Trabajan de forma individual o con un equipo?",
    answer: "NovaLure está dirigida por su responsable de equipo. Franz lidera el diagnóstico y la arquitectura del sistema. Según el alcance participan especialistas en páginas, CRM, medición, campañas, rendimiento o contenidos."
  },
  {
    question: "¿Por qué NovaLure tiene su base en Irlanda?",
    answer: "NovaLure es una empresa con raíces en Irlanda y orientación internacional. La base irlandesa proporciona un marco contractual europeo claro y el equipo mantiene proximidad operativa con los mercados DACH, Reino Unido y otros mercados internacionales."
  },
  {
    question: "¿Es una estructura adecuada para clientes de la Unión Europea?",
    answer: "NovaLure opera en un contexto de la UE y utiliza procesos estructurados. Los detalles contractuales, de privacidad y de herramientas se aclaran antes de iniciar cada encargo."
  },
  {
    question: "¿Por qué no basta con una web convencional?",
    answer: "Una web presenta. Un sistema comercial continúa el recorrido: cualifica, realiza seguimiento, prepara el traspaso y hace visible el siguiente paso."
  },
  {
    question: "¿Por qué no bastan Meta Ads o Google Ads?",
    answer: "Los anuncios generan atención. Sin una página adecuada, cualificación, seguimiento y traspaso, el resultado suele ser volumen sin oportunidades comerciales utilizables."
  },
  {
    question: "¿Qué diferencia a NovaLure de otras agencias de marketing inmobiliario?",
    answer: "NovaLure no parte de la estética de la campaña ni del coste del clic, sino de las conversaciones cualificadas. Importa que el origen, interés, plazo, encaje presupuestario y siguiente paso sean visibles antes de la primera llamada."
  },
  {
    question: "¿Cuándo no es NovaLure el socio adecuado?",
    answer: "Cuando no existe una promoción o mercado concreto, presupuesto ni voluntad de realizar un seguimiento estructurado. NovaLure no está pensada para campañas de imagen o alcance sin un objetivo comercial."
  },
  {
    question: "¿Qué recibimos después del análisis del proyecto?",
    answer: "Una valoración del recorrido actual, los puntos débiles identificados y una recomendación sobre si conviene implantar y mejorar el sistema. El análisis aporta claridad sobre el siguiente paso, no una estrategia completa gratuita."
  },
  {
    question: "¿Cuándo no compensa implantar el sistema?",
    answer: "Cuando no hay una promoción, mercado, presupuesto de medios o ejecución, seguimiento ni objetivo comercial claro."
  }
];

const homeEs: HomeContent = {
  key: "home",
  locale: "es",
  template: "home",
  eyebrow: "Comercialización de promociones inmobiliarias con una estructura de ventas clara",
  title: relaunchCopy.es.heroH1,
  seoTitle: "NovaLure | Comercialización de promociones inmobiliarias",
  description: relaunchCopy.es.heroSub,
  metaDescription: "NovaLure conecta la comercialización inmobiliaria, el seguimiento y el traspaso preparado: conversaciones cualificadas en lugar de contactos sin filtrar.",
  primaryCta: { label: "Solicitar un análisis del proyecto", target: "contact", anchor: "book-audit" },
  secondaryCta: { label: "Descargar el Playbook", target: "playbooks", variant: "subtle" },
  heroBullets: [
    "Menos tiempo dedicado a solicitudes sin cualificar",
    "Más contexto antes de la primera llamada",
    "Priorización clara dentro del sistema",
    "Para promotores, equipos comerciales y agencias inmobiliarias"
  ],
  audience: {
    title: "Para empresas inmobiliarias que necesitan convertir antes sus solicitudes en conversaciones cualificadas.",
    cards: [
      {
        title: "Para promotores y equipos comerciales",
        body: "Cuando una promoción debe venderse, los clics no bastan. El equipo necesita compradores que encajen con el proyecto, el presupuesto y el calendario.",
        hrefKey: "developers",
        points: ["Recorrido según tipología y público", "Preguntas sobre presupuesto, plazo y uso", "Traspaso preparado con siguiente paso"]
      },
      {
        title: "Para agencias y equipos inmobiliarios",
        body: "Cuando las solicitudes de vendedores y compradores llegan sin prioridad, el equipo pierde tiempo. NovaLure separa la curiosidad de una intención real de vender o comprar.",
        hrefKey: "agents",
        points: ["Vendedores con grado de madurez claro", "Compradores con lógica de búsqueda", "Seguimiento y contexto más allá de los portales"]
      }
    ]
  },
  problem: {
    title: "Muchas empresas inmobiliarias no tienen un problema de contactos. Tienen un problema de clasificación.",
    body: "Las solicitudes llegan, pero el equipo comercial descubre demasiado tarde cuáles merecen atención. Cada contacto sin cualificar consume tiempo. NovaLure crea la estructura que convierte la demanda en conversaciones útiles.",
    points: [
      { title: "Los contactos sin filtrar consumen tiempo", body: "Si el presupuesto, el plazo o la motivación solo se descubren durante la llamada, la pérdida se produjo antes." },
      { title: "El coste por contacto no es el flujo comercial", body: "Más solicitudes no resuelven nada si las inadecuadas llegan primero al equipo." },
      { title: "La dependencia de portales sigue siendo un riesgo", body: "Los portales aportan alcance, pero no una lógica propia de cualificación, traspaso y seguimiento." }
    ]
  },
  system: {
    title: "La estructura NovaLure conecta presencia, solicitud y conversación cualificada.",
    body: "Integra página de destino, preguntas de intención, traspaso preparado, seguimiento e informes. Los anuncios pueden formar parte del recorrido, pero no son el producto.",
    layers: [
      { label: "01", title: "Del clic a la solicitud", body: "El público, la promoción o el mercado y las preguntas clave se definen antes de aumentar el presupuesto." },
      { label: "02", title: "Preguntas de precualificación", body: "Las preguntas identifican intención real antes de que el equipo invierta tiempo en una conversación." },
      { label: "03", title: "Traspaso preparado", body: "Origen, motivación, plazo, presupuesto y siguiente paso son visibles, no solo el nombre y el teléfono." },
      { label: "04", title: "Implantación y mejora continua", body: "La calidad mejora mediante conversaciones, comentarios e informes, no únicamente mediante clics." }
    ]
  },
  modules: {
    title: "Qué aporta NovaLure",
    items: [
      { title: "Cualificar", audience: "Módulo esencial", body: "Planteamos las preguntas que hacen visible la intención real de compra o venta." },
      { title: "Traspasar", audience: "Módulo esencial", body: "El equipo recibe origen, motivación, plazo, encaje presupuestario y siguiente paso." },
      { title: "Priorizar", audience: "Módulo esencial", body: "Las solicitudes se ordenan por encaje, plazo y presupuesto para empezar por las conversaciones correctas." },
      { title: "Mejorar", audience: "Módulo esencial", body: "La calidad se optimiza de forma continua mediante feedback comercial e informes." }
    ]
  },
  playbookSection: {
    title: "El Playbook es el segundo paso, no la venta principal.",
    body: "Si todavía no está preparado para un análisis, el Playbook muestra dónde se pierde contexto antes de llegar al equipo comercial. La vía directa sigue siendo el análisis de 30 minutos."
  },
  beforeAfter: {
    beforeTitle: "Antes de NovaLure",
    afterTitle: "Después de estructurar el recorrido",
    before: ["Formularios sin contexto", "Coste por contacto sin visión comercial", "Seguimiento dependiente de personas", "CRM sin contexto", "Clasificación manual"],
    after: ["Origen, segmento y plazo visibles", "Oportunidades priorizadas", "Seguimiento por segmento", "Nota de traspaso antes de la llamada", "Mejora basada en calidad"]
  },
  process: {
    id: "proceso",
    title: "Primero diagnóstico. Después implantación. A continuación, mejora continua.",
    body: "NovaLure no vende un paquete estándar. El alcance depende del problema, el mercado, la lógica del proyecto, la estructura comercial y la viabilidad económica.",
    steps: ["Análisis del proyecto", "Definir el cuello de botella", "Concretar el alcance", "Construir el recorrido", "Configurar el traspaso", "Lanzar", "Mejorar la calidad"]
  },
  team: {
    id: "equipo",
    title: "Creado desde la perspectiva comercial inmobiliaria, no desde la campaña.",
    body: "NovaLure se centra en un problema sencillo: muchas solicitudes llegan al equipo comercial sin contexto suficiente. Creamos sistemas que conectan demanda, cualificación, traspaso y seguimiento para reconocer antes qué conversaciones merecen prioridad.",
    pillars: [
      "Primero la conversación comercial; después la lógica de campaña.",
      "Conversaciones inmobiliarias cualificadas en lugar de un simple recuento de contactos.",
      "Contexto antes de la primera llamada: origen, motivación, plazo, presupuesto y siguiente paso.",
      "Análisis antes de la propuesta: el alcance se define tras el diagnóstico.",
      "Reforzamos equipos existentes y ayudamos a implantar estructuras cuando faltan."
    ],
    founder: "Franz Romih — Dirección de equipo: diagnóstico, arquitectura del sistema y priorización comercial",
    workstyle: "Franz dirige el diagnóstico, la arquitectura y la lógica comercial. Según el alcance participan especialistas en páginas, medición, CRM, campañas y contenidos. La responsabilidad por el sistema, la calidad y el traspaso permanece centralizada.",
    ireland: "NovaLure es una empresa con raíces en Irlanda y orientación internacional. Opera en Irlanda, Reino Unido, DACH y otros mercados con interlocutores claros, base contractual definida, herramientas conformes con el RGPD y entregables concretos."
  },
  faq: hardFaqEs,
  finalCtaTitle: "Analicemos dónde pierde tiempo comercial su recorrido actual."
};

function thankYouEs(key: "playbookThanks" | "auditThanks"): PageContent {
  const playbook = key === "playbookThanks";
  return {
    key,
    locale: "es",
    template: "thank-you",
    eyebrow: playbook ? "Playbook" : "Análisis del proyecto",
    title: playbook ? "Revise su bandeja de entrada." : "Hemos recibido su solicitud de análisis.",
    seoTitle: playbook ? "Playbook solicitado | NovaLure" : "Análisis solicitado | NovaLure",
    description: playbook
      ? "Su Playbook está de camino. Revise también la carpeta de correo no deseado si no lo recibe en los próximos minutos."
      : "Revisaremos sus datos. El análisis es un diagnóstico, no un informe gratuito. Prepare el proyecto, las fuentes, el CRM y el principal cuello de botella.",
    primaryCta: playbook
      ? { label: "Solicitar un análisis del proyecto", target: "contact", anchor: "book-audit" }
      : { label: "Ver un ejemplo de traspaso", target: "home", anchor: "proof" },
    secondaryCta: playbook
      ? { label: "Ver un ejemplo de traspaso", target: "home", anchor: "proof" }
      : { label: "Descargar el Playbook", target: "playbooks" },
    heroBullets: playbook
      ? ["¿Dónde pierde tiempo el equipo?", "¿Qué fuentes aportan poco contexto?", "¿Existe presupuesto para implantar y mejorar?"]
      : ["promoción o mercado", "fuentes actuales", "CRM", "principal cuello de botella", "presupuesto", "capacidad de decisión"],
    sections: [{
      title: playbook ? "Tres preguntas antes del análisis" : "Información que conviene preparar",
      body: playbook ? "Si puede responderlas de forma concreta, un análisis será más útil que nuevas ideas generales." : "Así la reunión se convierte en un diagnóstico claro.",
      items: playbook
        ? ["¿Dónde pierde tiempo su equipo?", "¿Qué fuentes funcionan pero aportan poco contexto?", "¿Existe presupuesto para implantar y mejorar?"]
        : ["promoción o mercado", "fuentes de oportunidades", "CRM o gestión actual", "páginas y campañas", "principal cuello de botella", "presupuesto", "capacidad de decisión"]
    }]
  };
}

function legalEs(key: "imprint" | "privacy" | "cookies"): PageContent {
  const titles = { imprint: "Aviso legal", privacy: "Política de privacidad", cookies: "Política de cookies" };
  const descriptions = {
    imprint: "Información detallada sobre NovaLure CLG conforme al Derecho societario irlandés y las normas europeas de comercio electrónico.",
    privacy: "Información detallada sobre el tratamiento de datos personales por NovaLure CLG conforme al Derecho irlandés, el RGPD y las normas de ePrivacy.",
    cookies: "Información sobre cookies, seguimiento y servicios externos utilizados en el sitio web de NovaLure."
  };
  const sections = key === "imprint" ? imprintSectionsEs : key === "privacy" ? privacySectionsEs : cookieSectionsEs;
  return {
    key,
    locale: "es",
    template: "legal",
    eyebrow: "Información legal",
    title: titles[key],
    seoTitle: `${titles[key]} | NovaLure`,
    description: descriptions[key],
    primaryCta: { label: "Solicitar un análisis del proyecto", target: "contact", anchor: "book-audit" },
    secondaryCta: { label: "Descargar el Playbook", target: "playbooks" },
    heroBullets: ["NovaLure CLG", "20 Harcourt Street, Dublin 2, D02 H364, Ireland", "Registration number: 796735", "Irish VAT number: 451718HH", "hello@novalure.eu"],
    sections
  };
}

export const pagesEs: Record<PageKey, PageContent | HomeContent> = {
  home: homeEs,
  developers: {
    key: "developers",
    locale: "es",
    template: "audience",
    eyebrow: "Para promotores y equipos comerciales",
    title: "Comercialización de promociones que no termina en la solicitud.",
    seoTitle: "Comercialización de promociones y compradores cualificados | NovaLure",
    description: "NovaLure conecta relato, visualización, dossier, campaña, seguimiento y traspaso para que su equipo converse con compradores preparados.",
    primaryCta: { label: "Solicitar un análisis del proyecto", target: "contact", anchor: "book-audit" },
    secondaryCta: { label: "Descargar el Playbook para promotores", target: "playbooks" },
    heroBullets: ["Relato, visualización y dossier con una misma lógica", "Campaña, formulario y seguimiento con cualificación", "Traspaso con origen, interés, plazo y siguiente paso"],
    sections: [
      {
        title: "Por qué una promoción necesita más que buenas imágenes",
        body: "La visualización y el dossier atraen la atención. Lo decisivo es que el recorrido continúe hacia la solicitud adecuada, la cualificación y un siguiente paso útil para el equipo comercial.",
        items: ["La página y el dossier definen la expectativa antes de la solicitud.", "El formulario y el seguimiento aclaran interés, plazo y presupuesto.", "El equipo recibe contexto, no solo datos de contacto.", "Las solicitudes se ordenan por encaje y madurez.", "Las campañas se evalúan por la calidad de las conversaciones."]
      },
      { title: "Qué debería recibir su equipo comercial", body: "Una oportunidad preparada muestra la promoción o tipología de interés, uso propio o inversión, plazo, encaje presupuestario, situación de financiación, origen y siguiente paso." },
      { title: "Qué implanta NovaLure para promotores", body: "Relato de proyecto, lógica visual y de dossier, página o recorrido, campaña, preguntas de cualificación, seguimiento, traspaso, priorización e informes." },
      { title: "Cuándo tiene sentido un análisis", body: "Es adecuado para obra nueva, proyectos de inversión, equipos comerciales y lanzamientos con una necesidad real de comercialización.", items: ["No adecuado: no existe una promoción concreta", "No adecuado: no hay presupuesto ni capacidad de decisión", "No adecuado: se exige una garantía de volumen", "No adecuado: campaña de marca sin objetivo comercial"] }
    ],
    faq: hardFaqEs
  },
  agents: {
    key: "agents",
    locale: "es",
    template: "audience",
    eyebrow: "Para agencias inmobiliarias",
    title: "Solicitudes de vendedores y compradores con un seguimiento claro.",
    seoTitle: "Captación cualificada para agencias inmobiliarias | NovaLure",
    description: "NovaLure conecta posicionamiento local, campañas, formularios, seguimiento y traspaso para separar oportunidades reales de simples consultas.",
    primaryCta: { label: "Solicitar un análisis del proyecto", target: "contact", anchor: "book-audit" },
    secondaryCta: { label: "Descargar el Playbook para agencias", target: "playbooks" },
    heroBullets: ["Demanda local con una lógica de conversación", "Separación de vendedores y compradores", "Seguimiento y traspaso con siguiente paso visible"],
    sections: [
      { title: "Por qué muchas solicitudes aún no están preparadas", body: "Las valoraciones, contactos de compradores y oportunidades de portales pueden ser valiosos. Necesitan una separación clara entre intención real, madurez y simple investigación.", items: ["Vendedores sin intención concreta.", "Compradores sin presupuesto ni perfil de búsqueda.", "Solicitudes web sin prioridad ni siguiente paso.", "Dependencia intacta de portales.", "Seguimiento basado en memoria individual."] },
      { title: "Separar correctamente vendedores y compradores", body: "Los vendedores necesitan campos sobre tipo de inmueble, ubicación, plazo, motivación y expectativa. Los compradores necesitan zona, tipología, presupuesto, financiación, plazo y requisitos esenciales." },
      { title: "Qué debe incluir una oportunidad preparada", body: "Origen, segmento, plazo, encaje presupuestario, nota de conversación y siguiente paso para iniciar el seguimiento sin reconstruir el contexto." },
      { title: "Cuándo debe revisarse el sistema", body: "Conviene analizarlo cuando existe especialización local, disciplina de seguimiento y presupuesto para implantación y mejora.", items: ["No adecuado: sin especialización local", "No adecuado: sin seguimiento estructurado", "No adecuado: solo se persigue volumen", "No adecuado: sin presupuesto de implantación"] }
    ],
    faq: hardFaqEs
  },
  playbooks: {
    key: "playbooks",
    locale: "es",
    template: "playbooks",
    eyebrow: "Playbook",
    title: "El Playbook muestra dónde el interés todavía no se convierte en una conversación cualificada.",
    seoTitle: "Playbooks de captación inmobiliaria | NovaLure",
    description: "Descubra dónde las oportunidades pierden contexto antes de llegar al equipo comercial y si un análisis es el siguiente paso adecuado.",
    primaryCta: { label: "Descargar el Playbook", target: "playbooks", anchor: "playbook-download" },
    secondaryCta: { label: "Solicitar un análisis", target: "contact", anchor: "book-audit" },
    heroBullets: ["Detectar carencias sin exponer todo el sistema", "Mini evaluación de madurez", "Paso claro hacia un análisis de 30 minutos"],
    faq: hardFaqEs
  },
  contact: {
    key: "contact",
    locale: "es",
    template: "contact",
    eyebrow: "Análisis del proyecto",
    title: "Analice el recorrido desde la presentación hasta la conversación.",
    seoTitle: "Análisis del proyecto para equipos inmobiliarios | NovaLure",
    description: "En 30 minutos revisamos presentación, campaña, formulario, cualificación, seguimiento, traspaso e informes para determinar si conviene estructurar el recorrido.",
    primaryCta: { label: "Solicitar un análisis del proyecto", target: "contact", anchor: "book-audit" },
    secondaryCta: { label: "Descargar el Playbook", target: "playbooks" },
    heroBullets: ["Valorar el recorrido", "Identificar puntos débiles", "Aclarar el siguiente paso"],
    faq: hardFaqEs
  },
  handover: {
    key: "handover",
    locale: "es",
    template: "handover",
    eyebrow: "Ejemplo del sistema",
    title: "Qué recibe el equipo comercial cuando una solicitud está preparada.",
    seoTitle: "Ejemplo de sistema para oportunidades inmobiliarias | NovaLure",
    description: "Una solicitud cobra valor cuando el equipo ve origen, interés, plazo, presupuesto, responsable y siguiente paso.",
    primaryCta: { label: "Ver un ejemplo de traspaso", target: "home", anchor: "proof" },
    secondaryCta: { label: "Solicitar un análisis", target: "contact", anchor: "book-audit" },
    heroBullets: ["Origen", "Interés", "Plazo", "Encaje presupuestario", "Siguiente paso"],
    faq: hardFaqEs.slice(0, 8)
  },
  playbookThanks: thankYouEs("playbookThanks"),
  auditThanks: thankYouEs("auditThanks"),
  imprint: legalEs("imprint"),
  privacy: legalEs("privacy"),
  cookies: legalEs("cookies")
};
