---
category: usage
order: 30
title: What is Java?
description: What Java is, why Minecraft needs it, how CubicLauncher manages JREs, and how to configure memory and JVM arguments.
---

# What is Java

Java is a programming language that runs on the **JVM** (Java Virtual Machine). Minecraft: Java Edition is written in Java, so it needs a JVM to start.

## JRE and JVM

The JVM comes inside a **JRE** (Java Runtime Environment), which includes the virtual machine, the Java libraries and everything needed to run the game.

CubicLauncher can use two kinds of Java:

- **Managed**: the launcher downloads and manages the JRE.
- **External**: you use a Java already installed on your system.

:::info Java is not installed automatically
CubicLauncher does not download a managed JRE until you ask it to. If you don't have Java installed, open **Settings → Java** and download the version you need.
:::

## Java versions

CubicLauncher can install and detect Java 8, 17, 21 and 25.

As a general guide:

- Java 8 for old Minecraft versions.
- Java 17 for modern versions that require it.
- Java 21 for the most recent versions.
- Java 25 is available for versions or loaders that request it.

The choice depends on what the game version, the loader and the instance overrides declare. The launcher checks the manifest and, if there is no explicit version, infers one from the Minecraft version. For old Forge/NeoForge it may keep Java 8; for recent versions it automatically raises to Java 17 or 21 when the loader requires it.

## Java providers

In **Settings → Java** you can choose the provider for each version:

- **Azul Zulu** — the default, balanced and available for Java 8, 17, 21 and 25.
- **Eclipse Temurin** — Eclipse's distribution and an OpenJDK reference.
- **BellSoft Liberica** — long-term support builds.
- **GraalVM** — often faster with mods; available for Java 17 or higher.

The **Automatic** option uses Azul Zulu and Eclipse Temurin depending on availability. If you change the provider of an already installed JRE, the launcher may ask you to uninstall and reinstall it.

## Where managed JREs are stored

Managed JREs are stored inside the shared folder, under `runtimes/jre<version>`. By default this is `~/.cubic/shared/runtimes/`, but if you change the shared files location from **Settings → Storage**, the runtimes path changes too.

## External Java detection

In **Settings → Java** you can use **Detect paths**. The launcher looks for binaries in `JAVA_HOME` and common system locations, and shows the paths found for Java 8, 17, 21 and 25. You can also enter a manual path.

## Per-instance Java

Each instance can use a different Java version from its editor:

- If the instance has no overrides, the global configuration is used.
- If you enable the custom configuration, you can choose the Java version and its own JVM arguments.
- Instance arguments are appended after the global ones.

## JVM parameters

JVM parameters are options passed to Java when Minecraft starts. They let you adjust memory, the garbage collector or system properties.

### Where to configure them

1. Open CubicLauncher's **Settings**.
2. Go to **Java**.
3. Find **JVM arguments** and enter the arguments separated by spaces or line breaks.

If Minecraft is already open, close it and open it again to apply the changes. You can also define per-instance JVM arguments from the instance editor.

<div class="docs-img-wrap">
  <img src="/jvm-arguments.png" alt="JVM parameter configuration in CubicLauncher" />
</div>

### Common parameters

These examples work with HotSpot distributions of Java 8, 17, 21 and 25, such as Eclipse Temurin:

| Parameter | What it is for |
| --- | --- |
| `-Xms1G` | Sets the initial Java heap memory to 1 GiB, where the game objects are stored. |
| `-Xmx4G` | Limits the heap to 4 GiB. Minecraft can consume additional memory outside that limit. |
| `-XX:+UseG1GC` | Selects G1 as the garbage collector, in charge of freeing unused memory. It is already the default in many modern Java installations. |
| `-XX:+ParallelRefProcEnabled` | Enables parallel reference processing during garbage collection; it can reduce the time spent on that task. |

For example, to use an initial heap of 1 GiB, a maximum of 4 GiB and the G1 collector:

```text
-Xms1G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

If you already configured RAM from the launcher, leave out `-Xms` and `-Xmx` from the parameters field to avoid duplicating those settings:

```text
-XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

You can change `4G` to another limit according to your available memory and your modpack requirements, leaving memory for the system and other programs. The `-Xms` value must be less than or equal to `-Xmx`. These settings do not guarantee more FPS: the result depends on your hardware, the Java version and the mods.

## Java environment variables

In **Settings → Java → Environment variables** you can define variables that will be applied when launching Minecraft. Use them only if a mod, a loader or a specific guide requires it.

## Recommended memory

From **Settings → Minecraft** you can see a recommended range based on your total RAM. As a general guide:

- 4 GB or less: 2 GB for Minecraft.
- 8 GB: between 3 and 4 GB.
- 16 GB or more: between 4 and 8 GB, depending on mods and shaders.

Remember that the system and other apps also need memory. Global memory is configured in **Settings → Minecraft → Performance (RAM)** and can be overridden per instance.
