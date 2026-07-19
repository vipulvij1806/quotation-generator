/**
 * app.js — Monika Makeovers Quotation Builder
 * Handles all state, rendering, and PDF generation logic.
 */

/* ─── State ─────────────────────────────────────────── */
let dateCounter = 0;
let itemCounter = 0;
const STATE = { dates: [] };

/* ─── Initialise ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  addDate();
  loadSavedQuotations();
});

/* ─── LocalStorage & Save/Load ──────────────────────── */
function saveQuotationToStorage(name) {
  const client = {
    name: document.getElementById("cName").value.trim(),
    phone: document.getElementById("cPhone").value.trim(),
    location: document.getElementById("cLocation").value.trim(),
    note: document.getElementById("cNote").value.trim(),
  };
  
  const quotation = {
    id: Date.now(),
    timestamp: new Date().toLocaleString("en-IN"),
    clientName: client.name || "Unnamed",
    name: name || `Quotation_${new Date().toISOString().split('T')[0]}`,
    client: client,
    state: JSON.parse(JSON.stringify(STATE)),
  };
  
  let saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  saved.unshift(quotation);
  localStorage.setItem("monika_quotations", JSON.stringify(saved));
  
  loadSavedQuotations();
  alert(`✓ Quotation saved as "${quotation.name}"`);
}

function loadQuotationFromStorage(id) {
  const saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  const quotation = saved.find(q => q.id === id);
  
  if (!quotation) {
    alert("Quotation not found");
    return;
  }
  
  // Load client details
  document.getElementById("cName").value = quotation.client.name || "";
  document.getElementById("cPhone").value = quotation.client.phone || "";
  document.getElementById("cLocation").value = quotation.client.location || "";
  document.getElementById("cNote").value = quotation.client.note || "";
  
  // Load state
  Object.assign(STATE, JSON.parse(JSON.stringify(quotation.state)));
  
  // Reset counters
  dateCounter = 0;
  itemCounter = 0;
  
  renderSidebar();
  alert(`✓ Quotation "${quotation.name}" loaded`);
}

function deleteQuotationFromStorage(id) {
  if (!confirm("Are you sure you want to delete this quotation?")) return;
  
  let saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  saved = saved.filter(q => q.id !== id);
  localStorage.setItem("monika_quotations", JSON.stringify(saved));
  
  loadSavedQuotations();
}

function loadSavedQuotations() {
  const saved = JSON.parse(localStorage.getItem("monika_quotations")) || [];
  const list = document.getElementById("savedList");
  
  if (!list) return;
  
  list.innerHTML = "";
  
  if (saved.length === 0) {
    list.innerHTML = `<div style="font-size:10px;color:#999;padding:8px;text-align:center;">No saved quotations</div>`;
    return;
  }
  
  saved.slice(0, 10).forEach(q => {
    const item = document.createElement("div");
    item.className = "saved-item";
    item.innerHTML = `
      <div class="saved-item-name" title="${q.name}">${q.name}</div>
      <button class="saved-item-btn saved-item-load" onclick="loadQuotationFromStorage(${q.id})" title="Load">↻</button>
      <button class="saved-item-btn saved-item-delete" onclick="deleteQuotationFromStorage(${q.id})" title="Delete">×</button>
    `;
    list.appendChild(item);
  });
}

