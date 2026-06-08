function goToPage(pageNum) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page' + pageNum).classList.remove('hidden');
  if (pageNum === 4) generateSummary();
}

function generateSummary() {
  const name = document.getElementById('clientName').value;
  const phone = document.getElementById('clientPhone').value;
  const note = document.getElementById('specialNote').value;
  const location = document.getElementById('location').value;

  const events = Array.from(document.querySelectorAll('#page1 input[type=checkbox]:checked'))
    .map(cb => cb.value);
  const packages = Array.from(document.querySelectorAll('#page2 input[type=checkbox]:checked'))
    .map(cb => cb.value);

  let html = `<p><strong>Client:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Location:</strong> ${location}</p>
              <p><strong>Note:</strong> ${note}</p>
              <p><strong>Events:</strong> ${events.join(', ')}</p>
              <p><strong>Packages:</strong> ${packages.join(', ')}</p>
              <h3>Inclusions</h3>
              <ul><li>Makeup</li><li>Hairstyle</li><li>Draping</li><li>Lenses</li><li>False Lashes</li></ul>
              <h3>Exclusions</h3>
              <ul><li>Conveyance Extra</li><li>Hair Extension: ₹1000–₹1500</li><li>Fresh Flowers</li><li>Hair Accessories</li></ul>`;
  document.getElementById('summary').innerHTML = html;
}

function downloadPDF() {
  window.print(); // quick export to PDF
}
