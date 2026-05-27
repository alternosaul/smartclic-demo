# Smartclic.mx — Sitio Web Moderno

Landing page moderna para **smartclic.mx**, agencia de desarrollo web en México. Stack: **React + Vite + Tailwind CSS v4 + shadcn/ui**.

## Stack

- **React 19** + TypeScript + Vite
- **Tailwind CSS v4** con tema personalizado
- **shadcn/ui** (Button, Badge, Card, Navigation Menu)
- **Motion** + componentes estilo React Bits (parallax, texto rotativo)
- **React Three Fiber** + Drei — visor 3D en la sección de tecnología

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Build de producción

```bash
npm run build
npm run preview
```

El sitio estático queda en la carpeta `dist/`.

---

## Deploy en Vercel

Repositorio: [github.com/alternosaul/smartclic-demo](https://github.com/alternosaul/smartclic-demo)

### Opción A — Importar desde GitHub (recomendado)

1. Entra en [vercel.com](https://vercel.com) e inicia sesión.
2. **Add New… → Project**.
3. Importa el repo `alternosaul/smartclic-demo`.
4. Vercel detecta **Vite** automáticamente. Confirma estos valores:

   | Campo | Valor |
   |--------|--------|
   | **Framework Preset** | Vite |
   | **Root Directory** | `./` (raíz del repo) |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

5. **Deploy**. En unos minutos tendrás una URL `*.vercel.app`.

Cada `git push` a `main` vuelve a desplegar si activas **Production Branch = main** (viene por defecto).

### Opción B — CLI de Vercel

```bash
npm i -g vercel
vercel login
vercel
```

Sigue el asistente (vincula el proyecto a tu cuenta/equipo). Para producción:

```bash
vercel --prod
```

### Configuración incluida en el repo

El archivo [`vercel.json`](./vercel.json) define:

- Comando de build y carpeta `dist`
- Framework Vite
- Rewrite SPA hacia `index.html` (útil si más adelante agregas rutas de cliente)

No hace falta configurar variables de entorno para este proyecto.

### Dominio propio (smartclic.mx)

1. En el proyecto de Vercel: **Settings → Domains**.
2. Añade `smartclic.mx` y `www.smartclic.mx`.
3. En tu DNS (donde gestiones el dominio), crea los registros que Vercel indique, por ejemplo:
   - **A** → `76.76.21.21` (o el valor actual que muestre Vercel)
   - **CNAME** `www` → `cname.vercel-dns.com`
4. Espera la verificación SSL (automática con Let’s Encrypt).

### Comprobar el deploy

- La home carga el hero, banners de marcas y secciones con anclas (`#soluciones`, `#blog`, etc.).
- El visor 3D (ToyCar GLB externo) requiere red; si falla, revisa la consola del navegador (CORS del CDN de GitHub).
- Prueba el cambio de idioma **ES / EN** en la navbar.

### Problemas frecuentes

| Problema | Solución |
|----------|----------|
| Build falla por Node | En Vercel → **Settings → General → Node.js Version** → **20.x** o **22.x** |
| Pantalla en blanco | Revisa que **Output Directory** sea `dist`, no `build` |
| 404 al recargar una ruta | Confirma que exista `vercel.json` con el rewrite a `index.html` |
| Repo en subcarpeta | Si el código no está en la raíz, pon **Root Directory** = `smartclic-web` |

---

## Estructura del código

```
src/
├── components/
│   ├── effects/          # EmojiRain, etc.
│   ├── sections/         # Hero, Solutions, Blog, Contact…
│   ├── layout/           # Navbar, Footer, Logo
│   ├── ui/               # shadcn + parallax, text-rotate
│   └── ModelViewer.tsx   # Visor 3D
├── i18n/                 # ES / EN
└── index.css             # Tema y fuentes
```

## Personalización

- Colores y fuentes: `src/index.css` (`@theme`)
- Textos ES/EN: `src/i18n/translations.ts`
- Logo: `public/logo-smartclic.png`
- Contacto: `src/components/sections/Contact.tsx`
