---
category: usage
order: 50
title: Migrating from other launchers
description: Import profiles from the official launcher, MultiMC/Prism/PolyMC/Pinecone/Freesm instances or X Minecraft Launcher (XMCL) without losing your data.
---

# Migrating from other launchers

You can migrate your existing installations without losing anything. CubicLauncher copies the data and leaves the source untouched.

## What can be migrated

- **Official launcher** — profiles that use `.minecraft`.
- **MultiMC and forks** — MultiMC, PolyMC, Prism Launcher, PineconeMC and Freesm Launcher.
- **X Minecraft Launcher (XMCL)** — instances registered in its data folder.

XMCL may have Bedrock instances or components Cubic cannot reinstall, such as OptiFine or LabyMod. Those cases appear as unsupported and are not copied.

## How to migrate

1. Open **Create instance → Local → Migrate**.
2. Choose the source: Official launcher, MultiMC (forks) or X Minecraft Launcher.
3. Click **Search installations** or **Choose folder**:
   - Official: the `.minecraft` folder with `launcher_profiles.json`.
   - MultiMC/Prism/PolyMC/Pinecone/Freesm: the launcher folder, its `instances` folder or a single instance.
   - XMCL: the data folder containing `instances.json` or the `instances` folder.
4. Select which instances or profiles you want to copy and review their versions.
5. Adjust the name each instance will have in Cubic if needed.
6. Confirm with **Migrate**. The wizard shows progress and a per-instance summary.

## What is copied and how

- Worlds, mods, resource packs, shader packs, game options, screenshots, servers and several mod configuration files.
- Official profiles that shared `.minecraft` get their own folder in Cubic, avoiding conflicts.
- Versions and loaders are installed from the launcher's download queue if needed.
- Accounts are always set up from CubicLauncher; tokens are not migrated.

The list of copied folders and files includes, among others: `mods`, `resourcepacks`, `shaderpacks`, `saves`, `screenshots`, `config`, `scripts`, `defaultconfigs`, `kubejs`, `options.txt`, `optionsof.txt`, `servers.dat`, `texturepacks`, `optionsshaders.txt`, JourneyMap maps and Xaero data.

## Compatibility and limits

- Fabric and its `Intermediary` are detected correctly; NeoForge too, through its arguments.
- MultiMC: published components are reinstalled; local changes to libraries or arguments are not copied.
- XMCL: Fabric, Forge, NeoForge and Quilt are detected. Memory and icon are migrated when available.
- Unknown components and base game patches appear as unsupported.
- Symbolic links inside the copied data are not supported.
- Account files, tokens and credentials are not migrated.

## Safe cancellation

You can cancel during the copy. Temporary files and the incomplete instance are deleted; instances that already finished are kept. Closing the wizard or changing tabs also cancels the pending migration.

## After migrating

- Review the version and loader of each instance.
- Wait for pending version and loader downloads to finish.
- Sign in with your accounts from CubicLauncher.
- If an instance does not start, check its console and see [Diagnostics and logs](/docs/en-EN/Usage/diagnostics).
