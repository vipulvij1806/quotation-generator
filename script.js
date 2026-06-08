document.addEventListener("DOMContentLoaded", () => {
  const serviceCheckboxes = document.querySelectorAll("#services input[type=checkbox]");
  const pricingTable = document.getElementById("pricingTable");
  const subtotalEl = document.getElementById("subtotal");
  const grandTotalEl = document.getElementById("grandTotal");
  const discountEl = document.getElementById("discount");
  const generateBtn = document.getElementById("generateBtn");
  const previewSection = document.getElementById("preview");
  const quotationPreview = document.getElementById("quotationPreview");
  const editBtn = document.getElementById("editBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  function updateTotals() {
    let subtotal = 0;
    pricingTable.querySelectorAll("tr[data-service]").forEach(row => {
      const rate = parseFloat(row.querySelector(".rate").value) || 0;
      const qty = parseInt(row.querySelector(".qty").value) || 0;
      const total = rate * qty;
      row.querySelector(".total").textContent = total.toFixed(2);
      subtotal += total;
    });
    subtotalEl.textContent = subtotal.toFixed(2);
    const discount = parseFloat(discountEl.value) || 0;
    grandTotalEl.textContent = (subtotal - discount).toFixed(2);
  }

  serviceCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const service = cb.dataset.service;
      const rate = cb.dataset.rate;
      if (cb.checked) {
        const row = document.createElement("tr");
        row.setAttribute("data-service", service);
        row.innerHTML = `
          <td>${service}</td>
          <td><input type="number" class="rate" value="${rate}"></td>
          <td><input type="number" class="qty" value="1"></td>
          <td class="total">${rate}</td>
        `;
        pricingTable.appendChild(row);
        row.querySelectorAll("input").forEach(input => input.addEventListener("input", updateTotals));
      } else {
        const row = pricingTable.querySelector(`tr[data-service="${service}"]`);
        if (row) pricingTable.removeChild(row);
      }
      updateTotals();
    });
  });

  discountEl.addEventListener("input", updateTotals);

  generateBtn.addEventListener("click", () => {
    const name = document.getElementById("clientName").value;
    const date = document.getElementById("eventDate").value;
    const location = document.getElementById("eventLocation").value;
    const inclusions = document.getElementById("packageInclusions").value;

    let html = `
      <h2>Monika Makeovers Quotation</h2>
      <p><strong>Client:</strong> ${name}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Package Inclusions:</strong> ${inclusions}</p>
      <h3>Selected Services</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr><th>Service</th><th>Rate</th><th>Quantity</th><th>Total</th></tr>
    `;

    pricingTable.querySelectorAll("tr[data-service]").forEach(row => {
      const service = row.dataset.service;
      const rate = row.querySelector(".rate").value;
      const qty = row.querySelector(".qty").value;
      const total = row.querySelector(".total").textContent;
      html += `<tr><td>${service}</td><td>${rate}</td><td>${qty}</td><td>${total}</td></tr>`;
    });

    html += `
      </table>
      <p><strong>Subtotal:</strong> ${subtotalEl.textContent}</p>
      <p><strong>Discount:</strong> ${discountEl.value}</p>
      <p><strong>Grand Total:</strong> ${grandTotalEl.textContent}</p>
    `;

    quotationPreview.innerHTML = html;
    previewSection.style.display = "block";
    document.getElementById("pricing").style.display = "none";
    document.getElementById("services").style.display = "none";
    document.getElementById("client").style.display = "none";
  });

  editBtn.addEventListener
