---
category: content
order: 20
title: Mods
description: Manage Minecraft mods from the Market, with support for Modrinth, CurseForge and already installed mods.
---

# Mods

**Mods** are modifications that alter or add content to Minecraft. CubicLauncher manages them from the **Market**, an integrated view that also lets you search for resource packs and shader packs.

## Requirements

To use the mods section you need an **instance** with a compatible loader:

- Fabric
- Forge
- NeoForge
- Quilt

If your instance is Vanilla or OptiFine, the mods section is not available. Resource packs and shaders can still be managed from their own sections.

## Access the Market

1. Select an instance with a compatible loader.
2. In the instance view, choose **Market**.
3. Choose the provider: **Modrinth**, **CurseForge** or **Local**.

You can also open the Market from the **Resources** and **Shaders** sections to search only for those content types.

<div class="docs-img-wrap">
  <img src="https://i.ibb.co/0yzDqtYW/imagen.png" alt="Launcher UI" />
</div>

## Providers

:::info Online providers
They let you search and download content directly from the internet.
:::

- **Modrinth** — search mods by name, category, version and loader.
- **CurseForge** — access the CurseForge catalog from the launcher.
- **Local** — shows the already installed mods, with their origin and status.

## Install and update

- For mods, the install button shows dependencies and conflicts before confirming.
- You can **double-click the card** to install faster.
- If the mod is already installed, the card indicates it and offers to update it when a new version exists.
- Mods from a modpack may appear as protected; unlock the pack before modifying them.

## Enable and disable

- An active mod uses the `.jar` extension.
- Disabling it renames it to `.jar.disabled` without deleting the file.
- You can enable it again from the same list.

## Compatibility

By default the Market shows only versions compatible with your instance's Minecraft version and loader. If a mod is not compatible, it appears marked before you try to install it.

## More information

See [Content and Marketplace](/docs/en-EN/Usage/marketplace) for providers, filters, resource packs, shaders and modpack updates.
