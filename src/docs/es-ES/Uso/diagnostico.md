---
category: troubleshooting
order: 20
title: Diagnóstico y logs
description: Usá la consola integrada, el historial de logs, la limpieza de datos sensibles y la subida a mclo.gs para diagnosticar problemas.
---

# Diagnóstico y logs

La consola integrada te ayuda a entender qué pasa cuando el juego inicia o si algo falla.

## Consola y ventana de logs

- Cada instancia tiene una consola en vivo con autoscroll.
- El menú de acciones permite abrir la ventana de logs, copiar el contenido o subirlo a mclo.gs.
- La ventana de logs conserva el historial de la sesión y permite filtrar por nivel.
- El menú es el mismo en la vista de la instancia y en la ventana dedicada, para que las acciones no cambien según dónde estés.

## Opciones de consola

En **Ajustes → Minecraft → Opciones de consola** podés configurar:

- **Límite del historial** — máximo de líneas conservadas por instancia (100 a 5000). El valor predeterminado es 3000.
- **Mostrar etiquetas de nivel** — muestra u oculta las etiquetas de nivel del log. Ocultarlas dificulta filtrar por nivel y no se recomienda.

## Previsualización en la vista principal

Mientras una instancia está iniciando o corriendo, la cabecera muestra la última línea relevante del log como vista previa.

## Cierres normales y crashes

- Un cierre normal del juego no se reporta como crash.
- Si el proceso termina de forma inesperada, el launcher detecta el crash y abre la consola con el historial.
- El historial del crash se conserva durante **1 hora** para que puedas revisarlo o subirlo aunque la ventana se haya cerrado.
- Si forzás el cierre desde el launcher o el proceso se detiene por una acción controlada, no se genera un crash.

## Privacidad: limpieza de datos sensibles

El launcher limpia automáticamente información sensible antes de mostrar o guardar logs:

- Tokens de acceso/refresh, ClientToken y cabeceras Authorization.
- IDs de sesión, correos electrónicos y direcciones IP.
- Datos específicos del usuario activo (username, UUID, tokens) con un filtro dedicado.

## Subir a mclo.gs

Usá la acción **Subir** del menú de logs para generar un enlace público en mclo.gs y compartirlo en soporte. Es ideal para reportar issues con el log completo.

## Reportar un problema

Si CubicLauncher no llega a mostrar la interfaz en Linux, consultá [Problemas gráficos en Linux: NVIDIA y Wayland](/docs/es-ES/guias/nvidia-wayland). La guía incluye cómo capturar la salida de la terminal y probar `WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher`; no necesitás iniciar Minecraft para investigar un fallo de la ventana del launcher.

Incluí en tu reporte:

- Versión de CubicLauncher y del sistema operativo.
- Pasos para reproducir el problema.
- Enlace al log en mclo.gs y, si aplica, el modpack usado.
- Si el problema ocurre al iniciar, la versión de Minecraft, el loader y el Java seleccionado.
