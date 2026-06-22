const documents = [
  {
    id: "IR-2024-032",
    title: "Inspection Report #32 - Pump P-101",
    type: "Inspection",
    asset: "Pump P-101",
    date: "2024-09-18",
    page: "p. 4",
    text:
      "Pump P-101 showed bearing vibration at 8.7 mm/s, above the 6.0 mm/s action threshold. Thermal reading reached 88 C near the drive-end bearing. Inspector recommended bearing replacement and lubrication audit within 48 hours."
  },
  {
    id: "WO-2024-118",
    title: "Maintenance Work Order - P-101 Bearing Replacement",
    type: "Maintenance",
    asset: "Pump P-101",
    date: "2024-09-21",
    page: "p. 2",
    text:
      "Technician A. Rao replaced drive-end bearing on Pump P-101. Grease line was partially blocked. Alignment check completed. Follow-up inspection scheduled after 30 operating days."
  },
  {
    id: "SOP-MECH-014",
    title: "SOP: Centrifugal Pump Bearing Replacement",
    type: "SOP",
    asset: "Pump P-101",
    date: "2023-11-05",
    page: "section 5.2",
    text:
      "For centrifugal pump bearing replacement, isolate power, drain casing, verify lockout tagout, inspect grease line, replace bearing set, confirm shaft alignment, and record post-maintenance vibration below 4.5 mm/s."
  },
  {
    id: "INC-2022-019",
    title: "Incident Note - P-101 Unplanned Stop",
    type: "Incident",
    asset: "Pump P-101",
    date: "2022-07-12",
    page: "p. 1",
    text:
      "Pump P-101 tripped during high ambient temperature. Bearing temperature was 86 C. Root cause listed as lubrication starvation and delayed inspection."
  },
  {
    id: "IR-2025-006",
    title: "Quarterly Inspection - Compressor C-204",
    type: "Inspection",
    asset: "Compressor C-204",
    date: "2025-02-11",
    page: "p. 6",
    text:
      "Compressor C-204 oil carryover was within limit. No critical non-conformance found. Recommended cleaning inlet filter during next planned shutdown."
  },
  {
    id: "REG-QMS-009",
    title: "Quality Audit Trail Requirements",
    type: "Compliance",
    asset: "Plant",
    date: "2024-04-03",
    page: "section 2.1",
    text:
      "All corrective work orders must link to inspection evidence, responsible technician, date of closure, and acceptance criteria. Deviations require documented corrective action."
  }
];

const assets = ["Pump P-101", "Compressor C-204", "Plant"];

const graphLinks = {
  "Pump P-101": [
    ["Pump P-101", "Inspection Report #32", "evidence"],
    ["Pump P-101", "Work Order 118", "corrective action"],
    ["Pump P-101", "SOP-MECH-014", "procedure"],
    ["Pump P-101", "Incident 2022", "history"],
    ["Inspection Report #32", "Bearing vibration", "finding"],
    ["Work Order 118", "Grease blockage", "root cause"]
  ],
  "Compressor C-204": [
    ["Compressor C-204", "Quarterly Inspection", "evidence"],
    ["Compressor C-204", "Inlet filter", "maintenance item"],
    ["Quarterly Inspection", "No critical NC", "result"]
  ],
  Plant: [
    ["Plant", "Quality Audit Trail", "compliance"],
    ["Plant", "Pump P-101", "asset"],
    ["Plant", "Compressor C-204", "asset"]
  ]
};

const insights = [
  {
    title: "Recurring condition detected",
    body: "P-101 failures in 2022 and 2024 both mention bearing temperature above 85 C and lubrication starvation."
  },
  {
    title: "Likely root cause",
    body: "Blocked grease line is the strongest shared factor across inspection evidence and the corrective work order."
  },
  {
    title: "Recommended action",
    body: "Increase vibration checks to weekly for 60 days, inspect grease line during every shift round, and verify post-maintenance vibration below 4.5 mm/s."
  },
  {
    title: "Compliance trace",
    body: "Work Order 118 should link Inspection Report #32, technician closure, and acceptance vibration criteria to satisfy REG-QMS-009."
  }
];

