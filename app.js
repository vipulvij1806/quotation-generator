/**
 * app.js — Monika Makeovers Quotation Builder
 * Handles all state, rendering, and PDF generation logic.
 */

/* ─── State ─────────────────────────────────────────── */
let dateCounter = 0;
const STATE = { dates: [] };

/* ─── Initialise ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  addDate();
});

/* ─── Date helpers ──────────────────────────────────── */
function addDate() {
  const id = "d" + dateCounter++;
  STATE.dates.push({ id, date: "", events: [] });
  renderSidebar();
  addEvent(id);
}

function removeDate(id) {
  STATE.dates = STATE.dates.filter((d) => d.id !== id);
  renderSidebar();
}

function setDate(id, value) {
  const d = STATE.dates.find((x) => x.id === id);
  if (d) d.date = value;
}

/* ─── Event helpers ─────────────────────────────────── */
function addEvent(dateId) {
  const d = STATE.dates.find((x) => x.id === dateId);
  if (!d) return;
  d.events.push({
    id: "e" + Math.floor(Math.random() * 99999),
    name: "",
    pkgs: {},
  });
  renderSidebar();
}

function removeEvent(dateId, eventId) {
  const d = STATE.dates.find((x) => x.id === dateId);
  if (!d) return;
  d.events = d.events.filter((e) => e.id !== eventId);
  renderSidebar();
}

function setEventName(dateId, eventId, value) {
  const ev = getEvent(dateId, eventId);
  if (ev) ev.name = value;
}

/* ─── Package helpers ───────────────────────────────── */
function togglePkg(dateId, eventId, pk) {
  const ev = getEvent(dateId, eventId);
  if (!ev) return;
  if (ev.pkgs[pk]) {
    delete ev.pkgs[pk];
  } else {
    ev.pkgs[pk] = {};
    PKGS[pk].fields.forEach((f) => {
      ev.pkgs[pk][f.k] = f.d;
    });
  }
  renderSidebar();
}

function setField(dateId, eventId, pk, fieldKey, value) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs[pk]) {
    ev.pkgs[pk][fieldKey] = parseFloat(value) || 0;
  }
}

function getEvent(dateId, eventId) {
  return STATE.dates
    .find((x) => x.id === dateId)
    ?.events.find((e) => e.id === eventId);
}

/* ─── Sidebar renderer ──────────────────────────────── */
function renderSidebar() {
  const list = document.getElementById("datesList");
  list.innerHTML = "";

  STATE.dates.forEach((d, di) => {
    const db = document.createElement("div");
    db.className = "date-block";

    /* Date header */
    db.innerHTML = `
      <div class="d-head">
        <span class="d-label">Date ${di + 1}</span>
        <button class="rm-btn" aria-label="Remove date" onclick="removeDate('${d.id}')">×</button>
      </div>
      <div class="field">
        <label class="lbl">Date</label>
        <input type="date" value="${d.date}" onchange="setDate('${d.id}', this.value)" />
      </div>
      <div id="evts_${d.id}"></div>
      <button class="add-btn" onclick="addEvent('${d.id}')">+ Add event on this date</button>
    `;

    list.appendChild(db);

    /* Events */
    const evContainer = db.querySelector("#evts_" + d.id);
    d.events.forEach((ev, ei) => {
      evContainer.appendChild(buildEventBlock(d.id, ev, ei));
    });
  });
}

