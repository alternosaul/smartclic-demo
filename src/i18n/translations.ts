export type Locale = 'es' | 'en'

export const translations = {
  es: {
    nav: {
      solutions: 'Soluciones',
      presence: 'Presencia',
      works: 'Trabajos',
      blog: 'Blog',
      contact: 'Contacto',
      cta: 'Cotiza tu sitio',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      langSwitch: 'Cambiar idioma a inglés',
      themePalette: 'Paleta de color del sitio',
      themes: {
        cyan: 'Tema cian',
        ocean: 'Tema océano',
        violet: 'Tema violeta',
        rose: 'Tema rosa',
        emerald: 'Tema esmeralda',
        amber: 'Tema ámbar',
      },
    },
    hero: {
      titlePrefix: 'Hacemos tu',
      rotate: [
        'tienda en línea',
        'sitio web',
        'branding',
        'marketing digital',
        'estrategia digital',
        'presencia digital',
        'campañas',
        'marca',
      ],
      subtitle:
        'Agencia digital en México: sitios web, branding, marketing y estrategias de crecimiento para que tu negocio destaque —',
      ctaPrimary: 'Cotiza tu proyecto',
      ctaSecondary: 'Ver portafolio',
    },
    brands: {
      title: 'Marcas que confían en nosotros',
    },
    sectionTransitions: {
      solutions: 'Soluciones',
      tech: 'Innovación',
      presence: 'Presencia global',
      portfolio: 'Portafolio',
      blog: 'Blog',
      contact: 'Hablemos',
    },
    solutions: {
      badge: 'Qué hacemos',
      title: 'Una agencia, todo lo que tu marca necesita',
      description:
        'En smartclic.mx unimos diseño, tecnología y marketing en un solo equipo para que no tengas que coordinar a media docena de proveedores.',
      items: [
        {
          title: 'Sitios web',
          titleLine2: 'ecommerce',
          description:
            'Páginas rápidas, modernas y pensadas para convertir visitantes en clientes.',
        },
        {
          title: 'Branding',
          titleLine2: 'e identidad',
          description:
            'Identidad visual, voz de marca y piezas que comunican quién eres y por qué importas.',
        },
        {
          title: 'Marketing digital',
          description:
            'Campañas, redes, contenido y publicidad para llegar a la audiencia correcta.',
        },
        {
          title: 'Estrategias de crecimiento',
          description:
            'Planes claros, métricas y acciones para escalar tu negocio en el entorno digital.',
        },
      ],
      bento: {
        web: {
          title: 'Sitios web ecommerce',
          description:
            'Páginas rápidas, modernas y pensadas para convertir visitantes en clientes.',
        },
        branding: {
          title: 'Branding e identidad',
          description:
            'Identidad visual, voz de marca y piezas que comunican quién eres y por qué importas.',
        },
        marketing: {
          title: 'Marketing digital',
          description:
            'Campañas, redes, contenido y publicidad para llegar a la audiencia correcta.',
          reachLabel: 'Alcance',
          growthBadge: '+24%',
        },
        growth: {
          title: 'Estrategias de crecimiento',
          description:
            'Planes claros, métricas y acciones para escalar tu negocio en el entorno digital.',
          metricsLabel: 'Proyección trimestral',
          trendBadge: '+38%',
        },
        team: {
          title: 'Un solo equipo para tu marca',
          description:
            'Diseño, tecnología y marketing coordinados — sin media docena de proveedores.',
          flowLabel: 'Todo en un mismo flujo',
          disciplines: [
            {
              label: 'Diseño y UX',
              detail: 'Marca, interfaces y experiencia de usuario',
            },
            {
              label: 'Desarrollo web',
              detail: 'Sitios, tiendas online y producto digital',
            },
            {
              label: 'Marketing digital',
              detail: 'Contenido, campañas y estrategia de crecimiento',
            },
          ],
        },
      },
    },
    tech: {
      badge: '3D interactivo',
      title: 'Tecnología de vanguardia',
      description:
        'Experiencias digitales de alto impacto — la misma innovación que aplicamos en sitios web, branding y campañas de smartclic.mx.',
      hint: 'Desplaza la página con normalidad. Arrastra el modelo para rotarlo.',
      capture: 'Capturar',
    },
    presence: {
      badge: 'Presencia regional',
      scrollTitle: 'Presencia global',
      scrollHint: 'Desplaza para recorrer cada mercado',
      title: 'Presencia en todo el continente',
      description:
        'Desde México coordinamos proyectos digitales para marcas en Norteamérica y Latinoamérica. Cerca de ti, con el mismo estándar de calidad.',
      mapHint: 'Toca un país para ver su mercado',
      partnersLabel: 'Empresas que confían en nosotros',
      statsTitle: 'Números que nos respaldan',
      stats: [
        {
          value: 4,
          suffix: '',
          prefix: '',
          label: 'Países con presencia activa',
        },
        {
          value: 30,
          suffix: '+',
          prefix: '',
          label: 'Clientes satisfechos',
        },
        {
          value: 10,
          suffix: '+',
          prefix: '',
          label: 'Años de experiencia digital',
        },
      ],
      countries: [
        {
          id: 'mx',
          name: 'México',
          city: 'CDMX',
          role: 'Sede principal',
        },
        {
          id: 'us',
          name: 'Estados Unidos',
          city: 'Remoto · USA',
          role: 'Clientes y socios',
        },
        {
          id: 'pe',
          name: 'Perú',
          city: 'Lima',
          role: 'Proyectos regionales',
        },
        {
          id: 'ar',
          name: 'Argentina',
          city: 'Buenos Aires',
          role: 'Expansión LATAM',
        },
      ],
    },
    portfolio: {
      badge: 'Portafolio',
      title: 'Proyectos que hablan por nosotros',
      cta: 'Ver todos los casos',
      prevProject: 'Proyecto anterior',
      nextProject: 'Siguiente proyecto',
      projects: [
        { title: 'E-commerce Premium', category: 'Tienda en línea' },
        { title: 'SaaS Dashboard', category: 'Aplicación web' },
        { title: 'Landing Corporativa', category: 'Marca institucional' },
        { title: 'Portal Inmobiliario', category: 'Catálogo & filtros' },
        { title: 'App de Reservas', category: 'Experiencia móvil' },
        { title: 'Rediseño de Marca', category: 'Identidad visual' },
      ],
    },
    blog: {
      badge: 'Blog',
      title: 'Ideas para hacer crecer tu negocio',
      description:
        'Artículos sobre marketing, presencia digital, IA y estrategias que puedes aplicar hoy.',
      cta: 'Ver todo el blog',
      scrollHint: 'Desplaza para ver cada artículo',
      readMore: 'Leer artículo',
      posts: [
        {
          title:
            'Inteligencia Artificial y Marketing Digital: la dupla que revoluciona los negocios',
          excerpt:
            'La IA ya está en el día a día del marketing. Descubre cómo aplicarla en campañas, contenido y decisiones de negocio.',
          date: '22 agosto 2025',
        },
        {
          title: 'Cómo preparar tu página web para el 2025 y maximizar resultados',
          excerpt:
            'Checklist práctico para lanzar o renovar tu sitio con SEO, velocidad y experiencia de usuario listos desde el día uno.',
          date: '19 diciembre 2024',
        },
        {
          title: 'Las 7 consecuencias de no tener una página web para tu negocio',
          excerpt:
            'En la era digital, no estar en la web tiene un costo real. Conoce los riesgos y cómo evitarlos.',
          date: '19 diciembre 2024',
        },
        {
          title: 'Tendencias de branding digital para 2025',
          excerpt:
            'Identidad visual, voz de marca y consistencia omnicanal: lo que marcas en México deben priorizar este año.',
          date: '10 enero 2025',
        },
        {
          title: 'Cómo medir el ROI de tu inversión en marketing digital',
          excerpt:
            'Métricas, embudos y herramientas para saber si tu presupuesto en ads, SEO y contenido está rindiendo.',
          date: '5 noviembre 2024',
        },
      ],
    },
    contact: {
      badge: 'Contacto',
      title: '¿Listo para impulsar tu marca en digital?',
      description:
        'Cuéntanos sobre tu proyecto. Te respondemos en menos de 24 horas con una propuesta clara y sin compromiso.',
      location: 'Ciudad de México, MX',
      success:
        '¡Gracias! Se abrió tu cliente de correo. Si no aparece, escríbenos a',
      form: {
        name: 'Nombre *',
        email: 'Email *',
        phone: 'Teléfono',
        company: 'Empresa',
        message: 'Mensaje *',
        namePlaceholder: 'Tu nombre',
        emailPlaceholder: 'tu@email.com',
        phonePlaceholder: '+52 55 0000 0000',
        companyPlaceholder: 'Nombre de tu negocio',
        messagePlaceholder:
          'Cuéntanos qué necesitas: sitio web, branding, marketing, plazos...',
        sending: 'Enviando...',
        submit: 'Enviar mensaje',
        mailtoNote: 'Al enviar, se abrirá tu aplicación de correo con el mensaje preparado.',
        mailSubject: 'Nuevo contacto',
        mailName: 'Nombre',
        mailPhone: 'Teléfono',
        mailCompany: 'Empresa',
        mailMessage: 'Mensaje',
      },
    },
    footer: {
      tagline: 'Sitios web · Branding · Marketing · Estrategias de crecimiento',
      privacy: 'Privacidad',
      blog: 'Blog',
      currentSite: 'Sitio actual',
      rights: 'Todos los derechos reservados.',
    },
    meta: {
      title: 'Smartclic | Agencia Digital · Web, Branding y Marketing',
      description:
        'Smartclic — Agencia digital en México. Sitios web, branding, marketing y estrategias de crecimiento para tu negocio.',
    },
  },
  en: {
    nav: {
      solutions: 'Solutions',
      presence: 'Presence',
      works: 'Work',
      blog: 'Blog',
      contact: 'Contact',
      cta: 'Get a quote',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      langSwitch: 'Switch language to Spanish',
      themePalette: 'Site color palette',
      themes: {
        cyan: 'Cyan theme',
        ocean: 'Ocean theme',
        violet: 'Violet theme',
        rose: 'Rose theme',
        emerald: 'Emerald theme',
        amber: 'Amber theme',
      },
    },
    hero: {
      titlePrefix: 'We build your',
      rotate: [
        'online store',
        'website',
        'branding',
        'digital marketing',
        'growth strategy',
        'digital presence',
        'campaigns',
        'brand',
      ],
      subtitle:
        'Digital agency in Mexico: websites, branding, marketing and growth strategies to make your business stand out —',
      ctaPrimary: 'Start your project',
      ctaSecondary: 'View portfolio',
    },
    brands: {
      title: 'Brands that trust us',
    },
    sectionTransitions: {
      solutions: 'Solutions',
      tech: 'Innovation',
      presence: 'Global presence',
      portfolio: 'Portfolio',
      blog: 'Blog',
      contact: "Let's talk",
    },
    solutions: {
      badge: 'What we do',
      title: 'One agency for everything your brand needs',
      description:
        'At smartclic.mx we combine design, technology and marketing in one team so you do not have to juggle a dozen vendors.',
      items: [
        {
          title: 'Websites',
          titleLine2: 'ecommerce',
          description:
            'Fast, modern pages built to turn visitors into customers.',
        },
        {
          title: 'Branding',
          titleLine2: 'and identity',
          description:
            'Visual identity, brand voice and assets that show who you are and why you matter.',
        },
        {
          title: 'Digital marketing',
          description:
            'Campaigns, social, content and ads to reach the right audience.',
        },
        {
          title: 'Growth strategies',
          description:
            'Clear plans, metrics and actions to scale your business digitally.',
        },
      ],
      bento: {
        web: {
          title: 'Websites & ecommerce',
          description:
            'Fast, modern pages built to turn visitors into customers.',
        },
        branding: {
          title: 'Branding & identity',
          description:
            'Visual identity, brand voice and assets that show who you are and why you matter.',
        },
        marketing: {
          title: 'Digital marketing',
          description:
            'Campaigns, social, content and ads to reach the right audience.',
          reachLabel: 'Reach',
          growthBadge: '+24%',
        },
        growth: {
          title: 'Growth strategies',
          description:
            'Clear plans, metrics and actions to scale your business digitally.',
          metricsLabel: 'Quarterly forecast',
          trendBadge: '+38%',
        },
        team: {
          title: 'One team for your brand',
          description:
            'Design, technology and marketing in sync — no juggling a dozen vendors.',
          flowLabel: 'One integrated workflow',
          disciplines: [
            {
              label: 'Design & UX',
              detail: 'Brand, interfaces and user experience',
            },
            {
              label: 'Web development',
              detail: 'Sites, online stores and digital product',
            },
            {
              label: 'Digital marketing',
              detail: 'Content, campaigns and growth strategy',
            },
          ],
        },
      },
    },
    tech: {
      badge: 'Interactive 3D',
      title: 'Cutting-edge technology',
      description:
        'High-impact digital experiences — the same innovation we bring to websites, branding and campaigns at smartclic.mx.',
      hint: 'Scroll the page as usual. Drag the model to rotate it.',
      capture: 'Capture',
    },
    presence: {
      badge: 'Regional presence',
      scrollTitle: 'Global presence',
      scrollHint: 'Scroll to explore each market',
      title: 'Presence across the Americas',
      description:
        'From Mexico we run digital projects for brands in North America and Latin America. Close to you, with the same quality standard.',
      mapHint: 'Tap a country to explore its market',
      partnersLabel: 'Companies that trust us',
      statsTitle: 'Numbers that back us up',
      stats: [
        {
          value: 4,
          suffix: '',
          prefix: '',
          label: 'Countries with active presence',
        },
        {
          value: 30,
          suffix: '+',
          prefix: '',
          label: 'Satisfied clients',
        },
        {
          value: 10,
          suffix: '+',
          prefix: '',
          label: 'Years of digital experience',
        },
      ],
      countries: [
        {
          id: 'mx',
          name: 'Mexico',
          city: 'CDMX',
          role: 'Headquarters',
        },
        {
          id: 'us',
          name: 'United States',
          city: 'Remote · USA',
          role: 'Clients & partners',
        },
        {
          id: 'pe',
          name: 'Peru',
          city: 'Lima',
          role: 'Regional projects',
        },
        {
          id: 'ar',
          name: 'Argentina',
          city: 'Buenos Aires',
          role: 'LATAM expansion',
        },
      ],
    },
    portfolio: {
      badge: 'Portfolio',
      title: 'Work that speaks for us',
      cta: 'View all case studies',
      prevProject: 'Previous project',
      nextProject: 'Next project',
      projects: [
        { title: 'Premium E-commerce', category: 'Online store' },
        { title: 'SaaS Dashboard', category: 'Web application' },
        { title: 'Corporate Landing', category: 'Institutional brand' },
        { title: 'Real Estate Portal', category: 'Catalog & filters' },
        { title: 'Booking App', category: 'Mobile experience' },
        { title: 'Brand Redesign', category: 'Visual identity' },
      ],
    },
    blog: {
      badge: 'Blog',
      title: 'Ideas to grow your business',
      description:
        'Articles on marketing, digital presence, AI and strategies you can apply today.',
      cta: 'View full blog',
      scrollHint: 'Scroll to view each article',
      readMore: 'Read article',
      posts: [
        {
          title: 'AI and Digital Marketing: the duo transforming business',
          excerpt:
            'AI is already part of everyday marketing. Learn how to use it in campaigns, content and business decisions.',
          date: 'August 22, 2025',
        },
        {
          title: 'How to prepare your website for 2025 and maximize results',
          excerpt:
            'A practical checklist to launch or refresh your site with SEO, speed and UX ready from day one.',
          date: 'December 19, 2024',
        },
        {
          title: '7 consequences of not having a website for your business',
          excerpt:
            'In the digital age, staying offline has a real cost. Learn the risks and how to avoid them.',
          date: 'December 19, 2024',
        },
        {
          title: 'Digital branding trends for 2025',
          excerpt:
            'Visual identity, brand voice and omnichannel consistency: what brands should prioritize this year.',
          date: 'January 10, 2025',
        },
        {
          title: 'How to measure ROI on your digital marketing spend',
          excerpt:
            'Metrics, funnels and tools to know if your budget for ads, SEO and content is paying off.',
          date: 'November 5, 2024',
        },
      ],
    },
    contact: {
      badge: 'Contact',
      title: 'Ready to grow your brand online?',
      description:
        'Tell us about your project. We reply within 24 hours with a clear, no-obligation proposal.',
      location: 'Mexico City, MX',
      success:
        'Thank you! Your email client should open. If it does not, write us at',
      form: {
        name: 'Name *',
        email: 'Email *',
        phone: 'Phone',
        company: 'Company',
        message: 'Message *',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'you@email.com',
        phonePlaceholder: '+52 55 0000 0000',
        companyPlaceholder: 'Your business name',
        messagePlaceholder:
          'Tell us what you need: website, branding, marketing, timeline...',
        sending: 'Sending...',
        submit: 'Send message',
        mailtoNote: 'Submitting will open your email app with the message ready.',
        mailSubject: 'New contact',
        mailName: 'Name',
        mailPhone: 'Phone',
        mailCompany: 'Company',
        mailMessage: 'Message',
      },
    },
    footer: {
      tagline: 'Websites · Branding · Marketing · Growth strategies',
      privacy: 'Privacy',
      blog: 'Blog',
      currentSite: 'Current site',
      rights: 'All rights reserved.',
    },
    meta: {
      title: 'Smartclic | Digital Agency · Web, Branding & Marketing',
      description:
        'Smartclic — Digital agency in Mexico. Websites, branding, marketing and growth strategies for your business.',
    },
  },
} as const

export type TranslationKeys = (typeof translations)[Locale]
