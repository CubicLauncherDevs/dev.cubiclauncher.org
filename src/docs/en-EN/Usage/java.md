---
title: What is Java?
description: What is Java and why is it necessary to launch the game?
---

# Java?

What is Java and why is it necessary to launch the game?

Java is a programming language, not as common as others since it uses something called the JVM. The JVM is a program that handles launching programs made in Java, like Minecraft itself.

> And yes, Minecraft is called Minecraft Java Edition for that reason :v

## JVM?
As I mentioned before, to run Java programs you use a program called JVM. This comes in "kits" called JRE or Java Runtime Environment. This includes everything needed for the JVM to work, both JVM libraries and the Java standard library.

## How do I download it?
In Cubic you have two options for using Java. You can use a JRE managed by the launcher or you can also use an external JRE if you prefer. The thing about why I do this: Cubic does NOT automatically install the managed JRE, you have to go to the configuration section and download it.

### Where?
In the Java section of the configuration you can open the Java environments menu and download whichever you like.
<div class="docs-img-wrap">
  <img src="https://i.ibb.co/60thDTQw/java.png" alt=">_<" />
</div>

### Which versions should I download?
Generally: Java 8 for versions below 1.16.5, Java 17 for versions below 1.20.4, Java 21 for versions below 1.21.11 and Java 25 for versions above the aforementioned (1.21.11 for those without reading comprehension).

## JVM parameters

JVM parameters are options passed to Java when Minecraft starts. They let you adjust how the game runs, such as memory management, garbage collection, or Java system properties.

### Where do I configure them?

1. Open CubicLauncher's **Settings**.
2. Go to the **Java** section.
3. Find the **JVM parameters** option and enter the arguments you want to use, separated by spaces.

These parameters are used when the game starts, so if Minecraft is already running, close it and launch it again to apply the changes.

<div class="docs-img-wrap">
  <img src="jvm-arguments.png" alt="JVM parameter settings in CubicLauncher" />
</div>

### Parameters you can use in Minecraft

These examples work with HotSpot-based Java 8, 17, 21, and 25 distributions, such as Eclipse Temurin:

| Parameter | What does it do? |
| --- | --- |
| `-Xms1G` | Sets the initial Java heap size to 1 GiB. The heap stores the game's objects. |
| `-Xmx4G` | Limits the heap to 4 GiB. Minecraft can use additional memory outside this limit. |
| `-XX:+UseG1GC` | Selects G1 as the garbage collector, which frees memory that is no longer used. It is already the default in many modern Java installations. |
| `-XX:+ParallelRefProcEnabled` | Enables parallel reference processing during garbage collection; it can reduce the time spent on that task. |

For example, to use an initial heap of 1 GiB, a maximum of 4 GiB, and the G1 collector:

```text
-Xms1G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

If you already configured RAM through the launcher, omit `-Xms` and `-Xmx` from the parameters field to avoid duplicating those settings:

```text
-XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

You can replace `4G` with another limit based on your available memory and modpack requirements, leaving memory for the system and other programs. The `-Xms` value must be less than or equal to `-Xmx`. These settings do not guarantee higher FPS: results depend on your hardware, Java version, and mods.
