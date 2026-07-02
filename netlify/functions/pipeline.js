exports.handler = async () => {
  const SHEET_ID = '1ZxwJk-YIzkDcJyvhv3g2YL1czOZeEgsI';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`Sheet returned ${res.status}`);
    const csv = await res.text();
    const rows = extractRows(csv);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ rows, fetchedAt: new Date().toISOString() })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};

function parseCSV(text) {
  const result = [];
  let row = [], field = '', inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuote = false;
      } else { field += c; }
    } else {
      if (c === '"') inQuote = true;
      else if (c === ',') { row.push(field.trim()); field = ''; }
      else if (c === '\n') {
        row.push(field.trim());
        if (row.some(f => f)) result.push(row);
        row = []; field = '';
      } else if (c !== '\r') field += c;
    }
  }
  if (field || row.length) { row.push(field.trim()); if (row.some(f => f)) result.push(row); }
  return result;
}

function parseDate(str) {
  if (!str || str.includes('1900')) return '';
  const MONTHS = {
    jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12,
    january:1,february:2,march:3,april:4,june:6,july:7,august:8,
    september:9,october:10,november:11,december:12
  };
  const m = str.match(/^(\d{1,2})-([A-Za-z]+)/);
  if (!m) return '';
  const day = parseInt(m[1]);
  const mon = MONTHS[m[2].toLowerCase()];
  if (!day || !mon) return '';
  return String(mon).padStart(2, '0') + '/' + String(day).padStart(2, '0');
}

function extractRows(csv) {
  const VALID = new Set(['P', 'V', 'F', 'Q', 'L']);
  const allRows = parseCSV(csv);
  const data = [];
  let started = false;

  for (const row of allRows) {
    const col0 = (row[0] || '').trim();
    if (!started) {
      if (col0 === 'Pipeline S/No') started = true;
      continue;
    }
    if (col0 === 'Pipeline Overview') break;

    const vendor = (row[3] || '').trim();
    const eventName = (row[2] || '').trim();
    if (!vendor || !eventName) continue;

    const status = (row[6] || '').trim().toUpperCase();
    if (!VALID.has(status)) continue;

    const amount = parseFloat((row[4] || '').replace(/[$,\s]/g, '')) || 0;
    const dateStr = parseDate((row[1] || '').trim());

    data.push({
      date: dateStr,
      eventName,
      vendor,
      amount,
      status,
      pic: (row[5] || '').trim(),
      remarks: (row[7] || '').trim()
    });
  }
  return data;
}