function exportQuotationAsJSON() {
  const client = {
    name: document.getElementById("cName").value.trim(),
    phone: document.getElementById("cPhone").value.trim(),
    location: document.getElementById("cLocation").value.trim(),
    note: document.getElementById("cNote").value.trim(),
  };
  
  const exportData = {
    exportDate: new Date().toISOString(),
    client: client,
    state: STATE,
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  
  link.href = url;
  link.download = `quotation_${client.name || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

function importQuotationFromJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      // Load client details
      document.getElementById("cName").value = data.client.name || "";
      document.getElementById("cPhone").value = data.client.phone || "";
      document.getElementById("cLocation").value = data.client.location || "";
      document.getElementById("cNote").value = data.client.note || "";
      
      // Load state
      Object.assign(STATE, JSON.parse(JSON.stringify(data.state)));
      
      // Reset counters
      dateCounter = 0;
      itemCounter = 0;
      
      renderSidebar();
      alert("✓ Quotation imported successfully");
    } catch (err) {
      alert("Error importing quotation: " + err.message);
    }
  };
  reader.readAsText(file);
}

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
    // Initialize custom items array for custom package
    if (pk === "custom") {
      ev.pkgs[pk]["customItems"] = [];
    }
    // Initialize package notes
    ev.pkgs[pk]["pkgNote"] = "";
    // Initialize salon per guest fields
    if (pk === "salonGuest") {
      ev.pkgs[pk] = {
        serviceType: "makeup_hair_draping",
        guestCount: 1,
        pricePerGuest: 0,
        note: "",
        pkgNote: "",
      };
    }
    // Initialize salon per artist fields
    if (pk === "salonArtist") {
      ev.pkgs[pk] = {
        serviceType: "makeup_hair_draping",
        artistCount: 1,
        pricePerArtist: 0,
        note: "",
        pkgNote: "",
      };
    }
  }
  renderSidebar();
}

function setField(dateId, eventId, pk, fieldKey, value) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs[pk]) {
    if (fieldKey === "pkgNote") {
      ev.pkgs[pk][fieldKey] = value;
    } else {
      ev.pkgs[pk][fieldKey] = parseFloat(value) || 0;
    }
  }
}

function setSalonGuestField(dateId, eventId, fieldKey, value) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs["salonGuest"]) {
    if (fieldKey === "guestCount") {
      ev.pkgs["salonGuest"][fieldKey] = parseInt(value) || 1;
    } else if (fieldKey === "pricePerGuest") {
      ev.pkgs["salonGuest"][fieldKey] = parseFloat(value) || 0;
    } else if (fieldKey === "serviceType") {
      ev.pkgs["salonGuest"][fieldKey] = value;
    } else if (fieldKey === "note") {
      ev.pkgs["salonGuest"][fieldKey] = value;
    } else if (fieldKey === "pkgNote") {
      ev.pkgs["salonGuest"][fieldKey] = value;
    }
  }
}

function setSalonArtistField(dateId, eventId, fieldKey, value) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs["salonArtist"]) {
    if (fieldKey === "artistCount") {
      ev.pkgs["salonArtist"][fieldKey] = parseInt(value) || 1;
    } else if (fieldKey === "pricePerArtist") {
      ev.pkgs["salonArtist"][fieldKey] = parseFloat(value) || 0;
    } else if (fieldKey === "serviceType") {
      ev.pkgs["salonArtist"][fieldKey] = value;
    } else if (fieldKey === "note") {
      ev.pkgs["salonArtist"][fieldKey] = value;
    } else if (fieldKey === "pkgNote") {
      ev.pkgs["salonArtist"][fieldKey] = value;
    }
  }
}

function getEvent(dateId, eventId) {
  return STATE.dates
    .find((x) => x.id === dateId)
    ?.events.find((e) => e.id === eventId);
}

/* ─── Custom item helpers ───────────────────────────── */
function addCustomItem(dateId, eventId, pk) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs[pk] && pk === "custom") {
    if (!ev.pkgs[pk]["customItems"]) {
      ev.pkgs[pk]["customItems"] = [];
    }
    ev.pkgs[pk]["customItems"].push({
      id: "ci" + itemCounter++,
      name: "",
      price: 0,
      qty: 1,
    });
    renderSidebar();
  }
}

function removeCustomItem(dateId, eventId, pk, itemId) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs[pk] && pk === "custom") {
    ev.pkgs[pk]["customItems"] = ev.pkgs[pk]["customItems"].filter(
      (item) => item.id !== itemId
    );
    renderSidebar();
  }
}

function setCustomItemField(dateId, eventId, pk, itemId, field, value) {
  const ev = getEvent(dateId, eventId);
  if (ev && ev.pkgs[pk] && pk === "custom") {
    const item = ev.pkgs[pk]["customItems"].find((ci) => ci.id === itemId);
    if (item) {
      if (field === "name") {
        item.name = value;
      } else {
        item[field] = parseFloat(value) || 0;
      }
    }
  }
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

    if (k === "custom") {
      // Custom items section
      const customItems = pdata["customItems"] || [];
      customItems.forEach((item) => {
        opts += `<div class="custom-item-row">
          <input type="text" class="custom-name" placeholder="Item name" value="${item.name}"
            onchange="setCustomItemField('${dateId}','${ev.id}','${k}','${item.id}','name',this.value)" />
          <input type="number" class="custom-price" placeholder="Price" min="0" value="${item.price}"
            onchange="setCustomItemField('${dateId}','${ev.id}','${k}','${item.id}','price',this.value)" />
          <input type="number" class="custom-qty" placeholder="Qty" min="1" value="${item.qty}"
            onchange="setCustomItemField('${dateId}','${ev.id}','${k}','${item.id}','qty',this.value)" />
          <button class="item-rm-btn" onclick="removeCustomItem('${dateId}','${ev.id}','${k}','${item.id}')">×</button>
        </div>`;
      });
      opts += `<button class="add-item-btn" onclick="addCustomItem('${dateId}','${ev.id}','${k}')">+ Add Item</button>`;
    } else if (k === "salonGuest") {
      // Salon per guest fields
      const st = pdata["serviceType"] || "makeup_hair_draping";
      const gc = pdata["guestCount"] || 1;
      const ppg = pdata["pricePerGuest"] || 0;
      const note = pdata["note"] || "";
      const pkgNote = pdata["pkgNote"] || "";
      
      opts += `<div class="price-row">
        <span class="price-lbl">Service Type</span>
        <select onchange="setSalonGuestField('${dateId}','${ev.id}','serviceType',this.value)">
          <option value="makeup_hair_draping" ${st === "makeup_hair_draping" ? "selected" : ""}>Makeup, Hair & Draping</option>
          <option value="hair_draping" ${st === "hair_draping" ? "selected" : ""}>Hair & Draping</option>
        </select>
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">No. of guests (approx)</span>
        <input type="number" class="qi" value="${gc}" min="1"
          onchange="setSalonGuestField('${dateId}','${ev.id}','guestCount',this.value)" />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Price per guest (₹)</span>
        <input type="number" class="pi" value="${ppg}" min="0"
          onchange="setSalonGuestField('${dateId}','${ev.id}','pricePerGuest',this.value)" />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Total Cost (₹)</span>
        <input type="number" class="pi" value="${gc * ppg}" disabled />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl discount-lbl">Discount (₹)</span>
        <input type="number" class="pi discount-input" value="${pdata["disc"] || 0}" min="0"
          onchange="setField('${dateId}','${ev.id}','${k}','disc',this.value)" />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Service Note</span>
        <textarea class="salon-note" placeholder="Add notes..." onchange="setSalonGuestField('${dateId}','${ev.id}','note',this.value)">${note}</textarea>
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Package Notes (for receipt)</span>
        <textarea class="salon-note" placeholder="Bullet points, conditions..." onchange="setSalonGuestField('${dateId}','${ev.id}','pkgNote',this.value)">${pkgNote}</textarea>
      </div>`;
    } else if (k === "salonArtist") {
      // Salon per artist fields
      const st = pdata["serviceType"] || "makeup_hair_draping";
      const ac = pdata["artistCount"] || 1;
      const ppa = pdata["pricePerArtist"] || 0;
      const note = pdata["note"] || "";
      const pkgNote = pdata["pkgNote"] || "";
      
      opts += `<div class="price-row">
        <span class="price-lbl">Service Type</span>
        <select onchange="setSalonArtistField('${dateId}','${ev.id}','serviceType',this.value)">
          <option value="makeup_hair_draping" ${st === "makeup_hair_draping" ? "selected" : ""}>Makeup, Hair & Draping</option>
          <option value="hair_draping" ${st === "hair_draping" ? "selected" : ""}>Hair & Draping</option>
        </select>
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Approx no. of guests</span>
        <input type="number" class="qi" value="${ac}" min="1"
          onchange="setSalonArtistField('${dateId}','${ev.id}','artistCount',this.value)" />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Price per artist (₹)</span>
        <input type="number" class="pi" value="${ppa}" min="0"
          onchange="setSalonArtistField('${dateId}','${ev.id}','pricePerArtist',this.value)" />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Total Cost (₹)</span>
        <input type="number" class="pi" value="${ac * ppa}" disabled />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl discount-lbl">Discount (₹)</span>
        <input type="number" class="pi discount-input" value="${pdata["disc"] || 0}" min="0"
          onchange="setField('${dateId}','${ev.id}','${k}','disc',this.value)" />
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Service Note</span>
        <textarea class="salon-note" placeholder="Add notes..." onchange="setSalonArtistField('${dateId}','${ev.id}','note',this.value)">${note}</textarea>
      </div>`;
      opts += `<div class="price-row">
        <span class="price-lbl">Package Notes (for receipt)</span>
        <textarea class="salon-note" placeholder="Bullet points, conditions..." onchange="setSalonArtistField('${dateId}','${ev.id}','pkgNote',this.value)">${pkgNote}</textarea>
      </div>`;
    } else {
      // Standard editable fields
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

      const pkgNote = pdata["pkgNote"] || "";
      opts += `<div class="price-row">
        <span class="price-lbl">Package Notes (for receipt)</span>
        <textarea class="salon-note" placeholder="Bullet points, conditions..." onchange="setField('${dateId}','${ev.id}','${k}','pkgNote',this.value)">${pkgNote}</textarea>
      </div>`;
    }

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

  if (pk === "custom") {
    // Calculate custom items total
    const customItems = pd["customItems"] || [];
    customItems.forEach((item) => {
      total += (item.price || 0) * (item.qty || 1);
    });
  } else if (pk === "salonGuest") {
    // Salon per guest: guestCount * pricePerGuest
    const gc = parseInt(pd["guestCount"]) || 1;
    const ppg = parseFloat(pd["pricePerGuest"]) || 0;
    total = gc * ppg;
  } else if (pk === "salonArtist") {
    // Salon per artist: artistCount * pricePerArtist
    const ac = parseInt(pd["artistCount"]) || 1;
    const ppa = parseFloat(pd["pricePerArtist"]) || 0;
    total = ac * ppa;
  } else {
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
  }

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
function buildReceiptHTML(name, phone, location, note, qno, today) {
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

        if (k === "custom") {
          // Custom items rendering
          const customItems = pd["customItems"] || [];
          customItems.forEach((item) => {
            if (item.name) {
              const itemTotal = (item.price || 0) * (item.qty || 1);
              rows += `<tr>
                <td>${item.name}</td>
                <td class="td-center">${item.qty}</td>
                <td>₹${(item.price || 0).toLocaleString("en-IN")}</td>
                <td class="td-right">₹${itemTotal.toLocaleString("en-IN")}</td>
              </tr>`;
            }
          });
        } else if (k === "salonGuest") {
          // Salon per guest rendering
          const serviceLabel = pd["serviceType"] === "makeup_hair_draping" ? "Makeup, Hair & Draping" : "Hair & Draping";
          const gc = parseInt(pd["guestCount"]) || 1;
          const ppg = parseFloat(pd["pricePerGuest"]) || 0;
          const total = gc * ppg;
          
          rows += `<tr>
            <td>${serviceLabel}</td>
            <td class="td-center">${gc}</td>
            <td>₹${ppg.toLocaleString("en-IN")}</td>
            <td class="td-right">₹${total.toLocaleString("en-IN")}</td>
          </tr>`;
          
          if (pd["note"]) {
            rows += `<tr><td colspan="4" class="td-note">${pd["note"]}</td></tr>`;
          }
        } else if (k === "salonArtist") {
          // Salon per artist rendering
          const serviceLabel = pd["serviceType"] === "makeup_hair_draping" ? "Makeup, Hair & Draping" : "Hair & Draping";
          const ac = parseInt(pd["artistCount"]) || 1;
          const ppa = parseFloat(pd["pricePerArtist"]) || 0;
          const total = ac * ppa;
          
          rows += `<tr>
            <td>${serviceLabel}</td>
            <td class="td-center">${ac}</td>
            <td>₹${ppa.toLocaleString("en-IN")}</td>
            <td class="td-right">₹${total.toLocaleString("en-IN")}</td>
          </tr>`;
          
          if (pd["note"]) {
            rows += `<tr><td colspan="4" class="td-note">${pd["note"]}</td></tr>`;
          }
        } else {
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
          </table>`;
        
        // Add package notes if they exist
        const pkgNote = pd["pkgNote"] || "";
        if (pkgNote) {
          pkgBlocks += `<div class="pkg-notes">
            ${pkgNote.split('\n').map(line => line.trim() ? `<div class="pkg-note-line">• ${line.trim()}</div>` : '').join('')}
          </div>`;
        }
        
        pkgBlocks += `</div>`;
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

/* ─── Generate filename ────────────────────────────── */
function generateFilename() {
  const activeDates = STATE.dates.filter((d) =>
    d.events.some((e) => Object.keys(e.pkgs).length > 0)
  );
  
  let dateStr = "";
  if (activeDates.length > 0 && activeDates[0].date) {
    const d = new Date(activeDates[0].date + "T00:00");
    dateStr = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
  } else {
    dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '-');
  }
  
  const serviceTypes = new Set();
  activeDates.forEach(d => {
    d.events.forEach(e => {
      Object.keys(e.pkgs).forEach(pk => {
        serviceTypes.add(pk);
      });
    });
  });
  
  const services = Array.from(serviceTypes).join("_") || "quotation";
  return `Services_${services}_${dateStr}_Monikamakeovers`;
}

/* ─── Generate receipt ──────────────────────────────── */
function generate() {
  const name     = document.getElementById("cName").value.trim()  || "Valued Client";
  const phone    = document.getElementById("cPhone").value.trim() || "";
  const location = document.getElementById("cLocation").value.trim() || "";
  const note     = document.getElementById("cNote").value.trim()  ||
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
    name, phone, location, note, qno, today
  );

  const preview = document.getElementById("previewArea");
  const filename = generateFilename();
  preview.innerHTML = `
    <div class="button-group no-print">
      <button class="print-btn" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
        Save as PDF
      </button>
      <button class="save-json-btn" onclick="exportQuotationAsJSON()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        Save JSON
      </button>
    </div>
    <div class="filename-info no-print">Filename: <strong>${filename}.pdf</strong></div>

    <div id="receipt">

      <div class="r-header">
        <div class="r-brand">
          <div class="r-brand-name">Monika Makeovers</div>
          <div class="r-brand-sub">Makeup Artist</div>
        </div>
        <div class="r-header-right">
          <div class="r-meta">
            <div class="r-qno">${qno}</div>
            <div class="r-date">Issued: ${today}</div>
          </div>
        </div>
      </div>

      <div class="r-client">
        <div class="ci"><span class="ck">Client</span><span class="cv">${name}</span></div>
        ${phone ? `<div class="ci"><span class="ck">Phone</span><span class="cv">${phone}</span></div>` : ""}
        ${location ? `<div class="ci"><span class="ck">Location</span><span class="cv">${location}</span></div>` : ""}
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
        <div class="r-footer-social">
          <a href="${CONTACT.instagram}" target="_blank" class="social-link">📷 Instagram</a>
          <span class="footer-divider">|</span>
          <a href="${CONTACT.wedme}" target="_blank" class="social-link">💍 WedMeGood</a>
        </div>
        <div class="r-footer-contact">
          ${CONTACT.phone1} &nbsp;|&nbsp; ${CONTACT.phone2}
        </div>
        <div class="r-footer-tag">${CONTACT.tagline}</div>
      </div>

    </div>
  `;
}
