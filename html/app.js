// Static demo client for Galaxy landing pages.
const GALAXY_BASE_URL = "https://usegalaxy.eu";

const WORKFLOW_TRS_URL =
  "https://workflowhub.eu/ga4gh/trs/v2/tools/2/versions/1";

const TOOL_ID =
  "toolshed.g2.bx.psu.edu/repos/galaxy-australia/alphafold2/alphafold/2.3.2+galaxy0";
const TOOL_VERSION = "2.3.2+galaxy0";
const TOOL_FASTA =
  ">sp|P01308|INS_HUMAN Insulin OS=Homo sapiens OX=9606 GN=INS PE=1 SV=1\nMALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAED\nLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN";

const DATA_FILE = {
  name: "Example BED file",
  url: "https://raw.githubusercontent.com/galaxyproject/galaxy/dev/test-data/1.bed",
  ext: "bed",
};

const ADVANCED_FILES = [
  "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039919/DRR039919_1.fastq.gz",
  "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039919/DRR039919_2.fastq.gz",
  "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039920/DRR039920_1.fastq.gz",
  "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039920/DRR039920_2.fastq.gz",
  "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039921/DRR039921_1.fastq.gz",
  "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039921/DRR039921_2.fastq.gz",
];

const ADVANCED_EXT = "fastqsanger.gz";

const setStatus = (id, message) => {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
};

const setButtonState = (button, label, disabled) => {
  if (!button) return;
  button.textContent = label;
  button.disabled = disabled;
};

const postJson = async (url, payload) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = { raw: text };
    }
  }
  return { response, data };
};

// Avoid sending "null" or "file://" origins when opened via file://
const maybeAddOrigin = (payload) => {
  const origin = window.location.origin;
  if (origin && origin !== "null" && origin !== "file://") {
    payload.origin = origin;
  }
  return payload;
};

const getErrorDetails = (data, response) =>
  data.error ||
  data.err_msg ||
  data.raw ||
  response.statusText ||
  "Failed to create landing request.";

// Shared handler for landing demo buttons.
const wireLanding = ({
  buttonId,
  statusId,
  endpoint,
  payloadBuilder,
  pendingLabel,
  idleLabel,
  statusMessage,
  redirectPrefix,
}) => {
  const button = document.getElementById(buttonId);
  const statusEl = document.getElementById(statusId);
  if (!button || !statusEl) return;
  button.addEventListener("click", async () => {
    setButtonState(button, pendingLabel, true);
    setStatus(statusId, statusMessage);

    try {
      const payload = maybeAddOrigin(payloadBuilder());
      const { response, data } = await postJson(`${GALAXY_BASE_URL}${endpoint}`, payload);
      if (!response.ok || !data.uuid) {
        throw new Error(getErrorDetails(data, response));
      }
      setStatus(statusId, "Redirecting to Galaxy...");
      window.location.href = `${GALAXY_BASE_URL}${redirectPrefix}${data.uuid}`;
    } catch (error) {
      setStatus(statusId, error.message || "Unexpected error.");
      setButtonState(button, idleLabel, false);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  wireLanding({
    buttonId: "run-workflow",
    statusId: "workflow-status",
    endpoint: "/api/workflow_landings",
    payloadBuilder: () => ({
      workflow_id: WORKFLOW_TRS_URL,
      workflow_target_type: "trs_url",
      request_state: {},
      public: true,
    }),
    pendingLabel: "Preparing...",
    idleLabel: "Run in Galaxy",
    statusMessage: "Creating Galaxy workflow landing...",
    redirectPrefix: "/workflow_landings/",
  });

  wireLanding({
    buttonId: "run-tool",
    statusId: "tool-status",
    endpoint: "/api/tool_landings",
    payloadBuilder: () => ({
      tool_id: TOOL_ID,
      tool_version: TOOL_VERSION,
      request_state: {
        fasta_or_text: {
          input_mode: "textbox",
          fasta_text: TOOL_FASTA,
        },
      },
      public: true,
    }),
    pendingLabel: "Preparing...",
    idleLabel: "Run tool in Galaxy",
    statusMessage: "Creating Galaxy tool landing...",
    redirectPrefix: "/tool_landings/",
  });

  wireLanding({
    buttonId: "run-data",
    statusId: "data-status",
    endpoint: "/api/data_landings",
    payloadBuilder: () => ({
      request_state: {
        targets: [
          {
            destination: { type: "hdas" },
            elements: [
              {
                src: "url",
                url: DATA_FILE.url,
                ext: DATA_FILE.ext,
                name: DATA_FILE.name,
              },
            ],
          },
        ],
      },
      public: true,
    }),
    pendingLabel: "Preparing...",
    idleLabel: "Send data to Galaxy",
    statusMessage: "Creating Galaxy data landing...",
    redirectPrefix: "/tool_landings/",
  });

  wireLanding({
    buttonId: "run-data-advanced",
    statusId: "data-advanced-status",
    endpoint: "/api/data_landings",
    payloadBuilder: () => {
      // Build a list:paired collection with deferred FASTQ elements.
      const pairs = [];
      for (let i = 0; i < ADVANCED_FILES.length; i += 2) {
        const forward = ADVANCED_FILES[i];
        const reverse = ADVANCED_FILES[i + 1];
        if (!forward || !reverse) break;
        pairs.push({
          name: `sample-${Math.floor(i / 2) + 1}`,
          collection_type: "paired",
          elements: [
            {
              src: "url",
              url: forward,
              ext: ADVANCED_EXT,
              name: "forward",
              deferred: true,
              tags: ["source:rules", "project:PRJDB3920"],
            },
            {
              src: "url",
              url: reverse,
              ext: ADVANCED_EXT,
              name: "reverse",
              deferred: true,
              tags: ["source:rules", "project:PRJDB3920"],
            },
          ],
        });
      }
      return {
        request_state: {
          targets: [
            {
              destination: { type: "hdca" },
              name: "PRJDB3920 paired reads",
              collection_type: "list:paired",
              elements: pairs,
              tags: ["source:rules", "project:PRJDB3920"],
            },
          ],
        },
        public: true,
      };
    },
    pendingLabel: "Preparing...",
    idleLabel: "Send paired collection to Galaxy",
    statusMessage: "Creating paired collection landing...",
    redirectPrefix: "/tool_landings/",
  });

  const copyButtons = document.querySelectorAll("[data-copy-target]");
  // Copy code snippets to clipboard.
  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const targetId = button.getAttribute("data-copy-target");
      const target = document.getElementById(targetId);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent || "");
        button.textContent = "Copied";
        setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      } catch (error) {
        button.textContent = "Failed";
      }
    });
  });
});
