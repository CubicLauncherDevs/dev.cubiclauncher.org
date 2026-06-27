# CubicLauncher Web - Developer Website

Una página web moderna y minimalista para desarrolladores interesados en contribuir al proyecto **CubicLauncher**, un lanzador de Minecraft de nueva generación.

## Características

- **Diseño minimalista**: Inspirado en sitios como Zed.dev, Linear y Vercel
- **Tema oscuro**: Paleta de colores sobria y profesional
- **Responsive**: Totalmente adaptable a diferentes dispositivos
- **Accesible**: Cumple con estándares WCAG
- **Rápido**: Optimizado con SvelteKit y Vite
- **TypeScript**: Código altamente tipado para mayor confiabilidad

## Estructura del Proyecto

```
src/
├── app.html              # HTML principal
├── app.css               # Estilos globales y variables CSS
├── lib/
│   └── components/       # Componentes reutilizables
│       ├── Button.svelte
│       ├── Card.svelte
│       ├── Header.svelte
│       ├── Hero.svelte
│       ├── Features.svelte
│       ├── Philosophy.svelte
│       ├── CTA.svelte
│       └── Footer.svelte
└── routes/
    ├── +layout.svelte    # Layout principal
    └── +page.svelte      # Página home
```

## Secciones

1. **Header**: Logo y navegación
2. **Hero**: Título principal, descripción y CTA con mockup de código
3. **Features**: 4 tarjetas destacando características clave
4. **Philosophy**: Valores del proyecto
5. **CTA**: Llamada a la acción para contribuir
6. **Footer**: Enlaces e información

## Componentes

Cada componente tiene una única responsabilidad:

- **Button**: Botón reutilizable con variantes (primary, secondary, ghost)
- **Card**: Tarjeta con icono, título y descripción
- **Header**: Navegación principal
- **Hero**: Sección introductoria
- **Features**: Grid de características
- **Philosophy**: Sección de valores
- **CTA**: Call-to-action
- **Footer**: Pie de página

## Instalación y Desarrollo

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

### Build

```bash
npm run build
```

### Preview de producción

```bash
npm run preview
```

## Tecnologías

- **SvelteKit**: Framework web moderno
- **Svelte**: UI reactiva
- **TypeScript**: Tipado estricto
- **CSS Puro**: Estilos sin dependencias externas
- **Vite**: Bundler rápido

## Estilos

Se utilizan variables CSS personalizadas para mantener la consistencia:

- **Colores**: Tema oscuro con accent verde
- **Tipografía**: Sistema de escala modular
- **Espaciado**: Sistema de espaciado consistente
- **Animaciones**: Transiciones sutiles

## Accesibilidad

- Semántica HTML correcta
- ARIA labels donde es necesario
- Contraste de colores adecuado
- Navegación con teclado
- Links semánticos

## Escalabilidad

La estructura permite agregar nuevas páginas fácilmente:

1. Crear nuevo archivo `.svelte` en `src/routes/`
2. Usar los componentes existentes
3. Mantener la consistencia visual

## Próximas Mejoras Potenciales

- [ ] Página de documentación
- [ ] Blog de contribuciones
- [ ] Perfiles de desarrolladores destacados
- [ ] Dark/Light mode toggle
- [ ] i18n (internacionalización)

## Licencia

Este proyecto es parte de CubicLauncher y utiliza la misma licencia.

## Contribuciones

¡Contribuciones bienvenidas! Por favor, consulta el repositorio principal de CubicLauncher.

---

**CubicLauncher**: https://github.com/CubicLauncherDevs/CubicLauncher
