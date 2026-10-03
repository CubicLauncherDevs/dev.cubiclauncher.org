---
category: troubleshooting
order: 30
title: Linux graphics issues: NVIDIA and Wayland
description: Blank windows, flickering and CubicLauncher crashes with NVIDIA and Wayland. Using WEBKIT_DISABLE_COMPOSITING_MODE=1 and WebKitGTK alternatives.
---

# Linux graphics issues: NVIDIA and Wayland

On Linux, CubicLauncher uses Tauri and WebKitGTK to display its interface. Some combinations of WebKitGTK, the NVIDIA driver and the compositor can cause blank windows, flickering or crashes. These issues can also occur on X11; using NVIDIA or Wayland does not automatically mean you need a workaround.

Other languages: [Español](/docs/es-ES/guias/nvidia-wayland) · [Français](/docs/fr-FR/guides/nvidia-wayland).

## Quick workaround reported for CubicLauncher

If the launcher fails to render its window, close it completely, including the system tray, and run:

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher
```

A CubicLauncher user running NVIDIA and Wayland reported that this command resolved their issue. The [official Tauri guide to Linux graphics issues](https://v2.tauri.app/develop/debug/linux-graphics/) also documents this variable as a last resort, particularly for crashes when resizing. The exact driver and compositor versions for that report are unavailable, so it does not establish a list of affected systems.

For an AppImage, replace the example filename with your own:

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 ./CubicLauncher.AppImage
```

:::info What changes
This variable disables WebKitGTK accelerated compositing. It may make the interface less smooth and increase CPU work. It does not itself disable Minecraft's graphics acceleration: the game has its own rendering engine. It applies to this launch and is not saved as a preference.
:::

## Common symptoms

- The window opens but remains white or blank.
- The interface flickers, particularly when resizing.
- The application exits when resized, sometimes without a clear error message.
- The terminal displays errors such as:

```text
AcceleratedSurfaceDMABuf was unable to construct a complete framebuffer
Gdk-Message: Error 71 (Protocol error) dispatching to Wayland display.
```

Tauri attributes many of these failures to graphics buffer exchange between WebKitGTK and the driver. A blank window does not identify a single cause: historical WebKit reports include different failures with similar symptoms.

## Diagnosis and alternatives

Try one option at a time and close CubicLauncher completely between tests. The commands below assume you have not already exported these settings; if you have, remove them before comparing results. Use the least restrictive workaround that solves your issue.

### 1. Update and check your environment

Update CubicLauncher, WebKitGTK and the NVIDIA driver through your distribution's supported mechanisms. Restart if the kernel or driver was updated. On Arch, perform a full system upgrade and see the [installation guide](/docs/en-EN/guides/arch).

To identify the session and driver:

```bash
printenv XDG_SESSION_TYPE XDG_CURRENT_DESKTOP
nvidia-smi
```

`XDG_SESSION_TYPE` usually reports `wayland` or `x11`. If it is empty, check the session in your desktop environment. On hybrid systems, `nvidia-smi` alone does not establish which GPU renders the launcher window.

Tauri also recommends checking NVIDIA kernel mode setting (KMS):

```bash
cat /sys/module/nvidia_drm/parameters/modeset
```

`Y` means enabled; `N` means disabled. If the file is missing, check which driver is loaded. If reading it requires permission, you can inspect the same file with `sudo cat`. When KMS is disabled, follow your distribution's instructions to enable it; Tauri mentions `nvidia_drm.modeset=1`, especially for older drivers. There is no need to add that parameter if KMS is already enabled.

### 2. Try disabling NVIDIA explicit synchronization

For some Wayland errors, particularly `Error 71`, Tauri suggests:

```bash
__NV_DISABLE_EXPLICIT_SYNC=1 cubiclauncher
```

This changes the driver's synchronization behavior without disabling WebKit accelerated compositing. Its effectiveness depends on the driver and compositor.

### 3. Try disabling the DMA-BUF renderer

For framebuffer errors, blank windows or when the previous test does not help:

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 cubiclauncher
```

This avoids WebKitGTK's DMA-BUF rendering path. It may sacrifice a faster path, but it is not equivalent to disabling all accelerated compositing. Both Tauri and WebKitGTK reports document this alternative.

### 4. Disable accelerated compositing

If the previous alternatives do not work, try the quick workaround:

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher
```

