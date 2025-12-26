import type { APIRoute } from "astro";
import { advancedDataLanding } from "../../data/dataLanding";

const baseUrl = (
  import.meta.env.GALAXY_BASE_URL ||
  import.meta.env.PUBLIC_GALAXY_BASE_URL ||
  "https://usegalaxy.eu"
).replace(/\/$/, "");

export const POST: APIRoute = async ({ request }) => {
  // Build a list:paired collection with deferred FASTQ elements.
  const pairs = [];
  for (let i = 0; i < advancedDataLanding.files.length; i += 2) {
    const forward = advancedDataLanding.files[i];
    const reverse = advancedDataLanding.files[i + 1];
    if (!forward || !reverse) break;
    pairs.push({
      name: `sample-${Math.floor(i / 2) + 1}`,
      collection_type: "paired",
      elements: [
        {
          src: "url",
          url: forward,
          ext: advancedDataLanding.ext,
          name: "forward",
          deferred: true,
          tags: advancedDataLanding.tags,
        },
        {
          src: "url",
          url: reverse,
          ext: advancedDataLanding.ext,
          name: "reverse",
          deferred: true,
          tags: advancedDataLanding.tags,
        },
      ],
    });
  }

  const payload = {
    request_state: {
      targets: [
        {
          destination: { type: "hdca" },
          name: "PRJDB3920 paired reads",
          collection_type: "list:paired",
          elements: pairs,
          tags: advancedDataLanding.tags,
        },
      ],
    },
    public: true,
    origin: request.headers.get("origin"),
  };

  const response = await fetch(`${baseUrl}/api/data_landings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    return new Response(
      JSON.stringify({
        error: "Galaxy API error while creating data landing request.",
        details,
      }),
      {
        status: 502,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const data = (await response.json()) as { uuid?: string };
  if (!data.uuid) {
    return new Response(
      JSON.stringify({
        error: "Galaxy API response missing landing UUID.",
      }),
      {
        status: 502,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      landingUrl: `${baseUrl}/tool_landings/${data.uuid}`,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
};
