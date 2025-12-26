import type { APIRoute } from "astro";
import { workflow } from "../../data/workflow";

const baseUrl = (
  import.meta.env.GALAXY_BASE_URL ||
  import.meta.env.PUBLIC_GALAXY_BASE_URL ||
  "https://usegalaxy.eu"
).replace(/\/$/, "");

export const POST: APIRoute = async ({ request }) => {
  const payload = {
    workflow_id: workflow.trsUrl,
    workflow_target_type: "trs_url",
    request_state: {},
    public: true,
    origin: request.headers.get("origin"),
  };

  const response = await fetch(`${baseUrl}/api/workflow_landings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    return new Response(
      JSON.stringify({
        error: "Galaxy API error while creating landing request.",
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
      landingUrl: `${baseUrl}/workflow_landings/${data.uuid}`,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
};
