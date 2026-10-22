---
category: usage
order: 10
title: User accounts
description: Set up Microsoft, Ely.by, CubicAuth, custom Yggdrasil servers or offline accounts, and manage skins and capes.
---

# User accounts

CubicLauncher lets you save several accounts and switch between them without closing the launcher. Each instance uses the active account when launching Minecraft.

## Add an account

1. Open the user section in the sidebar.
2. Choose **Add** or **Add account**.
3. Select the account type.

### Microsoft

There are two ways to sign in:

- **From the launcher** — opens a Microsoft window to complete sign-in.
- **With an authentication code** — shows a link and a code to enter manually in your browser.

If you already had a saved Microsoft account, you can select it instead of signing in again. The session is renewed automatically when possible.

### Ely.by

Uses the preset `https://account.ely.by/api/authlib-injector` server. After connecting the account, you can manage its skin on the Ely.by profile page and refresh the preview in the launcher.

### CubicAuth

Connects the account to `https://auth.cubiclauncher.org`. If you don't have an account yet, you can sign up from the link shown by the launcher.

### Custom Yggdrasil / Authlib server

Lets you enter the URL of any Yggdrasil/Authlib-injector compatible server. The launcher saves the server together with the account.

### Offline

Enter a name between 3 and 16 characters. Only letters, numbers and underscores (`_`) are allowed. This mode does not authenticate against Microsoft or an external server.

## Manage accounts

From the user profile you can:

- **Activate** an account for future launches.
- **Sign out** of the active account.
- **Remove** a saved account.
- Check the account type and its associated server.

Tokens are stored in the system's secure storage when available. CubicLauncher never receives your Microsoft password.

## Expired sessions

If an account's token can no longer be refreshed, the launcher shows a notice and asks you to sign in again. The message shows the account name and lets you choose the authentication method again. Other accounts and instances are not modified.

## Skins and capes

Accounts that support it can manage their skin and capes from the profile.

### Upload a skin

- Accepted format: `.png`.
- You can drag the image onto the upload area or click to choose it.
- A preview is shown before saving.
- Changes are confirmed with **Save changes** and can be discarded.

### Classic or slim model

CubicLauncher detects the model from the skin pixels:

- A slim (Alex) skin selects the **Slim** model.
- A classic (Steve) skin selects the **Classic** model.
- A slim skin **cannot be saved as classic**, because black stripes would appear on the arms.
- If detection is not enough to decide, you can pick the model manually.
- Changing from classic to slim is allowed.

### Capes

- The list shows the capes available on the account.
- You can equip, unequip or change the active cape.
- Skin and cape changes are saved together.
- If you make too many changes in a row, the launcher shows a rate-limit notice and you can retry a few seconds later.

### Skin closet

The closet lets you save skins for later use:

- Save the current skin with a name.
- Rename or delete entries.
- Equip a saved skin on the account.

The closet is stored in the `.cubic/skins/` folder and is not shared between accounts.

### Ely.by skins

For Ely.by accounts, the launcher opens the service's skins page so you can choose or upload a skin. When you come back, you can refresh the preview and head from the profile.

## Common issues

- **The upload skin button does not appear**: the account or server does not allow changing the skin from the launcher.
- **The skin shows black stripes on the arms**: a slim skin was saved as classic. Upload it again and use the Slim model.
- **The Microsoft session expires**: sign in again from the expired-session notice.
- **I cannot sign in to a custom server**: check the server URL and that it is Yggdrasil/Authlib-injector compatible.
