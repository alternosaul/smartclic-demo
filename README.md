# Smartclic.mx — Sitio Web Moderno

Landing page moderna para **smartclic.mx**, agencia de desarrollo web en México. Reemplaza el stack WordPress/Elementor por **React + Vite + Tailwind CSS v4 + shadcn/ui**.

## Stack

- **React 19** + TypeScript + Vite
- **Tailwind CSS v4** con tema personalizado
- **shadcn/ui** (Button, Badge, Card, Navigation Menu)
- **Framer Motion** + componentes estilo **React Bits** (BlurText, Spotlight, MagnetButton)
- **React Three Fiber** + Drei — animaciones 3D de productos digitales en los laterales del hero

## Desarrollo

```bash
cd smartclic-web
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Build producción

```bash
npm run build
npm run preview
```

## Estructura

```
src/
├── components/
│   ├── 3d/FallingProducts.tsx   # Objetos 3D cayendo en laterales
│   ├── reactbits/                 # Efectos animados
│   ├── sections/                  # Hero, Services, Process, etc.
│   ├── layout/                    # Navbar, Footer
│   └── ui/                        # shadcn components
└── lib/utils.ts
```

## Personalización

- Colores y fuentes: `src/index.css` (`@theme`)
- Contenido y métricas: `src/components/sections/`
- Contacto: actualiza email/teléfono en `Contact.tsx`

## Deploy

Compatible con **Vercel**, **Netlify** o cualquier host estático. El output está en `dist/` tras `npm run build`.