Compare stability when opening, resizing and using the launcher. If this is the only option that works, you can keep it for CubicLauncher and try again without it after updating your system.

### Additional test through XWayland

If your Wayland session provides XWayland and GTK includes the X11 backend, you can compare behavior with:

```bash
GDK_BACKEND=x11 cubiclauncher
```

This selects X11 for the GTK application; it does not change your entire desktop session. If XWayland is missing or no X server is accessible, the application may report that it cannot open the display. A successful test helps diagnosis, but does not guarantee that every NVIDIA issue disappears on X11.

## Apply the workaround to the desktop shortcut

Once you have confirmed which variable works, you can apply it when opening CubicLauncher from the applications menu:

1. Locate its `.desktop` file, usually in `/usr/share/applications/` or `/usr/local/share/applications/`. The filename depends on the package.
2. Copy it to `${XDG_DATA_HOME:-$HOME/.local/share}/applications/`, creating the directory if needed and keeping the same filename. If a personal copy already exists, edit that copy.
3. In the `Exec=` line, prepend `env WEBKIT_DISABLE_COMPOSITING_MODE=1` to the existing executable. Preserve its path, arguments and field codes such as `%u` or `%U`.

For example, **if the original line is** `Exec=cubiclauncher %U`, it becomes:

```ini
Exec=env WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher %U
```

For an AppImage, preserve its absolute path and quote it if it contains spaces. `Exec` is not interpreted as a shell command: do not use `~`, `$HOME` or a variable assignment without `env`. If the file contains `DBusActivatable=true`, change it to `false` in your personal copy so the desktop uses `Exec`.

If another variable was sufficient, use it instead of the example variable. Reopen the application from the menu; some desktops may require refreshing the menu or signing out and back in. A terminal alias does not change the applications-menu shortcut.

## Revert and compare without workarounds

If you only used a terminal prefix, close the launcher and run `cubiclauncher` normally again. If you modified the shortcut, restore its `Exec` line and any change to `DBusActivatable`, or remove your personal copy if you created it solely for this workaround. Personal copies can also hide future changes to the shortcut supplied by the package.

If you have exported variables in your session, you can test without the four variables described here:

```bash
env -u WEBKIT_DISABLE_COMPOSITING_MODE -u WEBKIT_DISABLE_DMABUF_RENDERER -u __NV_DISABLE_EXPLICIT_SYNC -u GDK_BACKEND cubiclauncher
```

Applying variables only to the launcher makes comparisons easier. Environment variables can be inherited by child processes; a targeted workaround should not become a global desktop setting.

## What to include in a report

- CubicLauncher version and package format: AUR, AppImage, `.deb`, `.rpm` or Nix.
- Distribution, kernel, desktop/compositor and session type.
- GPU model, driver version and, if the package uses system libraries, WebKitGTK version. On Arch you can check `pacman -Q webkit2gtk-4.1`.
- Whether the issue happens on startup, when resizing or when opening a particular view.
- The result of each test and the exact command that worked.

To save the output of a normal launch:

```bash
cubiclauncher 2>&1 | tee cubiclauncher-graphics.log
```

Review the file before sharing it: terminal output does not necessarily pass through the integrated console's data sanitization. If the launcher cannot open, attach this output; a Minecraft log is not required. See [Launcher diagnostics](/docs/en-EN/Advanced/debug) or [Support](/docs/en-EN/guides/support).

## Sources

Consulted on October 3, 2026. Results depend on installed versions; historical reports do not imply that all current versions are affected.

- [Tauri: Linux Graphics Issues](https://v2.tauri.app/develop/debug/linux-graphics/) — symptoms, KMS and rendering workarounds.
- [Tauri: Webview Versions](https://v2.tauri.app/reference/webview-versions/) — WebKitGTK as the Linux engine.
- [WebKitGTK: issue 261874](https://bugs.webkit.org/show_bug.cgi?id=261874) — NVIDIA and DMA-BUF background; covers several causes and was closed as MOVED.
- [GTK 3: Running GTK Applications](https://docs.gtk.org/gtk3/running.html) — backend selection with `GDK_BACKEND`.
- [freedesktop.org: The Exec key](https://specifications.freedesktop.org/desktop-entry-spec/latest/exec-variables.html) — desktop shortcut syntax.
