---
category: usage
order: 40
title: Configuración del launcher
description: Guía de todas las secciones de Ajustes de CubicLauncher: almacenamiento, interfaz, notificaciones, Minecraft, descargas, consola, Java y actualizaciones.
---

# Configuración del launcher

Los ajustes se abren desde el engranaje de la barra lateral y se organizan en cuatro pestañas: **Launcher**, **Minecraft**, **Personalizar** y **Java**. Los cambios se guardan automáticamente.

## Pestaña Launcher

### General

- **Idioma** — cambia el idioma de la interfaz. Están disponibles español, inglés, francés, alemán, ucraniano, japonés y ruso.
- **Buscar actualizaciones al iniciar** — consulta si hay una versión nueva al abrir el launcher.
- **Presencia de Discord** — muestra la actividad de CubicLauncher en Discord.
- **Ocultar el launcher al jugar** — minimiza u oculta la ventana cuando inicia Minecraft.
- **Abrir la consola al iniciar instancias** — abre la ventana de logs al lanzar una instancia.
- **Notificaciones destacadas** — usa avisos grandes y centrados con títulos en mayúsculas y mensajes más legibles.
- **Probar notificación** — muestra una vista previa de las notificaciones actuales.

### Almacenamiento

Permite elegir en qué disco se guardan las instancias y los archivos compartidos:

- **Ubicación de instancias** — muestra la ruta actual y cuántas instancias hay. Podés cambiarla o restablecer la ubicación por defecto.
- **Traslado con enlaces duros** — si el disco de destino lo permite, las instancias se mueven sin duplicar espacio. Si el destino está en otro disco, se copian los datos.
- **Solo se borra el origen** cuando cada instancia quedó completa en el nuevo destino. Si algo falla, el launcher muestra qué archivos no se pudieron mover.
- **Archivos compartidos** — muestra el espacio usado por versiones, librerías, assets y runtimes. Podés cambiar la ubicación, restablecerla o borrar todo el contenido.
- Al borrar los archivos compartidos, tus mundos y ajustes no se tocan: las versiones y librerías se vuelven a descargar cuando lances una instancia.
- La carpeta nueva de archivos compartidos debe estar vacía. Cerrá Minecraft y esperá a que terminen las descargas antes de modificar estas rutas.

La configuración se guarda en `settings.cub` y las rutas personalizadas se leen al iniciar el launcher.

### Temas

- Muestra el tema activo.
- **Importar tema** — carga un ZIP o `.cbth`.
- **Explorar temas** — abre el catálogo web de temas.
- **Exportar** — guarda el tema activo para compartirlo.
- **Eliminar** — borra un tema instalado por el usuario.

### Rendimiento

- **Reducir animaciones de la interfaz**.
- **Desactivar efectos de desenfoque (blur)**.
- **Desactivar animaciones de carga continuas**.
- **Desactivar animación del visor 3D de skin**.
- **Reducir animaciones de logs**.

Estas opciones ayudan en equipos modestos o si preferís una interfaz más sobria.

### Actualizaciones

- Muestra la versión actual y si hay una actualización disponible.
- **Canal de actualización** — Estable o Pre-lanzamiento.
- Permite buscar actualizaciones, ver las notas de la versión, descargar e instalar.
- La fecha de la última comprobación correcta aparece en esta sección.

### Sobre nosotros

Incluye enlaces al Discord, al código abierto y al reporte de problemas.

## Pestaña Minecraft

### Rendimiento (RAM)

- **Memoria mínima** y **máxima** en GB.
- **Usar RAM recomendada** calcula un rango según la memoria total del equipo.
- La memoria global se usa cuando una instancia no tiene overrides.

### Opciones de Minecraft

- **Mostrar versiones Snapshots**.
- **Mostrar versiones Alpha**.
- **Mostrar versiones inestables de los loaders**.

Estas opciones afectan a las versiones que aparecen en el descargador y al crear instancias.

### Proveedor de descargas

- **Oficial (Mojang)** — servidores oficiales; recomendado fuera de China.
- **BMCLAPI (China)** — espejo para jugadores en China con descargas lentas. Si el espejo falla, el launcher usa los servidores oficiales como respaldo.

El proveedor se aplica a metadatos, assets, librerías y a la instalación de Forge, NeoForge, Fabric y OptiFine.

### Opciones de consola

- **Límite del historial** — líneas conservadas por instancia (100 a 5000).
- **Mostrar etiquetas de nivel** — útil para filtrar logs. Ocultarlas no se recomienda.

### Perfiles de options.txt

- Crear, editar, importar y eliminar perfiles de `options.txt`.
- Asignar un perfil a una instancia desde su editor.
- Aplicar el perfil manualmente o automáticamente antes de lanzar.
- Al reemplazar un `options.txt` existente se guarda un respaldo.

:::warning Función experimental
Los perfiles de `options.txt` pueden cambiar en futuras versiones. Aplicar un perfil automáticamente reemplaza el archivo de la instancia; los cambios hechos dentro del juego se perderán en el siguiente lanzamiento.
:::

## Pestaña Personalizar

### Interfaz

- **Escala de interfaz** — cambia el tamaño de toda la ventana. 100 % es el tamaño original.
- **Densidad** — Del tema, Compacta o Cómoda. Ajusta la separación entre tarjetas, listas y opciones sin cambiar la tipografía.
- **Fuente** — Del tema o una de las fuentes incluidas en el launcher.
- **Restablecer interfaz** — vuelve a los valores por defecto.

### Notificaciones

- Activar o desactivar la personalización de notificaciones.
- **Posición** — seis esquinas o bordes de la pantalla.
- **Tamaño del cuadro** — Compacto, Normal o Amplio.
- **Tamaño del título** y **del mensaje**.
- **Duración** — aplica a los avisos temporales; las descargas permanecen visibles hasta terminar.
- **Título en mayúsculas** y **título en negrita**.
- **Restablecer notificaciones** y vista previa.

## Pestaña Java

### Entornos Java (Runtimes)

Para Java 8, 17, 21 y 25:

- Ver si el JRE está instalado y qué versión tiene.
- Elegir el **proveedor**: Automático, Azul Zulu, Eclipse Temurin, BellSoft Liberica o GraalVM.
- **Instalar** o **desinstalar** el JRE gestionado.
- **Detectar rutas** para encontrar Java externos.
- Indicar rutas manuales para cada versión.

Los JRE gestionados se guardan en la carpeta compartida (`shared/runtimes/jre<version>`).

### Avanzado

- **Argumentos JVM** — se aplican globalmente al lanzar Minecraft.
- **Variables de entorno** — se añaden al proceso de Java. Usalas solo si una guía o un mod lo requiere.

Los argumentos y variables de una instancia se añaden después de los globales. Ver [Qué es Java](/docs/es-ES/Uso/java) para ejemplos de parámetros.

## Restablecer ajustes

Cada sección tiene su propio botón de restablecimiento cuando aplica. Si necesitás volver a una configuración limpia, revisá también las rutas de almacenamiento y los perfiles de Java antes de borrar datos.
