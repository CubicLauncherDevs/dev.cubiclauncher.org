---
category: getting-started
order: 10
title: Introducción a CubicLauncher
description: Qué es CubicLauncher, qué puede hacer y cómo empezar en pocos minutos.
---

# Introducción

CubicLauncher es un launcher de código abierto para Minecraft: Java Edition. Te permite crear y gestionar instancias aisladas, instalar versiones y loaders, manejar cuentas, descargar contenido desde Modrinth y CurseForge y personalizar la apariencia con temas.

## Características clave

- Instancias independientes con su propia configuración, mods, resource packs, shader packs, capturas, mundos y servidores.
- Soporte para Vanilla, Fabric, Forge, Quilt y NeoForge.
- Cuentas Microsoft, Ely.by, CubicAuth, servidores Yggdrasil/Authlib personalizados y modo sin conexión.
- Contenido desde Modrinth y CurseForge: mods, resource packs, shader packs y modpacks.
- Gestión de mundos y servidores por instancia, con ping y conexión rápida.
- Skins y capas, armario de skins y detección automática del modelo clásico o delgado.
- Java gestionado por el launcher o externo, con proveedores Azul Zulu, Eclipse Temurin, BellSoft Liberica y GraalVM.
- Consola integrada con historial, limpieza de datos sensibles y subida a mclo.gs.
- Temas (v1 JSON y v2 CBTH), fondos, iconos y fuentes personalizadas.
- Interfaz disponible en español, inglés, francés, alemán, ucraniano, japonés y ruso.

## Dónde guarda mis cosas

Por defecto, los datos viven en tu carpeta de usuario, bajo `.cubic`:

```
~/.cubic/
├── instances/   # Instancias y su contenido
├── shared/      # Versiones, librerías, assets y runtimes Java compartidos
├── settings/    # Configuración del launcher (settings.cub)
├── themes/      # Temas instalados
└── skins/       # Armario de skins
```

Las carpetas `instances` y `shared` se pueden mover a otro disco desde **Ajustes → Almacenamiento**. El launcher traslada las instancias con enlaces duros cuando es posible y permite vaciar los archivos compartidos para liberar espacio; las versiones y librerías se vuelven a descargar cuando haga falta.

## Primeros pasos rápidos

1. Instalá el launcher siguiendo la guía de [Instalación](/docs/es-ES/Comenzando/instalacion).
2. Abrí CubicLauncher y descargá la versión del juego que quieras.
3. Creá una instancia con esa versión y, si querés, elegí un loader.
4. Iniciá sesión con Microsoft, Ely.by/CubicAuth, un servidor Yggdrasil propio o usá modo sin conexión.
5. Abrí el Market para instalar mods, resource packs o shaders, o importá un modpack.
6. Ajustá RAM, Java, interfaz y notificaciones desde **Ajustes**.

## Enlaces rápidos

- [Instalación](/docs/es-ES/Comenzando/instalacion)
- [Instancias](/docs/es-ES/Uso/instances)
- [Contenido y Marketplace](/docs/es-ES/Uso/marketplace)
- [Cuentas de usuario](/docs/es-ES/Uso/accounts)
- [Configuración del launcher](/docs/es-ES/Avanzado/config)
