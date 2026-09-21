---
title: Introducción a CubicLauncher
description: Qué es CubicLauncher, qué puede hacer y cómo empezar en pocos minutos.
---

# Introducción

CubicLauncher es un launcher de código abierto para Minecraft: Java Edition. Te permite crear y gestionar instancias aisladas, instalar versiones y loaders, manejar cuentas, descargar mods y modpacks desde proveedores populares y personalizar la apariencia con temas.

## Características clave

- Instancias independientes con su propia configuración, mods, resource packs, screenshots y servidores.
- Soporte para loaders: Vanilla, Fabric, Forge, Quilt y NeoForge.
- Cuentas: Microsoft, Yggdrasil (Authlib) y modo sin conexión.
- Contenido: búsqueda e instalación desde Modrinth y CurseForge; importación de modpacks (MRPack y CurseForge Zip).
- Mundos y servidores: gestión por instancia, ping de servidores y conexión rápida.
- Java gestionado por el launcher o externo, elección automática según la versión del juego.
- Consola integrada de logs con previsualización, limpieza de datos sensibles y subida a mclo.gs.
- Personalización con temas (v1 JSON y v2 CBTH), fondos, íconos y fuentes personalizadas.

## Dónde guarda mis cosas

Todos los datos viven en tu carpeta de usuario, bajo `.cubic`:

```
~/.cubic/
├── instances/   # Instancias y su contenido
├── shared/      # Versiones compartidas, runtimes Java gestionados
├── settings/    # Configuración del launcher (settings.cub)
├── themes/      # Temas instalados por el usuario
└── skins/       # Guardarropa de skins
```

Esto facilita hacer backups, mover tus datos a otra PC y mantener aisladas tus configuraciones por instancia.

## Primeros pasos rápidos

1. Instalá el launcher siguiendo la guía de Instalación.
2. Abrí CubicLauncher y descargá la versión del juego que quieras.
3. Creá una instancia con esa versión y, si querés, elegí un loader.
4. Iniciá sesión con tu cuenta (Microsoft o servidor Yggdrasil) o usá modo sin conexión.
5. Si tu instancia usa loader, abrí el Market para instalar mods o importá un modpack.

Seguí con la guía de Instalación para ver opciones por plataforma.

## Enlaces rápidos

- Instalación: /docs/es-ES/Comenzando/instalacion
- Instancias: /docs/es-ES/Uso/instances
