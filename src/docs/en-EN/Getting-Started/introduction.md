---
category: getting-started
order: 10
title: Introduction to CubicLauncher
description: What CubicLauncher is, what it can do and how to get started in a few minutes.
---

# Introduction

CubicLauncher is an open-source launcher for Minecraft: Java Edition. It lets you create and manage isolated instances, install versions and loaders, manage accounts, download content from Modrinth and CurseForge, and customize the look with themes.

## Key features

- Independent instances with their own configuration, mods, resource packs, shader packs, screenshots, worlds and servers.
- Support for Vanilla, Fabric, Forge, Quilt and NeoForge.
- Microsoft, Ely.by, CubicAuth, custom Yggdrasil/Authlib servers and offline mode accounts.
- Content from Modrinth and CurseForge: mods, resource packs, shader packs and modpacks.
- Per-instance world and server management, with ping and Quick Play.
- Skins and capes, skin closet and automatic classic/slim model detection.
- Java managed by the launcher or external, with Azul Zulu, Eclipse Temurin, BellSoft Liberica and GraalVM providers.
- Integrated console with history, sensitive-data cleaning and mclo.gs upload.
- Themes (v1 JSON and v2 CBTH), backgrounds, icons and custom fonts.
- Interface available in Spanish, English, French, German, Ukrainian, Japanese and Russian.

## Where my data is stored

By default, data lives in your user folder under `.cubic`:

```
~/.cubic/
├── instances/   # Instances and their content
├── shared/      # Shared versions, libraries, assets and Java runtimes
├── settings/    # Launcher configuration (settings.cub)
├── themes/      # Installed themes
└── skins/       # Skin closet
```

The `instances` and `shared` folders can be moved to another disk from **Settings → Storage**. The launcher moves instances with hardlinks when possible and lets you clear shared files to free space; versions and libraries are downloaded again when needed.

## Quick start

1. Install the launcher by following the [Installation](/docs/en-EN/Getting-Started/install) guide.
2. Open CubicLauncher and download the game version you want.
3. Create an instance with that version and, optionally, choose a loader.
4. Sign in with Microsoft, Ely.by/CubicAuth, a custom Yggdrasil server, or use offline mode.
5. Open the Market to install mods, resource packs or shaders, or import a modpack.
6. Adjust RAM, Java, interface and notifications from **Settings**.

## Quick links

- [Installation](/docs/en-EN/Getting-Started/install)
- [Instances](/docs/en-EN/Usage/instances)
- [Content and Marketplace](/docs/en-EN/Usage/marketplace)
- [User accounts](/docs/en-EN/Usage/accounts)
- [Launcher configuration](/docs/en-EN/Advanced/config)
