---
category: troubleshooting
order: 30
title: Problemas gráficos en Linux: NVIDIA y Wayland
description: Pantalla blanca, parpadeos y cierres de CubicLauncher con NVIDIA y Wayland. Uso de WEBKIT_DISABLE_COMPOSITING_MODE=1 y alternativas de WebKitGTK.
---

# Problemas gráficos en Linux: NVIDIA y Wayland

En Linux, CubicLauncher usa Tauri y WebKitGTK para mostrar su interfaz. Algunas combinaciones de WebKitGTK, controlador NVIDIA y compositor pueden provocar ventanas vacías, parpadeos o cierres. Estos problemas también pueden aparecer en X11; tener NVIDIA o Wayland no significa que necesites aplicar un ajuste.

Otros idiomas: [English](/docs/en-EN/guides/nvidia-wayland) · [Français](/docs/fr-FR/guides/nvidia-wayland).

## Solución rápida reportada en CubicLauncher

Si el launcher falla al dibujar la ventana, cerralo completamente, incluida la bandeja del sistema, y ejecutá:

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher
```

Este comando fue reportado como solución por un usuario de CubicLauncher con NVIDIA y Wayland. La [guía oficial de Tauri sobre problemas gráficos en Linux](https://v2.tauri.app/develop/debug/linux-graphics/) también documenta esta variable como último recurso, especialmente para cierres al redimensionar. No se dispone de las versiones exactas del controlador y del compositor de ese caso, por lo que no establece una lista de equipos afectados.

Para una AppImage, reemplazá el nombre del ejemplo por el de tu archivo:

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 ./CubicLauncher.AppImage
```

:::info Qué cambia
La variable desactiva la composición acelerada de WebKitGTK. Puede reducir la fluidez de la interfaz y aumentar el trabajo de la CPU. No desactiva por sí misma la aceleración gráfica de Minecraft: el juego tiene su propio motor de renderizado. Se aplica a ese inicio del launcher; no queda guardada como preferencia.
:::

## Síntomas habituales

- La ventana se abre, pero queda blanca o vacía.
- La interfaz parpadea, especialmente al cambiar el tamaño.
- La aplicación se cierra al redimensionar, a veces sin un mensaje claro.
- En la terminal aparecen errores como:

```text
AcceleratedSurfaceDMABuf was unable to construct a complete framebuffer
Gdk-Message: Error 71 (Protocol error) dispatching to Wayland display.
```

Tauri relaciona muchos de estos fallos con el intercambio de buffers gráficos entre WebKitGTK y el controlador. Una ventana vacía no identifica una causa única: los reportes históricos de WebKit incluyen fallos distintos con síntomas parecidos.

## Diagnóstico y alternativas

Probá una opción por vez y cerrá completamente CubicLauncher entre pruebas. Los comandos siguientes suponen que no exportaste estos ajustes previamente; si lo hiciste, retiralos antes de comparar resultados. Usá el ajuste menos restrictivo que resuelva tu problema.

### 1. Actualizar y comprobar el entorno

Actualizá CubicLauncher, WebKitGTK y el controlador NVIDIA mediante los mecanismos de tu distribución. Reiniciá si se actualizó el kernel o el controlador. En Arch, usá una actualización completa del sistema y consultá la [guía de instalación](/docs/es-ES/guias/arch).

Para identificar la sesión y el controlador:

```bash
printenv XDG_SESSION_TYPE XDG_CURRENT_DESKTOP
nvidia-smi
```

`XDG_SESSION_TYPE` suele indicar `wayland` o `x11`. Si está vacío, comprobá la sesión desde tu escritorio. En equipos híbridos, `nvidia-smi` no demuestra por sí solo qué GPU está usando la ventana del launcher.

Tauri también recomienda comprobar el *kernel mode setting* (KMS) de NVIDIA:

```bash
cat /sys/module/nvidia_drm/parameters/modeset
```

`Y` indica que está habilitado; `N`, que está deshabilitado. Si el archivo no existe, comprobá qué controlador está cargado. Si no tenés permiso de lectura, podés consultar el mismo archivo con `sudo cat`. Cuando KMS esté deshabilitado, seguí las instrucciones de tu distribución para habilitarlo; la guía de Tauri menciona `nvidia_drm.modeset=1`, especialmente para controladores antiguos. No hace falta añadir ese parámetro si KMS ya está activo.

### 2. Probar sin sincronización explícita de NVIDIA

Para ciertos errores de Wayland, en particular `Error 71`, Tauri propone:

```bash
__NV_DISABLE_EXPLICIT_SYNC=1 cubiclauncher
```

Este ajuste cambia el comportamiento de sincronización del controlador, sin desactivar la composición acelerada de WebKit. Su eficacia depende del controlador y del compositor.

### 3. Probar sin el renderizador DMA-BUF

Para fallos de framebuffer, ventanas vacías o si la prueba anterior no ayuda:

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 cubiclauncher
```

Evita la ruta de renderizado DMA-BUF de WebKitGTK. Puede perderse una ruta más rápida, pero no equivale a desactivar toda la composición acelerada. Es una alternativa documentada tanto por Tauri como en los reportes de WebKitGTK.

### 4. Desactivar la composición acelerada

Si las alternativas anteriores no funcionan, probá el comando de la solución rápida:

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher
```