function buildEventBlock(dateId, ev, index) {
  const eb = document.createElement("div");
  eb.className = "event-block";

  /* Package checkboxes */
  let chips = '<div class="pkg-grid">';
  Object.entries(PKGS).forEach(([k, p]) => {
    const on = ev.pkgs[k] ? "on" : "";
    chips += `
      <div class="pkg-chip ${on}" onclick="togglePkg('${dateId}','${ev.id}','${k}')">
        <span class="chk">${ev.pkgs[k] ? "✓" : ""}</span>
        <span>${p.label}</span>
      </div>`;
  });
  chips += "</div>";

  /* Package options */
  let opts = '<div class="pkg-opts">';
  Object.entries(ev.pkgs).forEach(([k, pdata]) => {
    const p = PKGS[k];
    opts += `<div class="opt-box">
      <div class="opt-head" style="color:${p.color}">${p.label}</div>`;

    p.fields.forEach((f) => {
      const val = pdata[f.k] !== undefined ? pdata[f.k] : f.d;
      opts += `<div class="price-row">
        <span class="price-lbl">${f.l}</span>
        <input type="number" class="pi" value="${val}" min="0"
          onchange="setField('${dateId}','${ev.id}','${k}','${f.k}',this.value)" />`;
      if (p.qty) {
        const q = pdata[f.k + "_q"] || 1;
        opts += `<input type="number" class="qi" value="${q}" min="1" title="Quantity / guests"
          onchange="setField('${dateId}','${ev.id}','${k}','${f.k}_q',this.value)" />`;
      }
      opts += "</div>";
    });

    if (p.guestField) {
      const g = pdata["guests"] || 1;
      opts += `<div class="price-row">
        <span class="price-lbl">No. of guests</span>
        <input type="number" class="qi" value="${g}" min="1"
          onchange="setField('${dateId}','${ev.id}','${k}','guests',this.value)" />
      </div>`;
    }

    if (p.artistField) {
      const a = pdata["artists"] || 1;
      opts += `<div class="price-row">
        <span class="price-lbl">No. of artists</span>
        <input type="number" class="qi" value="${a}" min="1"
          onchange="setField('${dateId}','${ev.id}','${k}','artists',this.value)" />
      </div>`;
    }

    const disc = pdata["disc"] || 0;
    opts += `<div class="price-row">
      <span class="price-lbl discount-lbl">Discount (₹)</span>
      <input type="number" class="pi discount-input" value="${disc}" min="0"
        onchange="setField('${dateId}','${ev.id}','${k}','disc',this.value)" />
    </div>`;

    opts += "</div>"; /* end opt-box */
  });
  opts += "</div>"; /* end pkg-opts */

  eb.innerHTML = `
    <div class="ev-head">
      <span class="ev-label">Event ${index + 1}</span>
      <button class="rm-btn" aria-label="Remove event" onclick="removeEvent('${dateId}','${ev.id}')">×</button>
    </div>
    <div class="field">
      <label class="lbl">Event Name</label>
      <input type="text" value="${ev.name}"
        placeholder="e.g. Mehendi, Sangeet, Wedding"
        onchange="setEventName('${dateId}','${ev.id}',this.value)" />
    </div>
    <div class="lbl" style="margin-bottom:4px">Packages</div>
    ${chips}
    ${opts}
  `;

  return eb;
}

/* ─── Calculation ───────────────────────────────────── */
function calcPkgTotal(pk, pd) {
  const p = PKGS[pk];
  let total = 0;
  p.fields.forEach((f) => {
    const v = parseFloat(pd[f.k]) || 0;
    if (p.qty) {
      total += v * (parseInt(pd[f.k + "_q"]) || 1);
    } else if (p.artistField && f.k === "rate") {
      total += v * (parseInt(pd["artists"]) || 1);
    } else {
      total += v;
    }
  });
  return Math.max(0, total - (parseFloat(pd["disc"]) || 0));
}

/* ─── Date formatter ────────────────────────────────── */
function fmtDate(ds) {
  if (!ds) return "Date to be confirmed";
  try {
    return new Date(ds + "T00:00").toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return ds;
  }
}

