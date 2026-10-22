---
category: troubleshooting
order: 20
title: Diagnostics and logs
description: Use the integrated console, log history, sensitive-data cleaning and mclo.gs upload to diagnose issues.
---

# Diagnostics and logs

The integrated console helps you understand what happens when the game starts or if something fails.

## Console and log window

- Each instance has a live console with autoscroll.
- The actions menu lets you open the log window, copy the contents or upload it to mclo.gs.
- The log window keeps the session history and lets you filter by level.
- The menu is the same in the instance view and in the dedicated window, so actions don't change depending on where you are.

## Console options

In **Settings → Minecraft → Console options** you can configure:

- **History limit** — maximum number of lines kept per instance (100 to 5000). The default is 3000.
- **Show level tags** — shows or hides log level tags. Hiding them makes filtering by level harder and is not recommended.

## Preview in the main view

While an instance is starting or running, the header shows the last relevant log line as a preview.

## Normal exits and crashes

- A normal game exit is not reported as a crash.
- If the process ends unexpectedly, the launcher detects the crash and opens the console with the history.
- The crash history is kept for **1 hour** so you can review it or upload it even after the window has closed.
- If you force close from the launcher or the process stops due to a controlled action, no crash is generated.

## Privacy: sensitive-data cleaning

The launcher automatically cleans sensitive information before showing or saving logs:

- Access/refresh tokens, ClientToken and Authorization headers.
- Session IDs, email addresses and IP addresses.
- Data specific to the active user (username, UUID, tokens) with a dedicated filter.

## Upload to mclo.gs

Use the **Upload** action from the log menu to generate a public link on mclo.gs and share it with support. It is ideal for reporting issues with the full log.

## Reporting a problem

If CubicLauncher does not even show the interface on Linux, see [Graphics issues on Linux: NVIDIA and Wayland](/docs/en-EN/guides/nvidia-wayland). The guide includes how to capture terminal output and test `WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher`; you do not need to start Minecraft to investigate a launcher window failure.

Include in your report:

- CubicLauncher and operating system version.
- Steps to reproduce the problem.
- Link to the log on mclo.gs and, if applicable, the modpack used.
- If the problem occurs on startup, the Minecraft version, the loader and the selected Java.
