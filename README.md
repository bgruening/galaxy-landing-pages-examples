# Galaxy Landing Pages Demo's

The aim of this repository is to provide examples for Galaxy's landing pages. Currently (Galaxy 25.1) workflow- and data-landing pages are supported. Tool landing pages are under contruction.
We have added an example in Astro and in pure HTML/JS. 
The workflow example renders a WorkflowHub workflow and the data landing demo has a simple and a more complex example using collections and deferred datasets.

We are using Galaxy 25.1 APIs (`/api/workflow_landings` and `/api/data_landings`, no API key
required) to generate landing UUIDs before redirecting to `https://usegalaxy.eu/workflow_landings/<uuid>` and `https://usegalaxy.eu/tool_landings/<uuid>`.

The Astro site lives in `astro/`. The HTML version lives in `html/`.

## Astro setup

```sh
cd astro
npm install
```

Optional override (defaults to `https://usegalaxy.eu`):

```sh
export PUBLIC_GALAXY_BASE_URL="https://usegalaxy.eu"
```

## Run the Astro example

```sh
cd astro
npm run dev
```

## Static HTML example

Open `html/index.html` directly or serve the folder with any static server.

Example:

```sh
cd html
python -m http.server 8080
```