/* ─── Receipt HTML builder ──────────────────────────── */
function buildReceiptHTML(name, phone, note, qno, today) {
  let grand = 0;
  let body = "";

  const activeDates = STATE.dates.filter((d) =>
    d.events.some((e) => Object.keys(e.pkgs).length > 0)
  );

  activeDates.forEach((d) => {
    const activeEvts = d.events.filter((e) => Object.keys(e.pkgs).length > 0);
    body += `<div class="date-section">
      <div class="date-pill">📅 ${fmtDate(d.date)}</div>`;

    activeEvts.forEach((ev) => {
      let evTotal = 0;
      let pkgBlocks = "";

      Object.entries(ev.pkgs).forEach(([k, pd]) => {
        const p = PKGS[k];
        const pt = calcPkgTotal(k, pd);
        evTotal += pt;
        grand += pt;

        let rows = "";
        p.fields.forEach((f) => {
          const v = parseFloat(pd[f.k]) || 0;
          if (!v) return;
          if (p.qty) {
            const q = parseInt(pd[f.k + "_q"]) || 1;
            rows += `<tr>
              <td>${f.l}</td>
              <td class="td-center">${q}</td>
              <td>₹${v.toLocaleString("en-IN")}</td>
              <td class="td-right">₹${(v * q).toLocaleString("en-IN")}</td>
            </tr>`;
          } else if (p.artistField && f.k === "rate") {
            const a = parseInt(pd["artists"]) || 1;
            rows += `<tr>
              <td>${f.l}</td>
              <td class="td-center">${a} artists</td>
              <td>₹${v.toLocaleString("en-IN")}</td>
              <td class="td-right">₹${(v * a).toLocaleString("en-IN")}</td>
            </tr>`;
          } else {
            rows += `<tr>
              <td colspan="2">${f.l}</td>
              <td></td>
              <td class="td-right">₹${v.toLocaleString("en-IN")}</td>
            </tr>`;
          }
        });

        if (p.guestField) {
          const g = parseInt(pd["guests"]) || 1;
          rows += `<tr><td colspan="4" class="td-note">For ${g} guests</td></tr>`;
        }

        const disc = parseFloat(pd["disc"]) || 0;
        if (disc) {
          rows += `<tr>
            <td colspan="3" class="td-discount">Discount</td>
            <td class="td-right td-discount">−₹${disc.toLocaleString("en-IN")}</td>
          </tr>`;
        }

        pkgBlocks += `<div class="pkg-block">
          <span class="pkg-badge" style="background:${p.bg};color:${p.color}">${p.label}</span>
          <table class="svc-table">
            <thead>
              <tr>
                <th style="width:42%">Service</th>
                <th style="width:12%;text-align:center">Qty</th>
                <th style="width:20%">Rate</th>
                <th style="width:26%;text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr class="subtotal-row">
                <td colspan="3">Subtotal</td>
                <td class="td-right">₹${pt.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>`;
      });

      const multi = Object.keys(ev.pkgs).length > 1;
      body += `<div class="event-section">
        <div class="event-title">${ev.name || "Event"}</div>
        ${pkgBlocks}
        ${multi ? `<div class="event-total">Event total: ₹${evTotal.toLocaleString("en-IN")}</div>` : ""}
      </div>`;
    });

    body += `</div><div class="divider"></div>`;
  });

  const totalDates = activeDates.length;
  const totalEvts = activeDates.reduce(
    (a, d) => a + d.events.filter((e) => Object.keys(e.pkgs).length > 0).length,
    0
  );

  return { html: body, grand, totalDates, totalEvts };
}

/* ─── Generate receipt ──────────────────────────────── */
function generate() {
  const name  = document.getElementById("cName").value.trim()  || "Valued Client";
  const phone = document.getElementById("cPhone").value.trim() || "";
  const note  = document.getElementById("cNote").value.trim()  ||
    "Conveyance charges extra. False eyelashes & lenses included in HD makeup. Minimum 4–5 guests for guest packages.";

  if (!STATE.dates.length) {
    alert("Please add at least one date.");
    return;
  }
  const hasPackages = STATE.dates.some((d) =>
    d.events.some((e) => Object.keys(e.pkgs).length > 0)
  );
  if (!hasPackages) {
    alert("Please select at least one package for an event.");
    return;
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const qno = "MM-" + String(Math.floor(Math.random() * 900) + 100);

  const { html: body, grand, totalDates, totalEvts } = buildReceiptHTML(
    name, phone, note, qno, today
  );

  const preview = document.getElementById("previewArea");
  preview.innerHTML = `
    <button class="print-btn no-print" onclick="window.print()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Save as PDF / Print
    </button>

    <div id="receipt">

      <div class="r-header">
        <div class="r-brand">
          <div class="r-brand-name">Monika Makeovers</div>
          <div class="r-brand-sub">Makeup Artist</div>
        </div>
        <div class="r-header-right">
          <img src="logo.png" alt="Monika Makeovers Logo" class="r-logo" />
          <div class="r-meta">
            <div class="r-qno">${qno}</div>
            <div class="r-date">Issued: ${today}</div>
          </div>
        </div>
      </div>

      <div class="r-client">
        <div class="ci"><span class="ck">Client</span><span class="cv">${name}</span></div>
        ${phone ? `<div class="ci"><span class="ck">Phone</span><span class="cv">${phone}</span></div>` : ""}
        <div class="ci">
          <span class="ck">Booking</span>
          <span class="cv">${totalEvts} event${totalEvts > 1 ? "s" : ""} · ${totalDates} date${totalDates > 1 ? "s" : ""}</span>
        </div>
      </div>

      <div class="r-body">${body}</div>

      <div class="r-grand">
        <span class="r-grand-label">Grand Total</span>
        <span class="r-grand-value">₹${grand.toLocaleString("en-IN")}</span>
      </div>

      ${note ? `<div class="r-note"><strong>Note:</strong> ${note}</div>` : ""}

      <div class="r-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>

      <div class="r-footer">
        <div class="r-footer-contact">
          ${CONTACT.phone1} &nbsp;|&nbsp; ${CONTACT.phone2}
        </div>
        <div class="r-footer-tag">${CONTACT.tagline}</div>
      </div>

    </div>
  `;
}
