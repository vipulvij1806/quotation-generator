const PKGS = {
  bridal: { label:"Bridal Package", fields:[{k:"bridalLook",l:"Bridal look",def:18000},{k:"trial",l:"Pre-bridal trial",def:5000},{k:"draping",l:"Draping",def:800}], hasQty:false },
  hd: { label:"HD Guest Makeup", fields:[{k:"fullLook",l:"Full look (HD)",def:7500},{k:"onlyMakeup",l:"Only makeup (HD)",def:6000},{k:"hair",l:"Hairstyle",def:1500},{k:"draping",l:"Draping",def:800}], hasQty:true },
  basic: { label:"Basic Guest Makeup", fields:[{k:"fullLook",l:"Full look (Basic)",def:4500},{k:"onlyMakeup",l:"Only makeup (Basic)",def:3000},{k:"hair",l:"Hairstyle",def:1500},{k:"draping",l:"Draping",def:800}], hasQty:true }
};

let dateCount = 0, quoteSeq = 1;
const state = { dates: [] };

function addDate() {
  const id = 'd' + dateCount++;
  state.dates.push({ id, events: [] });
  renderDates();
  addEvent(id);
}

function addEvent(dateId) {
  const d = state.dates.find(x => x.id === dateId);
  if (!d) return;
  const eid = 'e' + (Math.random()*9999|0);
  d.events.push({ id:eid, name:'', pkgs:{} });
  renderDates();
}

function renderDates() {
  const el = document.getElementById('datesList');
  el.innerHTML = '';
  state.dates.forEach((d,di) => {
    const db = document.createElement('div');
    db.className = 'date-block';
    db.innerHTML = `<div class="date-head">Date ${di+1}</div>
      <input type="date" onchange="state.dates.find(x=>x.id==='${d.id}').date=this.value" />
      <div id="evts_${d.id}"></div>
      <button class="add-btn" onclick="addEvent('${d.id}')">+ Add event</button>`;
    el.appendChild(db);
    renderEvents(d);
  });
}

function renderEvents(d) {
  const el = document.getElementById('evts_'+d.id);
  el.innerHTML = '';
  d.events.forEach((ev,ei) => {
    const eb = document.createElement('div');
    eb.className = 'event-block';
    eb.innerHTML = `<div class="event-head">Event ${ei+1}</div>
      <input type="text" placeholder="e.g. Wedding" onchange="ev.name=this.value" />`;
    el.appendChild(eb);
  });
}

function generateQuote() {
  const name = document.getElementById('clientName').value || 'Valued Client';
  const phone = document.getElementById('clientPhone').value || '';
  document.getElementById('previewArea').innerHTML = `
    <div class="quote-wrap">
      <h2>Quotation for ${name}</h2>
      <p>Contact: ${phone}</p>
      <p>Events: ${state.dates.length}</p>
      <button onclick="window.print()">Print / Save PDF</button>
    </div>`;
}

addDate();
