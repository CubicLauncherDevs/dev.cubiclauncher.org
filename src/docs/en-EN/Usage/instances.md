---
category: usage
order: 20
title: Instances
description: How to create, organize and manage isolated Minecraft instances, each with its own content, worlds, servers and configuration.
---

# Instances

An **instance** is a self-contained directory with its own copy of Minecraft, mods, resource packs, shader packs, screenshots, worlds and configuration. Each instance represents a specific combination of Minecraft version and mod loader.

## Disk structure

By default, instances live inside `.cubic/instances/`. Each instance is a folder named the way you chose:

```
.cubic/
├── instances/
│   └── My Instance/
│       ├── instance.cub        ← instance metadata
│       ├── mods/               ← mods (.jar / .jar.disabled)
│       ├── resourcepacks/      ← resource packs
│       ├── shaderpacks/        ← shader packs
│       ├── saves/              ← worlds
│       ├── screenshots/        ← screenshots
│       └── ...                 ← Minecraft runtime files
└── shared/                     ← shared versions, libraries, assets and Java
```

The `instance.cub` file stores metadata in JSON. Among other fields, it includes the name, version, icon, optional memory, the assigned `options.txt` profile and whether it is applied automatically on launch:

```jsonc
{
  "name": "My Instance",
  "version": "1.21-fabric",
  "last_played": 1717000000,
  "playtime_seconds": 3600,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "icon": "/images/instances/fabric.png",
  "cover_image": null,
  "min_memory": null,
  "max_memory": null,
  "pinned": false,
  "options_profile_id": null,
  "auto_apply_options": false
}
```

The `instances` and `shared` paths can be changed from **Settings → Storage**. When moving instances, the launcher uses hardlinks if the target disk allows it; otherwise it copies the data. Shared files can be cleared and are downloaded again when you launch an instance.

## Create an instance

1. Click **"Create Instance"** in the sidebar.
2. Choose a **name** of up to 24 ASCII characters.
3. Select a **version** from the already downloaded ones (if the one you want is missing, download it first from the downloads button).
4. Choose an **icon** and, optionally, a cover image.
5. Press **Create**.

You can also create an instance from a Modrinth or CurseForge modpack, import an `.mrpack`/ZIP, or migrate an existing installation from **Create instance → Local**.

> The version determines the loader automatically: if the ID contains `fabric` it is detected as Fabric, `forge` as Forge, `neoforge` as NeoForge, `quilt` as Quilt, and if none match it is treated as Vanilla.

## The instance view

Selecting an instance opens its main panel with:

- **Hero** — banner with name, icon, version, loader, playtime and current status.
- **"Play" button** — launches Minecraft with this instance.
- **Status bar** — shows the real-time status: Off, Starting, Started or Error.
- **Modpack chip** — if the instance comes from a modpack, shows its version and actions to protect it, update it or recover the inventory.

### Details tab

Shows the instance's general information:

- Version and loader badges (Vanilla, Fabric, Forge, NeoForge, Quilt).
- Disk path with a button to open the folder.
- Shortcuts to the mods, screenshots, resource packs and shader packs folders.
- Live console with Minecraft output and autoscroll.
- **"Force close"** button if the instance is running.

### Mod Market

Lists, searches and installs mods from Modrinth and CurseForge, or manages the already installed ones from the **Local** source. You can enable or disable mods (renames `.jar` ↔ `.jar.disabled`) and see which mods belong to the modpack.

It is only available if the instance uses a mod loader. Vanilla and OptiFine instances do not show this section.

### Resources and shaders

The **Resources** and **Shaders** tabs use the same Market, but limited to resource packs or shader packs. You can search for compatible content, install it and manage local files.

Shader packs are not available on Vanilla instances.

### Worlds and servers

Each instance has its own world and server list. From these sections you can open the `saves/` folder, add servers, check their status and connect with Quick Play. See [Servers and worlds](/docs/en-EN/Usage/servers-worlds).

### Screenshots

Gallery of screenshots taken inside the instance:

- Thumbnail preview.
- Lightbox viewer on click.
- Delete screenshots.

## Lifecycle

```
Off ──► Starting ──► Started ──► Off
 │         │            │
 │         │            │
 └────► Error ◄─────────┘
```

- **Off** — the instance is not running.
- **Starting** — the launcher is preparing and launching Minecraft.
- **Started** — Minecraft is running.
- **Error** — an error occurred while starting (missing version, wrong Java, etc.).

A normal game exit is not reported as a crash. If the process ends unexpectedly, the launcher keeps the log history and opens the console window so you can review it. See [Diagnostics and logs](/docs/en-EN/Usage/diagnostics).

## Manage instances

From the sidebar or the instance menu you can:

- **Rename** — changes the name and the folder on disk.
- **Delete** — removes the instance and all its content.
- **Open folder** — accesses the instance directory directly.
- **Pin** — places the instance at the top of the list.
- **Export** — generates an `.mrpack` with the selected content.
- **Import** — restores an instance from a compatible ZIP with a preview before confirming.

### Instance editor

The editor lets you change the version and loader, repair the installation, adjust the instance's own memory and JVM arguments, and assign an `options.txt` profile.

:::warning Changing version or loader
Changing the version or loader can damage the installation and make mods stop working. The launcher shows a warning before applying the change.
:::

## options.txt profiles

Profiles store the contents of an `options.txt` and can be applied to any instance, manually or before launching. This feature is **experimental**.

- They are managed from **Settings → Minecraft → options.txt profiles**.
- In each instance's editor you choose the profile and whether it is applied automatically on launch.
- If the instance already has an `options.txt`, a backup is saved before replacing it.
- When a profile is applied automatically, changes you make inside the game are lost on the next launch.
- You can also import an `options.txt` from a file or save the current options of an instance as a profile.

## Modpacks

- Import a Modrinth `.mrpack` or a CurseForge ZIP.
- The launcher resolves dependencies and downloads the correct versions.
- You can see a plan before installing and cancel if you are not convinced.
- The modpack chip lets you **protect** the pack to avoid accidental changes, **update** it from a published version or a local file, and review conflicts before applying.
- If the original inventory is missing, the chip offers **recover inventory** to identify the pack's mods.

Modpack updates are **experimental**.

## Download versions

Use the downloads button in the sidebar to open the **Version Downloader**. There you can download:

- Vanilla versions (release and snapshot).
- Alpha/Beta versions.
- Fabric, Forge, NeoForge, Quilt and OptiFine.

Downloaded versions are stored in the `shared` folder and shared across all instances. From **Settings → Minecraft** you can choose whether snapshots, Alpha versions and unstable loader versions are shown.

## RAM memory

Global memory is configured from **Settings → Minecraft → Performance (RAM)**. The launcher shows a recommended range based on your total RAM.

Each instance can override memory from its editor if you enable the custom configuration. If there are no overrides, the global values are used.