Compará la estabilidad al abrir, redimensionar y usar el launcher. Si esta es la única opción que funciona, podés conservarla para CubicLauncher y volver a probar sin ella después de actualizar el sistema.

### Prueba adicional mediante XWayland

Si tu sesión Wayland dispone de XWayland y GTK incluye el backend X11, podés comparar el comportamiento con:

```bash
GDK_BACKEND=x11 cubiclauncher
```

Esto selecciona X11 para la aplicación GTK; no cambia toda la sesión de escritorio. Si falta XWayland o no hay un servidor X accesible, puede aparecer un error de apertura de pantalla. Que funcione ayuda al diagnóstico, pero no garantiza que todos los problemas de NVIDIA desaparezcan en X11.

## Aplicar el ajuste al acceso directo

Una vez que confirmes qué variable funciona, podés usarla al abrir CubicLauncher desde el menú de aplicaciones:

1. Localizá su archivo `.desktop`, normalmente en `/usr/share/applications/` o `/usr/local/share/applications/`. El nombre depende del paquete.
2. Copialo a `${XDG_DATA_HOME:-$HOME/.local/share}/applications/`, creando el directorio si hace falta y conservando el mismo nombre de archivo. Si ya existe una copia personal, editá esa copia.
3. En la línea `Exec=`, anteponé `env WEBKIT_DISABLE_COMPOSITING_MODE=1` al ejecutable existente. Conservá su ruta, argumentos y códigos como `%u` o `%U`.

Por ejemplo, **si la línea original es** `Exec=cubiclauncher %U`, quedaría:

```ini
Exec=env WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher %U
```

Si usás AppImage, conservá su ruta absoluta, entre comillas si contiene espacios. `Exec` no se interpreta como un comando de shell: no uses `~`, `$HOME` ni una asignación de variable sin `env`. Si el archivo contiene `DBusActivatable=true`, cambialo a `false` en la copia personal para que el escritorio utilice `Exec`.

Si otra variable fue suficiente, usá esa en lugar de la del ejemplo. Reabrí la aplicación desde el menú; algunos escritorios pueden necesitar refrescarlo o volver a iniciar sesión. Un alias en la terminal no modifica el acceso directo del menú.

## Revertir y comparar sin ajustes

Si solo usaste el prefijo en la terminal, cerrá el launcher y volvé a ejecutar `cubiclauncher` normalmente. Si modificaste el acceso directo, restaurá su línea `Exec` y cualquier cambio en `DBusActivatable`, o retirá la copia personal si la creaste únicamente para este ajuste. Las copias personales también pueden ocultar futuros cambios del acceso directo distribuido por el paquete.

Si tenés variables exportadas en la sesión, podés hacer una prueba sin las cuatro variables descritas aquí:

```bash
env -u WEBKIT_DISABLE_COMPOSITING_MODE -u WEBKIT_DISABLE_DMABUF_RENDERER -u __NV_DISABLE_EXPLICIT_SYNC -u GDK_BACKEND cubiclauncher
```

Aplicar las variables solo al launcher facilita comparar resultados. Las variables de entorno pueden heredarse a sus procesos hijos; no conviene convertir un ajuste puntual en una configuración global del escritorio.

## Qué incluir en un reporte

- Versión de CubicLauncher y formato instalado: AUR, AppImage, `.deb`, `.rpm` o Nix.
- Distribución, kernel, escritorio/compositor y tipo de sesión.
- Modelo de GPU, versión del controlador y, si el paquete usa las bibliotecas del sistema, versión de WebKitGTK. En Arch podés consultar `pacman -Q webkit2gtk-4.1`.
- Si ocurre al iniciar, redimensionar o abrir una vista específica.
- Resultado de cada prueba y el comando exacto que funcionó.

Para guardar la salida de un inicio normal:

```bash
cubiclauncher 2>&1 | tee cubiclauncher-graficos.log
```

Revisá el archivo antes de compartirlo: la salida de la terminal no necesariamente pasa por la limpieza de datos de la consola integrada. Si el launcher no llega a abrir, adjuntá esta salida; no hace falta tener un log de Minecraft. Consultá [Diagnóstico y logs](/docs/es-ES/Uso/diagnostico) o [Soporte](/docs/es-ES/guias/soporte).

## Fuentes

Consultadas el 3 de octubre de 2026. Los resultados dependen de las versiones instaladas; los reportes históricos no implican que todas las versiones actuales estén afectadas.

- [Tauri: Linux Graphics Issues](https://v2.tauri.app/develop/debug/linux-graphics/) — síntomas, KMS y alternativas de renderizado.
- [Tauri: Webview Versions](https://v2.tauri.app/reference/webview-versions/) — WebKitGTK como motor en Linux.
- [WebKitGTK: reporte 261874](https://bugs.webkit.org/show_bug.cgi?id=261874) — antecedentes de NVIDIA y DMA-BUF; contiene varias causas y fue cerrado como MOVED.
- [GTK 3: Running GTK Applications](https://docs.gtk.org/gtk3/running.html) — selección del backend con `GDK_BACKEND`.
- [freedesktop.org: The Exec key](https://specifications.freedesktop.org/desktop-entry-spec/latest/exec-variables.html) — sintaxis de los accesos directos.
