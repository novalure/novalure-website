import { pages, playbooks, type FaqItem, type HomeContent, type PageContent, type PageSection } from "@/content/pages";
import { relaunchCopy } from "@/content/relaunch-copy";
import type { PageKey } from "@/lib/i18n";

const spanishHomepageFaq = relaunchCopy.es.faq.map((item, index) =>
  index === relaunchCopy.es.faq.length - 1
    ? {
        q: "¿En qué mercados e idiomas trabaja NovaLure?",
        a: "Nuestro foco actual es España. NovaLure tiene su sede en Irlanda y trabaja también en Irlanda, el mercado DACH y con públicos internacionales. Desarrollamos materiales, campañas y procesos comerciales en español, inglés y alemán."
      }
    : { ...item }
);

const spanishProcessSteps = relaunchCopy.es.steps.map((step, index) =>
  index === 3
    ? {
        ...step,
        t: "Campaña",
        d: "Campañas diseñadas para el mercado español, con alcance adicional entre compradores internacionales de Irlanda, DACH y Reino Unido cuando el proyecto lo requiere.",
        g: "Captación local e internacional, especialmente relevante para promociones costeras y destinos vacacionales."
      }
    : { ...step }
);

Object.assign(relaunchCopy.es as unknown as Record<string, unknown>, {
  kicker: "Sistemas internacionales de comercialización inmobiliaria para promotores y agencias en España",
  heroSub:
    "NovaLure aplica en España una metodología comercial desarrollada a partir de proyectos en Irlanda, DACH y mercados internacionales: posicionamiento, visualización, dossier comercial, campaña, seguimiento y traspaso comercial al equipo de ventas.",
  trust: "Con raíces en Irlanda · Activos en Irlanda, DACH e internacionalmente · Ahora en España",
  chipKicker: "Referencias · Mandatos en el mercado DACH",
  proofNote: "Resultados de referencia de nuestros mandatos en el mercado DACH — GRASL Immobilien",
  bauKicker: "Para promotores en España",
  bauH: "Su promoción necesita compradores preparados, no solo solicitudes.",
  procH: "Seis pasos. Metodología internacional. Aplicación local en España.",
  steps: spanishProcessSteps,
  procNote:
    "Puede contratar el recorrido completo o módulos concretos. El análisis del proyecto determina qué necesita su promoción en España y dónde aporta valor una captación internacional.",
  caseKicker: "Referencia internacional · Mercado DACH",
  c1t: "Situación inicial del mandato DACH",
  c1: "Contactos sin filtrar, sin priorización y con una previsión comercial limitada.",
  c2t: "Sistema implantado",
  c2: "Recorrido de captación con cualificación, seguimiento y traspaso comercial al CRM.",
  c3t: "Resultado del mandato DACH",
  c3: "15–20 solicitudes cualificadas al mes, más de 110.000 EUR de volumen de comisiones y una cartera comercial más previsible.",
  mkKicker: "Para agencias inmobiliarias en España",
  mkH: "Demanda local e internacional con una misma disciplina comercial.",
  mkBody:
    "Para agencias españolas que comercializan promociones o quieren mejorar la calidad de sus solicitudes. NovaLure conecta posicionamiento, campaña, seguimiento y traspaso comercial para que el equipo reciba conversaciones preparadas, también cuando el comprador procede de Irlanda, DACH o Reino Unido.",
  mat1m: "Referencia de trabajo: promoción residencial en el mercado DACH",
  mat2m: "Referencia de trabajo: visualización y equipamiento",
  mat3m: "Ejemplo para España: dossier comercial y campaña",
  teamBody:
    "Franz Romih dirige cada mandato desde la primera evaluación hasta el traspaso comercial. NovaLure tiene su sede en Irlanda y reúne experiencia de Irlanda, DACH y mercados internacionales para aplicarla ahora a promotores y agencias en España.",
  pbBody:
    "Cómo convertir la presencia de una promoción en solicitudes cualificadas y conversaciones comerciales: proceso, métricas y traspaso. Adaptado al mercado español y a compradores internacionales.",
  finalSub:
    "Una evaluación concreta para promotores y agencias en España, con perspectiva local e internacional y sin una presentación comercial genérica.",
  footTag:
    "Sistemas internacionales de comercialización inmobiliaria aplicados al mercado español. Con raíces en Irlanda y experiencia en Irlanda, DACH y mercados internacionales.",
  faqH: "Lo que promotores y agencias en España preguntan antes de la primera conversación.",
  faq: spanishHomepageFaq
});

