---
category: usage
order: 40
title: Launcher configuration
description: Guide to all CubicLauncher Settings sections: storage, interface, notifications, Minecraft, downloads, console, Java and updates.
---

# Launcher configuration

Settings open from the gear icon in the sidebar and are organized into four tabs: **Launcher**, **Minecraft**, **Customize** and **Java**. Changes are saved automatically.

## Launcher tab

### General

- **Language** — changes the interface language. Spanish, English, French, German, Ukrainian, Japanese and Russian are available.
- **Check for updates on startup** — checks for a new version when opening the launcher.
- **Discord presence** — shows CubicLauncher activity on Discord.
- **Hide the launcher while playing** — minimizes or hides the window when Minecraft starts.
- **Open the console when starting instances** — opens the log window when launching an instance.
- **Prominent notifications** — uses large, centered notices with uppercase titles and more legible messages.
- **Test notification** — shows a preview of the current notifications.

### Storage

Lets you choose which disk stores instances and shared files:

- **Instances location** — shows the current path and how many instances exist. You can change it or reset the default location.
- **Move with hardlinks** — if the target disk allows it, instances are moved without duplicating space. If the target is on another disk, the data is copied.
- **The source is only deleted** once every instance is complete in the new location. If something fails, the launcher shows which files could not be moved.
- **Shared files** — shows the space used by versions, libraries, assets and runtimes. You can change the location, reset it or delete all the content.
- Deleting shared files does not touch your worlds or settings: versions and libraries are downloaded again when you launch an instance.
- The new shared files folder must be empty. Close Minecraft and wait for downloads to finish before changing these paths.

The configuration is stored in `settings.cub`, and custom paths are read when the launcher starts.

### Themes

- Shows the active theme.
- **Import theme** — loads a ZIP or `.cbth`.
- **Browse themes** — opens the web theme catalog.
- **Export** — saves the active theme to share it.
- **Delete** — removes a user-installed theme.

### Performance

- **Reduce interface animations**.
- **Disable blur effects**.
- **Disable continuous loading animations**.
- **Disable the 3D skin viewer animation**.
- **Reduce log animations**.

These options help on modest hardware or if you prefer a more restrained interface.

### Updates

- Shows the current version and whether an update is available.
- **Update channel** — Stable or Pre-release.
- Lets you check for updates, view release notes, download and install.
- The date of the last successful check appears in this section.

### About

Includes links to Discord, the open-source code and issue reporting.

## Minecraft tab

### Performance (RAM)

- **Minimum** and **maximum** memory in GB.
- **Use recommended RAM** calculates a range based on the computer's total memory.
- Global memory is used when an instance has no overrides.

### Minecraft options

- **Show Snapshots**.
- **Show Alpha versions**.
- **Show unstable loader versions**.

These options affect the versions shown in the downloader and when creating instances.

### Download provider

- **Official (Mojang)** — official servers; recommended outside China.
- **BMCLAPI (China)** — mirror for players in China with slow downloads. If the mirror fails, the launcher uses the official servers as a fallback.

The provider applies to metadata, assets, libraries and to installing Forge, NeoForge, Fabric and OptiFine.

### Console options

- **History limit** — lines kept per instance (100 to 5000).
- **Show level tags** — useful for filtering logs. Hiding them is not recommended.

### options.txt profiles

- Create, edit, import and delete `options.txt` profiles.
- Assign a profile to an instance from its editor.
- Apply the profile manually or automatically before launching.
- When replacing an existing `options.txt`, a backup is saved.

:::warning Experimental feature
`options.txt` profiles may change in future versions. Applying a profile automatically replaces the instance file; changes made inside the game will be lost on the next launch.
:::

## Customize tab

### Interface

- **Interface scale** — changes the size of the whole window. 100% is the original size.
- **Density** — Theme, Compact or Comfortable. Adjusts the spacing between cards, lists and options without changing the font.
- **Font** — Theme or one of the fonts included in the launcher.
- **Reset interface** — returns to the default values.

### Notifications

- Enable or disable notification customization.
- **Position** — six screen corners or edges.
- **Box size** — Compact, Normal or Wide.
- **Title size** and **message size**.
- **Duration** — applies to temporary notices; downloads remain visible until they finish.
- **Uppercase title** and **bold title**.
- **Reset notifications** and preview.

## Java tab

### Java runtimes

For Java 8, 17, 21 and 25:

- See whether the JRE is installed and which version it has.
- Choose the **provider**: Automatic, Azul Zulu, Eclipse Temurin, BellSoft Liberica or GraalVM.
- **Install** or **uninstall** the managed JRE.
- **Detect paths** to find external Java installations.
- Enter manual paths for each version.

Managed JREs are stored in the shared folder (`shared/runtimes/jre<version>`).

### Advanced

- **JVM arguments** — applied globally when launching Minecraft.
- **Environment variables** — added to the Java process. Use them only if a guide or a mod requires it.

Instance arguments and variables are appended after the global ones. See [What is Java](/docs/en-EN/Usage/java) for parameter examples.

## Resetting settings

Each section has its own reset button where applicable. If you need a clean configuration, also review the storage paths and Java profiles before deleting data.
