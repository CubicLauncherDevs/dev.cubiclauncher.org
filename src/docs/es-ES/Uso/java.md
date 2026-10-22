---
category: usage
order: 30
title: Qué es Java
description: Qué es Java, por qué es necesario para Minecraft, cómo gestiona CubicLauncher los JRE y cómo configurar la memoria y los argumentos JVM.
---

# Qué es Java

Java es un lenguaje de programación que se ejecuta sobre la **JVM** (Java Virtual Machine). Minecraft: Java Edition está escrito en Java, por lo que necesita una JVM para iniciarse.

## JRE y JVM

La JVM viene dentro de un **JRE** (Java Runtime Environment), que incluye la máquina virtual, las librerías de Java y todo lo necesario para ejecutar el juego.

CubicLauncher puede usar dos tipos de Java:

- **Gestionado**: el launcher descarga y administra el JRE.
- **Externo**: usás un Java que ya tenés instalado en el sistema.

:::info Java no se instala automáticamente
CubicLauncher no descarga un JRE gestionado hasta que vos lo pedís. Si no tenés Java instalado, abrí **Ajustes → Java** y descargá la versión que necesites.
:::

## Versiones de Java

CubicLauncher permite instalar y detectar Java 8, 17, 21 y 25.

Como guía general:

- Java 8 para versiones antiguas de Minecraft.
- Java 17 para versiones modernas que lo requieren.
- Java 21 para las versiones más recientes.
- Java 25 está disponible para versiones o loaders que lo soliciten.

La elección depende de lo que declare la versión del juego, del loader y de los overrides de la instancia. El launcher consulta el manifiesto y, si no hay una versión explícita, infiere una según la versión de Minecraft. Para Forge/NeoForge antiguos puede mantener Java 8; para versiones recientes eleva automáticamente a Java 17 o 21 cuando el loader lo requiere.

## Proveedores de Java

En **Ajustes → Java** podés elegir el proveedor para cada versión:

- **Azul Zulu** — opción por defecto, equilibrada y disponible para Java 8, 17, 21 y 25.
- **Eclipse Temurin** — distribución de Eclipse, referencia de OpenJDK.
- **BellSoft Liberica** — compilaciones con soporte a largo plazo.
- **GraalVM** — suele ir más rápido con mods; disponible para Java 17 o superior.

La opción **Automático** usa Azul Zulu y Eclipse Temurin según su disponibilidad. Si cambiás el proveedor de un JRE ya instalado, el launcher puede pedirte que lo desinstales y lo vuelvas a instalar.

## Dónde se guardan los JRE gestionados

Los JRE gestionados se guardan dentro de la carpeta compartida, en `runtimes/jre<version>`. Por defecto es `~/.cubic/shared/runtimes/`, pero si cambiás la ubicación de los archivos compartidos desde **Ajustes → Almacenamiento**, también cambia la ruta de los runtimes.

## Detección de Java externo

En **Ajustes → Java** podés usar **Detectar rutas**. El launcher busca binarios en `JAVA_HOME` y en ubicaciones comunes del sistema, y muestra las rutas encontradas para Java 8, 17, 21 y 25. También podés indicar una ruta manual.

## Java por instancia

Cada instancia puede usar una versión de Java distinta desde su editor:

- Si la instancia no tiene overrides, se usa la configuración global.
- Si activás la configuración personalizada, podés elegir la versión de Java y los argumentos JVM propios.
- Los argumentos de la instancia se añaden después de los globales.

## Parámetros de la JVM

Los parámetros de la JVM son opciones que se le pasan a Java al iniciar Minecraft. Permiten ajustar la memoria, el recolector de basura o propiedades del sistema.

### Dónde se configuran

1. Abrí la **Configuración** de CubicLauncher.
2. Entrá en **Java**.
3. Buscá **Argumentos JVM** e ingresá los argumentos separados por espacios o saltos de línea.

Si Minecraft ya está abierto, cerralo y volvé a abrirlo para aplicar los cambios. También podés definir argumentos JVM por instancia desde el editor de la instancia.

<div class="docs-img-wrap">
  <img src="/jvm-arguments.png" alt="Configuración de los parámetros de la JVM en CubicLauncher" />
</div>

### Parámetros habituales

Estos ejemplos funcionan con distribuciones HotSpot de Java 8, 17, 21 y 25, como Eclipse Temurin:

| Parámetro | ¿Para qué sirve? |
| --- | --- |
| `-Xms1G` | Establece en 1 GiB la memoria inicial del heap de Java, donde se almacenan los objetos del juego. |
| `-Xmx4G` | Limita el heap a 4 GiB. Minecraft puede consumir memoria adicional fuera de ese límite. |
| `-XX:+UseG1GC` | Selecciona G1 como recolector de basura, encargado de liberar memoria que ya no se usa. Ya es el predeterminado en muchas instalaciones modernas de Java. |
| `-XX:+ParallelRefProcEnabled` | Activa el procesamiento paralelo de referencias durante la recolección de basura; puede reducir el tiempo dedicado a esa tarea. |

Por ejemplo, para usar un heap inicial de 1 GiB, un máximo de 4 GiB y el recolector G1:

```text
-Xms1G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

Si ya configuraste la RAM desde el launcher, omití `-Xms` y `-Xmx` del campo de parámetros para no duplicar esos ajustes:

```text
-XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

Podés cambiar `4G` por otro límite según la memoria disponible y los requisitos de tu modpack, dejando memoria para el sistema y otros programas. El valor de `-Xms` debe ser menor o igual al de `-Xmx`. Estos ajustes no garantizan más FPS: el resultado depende de tu equipo, la versión de Java y los mods.

## Variables de entorno de Java

En **Ajustes → Java → Variables de entorno** podés definir variables que se aplicarán al lanzar Minecraft. Usalas solo si un mod, un loader o una guía específica lo requiere.

## Memoria recomendada

Desde **Ajustes → Minecraft** podés ver un rango recomendado según tu RAM total. Como guía general:

- 4 GB o menos: 2 GB para Minecraft.
- 8 GB: entre 3 y 4 GB.
- 16 GB o más: entre 4 y 8 GB, según mods y shaders.

Recordá que el sistema y otras apps también necesitan memoria. La memoria global se configura en **Ajustes → Minecraft → Rendimiento (RAM)** y se puede sobrescribir por instancia.