const baseFaq = ((pages.es.developers as PageContent).faq ?? []).map((item) => ({ ...item }));

const marketFaq: FaqItem[] = baseFaq.map((item, index) => {
  if (index === 0) {
    return {
      question: "¿Cómo deben interpretarse las referencias que aparecen en la web?",
      answer:
        "Las referencias visibles corresponden a mandatos reales del mercado DACH y muestran la metodología, la calidad del material y la disciplina comercial de NovaLure. Se presentan como experiencia internacional; no como casos realizados en España."
    };
  }

  if (index === 1) {
    return {
      question: "¿Las referencias corresponden a proyectos en España?",
      answer:
        "No. Las referencias publicadas actualmente proceden de nuestros mandatos en el mercado DACH. NovaLure aplica ahora esa experiencia internacional a promociones y agencias en España sin atribuirse resultados locales que todavía no estén documentados."
    };
  }

  if (index === 2) {
    return {
      question: "¿Por qué se muestran mandatos del mercado DACH?",
      answer:
        "Porque permiten valorar trabajo real: posicionamiento, visualización, dossier comercial, captación, seguimiento y resultados comerciales. La procedencia de cada referencia se indica de forma expresa para evitar confundir experiencia internacional con referencias españolas."
    };
  }

  if (item.question === "¿Trabajan de forma individual o con un equipo?") {
    return {
      question: item.question,
      answer:
        "NovaLure mantiene una dirección central para el diagnóstico, la arquitectura del sistema y la coordinación. Según el alcance intervienen especialistas en páginas de captación, CRM, analítica, campañas, rendimiento, visualización y contenidos."
    };
  }

  if (item.question === "¿Por qué NovaLure tiene su base en Irlanda?") {
    return {
      question: item.question,
      answer:
        "NovaLure es una empresa con sede en Irlanda y orientación internacional. La experiencia acumulada en Irlanda, DACH y otros mercados se aplica ahora a proyectos en España, dentro de un marco contractual europeo y con interlocutores claros."
    };
  }

  if (item.question === "¿Es una estructura adecuada para clientes de la Unión Europea?") {
    return {
      question: item.question,
      answer:
        "Sí. NovaLure opera desde Irlanda dentro de la Unión Europea. Antes de cada encargo se definen el alcance, la protección de datos, las herramientas, los responsables y la operativa aplicable al proyecto en España."
    };
  }

  if (item.question === "¿Necesitamos un equipo comercial propio?") {
    return {
      question: item.question,
      answer:
        "No necesariamente. Cuando ya existe un equipo, NovaLure reduce la clasificación manual y prepara mejor las solicitudes cualificadas. Si la estructura todavía no está definida, podemos ayudar a implantar el proceso, el seguimiento y el traspaso comercial."
    };
  }

  if (item.question === "¿Qué necesitamos antes de empezar?") {
    return {
      question: item.question,
      answer:
        "Una promoción o zona de mercado concreta en España, público objetivo, activos disponibles, proceso comercial actual, responsable de decisión, capacidad presupuestaria y una persona de contacto."
    };
  }

  return item;
});

marketFaq.splice(13, 0, {
  question: "¿En qué mercados e idiomas trabaja NovaLure?",
  answer:
    "El foco actual es España. NovaLure tiene su sede en Irlanda y trabaja también en Irlanda, DACH y con públicos compradores internacionales. Los materiales, campañas y procesos pueden desarrollarse en español, inglés y alemán."
});

