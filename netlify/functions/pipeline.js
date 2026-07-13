exports.handler = async (event) => {
  const token = ((event.headers || {}).authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Sign-in required' }) };
  }

  const SHEET_ID = '1ShF1pZ2qYc0LJk8KPI-Xkb3iV7iqT-41pn_H278xE1Y';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:H`;

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) {
      return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Token expired — please sign in again' }) };
    }
    if (!res.ok) {
      const errBody = await res.text();
      let detail = errBody;
      try { detail = JSON.parse(errBody)?.error?.message || errBody; } catch(_) {}
      return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: `Sheets API ${res.status}: ${detail}` }) };
    }

    const json = await res.json();
    const allValues = json.values || [];
    const rows = extractRows(allValues);
    return {
      statusCode: 200,
      headers: { ...cors(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows, fetchedAt: new Date().toISOString(), _debug: allValues.slice(0, 8) })
    };
  } catch (e) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: e.message }) };
  }
};

function cors() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type' };
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

function extractRows(values) {
  const VALID = new Set(['P', 'V', 'F', 'Q', 'L']);
  const data = [];

  for (const row of values.slice(1)) {  // skip header row
    const col0 = (row[0] || '').trim();
    if (col0 === 'Pipeline Overview') break;

    const vendor = (row[3] || '').trim();
    const eventName = (row[2] || '').trim();
    if (!vendor || !eventName) continue;

    const status = (row[6] || '').trim().toUpperCase();
    if (!VALID.has(status)) continue;

    const amount = parseFloat((row[4] || '').replace(/[$,\s]/g, '')) || 0;

    data.push({
      date: parseDate((row[1] || '').trim()),
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
