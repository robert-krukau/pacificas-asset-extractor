<p align="center">
  <img src="assets/icon-128.png" width="96" height="96" alt="Pacifica's Asset Extractor icon">
</p>

<h1 align="center">Pacifica's Asset Extractor</h1>

<p align="center">
  Extract original GIF assets from Figma files — with previews, deduplication, file size info, and ZIP export.
</p>

<p align="center">
  <strong>Open-source Figma plugin · Local asset extraction · No re-encoding</strong>
</p>

---

## What it does

Pacifica's Asset Extractor scans a Figma page or an entire Figma file and finds embedded GIF assets.

Instead of exporting a rendered frame, it reads the original encoded image bytes from Figma and lets you download the actual `.gif` file.

### Current features

- Scan the **current page** or the **entire Figma file**
- Detect real GIF files using `GIF87a` / `GIF89a` signatures
- Deduplicate repeated assets by Figma `imageHash`
- Show animated GIF previews
- Show the page and layer where the asset was found
- Show usage count and file size
- Download a single GIF
- Download all unique GIFs as a ZIP archive
- Generate readable filenames such as:

```text
Checkout_Loading_01.gif
Components_Spinner_02.gif
```

---

## Why

Figma makes it easy to place GIFs into designs, but recovering the original GIF later can be awkward — especially in large files inherited from another designer or team.

Pacifica's Asset Extractor is intended to make that simple:

```text
Open file
→ Scan
→ Preview GIFs
→ Download originals
```

---

## Install from GitHub

Until the plugin is available in Figma Community, you can run it as a development plugin.

### Requirements

- [Node.js](https://nodejs.org/)
- Figma Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/robert-krukau/pacificas-asset-extractor.git
cd pacificas-asset-extractor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the plugin

```bash
npm run build
```

### 4. Import it into Figma

In **Figma Desktop**:

```text
Plugins
→ Development
→ Import plugin from manifest...
```

Select:

```text
manifest.json
```

The plugin will then appear under **Plugins → Development**.

---

## Usage

1. Open a Figma design file.
2. Run **Pacifica's Asset Extractor**.
3. Choose:
   - **Current page**
   - **Entire file**
4. Browse the detected GIFs.
5. Download an individual GIF or use **Download all** to create a ZIP archive.

The plugin automatically scans the current page when opened.

---

## How it works

The plugin uses the Figma Plugin API to:

1. Find nodes containing `IMAGE` fills.
2. Resolve the associated `imageHash`.
3. Read the original encoded bytes using Figma's image API.
4. Check the file signature for:

```text
GIF87a
GIF89a
```

5. Deduplicate matching `imageHash` values.
6. Pass the original bytes to the plugin UI for preview and download.

GIFs are not converted or re-encoded before download.

---

## Privacy

GIF content is processed inside the plugin and is not uploaded to a custom server.

The current version loads JSZip from jsDelivr in order to create ZIP archives for **Download all**.

---

## Project structure

```text
pacificas-asset-extractor/
├─ assets/
│  ├─ icon-16.png
│  ├─ icon-32.png
│  ├─ icon-64.png
│  └─ icon-128.png
├─ code.ts
├─ ui.html
├─ manifest.json
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## Roadmap

The first goal is to keep the plugin small and focused.

Possible future improvements:

- Better generated filenames for unnamed Figma layers
- Sorting by file size
- Search and filtering
- More original image formats beyond GIF
- Fully bundled ZIP dependency for zero external network access

---

## Disclaimer

Only export and use assets that you own or have permission to use.

This plugin does not change the copyright or license of any extracted asset.
