# Void Presence Web

Void Presence Web is the web interface for **Void Presence** – a service for browsing, sharing, and using community-made Discord Rich Presence configs.

Live site: https://www.voidpresence.site/

---

## Features

- View detailed information about a config (cycles, buttons, images).
- Rich preview of the Discord Rich Presence card.
- Download config as a `JSON` file.
- Copy JSON to clipboard with a single click.
- Responsive UI for both desktop and mobile.

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Firebase** (config storage)
- **CSS / SCSS** for custom styling

---

## Security & data

Void Presence uploads only **Rich Presence configuration data** when you use cloud features or share configs on the website.

What can be stored in the cloud:

- **Config data** – button pairs, status cycles, image cycles and related settings (`configData`, `buttonPairs`, `cycles`, `imageCycles`)  
- **Metadata** – config title, description, upload timestamp, download counter (`title`, `description`, `uploadedAt`, `downloads`)  
- **Author name** – your display name or handle shown as the config author (`author`, for example `Devollox`)

What is **not** stored:

- No Discord tokens, passwords or OAuth keys  
- No personal messages or Discord account data  
- No system files or arbitrary local data

Configs are used only to render Rich Presence and to let you share presets between machines or with other users through the Void Presence website.

---

## Author

Made with ❤️ by [Devollox](https://github.com/Devollox)

<p align="left">
  <img width="128" height="128" alt="выфвфы" src="https://github.com/user-attachments/assets/f5c3c406-552b-412e-a2a9-3ff0fdddf400" />
</p>

**Void Presence** – Control your Discord presence. Own your story.