const home = pages.es.home as HomeContent;
pages.es.home = {
  ...home,
  eyebrow: "Sistemas internacionales de comercialización inmobiliaria para España",
  title: relaunchCopy.es.heroH1,
  seoTitle: "NovaLure España | Comercialización inmobiliaria internacional",
  description: relaunchCopy.es.heroSub,
  metaDescription:
    "Sistemas de comercialización para promotores y agencias en España, con experiencia en Irlanda, DACH y mercados internacionales.",
  heroBullets: [
    "Solicitudes cualificadas para promociones y agencias en España",
    "Contexto comercial antes de la primera llamada",
    "Captación local con alcance internacional cuando el proyecto lo exige",
    "Traspaso comercial con prioridad y siguiente paso"
  ],
  audience: {
    title: "Para promotores y agencias en España que quieren convertir demanda en conversaciones comerciales.",
    cards: [
      {
        title: "Para promotores y equipos comerciales en España",
        body:
          "Estructuramos el recorrido desde la presentación de la promoción hasta el traspaso comercial, con captación local y acceso a compradores internacionales cuando resulta relevante.",
        hrefKey: "developers",
        points: [
          "Relato, visualización y dossier comercial",
          "Cualificación por presupuesto, plazo y uso",
          "Traspaso comercial con siguiente paso"
        ]
      },
      {
        title: "Para agencias inmobiliarias en España",
        body:
          "Ordenamos solicitudes de vendedores y compradores para que el equipo distinga antes la curiosidad de una oportunidad real y pueda realizar un seguimiento coherente.",
        hrefKey: "agents",
        points: [
          "Posicionamiento y demanda local",
          "Compradores nacionales e internacionales",
          "Seguimiento y contexto más allá de los portales"
        ]
      }
    ]
  },
  problem: {
    ...home.problem,
    body:
      "En España, las solicitudes pueden llegar desde portales, campañas, recomendaciones y compradores internacionales. Sin una clasificación común, el equipo descubre demasiado tarde cuáles merecen atención. NovaLure convierte esa demanda en conversaciones útiles."
  },
  system: {
    title: "Metodología internacional, adaptada al recorrido comercial español.",
    body:
      "Integramos landing page, dossier comercial, preguntas de intención, seguimiento, CRM, informes y traspaso comercial. La estructura procede de nuestra experiencia en Irlanda, DACH y mercados internacionales y se adapta a cada promoción o agencia en España.",
    layers: [
      {
        label: "01",
        title: "Del mercado a la solicitud",
        body: "Se definen el público español, la promoción y los posibles segmentos internacionales antes de aumentar la inversión."
      },
      {
        label: "02",
        title: "Preguntas de precualificación",
        body: "Las preguntas identifican intención, presupuesto, plazo, uso e idioma antes de que el equipo invierta tiempo."
      },
      {
        label: "03",
        title: "Traspaso comercial preparado",
        body: "Origen, motivación, plazo, presupuesto, idioma y siguiente paso llegan juntos al equipo comercial."
      },
      {
        label: "04",
        title: "Implantación y mejora continua",
        body: "La calidad mejora con datos, feedback comercial y aprendizaje del mercado español, no solo con clics."
      }
    ]
  },
  playbookSection: {
    title: "El Playbook ayuda a detectar dónde pierde contexto el recorrido comercial.",
    body:
      "La edición en español muestra las brechas habituales entre presentación, solicitud, seguimiento y traspaso comercial para promotores y agencias en España."
  },
  process: {
    ...home.process,
    title: "Diagnóstico en España. Implantación con metodología internacional. Mejora continua.",
    body:
      "El alcance depende de la promoción, la zona, el público, la estructura comercial, el peso de compradores internacionales y la viabilidad económica."
  },
  team: {
    ...home.team,
    title: "Sede en Irlanda. Experiencia internacional. Aplicación directa en España.",
    body:
      "NovaLure combina conocimiento comercial inmobiliario, sistemas de captación y coordinación internacional. La metodología desarrollada en Irlanda, DACH y otros mercados se adapta a promotores y agencias que operan en España.",
    workstyle:
      "Franz dirige el diagnóstico, la arquitectura y la lógica comercial. Según el alcance participan especialistas en páginas de captación, analítica, CRM, campañas, visualización y contenidos. La responsabilidad por la calidad y el traspaso comercial permanece centralizada.",
    ireland:
      "NovaLure CLG tiene su sede en Irlanda y trabaja en español, inglés y alemán. Su foco actual es España, manteniendo actividad y experiencia en Irlanda, DACH y mercados internacionales."
  },
  faq: spanishHomepageFaq.map((item) => ({ question: item.q, answer: item.a })),
  finalCtaTitle: "Analicemos cómo aplicar una metodología comercial internacional a su proyecto en España."
};

type NonHomePageKey = Exclude<PageKey, "home">;

function updatePage(key: NonHomePageKey, patch: Partial<PageContent>) {
  pages.es[key] = {
    ...(pages.es[key] as PageContent),
    ...patch
  };
}

