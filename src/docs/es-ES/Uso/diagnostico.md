---
title: Diagnóstico y logs
description: Usá la consola integrada, previsualización de logs y subida a mclo.gs. Cómo reportar problemas.
---

# Diagnóstico y logs

La consola integrada te ayuda a entender qué pasa cuando el juego inicia o si algo falla.

## Consola y ventana de logs

- Cada instancia tiene una consola en vivo con autoscroll.
- Podés abrir una ventana dedicada de logs con historial.
- Si el juego se cierra con error, el launcher conserva un snapshot del log durante 1 hora para que puedas revisarlo.

## Previsualización en la vista principal

Mientras una instancia está iniciando o corriendo, la tarjeta de la instancia muestra la última línea relevante del log como vista previa.

## Privacidad: limpieza de datos sensibles

El launcher limpia automáticamente información sensible antes de mostrar o guardar logs:

- Tokens de acceso/refresh, ClientToken, cabeceras Authorization.
- IDs de sesión, correos electrónicos y direcciones IP.
- Datos específicos del usuario activo (username, UUID, tokens) con un filtro dedicado.

## Subir a mclo.gs

Usá el botón de Upload para generar un enlace público en mclo.gs y compartirlo en soporte. Ideal para issues.

## Reportar un problema

Incluí en tu reporte:

- Versión de CubicLauncher y del sistema operativo.
- Pasos para reproducir el problema.
- Enlace al log en mclo.gs y, si aplica, el modpack usado.
