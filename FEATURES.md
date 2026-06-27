# CubicLauncher Web - Features & Components

## 🎯 Component Architecture

### Button.svelte
**Líneas**: 70  
**Responsabilidades**: Botón reutilizable

```typescript
Props:
- href: string          // URL del link
- variant: 'primary' | 'secondary' | 'ghost'
- size: 'sm' | 'md' | 'lg'
```

**Variantes de estilos**:
- Primary: Verde accent, elevación en hover
- Secondary: Borde, fondo hover oscuro
- Ghost: Sin fondo, cambio de color en hover

---

### Card.svelte
**Líneas**: 58  
**Responsabilidades**: Tarjeta de característica

```typescript
Props:
- icon: string          // SVG inline
- title: string
- description: string
```

**Features**:
- Hover animation con elevación
- Icono SVG con stroke color accent
- Diseño minimalista

---

### Header.svelte
**Líneas**: 91  
**Responsabilidades**: Navegación principal

**Componentes**:
- Logo clickeable
- Navigation links (Home, GitHub, Docs)
- Responsive hamburger-ready structure

**Interactividad**:
- Hover states en links
- Transiciones suaves
- Mobile responsive

---

### Hero.svelte
**Líneas**: 174  
**Responsabilidades**: Sección introductoria

**Contenido**:
- Título impactante (h1)
- Descripción de dos líneas
- Dos CTA buttons (GitHub, Docs)
- Mockup de código Rust

**Features**:
- Grid 2 columnas en desktop, 1 en mobile
- Animación slide-up en código
- Sintaxis highlighting básico

---

### Features.svelte
**Líneas**: 116  
**Responsabilidades**: Grid de características

**Contenido**:
- 4 tarjetas Features
- Modern Architecture
- Open Source
- Fast Development
- Built for Contributors

**Grid responsive**:
- `repeat(auto-fit, minmax(280px, 1fr))`

---

### Philosophy.svelte
**Líneas**: 79  
**Responsabilidades**: Valores del proyecto

**Valores**:
- Clean Code
- Simplicity First
- Community Driven
- Open Development

**Layout**:
- 4 columnas grid responsive
- Títulos en accent color
- Descripciones en secondary text

---

### CTA.svelte
**Líneas**: 68  
**Responsabilidades**: Call-to-action section

**Contenido**:
- Headline "Ready to make an impact?"
- Descripción
- Botón primary grande

**Estilos**:
- Background gradient
- Centered content
- Large button size

---

### Footer.svelte
**Líneas**: 96  
**Responsabilidades**: Pie de página

**Contenido**:
- Descripción breve
- Links: GitHub, License, Discord
- Copyright

**Layout**:
- 2 columnas en desktop
- Links alineados a derecha
- Borde superior y contenedor

---

## 🎨 Design System

### Colors
```css
--bg-primary: #0f0f0f       /* Fondo principal */
--bg-secondary: #1a1a1a     /* Fondo secundario */
--bg-tertiary: #252525      /* Fondo terciario */
--bg-hover: #2d2d2d         /* Estado hover */

--text-primary: #f5f5f5     /* Texto principal */
--text-secondary: #b0b0b0   /* Texto secundario */
--text-tertiary: #808080    /* Texto terciario */

--accent: #10b981           /* Verde primario */
--accent-light: #6ee7b7     /* Verde claro */

--border: #333333           /* Bordes */
```

### Spacing System
```css
--spacing-xs: 0.5rem        /* 8px */
--spacing-sm: 1rem          /* 16px */
--spacing-md: 1.5rem        /* 24px */
--spacing-lg: 2rem          /* 32px */
--spacing-xl: 3rem          /* 48px */
--spacing-2xl: 4rem         /* 64px */
--spacing-3xl: 6rem         /* 96px */
```

### Typography
```css
Sizes: xs (12px) → 5xl (48px)
Weights: 400, 500, 600, 700
Font: System stack (-apple-system...)
Mono: Menlo, Monaco, Courier New
```

### Border Radius
```css
--radius-sm: 0.375rem       /* 6px */
--radius-md: 0.5rem         /* 8px */
--radius-lg: 0.75rem        /* 12px */
--radius-full: 9999px       /* Circle */
```

### Transitions
```css
--transition-fast: 150ms    /* Hover states */
--transition-base: 200ms    /* Default */
--transition-slow: 300ms    /* Animations */
```

---

## 📱 Responsiveness

### Breakpoints
- Mobile: < 768px
- Tablet/Desktop: ≥ 768px

### Responsive Patterns
1. **Grid**: `repeat(auto-fit, minmax(280px, 1fr))`
2. **Flex**: `flex-direction: column` on mobile
3. **Font**: Reduce 1-2 sizes on mobile
4. **Spacing**: Reduce spacing on mobile

---

## ♿ Accessibility

### ARIA
- `aria-label`: Links y botones
- `aria-hidden="true"`: Elementos decorativos

### Semantic HTML
- `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Proper heading hierarchy (h1, h2, h3...)
- `<a>` con href válido

### Contrast
- Text color: WCAG AA compliant
- Links distinguibles

### Keyboard Navigation
- Links funcionales con Tab
- Skip to content ready

---

## 🚀 Performance

### Bundle Size
- ~11KB gzipped (sin node_modules)
- CSS inline en HTML
- Zero external frameworks

### Optimizations
- CSS variables para reutilización
- No duplicación de estilos
- Minimal JavaScript
- Vite tree-shaking

### Build Output
```
.svelte-kit/output/
├── client/          # JS optimizado
├── server/          # SSR bundle
└── prerendered/     # Static HTML
```

---

## 📝 Code Quality

### TypeScript
- Strict mode habilitado
- Props totalmente tipadas
- No `any` types

### Estructura
- 1 componente = 1 responsabilidad
- Max 200 líneas por componente
- CSS modular por componente

### Naming
- Descriptivos: `hero-title`, `nav-link`
- camelCase para TypeScript
- kebab-case para CSS classes

---

## 🔄 Escalabilidad

### Agregar Nueva Página
1. Crear `src/routes/nueva-pagina/+page.svelte`
2. Importar componentes existentes
3. Reutilizar estilos

### Agregar Nuevo Componente
1. Crear en `src/lib/components/Componente.svelte`
2. Definir props TypeScript
3. Usar CSS variables globales

---

## 📚 Documentation

### Archivos
- `README.md` - Guía principal
- `FEATURES.md` - Este archivo
- `package.json` - Dependencias
- `tsconfig.json` - TypeScript config

