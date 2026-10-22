export const DOCS_LOCALES = ['es-ES', 'en-EN', 'fr-FR', 'ru-RU'] as const;
export type DocsLocale = (typeof DOCS_LOCALES)[number];

export interface DocsUiStrings {
  explore: string;
  home: string;
  categories: string;
  allPages: string;
  categoryTitle: (label: string) => string;
  docs: string;
  community: string;
  github: string;
  discord: string;
  eyebrow: string;
  heroTitle: string;
  tagline: string;
  contributors: string;
  contributorsSubtitle: string;
  contributionCount: (n: number) => string;
  articleWord: (n: number) => string;
  categoryWord: (n: number) => string;
  pagesCount: (n: number) => string;
  categoriasSubtitle: (lang: string) => string;
  categoriaSubtitle: (n: number) => string;
  todasSubtitle: (n: number, lang: string) => string;
  quick: { label: string; description: string }[];
  meta: {
    docsTitle: (title: string) => string;
    indexDescription: string;
    indexOgDescription: string;
    docFallbackSubtitle: string;
    docDescription: (title: string) => string;
  };
  chrome: {
    skipToContent: string;
    menu: string;
    menuLabel: string;
    language: string;
    navLabel: string;
    breadcrumbLabel: string;
    quickLinksLabel: string;
    edit: string;
    history: string;
    category: string;
    backToTop: string;
    copyFailed: string;
  };
  search: {
    trigger: string;
    placeholder: string;
    dialog: string;
    input: string;
    close: string;
    results: string;
    statusResults: (n: number, lang: string) => string;
    statusSearching: (lang: string) => string;
    emptyMin: string;
    emptyNone: string;
    navigate: string;
    select: string;
    closeKey: string;
  };
  toc: {
    title: string;
    aria: string;
  };
  lightbox: {
    dialog: string;
    close: string;
    prev: string;
    next: string;
  };
  theme: {
    toggle: string;
  };
  markdown: {
    details: string;
    related: string;
    expansion: string;
    invalidYoutube: string;
    videoUnsupported: string;
    invalidVideo: string;
    openImage: string;
    editSection: string;
    edit: string;
    copyCode: string;
    copy: string;
  };
}

