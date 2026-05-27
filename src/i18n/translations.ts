export type Locale = 'es' | 'en'

export const translations = {
  es: {
    nav: {
      solutions: 'Soluciones',
      process: 'Proceso',
      works: 'Trabajos',
      blog: 'Blog',
      contact: 'Contacto',
      cta: 'Cotiza tu sitio',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      langSwitch: 'Cambiar idioma a inglés',
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
    },
    tech: {
      badge: '3D interactivo',
      title: 'Tecnología de vanguardia',
      description:
        'Experiencias digitales de alto impacto — la misma innovación que aplicamos en sitios web, branding y campañas de smartclic.mx.',
      hint: 'Desplaza la página con normalidad. Arrastra el modelo para rotarlo.',
      capture: 'Capturar',
    },
    process: {
      badge: 'Proceso',
      title: 'De la idea a resultados medibles',
      description:
        'Un flujo claro, transparente y sin sorpresas. Tú enfócate en tu negocio; nosotros en la estrategia y la ejecución digital.',
      steps: [
        {
          title: 'Descubrimiento',
          text: 'Entendemos tu marca, audiencia y objetivos de negocio.',
        },
        {
          title: 'Diseño & prototipo',
          text: 'Wireframes y UI de alto impacto antes de lanzar.',
        },
        {
          title: 'Desarrollo',
          text: 'Sitios web, piezas de marca y campañas listas para lanzar y medir.',
        },
        {
          title: 'Lanzamiento',
          text: 'Deploy, SEO, analytics y soporte post-lanzamiento.',
        },
      ],
    },
    portfolio: {
      badge: 'Portafolio',
      title: 'Proyectos que hablan por nosotros',
      cta: 'Ver todos los casos',
      projects: [
        { title: 'E-commerce Premium', category: 'Tienda en línea' },
        { title: 'SaaS Dashboard', category: 'Aplicación web' },
        { title: 'Landing Corporativa', category: 'Marca institucional' },
        { title: 'Portal Inmobiliario', category: 'Catálogo & filtros' },
      ],
    },
    blog: {
      badge: 'Blog',
      title: 'Ideas para hacer crecer tu negocio',
      description:
        'Artículos sobre marketing, presencia digital, IA y estrategias que puedes aplicar hoy.',
      cta: 'Ver todo el blog',
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
      process: 'Process',
      works: 'Work',
      blog: 'Blog',
      contact: 'Contact',
      cta: 'Get a quote',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      langSwitch: 'Switch language to Spanish',
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
    },
    tech: {
      badge: 'Interactive 3D',
      title: 'Cutting-edge technology',
      description:
        'High-impact digital experiences — the same innovation we bring to websites, branding and campaigns at smartclic.mx.',
      hint: 'Scroll the page as usual. Drag the model to rotate it.',
      capture: 'Capture',
    },
    process: {
      badge: 'Process',
      title: 'From idea to measurable results',
      description:
        'A clear, transparent workflow. You focus on your business; we handle digital strategy and execution.',
      steps: [
        {
          title: 'Discovery',
          text: 'We learn your brand, audience and business goals.',
        },
        {
          title: 'Design & prototype',
          text: 'High-impact wireframes and UI before launch.',
        },
        {
          title: 'Development',
          text: 'Websites, brand assets and campaigns ready to launch and measure.',
        },
        {
          title: 'Launch',
          text: 'Deploy, SEO, analytics and post-launch support.',
        },
      ],
    },
    portfolio: {
      badge: 'Portfolio',
      title: 'Work that speaks for us',
      cta: 'View all case studies',
      projects: [
        { title: 'Premium E-commerce', category: 'Online store' },
        { title: 'SaaS Dashboard', category: 'Web application' },
        { title: 'Corporate Landing', category: 'Institutional brand' },
        { title: 'Real Estate Portal', category: 'Catalog & filters' },
      ],
    },
    blog: {
      badge: 'Blog',
      title: 'Ideas to grow your business',
      description:
        'Articles on marketing, digital presence, AI and strategies you can apply today.',
      cta: 'View full blog',
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
