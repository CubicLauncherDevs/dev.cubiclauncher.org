---
category: usage
order: 10
title: Cuentas de usuario
description: Configurá cuentas Microsoft, Ely.by, CubicAuth, servidores Yggdrasil personalizados u offline, y administrá skins y capas.
---

# Cuentas de usuario

CubicLauncher permite guardar varias cuentas y cambiar entre ellas sin cerrar el launcher. Cada instancia usa la cuenta activa al lanzar Minecraft.

## Agregar una cuenta

1. Abrí la sección de usuario en la barra lateral.
2. Elegí **Agregar** o **Agregar cuenta**.
3. Seleccioná el tipo de cuenta.

### Microsoft

Hay dos formas de iniciar sesión:

- **Desde el launcher** — abre una ventana de Microsoft para completar el inicio de sesión.
- **Con código de autenticación** — muestra un enlace y un código para introducirlos manualmente en el navegador.

Si ya tenías una cuenta Microsoft guardada, podés elegirla en lugar de iniciar sesión otra vez. La sesión se renueva automáticamente cuando es posible.

### Ely.by

Usa el servidor preconfigurado `https://account.ely.by/api/authlib-injector`. Después de conectar la cuenta, podés administrar su skin desde el perfil de Ely.by y actualizar la vista previa en el launcher.

### CubicAuth

Conecta la cuenta al servidor `https://auth.cubiclauncher.org`. Si todavía no tenés una cuenta, podés registrarte desde el enlace que muestra el launcher.

### Servidor Yggdrasil / Authlib personalizado

Permite ingresar la URL de cualquier servidor compatible con Yggdrasil/Authlib-injector. El launcher guarda el servidor junto con la cuenta.

### Sin conexión (offline)

Ingresá un nombre de 3 a 16 caracteres. Solo se permiten letras, números y guiones bajos (`_`). Este modo no autentica contra Microsoft ni contra un servidor externo.

## Administrar cuentas

Desde el perfil de usuario podés:

- **Activar** una cuenta para usarla en los próximos lanzamientos.
- **Cerrar sesión** de la cuenta activa.
- **Eliminar** una cuenta guardada.
- Consultar el tipo de cuenta y el servidor asociado.

Los tokens se guardan en el almacenamiento seguro del sistema cuando está disponible. CubicLauncher nunca recibe tu contraseña de Microsoft.

## Sesiones vencidas

Si el token de una cuenta ya no se puede renovar, el launcher muestra un aviso y pide iniciar sesión de nuevo. El mensaje indica el nombre de la cuenta y permite elegir el método de autenticación otra vez. Las demás cuentas e instancias no se modifican.

## Skins y capas

Las cuentas que lo permiten pueden administrar su skin y sus capas desde el perfil.

### Subir una skin

- Formatos aceptados: `.png`.
- Podés arrastrar la imagen al área de carga o hacer clic para elegirla.
- Antes de guardar se muestra una vista previa.
- Los cambios se confirman con **Guardar cambios** y se pueden descartar.

### Modelo clásico o delgado

CubicLauncher detecta el modelo a partir de los píxeles de la skin:

- Si la skin es delgada (Alex), se selecciona el modelo **Delgado**.
- Si la skin es clásica (Steve), se selecciona el modelo **Clásico**.
- Una skin delgada **no se puede guardar como clásica**, porque aparecerían franjas negras en los brazos.
- Si la detección no alcanza para decidir, podés elegir el modelo manualmente.
- Cambiar de clásico a delgado sí está permitido.

### Capas

- La lista muestra las capas disponibles en la cuenta.
- Podés equipar, desequipar o cambiar la capa activa.
- Los cambios de skin y capa se guardan juntos.
- Si hacés demasiados cambios seguidos, el launcher muestra un aviso de límite de solicitudes y podés reintentar unos segundos después.

### Armario de skins

El armario permite guardar skins para reutilizarlas:

- Guardar la skin actual con un nombre.
- Renombrar o eliminar entradas.
- Equipar una skin guardada en la cuenta.

El armario se guarda en la carpeta `.cubic/skins/` y no se comparte entre cuentas.

### Skins de Ely.by

En cuentas de Ely.by, el launcher abre la página de skins del servicio para que elijas o subas la skin. Al volver, podés actualizar la vista previa y la cabeza desde el perfil.

## Problemas frecuentes

- **No aparece el botón para subir skin**: la cuenta o el servidor no permiten cambiar la skin desde el launcher.
- **La skin se ve con franjas negras en los brazos**: se guardó una skin delgada como clásica. Volvé a subirla y usá el modelo Delgado.
- **La sesión de Microsoft vence**: iniciá sesión de nuevo desde el aviso de sesión vencida.
- **No puedo iniciar sesión en un servidor personalizado**: verificá la URL del servidor y que sea compatible con Yggdrasil/Authlib-injector.