function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export const DOCS_UI: Record<DocsLocale, DocsUiStrings> = {
  'es-ES': {
    explore: 'Explorar la documentación',
    home: 'Portada',
    categories: 'Categorías',
    allPages: 'Todas las páginas',
    categoryTitle: (label) => `Categoría: ${label}`,
    docs: 'Documentación',
    community: 'Comunidad',
    github: 'GitHub',
    discord: 'Discord',
    eyebrow: 'Documentación de la comunidad',
    heroTitle: 'Documentación de CubicLauncher',
    tagline: 'Todo lo que necesitas para instalar, configurar y aprovechar tu launcher de Minecraft. Explora las guías o busca una respuesta concreta.',
    contributors: 'Contribuyentes',
    contributorsSubtitle: 'Personas que hacen posible CubicLauncher en todos sus repositorios.',
    contributionCount: (n) => `${n} ${n === 1 ? 'contribución' : 'contribuciones'}`,
    articleWord: (n) => (n === 1 ? 'artículo' : 'artículos'),
    categoryWord: (n) => (n === 1 ? 'categoría' : 'categorías'),
    pagesCount: (n) => `${n} ${n === 1 ? 'página' : 'páginas'}`,
    categoriasSubtitle: (lang) => `Todas las categorías de la documentación en ${lang}.`,
    categoriaSubtitle: (n) => `${n} ${n === 1 ? 'página' : 'páginas'} en esta categoría.`,
    todasSubtitle: (n, lang) => `Índice alfabético de los ${n} ${n === 1 ? 'artículo' : 'artículos'} de la documentación en ${lang}.`,
    quick: [
      { label: 'Conoce el launcher', description: 'Características y primeros pasos.' },
      { label: 'Instala CubicLauncher', description: 'Prepara el launcher en tu sistema.' },
      { label: 'Encuentra ayuda', description: 'Resuelve dudas y problemas habituales.' }
    ],
    meta: {
      docsTitle: (title) => `${title} — CubicLauncher Docs`,
      indexDescription: 'CubicLauncher Docs — Guías, referencias y recursos sobre CubicLauncher, el launcher de Minecraft multiplataforma.',
      indexOgDescription: 'Guías, referencias y recursos sobre CubicLauncher.',
      docFallbackSubtitle: 'De CubicLauncher Docs',
      docDescription: (title) => `Documentación de CubicLauncher: ${title}.`
    },
    chrome: {
      skipToContent: 'Saltar al contenido',
      menu: 'Menú',
      menuLabel: 'Menú de documentación',
      language: 'Idioma',
      navLabel: 'Navegación de la documentación',
      breadcrumbLabel: 'Ruta de navegación',
      quickLinksLabel: 'Primeros pasos',
      edit: 'Editar',
      history: 'Historial',
      category: 'Categoría',
      backToTop: 'Volver arriba ↑',
      copyFailed: 'No se pudo copiar. Selecciona el código para copiarlo manualmente.'
    },
    search: {
      trigger: 'Buscar documentación',
      placeholder: 'Buscar en la documentación...',
      dialog: 'Búsqueda de documentación',
      input: 'Buscar artículos',
      close: 'Cerrar búsqueda',
      results: 'Artículos encontrados',
      statusResults: (n, lang) => `${n} ${n === 1 ? 'resultado' : 'resultados'} · ${lang}`,
      statusSearching: (lang) => `Búsqueda en ${lang}`,
      emptyMin: 'Escribe al menos 2 caracteres para buscar.',
      emptyNone: 'No se encontraron resultados. Prueba con menos palabras o cambia el idioma de la documentación.',
      navigate: 'navegar',
      select: 'seleccionar',
      closeKey: 'cerrar'
    },
    toc: {
      title: 'En esta página',
      aria: 'Tabla de contenidos'
    },
    lightbox: {
      dialog: 'Visor de imágenes',
      close: 'Cerrar visor',
      prev: 'Imagen anterior',
      next: 'Imagen siguiente'
    },
    theme: {
      toggle: 'Cambiar tema'
    },
    markdown: {
      details: 'Detalles',
      related: 'Artículos relacionados',
      expansion: 'Esta página necesita expansión',
      invalidYoutube: 'ID de YouTube no válido:',
      videoUnsupported: 'Tu navegador no soporta la reproducción de video.',
      invalidVideo: 'Formato de video no reconocido:',
      openImage: 'Ampliar imagen',
      editSection: 'Editar esta sección',
      edit: 'editar',
      copyCode: 'Copiar código',
      copy: 'Copiar'
    }
  },
  'en-EN': {
    explore: 'Explore the documentation',
    home: 'Home',
    categories: 'Categories',
    allPages: 'All pages',
    categoryTitle: (label) => `Category: ${label}`,
    docs: 'Documentation',
    community: 'Community',
    github: 'GitHub',
    discord: 'Discord',
    eyebrow: 'Community documentation',
    heroTitle: 'CubicLauncher documentation',
    tagline: 'Everything you need to install, configure and get the most out of your Minecraft launcher. Browse the guides or search for a specific answer.',
    contributors: 'Contributors',
    contributorsSubtitle: 'People who make CubicLauncher possible across its repositories.',
    contributionCount: (n) => `${n} ${n === 1 ? 'contribution' : 'contributions'}`,
    articleWord: (n) => (n === 1 ? 'article' : 'articles'),
    categoryWord: (n) => (n === 1 ? 'category' : 'categories'),
    pagesCount: (n) => `${n} ${n === 1 ? 'page' : 'pages'}`,
    categoriasSubtitle: (lang) => `All documentation categories in ${lang}.`,
    categoriaSubtitle: (n) => `${n} ${n === 1 ? 'page' : 'pages'} in this category.`,
    todasSubtitle: (n, lang) => `Alphabetical index of the ${n} ${n === 1 ? 'article' : 'articles'} in the documentation in ${lang}.`,
    quick: [
      { label: 'Meet the launcher', description: 'Features and first steps.' },
      { label: 'Install CubicLauncher', description: 'Set up the launcher on your system.' },
      { label: 'Find help', description: 'Solve common questions and issues.' }
    ],
    meta: {
      docsTitle: (title) => `${title} — CubicLauncher Docs`,
      indexDescription: 'CubicLauncher Docs — Guides, references and resources about CubicLauncher, the cross-platform Minecraft launcher.',
      indexOgDescription: 'Guides, references and resources about CubicLauncher.',
      docFallbackSubtitle: 'From CubicLauncher Docs',
      docDescription: (title) => `CubicLauncher documentation: ${title}.`
    },
    chrome: {
      skipToContent: 'Skip to content',
      menu: 'Menu',
      menuLabel: 'Documentation menu',
      language: 'Language',
      navLabel: 'Documentation navigation',
      breadcrumbLabel: 'Breadcrumb',
      quickLinksLabel: 'Getting started',
      edit: 'Edit',
      history: 'History',
      category: 'Category',
      backToTop: 'Back to top ↑',
      copyFailed: 'Could not copy. Select the code to copy it manually.'
    },
    search: {
      trigger: 'Search documentation',
      placeholder: 'Search the documentation...',
      dialog: 'Documentation search',
      input: 'Search articles',
      close: 'Close search',
      results: 'Found articles',
      statusResults: (n, lang) => `${n} ${n === 1 ? 'result' : 'results'} · ${lang}`,
      statusSearching: (lang) => `Searching ${lang}`,
      emptyMin: 'Type at least 2 characters to search.',
      emptyNone: 'No results found. Try fewer words or change the documentation language.',
      navigate: 'navigate',
      select: 'select',
      closeKey: 'close'
    },
    toc: {
      title: 'On this page',
      aria: 'Table of contents'
    },
    lightbox: {
      dialog: 'Image viewer',
      close: 'Close viewer',
      prev: 'Previous image',
      next: 'Next image'
    },
    theme: {
      toggle: 'Change theme'
    },
    markdown: {
      details: 'Details',
      related: 'Related articles',
      expansion: 'This page needs expansion',
      invalidYoutube: 'Invalid YouTube ID:',
      videoUnsupported: 'Your browser does not support video playback.',
      invalidVideo: 'Unrecognized video format:',
      openImage: 'Enlarge image',
      editSection: 'Edit this section',
      edit: 'edit',
      copyCode: 'Copy code',
      copy: 'Copy'
    }
  },
  'fr-FR': {
    explore: 'Explorer la documentation',
    home: 'Accueil',
    categories: 'Catégories',
    allPages: 'Toutes les pages',
    categoryTitle: (label) => `Catégorie : ${label}`,
    docs: 'Documentation',
    community: 'Communauté',
    github: 'GitHub',
    discord: 'Discord',
    eyebrow: 'Documentation communautaire',
    heroTitle: 'Documentation de CubicLauncher',
    tagline: 'Tout ce qu\'il faut pour installer, configurer et profiter de votre launcher Minecraft. Parcourez les guides ou recherchez une réponse précise.',
    contributors: 'Contributeurs',
    contributorsSubtitle: 'Les personnes qui rendent CubicLauncher possible sur tous ses dépôts.',
    contributionCount: (n) => `${n} ${n === 1 ? 'contribution' : 'contributions'}`,
    articleWord: (n) => (n === 1 ? 'article' : 'articles'),
    categoryWord: (n) => (n === 1 ? 'catégorie' : 'catégories'),
    pagesCount: (n) => `${n} ${n === 1 ? 'page' : 'pages'}`,
    categoriasSubtitle: (lang) => `Toutes les catégories de la documentation en ${lang}.`,
    categoriaSubtitle: (n) => `${n} ${n === 1 ? 'page' : 'pages'} dans cette catégorie.`,
    todasSubtitle: (n, lang) => `Index alphabétique des ${n} ${n === 1 ? 'article' : 'articles'} de la documentation en ${lang}.`,
    quick: [
      { label: 'Découvrir le launcher', description: 'Fonctionnalités et premiers pas.' },
      { label: 'Installer CubicLauncher', description: 'Préparez le launcher sur votre système.' },
      { label: 'Trouver de l\'aide', description: 'Résolvez les questions et problèmes courants.' }
    ],
    meta: {
      docsTitle: (title) => `${title} — CubicLauncher Docs`,
      indexDescription: 'CubicLauncher Docs — Guides, références et ressources sur CubicLauncher, le launcher Minecraft multiplateforme.',
      indexOgDescription: 'Guides, références et ressources sur CubicLauncher.',
      docFallbackSubtitle: 'De CubicLauncher Docs',
      docDescription: (title) => `Documentation de CubicLauncher : ${title}.`
    },
    chrome: {
      skipToContent: 'Aller au contenu',
      menu: 'Menu',
      menuLabel: 'Menu de la documentation',
      language: 'Langue',
      navLabel: 'Navigation de la documentation',
      breadcrumbLabel: 'Fil d’Ariane',
      quickLinksLabel: 'Premiers pas',
      edit: 'Modifier',
      history: 'Historique',
      category: 'Catégorie',
      backToTop: 'Retour en haut ↑',
      copyFailed: 'Impossible de copier. Sélectionnez le code pour le copier manuellement.'
    },
    search: {
      trigger: 'Rechercher dans la documentation',
      placeholder: 'Rechercher dans la documentation...',
      dialog: 'Recherche dans la documentation',
      input: 'Rechercher des articles',
      close: 'Fermer la recherche',
      results: 'Articles trouvés',
      statusResults: (n, lang) => `${n} résultat${n > 1 ? 's' : ''} · ${lang}`,
      statusSearching: (lang) => `Recherche dans ${lang}`,
      emptyMin: 'Saisissez au moins 2 caractères pour lancer la recherche.',
      emptyNone: 'Aucun résultat. Essayez moins de mots ou changez la langue de la documentation.',
      navigate: 'naviguer',
      select: 'sélectionner',
      closeKey: 'fermer'
    },
    toc: {
      title: 'Sur cette page',
      aria: 'Table des matières'
    },
    lightbox: {
      dialog: 'Visionneuse d’images',
      close: 'Fermer la visionneuse',
      prev: 'Image précédente',
      next: 'Image suivante'
    },
    theme: {
      toggle: 'Changer de thème'
    },
    markdown: {
      details: 'Détails',
      related: 'Articles liés',
      expansion: 'Cette page nécessite une expansion',
      invalidYoutube: 'ID YouTube non valide :',
      videoUnsupported: 'Votre navigateur ne prend pas en charge la lecture vidéo.',
      invalidVideo: 'Format vidéo non reconnu :',
      openImage: 'Agrandir l’image',
      editSection: 'Modifier cette section',
      edit: 'modifier',
      copyCode: 'Copier le code',
      copy: 'Copier'
    }
  },
  'ru-RU': {
    explore: 'Изучение документации',
    home: 'Главная',
    categories: 'Категории',
    allPages: 'Все страницы',
    categoryTitle: (label) => `Категория: ${label}`,
    docs: 'Документация',
    community: 'Сообщество',
    github: 'GitHub',
    discord: 'Discord',
    eyebrow: 'Документация сообщества',
    heroTitle: 'Документация CubicLauncher',
    tagline: 'Всё, что нужно для установки, настройки и использования вашего лаунчера Minecraft. Изучайте руководства или ищите конкретный ответ.',
    contributors: 'Участники',
    contributorsSubtitle: 'Люди, благодаря которым CubicLauncher существует во всех его репозиториях.',
    contributionCount: (n) => `${n} ${ruPlural(n, 'вклад', 'вклада', 'вкладов')}`,
    articleWord: (n) => ruPlural(n, 'статья', 'статьи', 'статей'),
    categoryWord: (n) => ruPlural(n, 'категория', 'категории', 'категорий'),
    pagesCount: (n) => `${n} ${ruPlural(n, 'страница', 'страницы', 'страниц')}`,
    categoriasSubtitle: (lang) => `Все категории документации: ${lang}.`,
    categoriaSubtitle: (n) => `${n} ${ruPlural(n, 'страница', 'страницы', 'страниц')} в этой категории.`,
    todasSubtitle: (n, lang) => `Алфавитный указатель: ${n} ${ruPlural(n, 'статья', 'статьи', 'статей')} документации (${lang}).`,
    quick: [
      { label: 'Знакомство с лаунчером', description: 'Возможности и первые шаги.' },
      { label: 'Установка CubicLauncher', description: 'Настройте лаунчер в вашей системе.' },
      { label: 'Поиск помощи', description: 'Решения частых вопросов и проблем.' }
    ],
    meta: {
      docsTitle: (title) => `${title} — CubicLauncher Docs`,
      indexDescription: 'CubicLauncher Docs — руководства, справочники и ресурсы по CubicLauncher, кроссплатформенному лаунчеру Minecraft.',
      indexOgDescription: 'Руководства, справочники и ресурсы по CubicLauncher.',
      docFallbackSubtitle: 'Из документации CubicLauncher',
      docDescription: (title) => `Документация CubicLauncher: ${title}.`
    },
    chrome: {
      skipToContent: 'Перейти к содержимому',
      menu: 'Меню',
      menuLabel: 'Меню документации',
      language: 'Язык',
      navLabel: 'Навигация по документации',
      breadcrumbLabel: 'Путь навигации',
      quickLinksLabel: 'Первые шаги',
      edit: 'Редактировать',
      history: 'История',
      category: 'Категория',
      backToTop: 'Наверх ↑',
      copyFailed: 'Не удалось скопировать. Выделите код и скопируйте вручную.'
    },
    search: {
      trigger: 'Поиск по документации',
      placeholder: 'Поиск по документации...',
      dialog: 'Поиск по документации',
      input: 'Искать статьи',
      close: 'Закрыть поиск',
      results: 'Найденные статьи',
      statusResults: (n, lang) => `${n} ${ruPlural(n, 'результат', 'результата', 'результатов')} · ${lang}`,
      statusSearching: (lang) => `Поиск: ${lang}`,
      emptyMin: 'Введите минимум 2 символа для поиска.',
      emptyNone: 'Ничего не найдено. Попробуйте меньше слов или смените язык документации.',
      navigate: 'навигация',
      select: 'выбрать',
      closeKey: 'закрыть'
    },
    toc: {
      title: 'На этой странице',
      aria: 'Содержание'
    },
    lightbox: {
      dialog: 'Просмотр изображений',
      close: 'Закрыть просмотр',
      prev: 'Предыдущее изображение',
      next: 'Следующее изображение'
    },
    theme: {
      toggle: 'Сменить тему'
    },
    markdown: {
      details: 'Подробности',
      related: 'Связанные статьи',
      expansion: 'Эта страница требует дополнения',
      invalidYoutube: 'Неверный ID YouTube:',
      videoUnsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
      invalidVideo: 'Нераспознанный формат видео:',
      openImage: 'Увеличить изображение',
      editSection: 'Редактировать этот раздел',
      edit: 'редактировать',
      copyCode: 'Копировать код',
      copy: 'Копировать'
    }
  }
};

export function docsUi(lang: string | undefined): DocsUiStrings {
  return DOCS_UI[(lang || 'es-ES') as DocsLocale] || DOCS_UI['es-ES'];
}