updatePage("developers", {
  eyebrow: "Para promotores y equipos comerciales en España",
  title: "Comercialización de promociones en España que no termina en la solicitud.",
  seoTitle: "Comercialización de promociones en España | NovaLure",
  description:
    "NovaLure aplica una metodología internacional al mercado español: relato, visualización, dossier comercial, campaña, seguimiento y traspaso comercial para generar conversaciones con compradores preparados.",
  metaDescription:
    "Comercialización para promotores en España con metodología internacional, solicitudes cualificadas y alcance a compradores de Irlanda, DACH y Reino Unido.",
  heroBullets: [
    "Relato, visualización y dossier comercial con una misma lógica",
    "Campañas para España y compradores internacionales cuando procede",
    "Solicitudes cualificadas antes del traspaso comercial"
  ],
  sections: [
    {
      title: "Metodología internacional, adaptada a cada promoción en España",
      body:
        "Aplicamos experiencia de Irlanda, DACH y mercados internacionales a la realidad comercial española. La estrategia parte de la ubicación, la tipología, el uso, el calendario, el presupuesto y el perfil real de comprador."
    },
    {
      title: "Del relato al dossier comercial y la solicitud cualificada",
      body:
        "La visualización y el dossier comercial deben atraer, informar y preparar la cualificación. El formulario y el seguimiento aclaran interés, plazo, presupuesto, financiación, uso e idioma antes de la primera conversación.",
      items: [
        "La presentación establece la expectativa correcta.",
        "El dossier comercial informa y filtra al mismo tiempo.",
        "La cualificación separa curiosidad de intención real.",
        "El equipo recibe contexto, prioridad y siguiente paso."
      ]
    },
    {
      title: "Campañas para España y compradores internacionales",
      body:
        "La captación se diseña para el mercado español y puede ampliarse a compradores de Irlanda, DACH y Reino Unido. Este alcance resulta especialmente relevante para promociones costeras, segundas residencias, inversión y destinos vacacionales."
    },
    {
      title: "Cuándo tiene sentido un análisis",
      body:
        "Es adecuado para obra nueva, promociones residenciales o de inversión y equipos que necesitan mejorar la calidad del recorrido comercial.",
      items: [
        "Existe una promoción concreta en España.",
        "Hay presupuesto y capacidad de decisión.",
        "El equipo está dispuesto a realizar seguimiento.",
        "No se exige una garantía artificial de volumen."
      ]
    }
  ],
  faq: marketFaq
});

updatePage("agents", {
  eyebrow: "Para agencias inmobiliarias en España",
  title: "Captación y seguimiento para agencias inmobiliarias en España.",
  seoTitle: "Captación inmobiliaria para agencias en España | NovaLure",
  description:
    "NovaLure conecta posicionamiento, campañas, formularios, seguimiento y traspaso comercial para que las agencias españolas distingan antes las oportunidades reales.",
  metaDescription:
    "Sistemas de captación para agencias inmobiliarias en España, con solicitudes cualificadas, seguimiento y experiencia internacional de Irlanda y DACH.",
  heroBullets: [
    "Demanda local con una lógica comercial clara",
    "Vendedores y compradores cualificados por separado",
    "Seguimiento y traspaso comercial con contexto"
  ],
  sections: [
    {
      title: "Captación local con disciplina comercial",
      body:
        "Portales, recomendaciones, campañas y posicionamiento local pueden generar demanda. El valor aparece cuando cada solicitud tiene segmento, intención, plazo, presupuesto y una siguiente acción."
    },
    {
      title: "Vendedores y compradores necesitan recorridos distintos",
      body:
        "Los vendedores requieren contexto sobre inmueble, ubicación, motivación y plazo. Los compradores necesitan zona, tipología, presupuesto, financiación, uso, idioma y requisitos esenciales."
    },
    {
      title: "Demanda internacional cuando el mercado lo permite",
      body:
        "En zonas costeras, destinos vacacionales y mercados de segunda residencia, el recorrido puede incluir compradores de Irlanda, DACH y Reino Unido sin perder la prioridad del mercado español."
    },
    {
      title: "Qué debe recibir el equipo",
      body:
        "Una solicitud cualificada con origen, segmento, motivación, plazo, encaje presupuestario, idioma, nota de seguimiento y siguiente paso para actuar sin reconstruir el contexto."
    }
  ],
  faq: marketFaq
});

updatePage("playbooks", {
  eyebrow: "Playbooks para el mercado español",
  title: "Detecte dónde pierde contexto su recorrido comercial en España.",
  seoTitle: "Playbooks para promotores y agencias en España | NovaLure",
  description:
    "Guías en español para promotores y agencias inmobiliarias: solicitudes cualificadas, seguimiento y traspaso comercial con una metodología internacional.",
  metaDescription:
    "Playbooks en español para promotores y agencias: cualificación, seguimiento y traspaso comercial aplicados al mercado inmobiliario español.",
  heroBullets: [
    "Ediciones para promotores y agencias en España",
    "Diagnóstico de solicitudes y traspaso comercial",
    "Perspectiva local con experiencia internacional"
  ],
  faq: marketFaq
});

