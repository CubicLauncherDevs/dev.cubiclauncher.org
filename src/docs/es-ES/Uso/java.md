---
title: Que es Java?
description: Que es Java y por que es necesario para lanzar el juego?
---

# Java?

Que es Java y por que es necesario para lanzar el juego?

Java es un lenguaje de programacion, este no es tan comun como otros ya que usa algo llamado JVM, la JVM es un programa que se encarga de lanzar programas hechos en Java, como el mismo minecraft.

> Y si, Minecraft se llama Minecraft Java Edition por eso :v


## JVM?
Como te dije antes para lanzar programas en Java se usa un programa llamado JVM, este viene en unos "kits" denominados JRE o Java Runtime Environment, o Entorno de Ejecucion de Java, esto trae todas las cosas necesarias para que ademas la JVM funcione, tanto librerias de la JVM o hasta la libreria estadar de java.

## Como lo descargo?
En Cubic tenes dos opciones para usar Java, podes usar un JRE administrado por el launcher o tambien podes usar un JRE externo si gustas, el tema de por que hago esto, Cubic NO instala automaticamente el JRE administrado, tenes que ir al apartado de configuracion y descargarlo

### Donde?
En el apartado de Java de la configuracion podes abrir el menu de entornos de Java y descargar los que gustes.
<div class="docs-img-wrap">
  <img src="https://i.ibb.co/60thDTQw/java.png" alt=">_<" />
</div>

### Que versiones descargo?
Lo general es java 8 para versiones inferiores a 1.16.5, java 17 para versiones inferiores a 1.20.4, java 21 para versiones inferiores a 1.21.11 y java 25 para versiones superiores a la mencionada anteriormente (1.21.11 para los que no tienen comprension lectora)

## Parámetros de la JVM

Los parámetros de la JVM son opciones que se le pasan a Java al iniciar Minecraft. Permiten ajustar cómo se ejecuta el juego, por ejemplo, el manejo de memoria, el recolector de basura o las propiedades del sistema de Java.

### ¿Dónde se configuran?

1. Abrí la **Configuración** de CubicLauncher.
2. Entrá en el apartado **Java**.
3. Buscá la opción de **parámetros de la JVM** e ingresá los argumentos que quieras usar, separados por espacios.

Estos parámetros se usan al iniciar el juego, así que si Minecraft ya está abierto tenés que cerrarlo y volver a lanzarlo para aplicar los cambios.

<div class="docs-img-wrap">
  <img src="/jvm-arguments.png" alt="Configuración de los parámetros de la JVM en CubicLauncher" />
</div>


### Parámetros que podés usar en Minecraft

Estos ejemplos funcionan con Java 8, 17, 21 y 25 basados en HotSpot, como Eclipse Temurin:

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
