---
category: content
order: 10
title: Content and Marketplace
description: Install mods, resource packs, shader packs and modpacks from Modrinth and CurseForge, and update your modpacks from the launcher.
---

# Content and Marketplace

The Market integrates providers to search for and install content directly from the launcher. It opens from the **Market**, **Resources** and **Shaders** sections of each instance.

## Providers

- **Modrinth**: search mods, resource packs and shader packs, with filters by version and loader.
- **CurseForge**: search mods, modpacks, texture packs and shaders.
- **Local**: shows the content already installed in your instance.

## Content types

| Section | Content | Availability |
| --- | --- | --- |
| Market | Mods | Instances with Fabric, Forge, NeoForge or Quilt |
| Resources | Resource packs / texture packs | All instances |
| Shaders | Shader packs | All instances except Vanilla |

On very old Minecraft versions, resource packs are stored in the `texturepacks` folder instead of `resourcepacks`. The launcher detects the correct folder based on the version.

## Automatic compatibility

The Market filters by your instance's Minecraft version and loader. If there is no compatible version, it tells you before installing.

## Install from the catalog

- For **mods**, the install button opens a preview with the dependency tree and detected conflicts. You can review what will be downloaded before confirming.
- For **resource packs** and **shaders**, installation happens directly from the card.
- In all cases you can **double-click the card** to install without opening the details.
- If it is already installed, the card indicates it and allows updating when a new version exists.

## Filters and sorting

The filter panel lets you search by name, category, loader, source and local status. You can also sort by relevance, name, downloads or date, and switch between Modrinth, CurseForge and Local.

## Mods and dependencies

- Mods are installed with their required dependencies.
- If a mod is already installed, the Market avoids duplicating it.
- You can enable or disable mods without deleting them: they are renamed to `.jar.disabled`.
- The **Local** view shows installed mods, their origin and whether they belong to a modpack.

## Modpacks (MRPack and CurseForge)

- Import a Modrinth `.mrpack` or a CurseForge ZIP.
- The launcher resolves dependencies and downloads the correct versions.
- You can see a plan before installing and cancel if you are not convinced.
- The modpack chip in the instance header lets you protect the pack, update it and recover the original inventory.

### Update a modpack

Modpack updates are **experimental**. From the modpack chip:

1. Choose **Update modpack**.
2. Select a published version or a local file (`.mrpack` / `.zip`).
3. Review added, removed and modified files.
4. Resolve conflicts by keeping your file or using the pack's file.
5. Apply the update.

If the pack is protected, you must unlock it first to modify its mods.

## Where it is stored

Each instance keeps its own `mods/`, `resourcepacks/` or `texturepacks/` and `shaderpacks/` folder. Game versions and libraries are shared in the `shared` folder, which by default is `~/.cubic/shared/` and can be changed from **Settings → Storage**.

## Troubleshooting

- If the Market does not appear, check that the instance has a compatible loader.
- If a mod does not appear, try changing the version, loader or source in the filters.
- If content does not install, check the download queue and the instance console. See [Diagnostics and logs](/docs/en-EN/Usage/diagnostics).
