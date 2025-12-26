import type { APIRoute } from "astro";
import { toolLanding } from "../../data/toolLanding";

const baseUrl = (
  import.meta.env.GALAXY_BASE_URL ||
  import.meta.env.PUBLIC_GALAXY_BASE_URL ||
  "https://usegalaxy.eu"
).replace(/\/$/, "");

export const POST: APIRoute = async ({ request }) => {
  const payload = {
    tool_id: toolLanding.toolId,
    tool_version: toolLanding.toolVersion,
    request_state: {
      fasta_or_text: {
        input_mode: "textbox",
        fasta_text: toolLanding.fastaText,
      },
    },
    public: true,
    origin: request.headers.get("origin"),
  };

  const response = await fetch(`${baseUrl}/api/tool_landings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    return new Response(
      JSON.stringify({
        error: "Galaxy API error while creating tool landing request.",
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
