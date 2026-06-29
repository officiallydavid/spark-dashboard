exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { message } = JSON.parse(event.body || '{}');
  if (!message) return { statusCode: 400, body: JSON.stringify({ error: 'No message' }) };

  const PIPELINE = `
SPARK FY2026 SALES PIPELINE — as of 30 Jun 2026
Annual Target: $1,500,000 USD (linear = $125,000/month)
Status codes: P=PO Received (won), V=Verbal Confirmed (won), F=Forecasted (pipeline), Q=Quoted (pipeline), T=Target, L=Lost, E=Excluded

SUMMARY:
- Won Revenue (P+V): $538,261 — 35.9% of target
- Projected Total (P+V+F+Q): $927,261 — 61.8% of target
- Active Pipeline F+Q: $389,000
- Lost Revenue: ~$102,000 | Win rate: 84% | Gap to target: -$572,739

MONTHLY WON (P+V):
Jan $22,200 | Feb $27,900 | Mar $120,500 | Apr $55,500 | May $185,700 | Jun $50,000 | Jul $21,846 | Aug $10,000 | Sep $4,615 | Oct $12,000 | Nov $0 | Dec $0

CUMULATIVE WON: Jan $22k | Feb $50k | Mar $171k | Apr $226k | May $412k | Jun $462k | Jul $484k | Aug $494k | Sep $498k | Oct $510k

MONTHLY F+Q PIPELINE:
Jul $69,000 | Aug $99,000 | Sep $156,000 | Oct $25,000 | Nov $20,000

KEY EVENTS & SPONSORS:
Jan: Tech Partners Networking — Apptio IBM $3,000 P
Jan: IMDA Workshop #3/3 (2025 contract) — IMDA $19,200 P
Feb: CNY Lunch — Redis $3,500P, SUSE $4,000P, Rubrik $3,400P, Akamai $3,000P
Feb: CNY Dinner — Redis $4,000P, Rubrik $4,000P, Akamai $3,000P, PingCap $3,000P
Mar: Tech Trends @ Punggol Digital District — Snowflake $20,000V, Apptio $22,500V, Tanium $2,500V, HPE $20,000V, Sambanova $22,500V | Lost: Freshworks, Cloud Kinetics $16,000, Teamviewer, Okta, Cohesity
Mar: Distinguished CEO Series — Snowflake $25,000V (bundled with IO2026)
Mar: ServiceNow Speaking HK — ServiceNow $8,000V
Mar: Distinguished CEO Series — Suse $20,000 LOST
Apr: Enable Mizuho — Red Hat $5,000P, NTT V (no amount), Veeam $5,000 LOST
Apr: Enable LTA — Red Hat $7,000P, F5 $8,000P
Apr: Sambanova Distinguished Tech Leader — Sambanova $8,000V
Apr: Distinguished CXO Series Apple — Apple $20,000V
Apr: iCompaz Roundtable — iCompaz $7,500V, Rubrik $6,000 LOST
May: IMDA Workshop #1/3 — IMDA $19,200V
May: HK Breakfast Leaders Circle — Apptio $22,500V, Veeam $2,000V
May: ATX Summit — Fortinet $10,000P, Akamai $8,000P, Info-Tech $5,000V, Snowflake $12,000V, Lenovo $15,000V | Lost: Redis $15,000
May: Info-Tech Roundtable — Info-Tech $5,000V
May: F5 Dinner — F5 $7,000V
May: Distinguished CEO Series Veeam — Veeam $80,000V (LARGEST SINGLE DEAL)
Jun: Temasek AI Day — TBD (pricing not yet agreed)
Jun: Distinguished CEO Series Akamai — Akamai $20,000V
Jun: Red Hat Public Sector Day — Red Hat $30,000P
Jul: Enable LTA VRLS Team — Hashicorp $4,000P, Snowflake $4,000V
Jul: Aerospike 1:1 Brief DANA Indonesia — Aerospike $2,000V
Jul: iCompaz/MS Office Breakfast RT — iCompaz $3,846V
Jul: SPARK Durians — Hashicorp $5,000F, Crowdstrike $5,000F, Apptio $4,000Q | Lost: Aerospike $5,000
Jul: ServiceNow Speaker Engagement — ServiceNow $8,000V
Jul: Suse Executive Roundtable Malaysia — Suse $25,000Q
Jul: Suse AI Masterclass Singapore — Suse $30,000Q
Jul: Tech Trends Indonesia — Rubrik $40,000 LOST, Snowflake $18,000 LOST
Aug: Suse AI Masterclass Malaysia — Suse $30,000Q
Aug: Thai DGA Workshop — F5 $10,000F, Suse $10,000F
Aug: ServiceNow Engagement TBC — ServiceNow $5,000F
Aug: Snowflake DataWorld — Snowflake $20,000F
Aug: SafeAI.sg Council — Veeam P (no $), Snowflake $10,000F, Google Workspace $10,000F
Aug: Enable LTA CIO Office — F5 P, HashiCorp $4,000F
Aug: Enable Singapore Pools — Aerospike $10,000V
Sep: SPARK Harness AI Forum — Snowflake $10,000F, Huawei $10,000F, Hashicorp $20,000F
Sep: IRAS Training — IRAS $4,615P
Sep: SPARK Hangzhou Study Trip — Snowflake $20,000F, Veeam $20,000Q, Hashicorp $20,000F, Huawei $20,000F + others TBD
Sep: IMDA Workshop #2/3 — IMDA $19,200 LOST (maybe cancelled)
Sep: Hashicorp Executive Study Tour — Hashicorp $36,000F
Oct: Tech Trends Bangkok — target $40,000T
Oct: Tech Trends Hong Kong — target $50,000T (Terminal3 excluded)
Oct: Thai DGA STACKx Forum — target $70,000T
Oct: Rubrik F1 Event — Rubrik $10,000F
Oct: Akamai Govware Lunch RT — Akamai $12,000V
Oct: Lenovo/Microsoft Govware Lunch RT — Lenovo $15,000F
Nov: SafeAI.sg Forum — target $80,000T, Hashicorp $20,000F
Nov: SPARK Christmas Celebration — target $25,000T
Undated: Aerospike Executive Roundtable — Aerospike $20,000V
Undated: Crowdstrike Executive Roundtable — Crowdstrike $20,000F
Undated: Enable Company TBC — Tanium $7,500V, Cloud Kinetics $16,000 LOST

TOP SPONSORS BY CONFIRMED (P+V):
Veeam: $82,000 (CEO Series $80k + HK Breakfast $2k)
Apptio: $48,000 (Tech Trends $22.5k + HK Breakfast $22.5k + Durians $3k quoted)
Snowflake: $61,000 (Tech Trends $20k V + CEO Series $25k V + Enable LTA $4k V + DataWorld $20k F)
Red Hat: $42,000 (Enable Mizuho $5k P + Enable LTA $7k P + Public Sector Day $30k P)
IMDA: $38,400 (Workshop 3/3 $19,200P + Workshop 1/3 $19,200V)
Akamai: $35,000 (CEO Series $20k V + Govware $12k V + CNY $6k P)
Sambanova: $30,500 (Tech Trends $22.5k V + Tech Leader $8k V)
HPE: $20,000 (Tech Trends $20k V)
Apple: $20,000 (CXO Series $20k V)
Aerospike: $32,000 ($2k V + $10k V Singapore Pools + $20k V Exec RT)
Hashicorp: $80,000 total active ($4k P + $5k F + $20k F Harness + $20k F Hangzhou + $36k F Study Tour)
`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a sales intelligence assistant for SPARK, a Singapore B2B events company. Answer questions concisely using the pipeline data below. Use specific numbers, event names, and sponsor names. Format currency as $X,XXX. Keep answers under 150 words unless a detailed breakdown is needed.\n\n${PIPELINE}`,
      messages: [{ role: 'user', content: message }]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 500, headers: {'Content-Type':'application/json'}, body: JSON.stringify({ error: 'API error', detail: err }) };
  }

  const data = await res.json();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ reply: data.content[0].text })
  };
};
