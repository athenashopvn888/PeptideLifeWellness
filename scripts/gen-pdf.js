const fs = require('fs');
const csv = fs.readFileSync(__dirname + '/PLW_Shopping_List.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim());

let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>PLW Shopping List</title>
<style>
@page{size:landscape;margin:8mm}
body{font:9px/1.4 Arial,sans-serif;margin:10px;color:#222}
h1{font-size:18px;margin:5px 0;color:#1a1a2e}
.sub{font-size:9px;color:#888;margin-bottom:10px}
h2{font-size:11px;background:#1a1a2e;color:#fff;padding:5px 10px;margin:14px 0 4px;border-radius:4px;page-break-after:avoid}
table{width:100%;border-collapse:collapse;margin-bottom:6px}
th{background:#444;color:#fff;padding:3px 5px;font-size:8px;text-align:left}
td{padding:3px 5px;font-size:8px;border-bottom:1px solid #e0e0e0}
tr:nth-child(even){background:#f9f9f9}
.hi{color:#e63946;font-weight:bold}
.med{color:#f4a261;font-weight:bold}
.lo{color:#2a9d8f}
b{font-weight:600}
</style></head><body>
<h1>PeptideLifeWellness &mdash; Master Product Shopping List</h1>
<div class="sub">Competitive analysis of 4 Canadian peptide stores &bull; May 2026<br>
Sources: PeptideWarehouse.ca &bull; PeptideProCanada.com &bull; LimitlessPeptides.com &bull; Direct-Peptides.com</div>`;

let tableOpen = false;

for (const line of lines) {
  // Simple CSV parse (handles quoted fields with commas)
  const cols = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  cols.push(cur.trim());

  if (cols[0] === '#') continue;

  // Section headers
  if (cols[1] && cols[1].includes('===')) {
    if (tableOpen) html += '</tbody></table>';
    const title = cols[1].replace(/===/g, '').trim();
    html += '<h2>' + title + '</h2>';
    html += '<table><thead><tr><th>#</th><th>Product</th><th>Category</th><th>Size</th><th>Price (CAD)</th><th>Stores</th><th>Demand</th><th>Notes</th></tr></thead><tbody>';
    tableOpen = true;
    continue;
  }

  // Skip empty rows
  if (!cols[0] && !cols[1]) continue;
  if (cols[0] === 'Format') continue;

  // Demand styling
  let demand = (cols[6] || '').replace(/[^\x20-\x7E\u2B50\uD83D\uDD25]/g, '');
  if (demand.includes('HIGH') || demand.includes('Trending') || demand.includes('Hottest') || demand.includes('Must Stock') || demand.includes('High Margin')) {
    demand = '<span class="hi">' + demand + '</span>';
  } else if (demand.includes('Popular') || demand.includes('Medium') || demand.includes('Best Seller')) {
    demand = '<span class="med">' + demand + '</span>';
  }

  let notes = cols[7] || '';
  if (notes.includes('differentiator') || notes.includes('Unique') || notes.includes('No competitor')) {
    notes = '<span class="lo"><b>' + notes + '</b></span>';
  }

  html += '<tr>';
  html += '<td>' + (cols[0] || '') + '</td>';
  html += '<td><b>' + (cols[1] || '') + '</b></td>';
  html += '<td>' + (cols[2] || '') + '</td>';
  html += '<td>' + (cols[3] || '') + '</td>';
  html += '<td>' + (cols[4] || '') + '</td>';
  html += '<td>' + (cols[5] || '') + '</td>';
  html += '<td>' + demand + '</td>';
  html += '<td>' + notes + '</td>';
  html += '</tr>';
}

if (tableOpen) html += '</tbody></table>';
html += '</body></html>';

fs.writeFileSync(__dirname + '/PLW_Shopping_List.html', html);
console.log('Created PLW_Shopping_List.html — open in browser and Ctrl+P to save as PDF');