updatePage("contact", {
  eyebrow: "Análisis comercial para España",
  title: "Analicemos su recorrido comercial en España.",
  seoTitle: "Análisis comercial de proyectos en España | NovaLure",
  description:
    "En 30 minutos revisamos presentación, dossier comercial, campaña, cualificación, seguimiento y traspaso comercial para determinar cómo aplicar una metodología internacional a su proyecto o agencia en España.",
  metaDescription:
    "Análisis comercial para promotores y agencias en España: captación, solicitudes cualificadas, seguimiento, CRM y traspaso comercial.",
  heroBullets: [
    "Situación del proyecto o agencia en España",
    "Demanda local e internacional",
    "Puntos débiles del recorrido",
    "Siguiente paso concreto"
  ],
  faq: marketFaq
});

updatePage("handover", {
  eyebrow: "Ejemplo de traspaso comercial",
  title: "Qué recibe el equipo cuando una solicitud cualificada está preparada.",
  seoTitle: "Traspaso comercial inmobiliario en España | NovaLure",
  description:
    "Un ejemplo de cómo NovaLure estructura origen, interés, plazo, presupuesto, idioma, responsable y siguiente paso para equipos comerciales en España.",
  metaDescription:
    "Ejemplo de traspaso comercial para promotores y agencias en España, con contexto de la solicitud y siguiente paso visible.",
  heroBullets: ["Origen", "Interés", "Plazo", "Presupuesto", "Idioma", "Siguiente paso"],
  faq: marketFaq.slice(0, 9)
});

updatePage("playbookThanks", {
  description:
    "Su Playbook en español está de camino. Incluye una guía de diagnóstico para promotores o agencias que operan en España.",
  metaDescription: "Confirmación de solicitud del Playbook de NovaLure para el mercado español."
});

updatePage("auditThanks", {
  description:
    "Hemos recibido su solicitud. Revisaremos el proyecto o la agencia en España, el recorrido actual y el posible alcance internacional.",
  metaDescription: "Confirmación de solicitud del análisis comercial de NovaLure para España."
});

function polishSpanishLegalString(value: string) {
  return value
    .replace(/Company registration number:/gi, "Número de registro mercantil:")
    .replace(/Registration number:/gi, "Número de registro:")
    .replace(/Irish VAT number:/gi, "Número de IVA irlandés:")
    .replace(/Registered office:/gi, "Domicilio social:")
    .replace(/Place of registration:/gi, "Lugar de registro:")
    .replace(/Legal form:/gi, "Forma jurídica:")
    .replace(/Register:/gi, "Registro:")
    .replace(/Website:/gi, "Sitio web:")
    .replace(/Email:/gi, "Correo electrónico:")
    .replace(/Phone:/gi, "Teléfono:");
}

function localizeLegalSections(sections: PageSection[] = []) {
  return sections.map((section) => ({
    ...section,
    title: polishSpanishLegalString(section.title),
    body: polishSpanishLegalString(section.body),
    items: section.items
      ?.filter((item) => !/\/(?:de|en)(?:\/|$)/.test(item))
      .map(polishSpanishLegalString)
  }));
}

for (const key of ["imprint", "privacy", "cookies"] as const) {
  const current = pages.es[key] as PageContent;
  updatePage(key, {
    ...current,
    heroBullets: [
      "NovaLure CLG",
      "20 Harcourt Street, Dublin 2, D02 H364, Ireland",
      "Número de registro: 796735",
      "Número de IVA irlandés: 451718HH",
      "hello@novalure.eu"
    ],
    sections: localizeLegalSections(current.sections),
    metaDescription: current.description
  });
}

playbooks.es = [
  {
    ...playbooks.es[0],
    subtitle:
      "Un mapa práctico para promotores en España que quieren convertir interés local e internacional en conversaciones cualificadas con compradores.",
    learns: [
      "Cómo estructurar el recorrido comercial para una promoción en España",
      "Dónde filtrar la intención antes del traspaso comercial",
      "Qué contexto necesita el equipo cuando el comprador es nacional o internacional"
    ]
  },
  {
    ...playbooks.es[1],
    subtitle:
      "Una guía para agencias inmobiliarias en España que quieren generar demanda propia y gestionar mejor solicitudes de vendedores y compradores.",
    learns: [
      "Cómo reducir la dependencia de portales con demanda propia",
      "Qué filtros cualifican vendedores y compradores",
      "Cómo estructurar el seguimiento y el traspaso comercial"
    ]
  }
];

for (const key of Object.keys(pages.es) as PageKey[]) {
  const page = pages.es[key] as PageContent;
  if (!page.metaDescription) {
    page.metaDescription = page.description;
  }
}
