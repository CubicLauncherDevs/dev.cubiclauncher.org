---
title: "Componentes de la wiki"
description: "Referencia de los componentes de markdown estilo Arch Wiki disponibles en CubicLauncher Docs."
---

# Componentes de la wiki

Esta página muestra todos los componentes de contenido disponibles para escribir artículos de la wiki, al estilo de [Arch Wiki](https://wiki.archlinux.org/) pero con el diseño de CubicLauncher.

## Callouts con icono

Los bloques de aviso aceptan un título opcional tras el tipo:

:::info Información
Este es un bloque de información con icono.
:::

:::tip Consejo
Los consejos aparecen en verde con una bombilla.
:::

:::warning Atención
Las advertencias usan amarillo con triángulo.
:::

:::danger Peligro
Los peligros usan rojo con rombo.
:::

## Artículos relacionados

La caja flotante de relacionados, como en Arch Wiki:

:::related
- [Instalación](/docs/es-ES/Comenzando/instalacion)
- [Java](/docs/es-ES/Uso/java)
- [Instancias](/docs/es-ES/Uso/instances)
:::

## Aviso de expansión

:::expansion
Este artículo es una plantilla. Puedes ayudar expandiendo el contenido.
:::

## Plantillas en línea

Código en línea con {{ic|pacman -Syu}}, teclas como {{kbd|Ctrl}} + {{kbd|K}}, y notas en línea: {{Note|esto es una nota}} o {{Tip|un consejo rápido}} o {{Warning|cuidado con esto}}.

## Bloques de consola

Bloque simple con {{bc|
$ echo "Hola mundo"
$ ls -la
}}

Bloque con cabecera (prompt o archivo) con {{hc|[usuario@cubic ~]$|
sudo pacman -S jre21-openjdk
}}

## Tablas con rejilla

| Atajo | Acción |
|-------|--------|
| {{kbd|Ctrl}} + {{kbd|K}} | Abrir búsqueda |
| {{kbd|Esc}} | Cerrar diálogo |

## Detalles plegables

:::details Más información
Contenido oculto que se expande al hacer clic.
:::
