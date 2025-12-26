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

## Customize

- Workflow target: `astro/src/data/workflow.ts`
- Data targets: `astro/src/data/dataLanding.ts`
- Tool target: `astro/src/data/toolLanding.ts`
- Static HTML + JS: `html/*.html`, `html/app.js`

## Where to edit

- `astro/src/data/workflow.ts` stores the WorkflowHub metadata and TRS URL.
- `astro/src/data/dataLanding.ts` stores the data landing examples.
- `astro/src/pages/api/landing.ts` calls the Galaxy workflow landing API.
- `astro/src/pages/api/data-landing.ts` calls the Galaxy data landing API.
- `astro/src/pages/api/data-landing-advanced.ts` calls the paired deferred collection API.
- `astro/src/pages/api/tool-landing.ts` calls the Galaxy tool landing API.
- `astro/src/pages/index.astro` is the landing selector page.
- `astro/src/pages/workflow-landing.astro` renders the workflow example.
- `astro/src/pages/data-landing.astro` renders the data landing example.
- `astro/src/pages/tool-landing.astro` renders the tool landing example.
