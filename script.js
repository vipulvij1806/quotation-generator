// script.js
document.addEventListener('DOMContentLoaded', () => {
  const serviceCheckboxes = document.querySelectorAll('.services input[type=checkbox]');
  const pricingBody = document.querySelector('#pricingTable tbody');
  const subtotalEl = document.getElementById('subtotal');
  const grandTotalEl = document.getElementById('grandTotal');
  const discountEl = document.getElementById('discount');
  const printBtn = document.getElementById('printBtn');

  // Function to recalculate totals
  function recalc() {
    let subtotal = 0;
    pricingBody.querySelectorAll('tr').forEach(row => {
      const rate = parseFloat(row.querySelector('.rate').value) || 0;
      const qty = parseInt(row.querySelector('.qty').value) || 0;
      const total = rate * qty;
      row.querySelector('.total').textContent = total.toFixed(2);
      subtotal += total;
    });
    subtotalEl.textContent = subtotal.toFixed(2);
    const discount = parseFloat(discountEl.value) || 0;
    grandTotalEl.textContent = Math.max(0, subtotal - discount).toFixed(2);
  }

  // Add/remove rows when checkboxes are toggled
  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const service = cb.dataset.service;
      const rate = cb.dataset.rate || 0;
      if (cb.checked) {
        const tr = document.createElement('tr');
        tr.dataset.service = service;
        tr.innerHTML = `
          <td>${service}</td>
          <td><input class="rate" type="number" value="${rate}"></td>
          <td><input class="qty" type="number" value="1" min="1"></td>
          <td class="total">${parseFloat(rate).toFixed(2)}</td>
        `;
        pricingBody.appendChild(tr);
        tr.querySelectorAll('input').forEach(i => i.addEventListener('input', recalc));
      } else {
        const row = pricingBody.querySelector(\`tr[data-service="${service}"]\`);
        if (row) row.remove();
      }
      recalc();
    });
  });

  // Discount field updates totals
  discountEl.addEventListener('input', recalc);

  // Print button triggers PDF download
  printBtn.addEventListener('click', () => window.print());
});
