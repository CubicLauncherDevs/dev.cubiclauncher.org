export type DocLanguage = 'es-ES' | 'en-EN' | 'fr-FR';

interface CategoryDefinition {
  id: string;
  translations: Record<DocLanguage, { label: string; description: string }>;
}

/** El orden de esta lista se comparte entre portada, navegación y categorías. */
export const DOC_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'getting-started',
    translations: {
      'es-ES': { label: 'Primeros pasos', description: 'Conoce CubicLauncher, instálalo en tu sistema y empieza a jugar.' },
      'en-EN': { label: 'Getting started', description: 'Discover CubicLauncher, install it on your system and start playing.' },
      'fr-FR': { label: 'Premiers pas', description: 'Découvrez CubicLauncher, installez-le sur votre système et commencez à jouer.' }
    }
  },
  {
    id: 'usage',
    translations: {
      'es-ES': { label: 'Uso y configuración', description: 'Gestiona cuentas, instancias, Java y las opciones del launcher.' },
      'en-EN': { label: 'Usage and configuration', description: 'Manage accounts, instances, Java and launcher settings.' },
      'fr-FR': { label: 'Utilisation et configuration', description: 'Gérez les comptes, les instances, Java et les paramètres du launcher.' }
    }
  },
  {
    id: 'content',
    translations: {
      'es-ES': { label: 'Mods y contenido', description: 'Amplía Minecraft con mods, contenido adicional y clientes compatibles.' },
      'en-EN': { label: 'Mods and content', description: 'Expand Minecraft with mods, additional content and compatible clients.' },
      'fr-FR': { label: 'Mods et contenu', description: 'Enrichissez Minecraft avec des mods, du contenu et des clients compatibles.' }
    }
  },
  {
    id: 'customization',
    translations: {
      'es-ES': { label: 'Personalización', description: 'Cambia la apariencia del launcher e instala o crea tus propios temas.' },
      'en-EN': { label: 'Customization', description: 'Change the launcher’s appearance and install or create your own themes.' },
      'fr-FR': { label: 'Personnalisation', description: 'Changez l’apparence du launcher et installez ou créez vos propres thèmes.' }
    }
  },
  {
    id: 'troubleshooting',
    translations: {
      'es-ES': { label: 'Ayuda y soporte', description: 'Diagnostica errores, consulta soluciones y encuentra ayuda.' },
      'en-EN': { label: 'Help and support', description: 'Diagnose errors, find solutions and get help.' },
      'fr-FR': { label: 'Aide et assistance', description: 'Diagnostiquez les erreurs, trouvez des solutions et obtenez de l’aide.' }
    }
  },
  {
    id: 'development',
    translations: {
      'es-ES': { label: 'Desarrollo y contribución', description: 'Explora el proyecto, prepara tu entorno y contribuye a CubicLauncher.' },
      'en-EN': { label: 'Development and contribution', description: 'Explore the project, set up your environment and contribute to CubicLauncher.' },
      'fr-FR': { label: 'Développement et contribution', description: 'Explorez le projet, préparez votre environnement et contribuez à CubicLauncher.' }
    }
  },
  {
    id: 'legal',
    translations: {
      'es-ES': { label: 'Información legal', description: 'Consulta la licencia, la política de privacidad y los términos de uso.' },
      'en-EN': { label: 'Legal information', description: 'Read the license, privacy policy and terms of use.' },
      'fr-FR': { label: 'Informations légales', description: 'Consultez la licence, la politique de confidentialité et les conditions d’utilisation.' }
    }
  }
];

export function getCategoryDetails(id: string, lang: string) {
  const category = DOC_CATEGORIES.find(c => c.id === id);
  if (!category) return undefined;
  const locale = lang in category.translations ? lang as DocLanguage : 'es-ES';
  return { name: category.id, ...category.translations[locale] };
}