const state = {
  documents: [...documents],
  messages: []
};

const documentList = document.querySelector("#documentList");
const docCount = document.querySelector("#docCount");
const entityCount = document.querySelector("#entityCount");
const chunkCount = document.querySelector("#chunkCount");
const chatLog = document.querySelector("#chatLog");
const questionForm = document.querySelector("#questionForm");
const questionInput = document.querySelector("#questionInput");
const fileInput = document.querySelector("#fileInput");
const simulateUpload = document.querySelector("#simulateUpload");
const assetSelect = document.querySelector("#assetSelect");
const graph = document.querySelector("#knowledgeGraph");
const runRca = document.querySelector("#runRca");
const rootCauseScore = document.querySelector("#rootCauseScore");
const meterFill = document.querySelector("#meterFill");
const insightList = document.querySelector("#insightList");

function renderStats() {
  const entityTotal = new Set(state.documents.flatMap((doc) => [doc.asset, doc.type, doc.id])).size;
  docCount.textContent = state.documents.length;
  entityCount.textContent = entityTotal;
  chunkCount.textContent = `${state.documents.length * 3} chunks`;
}

function renderDocuments() {
  documentList.innerHTML = state.documents
    .map(
      (doc) => `
      <article class="doc-card">
        <strong>${doc.title}</strong>
        <div class="doc-meta">
          <span>${doc.type}</span>
          <span>${doc.asset}</span>
          <span>${doc.date}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function addMessage(role, html) {
  state.messages.push({ role, html });
  chatLog.innerHTML = state.messages
    .map((message) => `<article class="message ${message.role}">${message.html}</article>`)
    .join("");
  chatLog.scrollTop = chatLog.scrollHeight;
}

function scoreDocument(question, doc) {
  const tokens = question.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
  const haystack = `${doc.title} ${doc.asset} ${doc.type} ${doc.text}`.toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function retrieve(question) {
  return state.documents
    .map((doc) => ({ doc, score: scoreDocument(question, doc) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.doc);
}

function answerQuestion(question) {
  const q = question.toLowerCase();
  const sources = retrieve(question);
  let answer;

  if (q.includes("why") || q.includes("root cause") || q.includes("cause")) {
    answer =
      "Pump P-101 most likely failed because lubrication starvation increased bearing temperature and vibration. Inspection Report #32 recorded 8.7 mm/s vibration and 88 C at the drive-end bearing; the follow-up work order found a partially blocked grease line.";
  } else if (q.includes("sop") || q.includes("bearing replacement")) {
    answer =
      "The bearing replacement SOP requires lockout tagout, casing drain, grease-line inspection, bearing-set replacement, shaft alignment verification, and post-maintenance vibration below 4.5 mm/s.";
  } else if (q.includes("failure") || q.includes("history")) {
    answer =
      "P-101 has two related events in the indexed knowledge base: a 2022 unplanned stop tied to lubrication starvation and a 2024 inspection/work-order pair tied to high vibration, high temperature, and grease-line blockage.";
  } else if (q.includes("compliance") || q.includes("audit")) {
    answer =
      "The quality trail should connect the inspection evidence, corrective work order, technician, date of closure, and acceptance criteria. REG-QMS-009 explicitly requires this linkage for deviations.";
  } else {
    answer =
      "I found the strongest matches in the indexed plant knowledge base. The relevant records point to Pump P-101, bearing vibration, maintenance follow-up, and SOP-driven acceptance checks.";
  }

  const sourceHtml = sources
    .map((doc) => `<span>${doc.id} - ${doc.page}</span>`)
    .join("");

  return `
    <span class="confidence">Confidence 92%</span>
    <p>${answer}</p>
    <div class="source-row">${sourceHtml}</div>
  `;
}

function submitQuestion(question) {
  if (!question.trim()) return;
  addMessage("user", `<p>${question}</p>`);
  window.setTimeout(() => addMessage("ai", answerQuestion(question)), 220);
}

function renderAssetOptions() {
  assetSelect.innerHTML = assets.map((asset) => `<option>${asset}</option>`).join("");
}

function drawGraph(asset) {
  const links = graphLinks[asset];
  const names = [...new Set(links.flatMap((link) => [link[0], link[1]]))];
  const center = { x: 380, y: 210 };
  const radiusX = 255;
  const radiusY = 145;
  const positions = {};

  positions[asset] = center;
  names
    .filter((name) => name !== asset)
    .forEach((name, index, list) => {
      const angle = (Math.PI * 2 * index) / list.length - Math.PI / 2;
      positions[name] = {
        x: center.x + Math.cos(angle) * radiusX,
        y: center.y + Math.sin(angle) * radiusY
      };
    });

  const edges = links
    .map(([from, to, label]) => {
      const a = positions[from];
      const b = positions[to];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      return `
        <line class="edge" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>
        <text class="edge-label" x="${mx}" y="${my - 8}">${label}</text>
      `;
    })
    .join("");

  const nodes = names
    .map((name) => {
      const pos = positions[name];
      const isCenter = name === asset;
      const fill = isCenter ? "#7bd3a4" : "#ffffff";
      const stroke = isCenter ? "#0d5d3e" : "#dbe4df";
      return `
        <g class="node">
          <rect x="${pos.x - 72}" y="${pos.y - 24}" width="144" height="48" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"></rect>
          <text x="${pos.x}" y="${pos.y + 5}">${name}</text>
        </g>
      `;
    })
    .join("");

  graph.innerHTML = `${edges}${nodes}`;
}

function renderInsights() {
  insightList.innerHTML = insights
    .map(
      (insight) => `
      <article class="insight">
        <strong>${insight.title}</strong>
        <p>${insight.body}</p>
      </article>
    `
    )
    .join("");
}

function simulateDocumentUpload(files = []) {
  const incoming = files.length
    ? Array.from(files).map((file, index) => ({
        id: `UP-${Date.now()}-${index}`,
        title: file.name,
        type: "Uploaded",
        asset: "Plant",
        date: new Date().toISOString().slice(0, 10),
        page: "uploaded",
        text: `${file.name} was uploaded in demo mode and added to the searchable plant knowledge base.`
      }))
    : [
        {
          id: `UP-${Date.now()}`,
          title: "Uploaded Vendor Manual - Pump P-101",
          type: "Manual",
          asset: "Pump P-101",
          date: new Date().toISOString().slice(0, 10),
          page: "demo",
          text: "Vendor manual notes that high bearing temperature is commonly caused by blocked lubrication lines or shaft misalignment."
        }
      ];

  state.documents = [...incoming, ...state.documents];
  renderStats();
  renderDocuments();
  addMessage(
    "ai",
    `<span class="confidence">Ingestion complete</span><p>${incoming.length} document${incoming.length > 1 ? "s" : ""} parsed, chunked, embedded, and linked into the graph index.</p>`
  );
}

function runRootCauseAnimation() {
  rootCauseScore.textContent = "0%";
  meterFill.style.width = "0%";
  let score = 0;
  const timer = window.setInterval(() => {
    score += 6;
    if (score >= 78) {
      score = 78;
      window.clearInterval(timer);
    }
    rootCauseScore.textContent = `${score}%`;
    meterFill.style.width = `${score}%`;
  }, 35);
}

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(questionInput.value);
  questionInput.value = "";
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => submitQuestion(button.dataset.question));
});

fileInput.addEventListener("change", () => simulateDocumentUpload(fileInput.files));
simulateUpload.addEventListener("click", () => simulateDocumentUpload());
assetSelect.addEventListener("change", () => drawGraph(assetSelect.value));
runRca.addEventListener("click", runRootCauseAnimation);

renderStats();
renderDocuments();
renderAssetOptions();
drawGraph("Pump P-101");
renderInsights();
runRootCauseAnimation();
addMessage(
  "ai",
  '<span class="confidence">PlantMind online</span><p>Ask me about equipment history, SOP guidance, root cause patterns, or compliance traceability. I will answer with citations from the indexed plant documents.</p>'
);
