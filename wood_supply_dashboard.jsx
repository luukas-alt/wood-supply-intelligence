import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Area } from "recharts";

// ─── DATA ───────────────────────────────────────────────────────────────
const DATA = {"summary":{"total_procurement_cost_2025":22412174,"total_volume_2025":500542,"avg_on_time_rate_2025":73.7,"supplier_count":50},"quarterly":[{"year":2023,"quarter":"Q1","total_cost":4751956,"total_volume":109456,"on_time_rate":74.7,"order_count":336,"cost_per_m3":43.41,"label":"2023 Q1"},{"year":2023,"quarter":"Q2","total_cost":4893049,"total_volume":113362,"on_time_rate":75.7,"order_count":382,"cost_per_m3":43.16,"label":"2023 Q2"},{"year":2023,"quarter":"Q3","total_cost":5316814,"total_volume":122371,"on_time_rate":74.6,"order_count":358,"cost_per_m3":43.45,"label":"2023 Q3"},{"year":2023,"quarter":"Q4","total_cost":5266785,"total_volume":126679,"on_time_rate":72.0,"order_count":350,"cost_per_m3":41.58,"label":"2023 Q4"},{"year":2024,"quarter":"Q1","total_cost":5851415,"total_volume":132289,"on_time_rate":75.3,"order_count":413,"cost_per_m3":44.23,"label":"2024 Q1"},{"year":2024,"quarter":"Q2","total_cost":6170131,"total_volume":138609,"on_time_rate":74.3,"order_count":373,"cost_per_m3":44.51,"label":"2024 Q2"},{"year":2024,"quarter":"Q3","total_cost":4931411,"total_volume":102178,"on_time_rate":73.4,"order_count":308,"cost_per_m3":48.26,"label":"2024 Q3"},{"year":2024,"quarter":"Q4","total_cost":4978138,"total_volume":112015,"on_time_rate":78.1,"order_count":347,"cost_per_m3":44.44,"label":"2024 Q4"},{"year":2025,"quarter":"Q1","total_cost":4937601,"total_volume":113136,"on_time_rate":76.5,"order_count":324,"cost_per_m3":43.64,"label":"2025 Q1"},{"year":2025,"quarter":"Q2","total_cost":5530820,"total_volume":120295,"on_time_rate":73.0,"order_count":344,"cost_per_m3":45.98,"label":"2025 Q2"},{"year":2025,"quarter":"Q3","total_cost":7200736,"total_volume":157988,"on_time_rate":70.9,"order_count":443,"cost_per_m3":45.58,"label":"2025 Q3"},{"year":2025,"quarter":"Q4","total_cost":4743017,"total_volume":109122,"on_time_rate":75.6,"order_count":311,"cost_per_m3":43.47,"label":"2025 Q4"}],"regional":[{"region":"Etelä-Suomi","total_cost":3497806,"total_volume":78515,"on_time_rate":75.0,"cost_per_m3":44.55},{"region":"Itä-Suomi","total_cost":4101933,"total_volume":89458,"on_time_rate":71.9,"cost_per_m3":45.85},{"region":"Kaakkois-Suomi","total_cost":3514313,"total_volume":82082,"on_time_rate":71.0,"cost_per_m3":42.81},{"region":"Keski-Suomi","total_cost":4345394,"total_volume":91681,"on_time_rate":75.7,"cost_per_m3":47.40},{"region":"Länsi-Suomi","total_cost":3256222,"total_volume":73711,"on_time_rate":76.2,"cost_per_m3":44.18},{"region":"Pohjois-Suomi","total_cost":3696507,"total_volume":85096,"on_time_rate":72.8,"cost_per_m3":43.44}],"depots":[{"depot":"Imatra Mill","total_stock":11520,"avg_utilization":38.4,"critical":0,"low":1,"optimal":3,"overstocked":2},{"depot":"Kemi Mill","total_stock":10447,"avg_utilization":34.8,"critical":0,"low":0,"optimal":6,"overstocked":0},{"depot":"Kotka Terminal","total_stock":6281,"avg_utilization":20.9,"critical":1,"low":0,"optimal":5,"overstocked":0},{"depot":"Oulu Terminal","total_stock":5566,"avg_utilization":18.6,"critical":1,"low":1,"optimal":4,"overstocked":0},{"depot":"Rauma Terminal","total_stock":7100,"avg_utilization":23.7,"critical":1,"low":1,"optimal":4,"overstocked":0},{"depot":"Varkaus Mill","total_stock":12366,"avg_utilization":41.2,"critical":1,"low":0,"optimal":3,"overstocked":2}],"wood_dist":[{"wood_type":"Koivukuitu","total_volume":81917,"total_cost":1659072,"avg_price":20.06},{"wood_type":"Koivutukki","total_volume":79194,"total_cost":4163994,"avg_price":52.27},{"wood_type":"Kuusikuitu","total_volume":83541,"total_cost":2002640,"avg_price":23.98},{"wood_type":"Kuusitukki","total_volume":84915,"total_cost":6592475,"avg_price":77.47},{"wood_type":"Mäntykuitu","total_volume":87390,"total_cost":1913399,"avg_price":21.87},{"wood_type":"Mäntytukki","total_volume":83584,"total_cost":6080594,"avg_price":72.14}],"suppliers_top":[{"supplier":"Supplier_049","region":"Kaakkois-Suomi","reliability_score":96.9,"quality_score":85.1,"price_competitiveness":42.2,"on_time_pct":93.8,"total_volume_m3":10237},{"supplier":"Supplier_050","region":"Länsi-Suomi","reliability_score":94.3,"quality_score":98.5,"price_competitiveness":80.2,"on_time_pct":87.8,"total_volume_m3":14290},{"supplier":"Supplier_013","region":"Länsi-Suomi","reliability_score":94.1,"quality_score":68.0,"price_competitiveness":57.4,"on_time_pct":55.9,"total_volume_m3":11722},{"supplier":"Supplier_011","region":"Keski-Suomi","reliability_score":93.6,"quality_score":72.4,"price_competitiveness":62.1,"on_time_pct":64.3,"total_volume_m3":4554},{"supplier":"Supplier_030","region":"Pohjois-Suomi","reliability_score":93.2,"quality_score":88.5,"price_competitiveness":83.8,"on_time_pct":92.2,"total_volume_m3":9577},{"supplier":"Supplier_017","region":"Keski-Suomi","reliability_score":92.9,"quality_score":79.6,"price_competitiveness":65.8,"on_time_pct":69.3,"total_volume_m3":15335}],"suppliers_bottom":[{"supplier":"Supplier_004","region":"Pohjois-Suomi","reliability_score":67.1,"quality_score":91.5,"price_competitiveness":66.6,"on_time_pct":75.7,"total_volume_m3":22885},{"supplier":"Supplier_033","region":"Keski-Suomi","reliability_score":66.8,"quality_score":76.4,"price_competitiveness":60.4,"on_time_pct":90.0,"total_volume_m3":14570},{"supplier":"Supplier_001","region":"Itä-Suomi","reliability_score":66.2,"quality_score":74.1,"price_competitiveness":66.0,"on_time_pct":97.8,"total_volume_m3":5945},{"supplier":"Supplier_034","region":"Keski-Suomi","reliability_score":64.7,"quality_score":84.6,"price_competitiveness":57.7,"on_time_pct":81.2,"total_volume_m3":38903},{"supplier":"Supplier_031","region":"Etelä-Suomi","reliability_score":62.5,"quality_score":79.1,"price_competitiveness":42.2,"on_time_pct":78.6,"total_volume_m3":29724}],"optim":{"status":"Optimal","total_cost":34596.23,"routes":[{"depot":"Kotka Terminal","mill":"Imatra Mill","volume_m3":1196.8,"capacity_m3":1500,"utilization_pct":79.8,"cost_eur":7551.63,"cost_per_m3":6.31},{"depot":"Imatra Mill","mill":"Kotka Mill","volume_m3":865.7,"capacity_m3":1500,"utilization_pct":57.7,"cost_eur":4838.99,"cost_per_m3":5.59},{"depot":"Varkaus Mill","mill":"Varkaus Mill","volume_m3":777.5,"capacity_m3":1500,"utilization_pct":51.8,"cost_eur":5084.74,"cost_per_m3":6.54},{"depot":"Oulu Terminal","mill":"Oulu Mill","volume_m3":759.6,"capacity_m3":1500,"utilization_pct":50.6,"cost_eur":3517.04,"cost_per_m3":4.63},{"depot":"Oulu Terminal","mill":"Heinola Mill","volume_m3":681.1,"capacity_m3":1500,"utilization_pct":45.4,"cost_eur":4720.08,"cost_per_m3":6.93},{"depot":"Varkaus Mill","mill":"Kemi Mill","volume_m3":659.3,"capacity_m3":750,"utilization_pct":87.9,"cost_eur":4179.97,"cost_per_m3":6.34},{"depot":"Kotka Terminal","mill":"Varkaus Mill","volume_m3":312.4,"capacity_m3":1500,"utilization_pct":20.8,"cost_eur":2083.85,"cost_per_m3":6.67},{"depot":"Kemi Mill","mill":"Heinola Mill","volume_m3":141.8,"capacity_m3":750,"utilization_pct":18.9,"cost_eur":1297.91,"cost_per_m3":9.15}],"savings":{"naive_cost_eur":42553.37,"optimized_cost_eur":34596.23,"savings_pct":18.7},"stats":{"variables":144,"constraints":84}},"prices":[{"date_label":"2023-01","Koivukuitu":19.74,"Koivutukki":47.78,"Kuusikuitu":23.25,"Kuusitukki":71.46,"Mäntykuitu":20.44,"Mäntytukki":72.27},{"date_label":"2023-04","Koivukuitu":17.3,"Koivutukki":51.85,"Kuusikuitu":25.67,"Kuusitukki":76.6,"Mäntykuitu":25.67,"Mäntytukki":64.17},{"date_label":"2023-06","Koivukuitu":23.52,"Koivutukki":59.83,"Kuusikuitu":24.63,"Kuusitukki":87.92,"Mäntykuitu":23.87,"Mäntytukki":79.58},{"date_label":"2023-08","Koivukuitu":22.58,"Koivutukki":52.66,"Kuusikuitu":24.6,"Kuusitukki":82.04,"Mäntykuitu":23.34,"Mäntytukki":80.8},{"date_label":"2023-10","Koivukuitu":19.38,"Koivutukki":54.52,"Kuusikuitu":24.74,"Kuusitukki":79.54,"Mäntykuitu":21.82,"Mäntytukki":69.57},{"date_label":"2023-12","Koivukuitu":22.16,"Koivutukki":45.51,"Kuusikuitu":25.67,"Kuusitukki":84.33,"Mäntykuitu":21.38,"Mäntytukki":69.89},{"date_label":"2024-02","Koivukuitu":20.61,"Koivutukki":50.25,"Kuusikuitu":21.58,"Kuusitukki":77.44,"Mäntykuitu":19.07,"Mäntytukki":83.99},{"date_label":"2024-04","Koivukuitu":21.0,"Koivutukki":60.12,"Kuusikuitu":25.38,"Kuusitukki":76.84,"Mäntykuitu":21.97,"Mäntytukki":76.57},{"date_label":"2024-06","Koivukuitu":23.85,"Koivutukki":57.82,"Kuusikuitu":25.82,"Kuusitukki":96.42,"Mäntykuitu":25.22,"Mäntytukki":80.47},{"date_label":"2024-08","Koivukuitu":18.88,"Koivutukki":48.78,"Kuusikuitu":26.05,"Kuusitukki":91.8,"Mäntykuitu":24.11,"Mäntytukki":68.54},{"date_label":"2024-10","Koivukuitu":22.41,"Koivutukki":49.37,"Kuusikuitu":24.94,"Kuusitukki":71.39,"Mäntykuitu":22.71,"Mäntytukki":69.36},{"date_label":"2024-12","Koivukuitu":19.57,"Koivutukki":58.47,"Kuusikuitu":25.24,"Kuusitukki":85.05,"Mäntykuitu":21.05,"Mäntytukki":73.67},{"date_label":"2025-02","Koivukuitu":23.01,"Koivutukki":59.33,"Kuusikuitu":24.56,"Kuusitukki":79.24,"Mäntykuitu":24.16,"Mäntytukki":89.61},{"date_label":"2025-04","Koivukuitu":24.62,"Koivutukki":58.38,"Kuusikuitu":24.85,"Kuusitukki":81.02,"Mäntykuitu":24.49,"Mäntytukki":68.15},{"date_label":"2025-06","Koivukuitu":19.12,"Koivutukki":61.57,"Kuusikuitu":26.58,"Kuusitukki":87.74,"Mäntykuitu":23.49,"Mäntytukki":87.84},{"date_label":"2025-08","Koivukuitu":22.47,"Koivutukki":56.32,"Kuusikuitu":27.05,"Kuusitukki":90.76,"Mäntykuitu":23.92,"Mäntytukki":86.85},{"date_label":"2025-10","Koivukuitu":21.24,"Koivutukki":58.62,"Kuusikuitu":25.78,"Kuusitukki":72.61,"Mäntykuitu":22.84,"Mäntytukki":67.88}],"inv_trend":[{"date":"2023-01-01","avg_stock":1061.2,"avg_utilization":21.2},{"date":"2023-03-26","avg_stock":972.8,"avg_utilization":19.5},{"date":"2023-06-18","avg_stock":1131.9,"avg_utilization":22.6},{"date":"2023-09-10","avg_stock":1136.4,"avg_utilization":22.7},{"date":"2023-12-03","avg_stock":1010.5,"avg_utilization":20.2},{"date":"2024-02-25","avg_stock":1181.7,"avg_utilization":23.6},{"date":"2024-05-19","avg_stock":1287.4,"avg_utilization":25.8},{"date":"2024-08-11","avg_stock":1238.0,"avg_utilization":24.8},{"date":"2024-11-03","avg_stock":1167.1,"avg_utilization":23.3},{"date":"2025-01-26","avg_stock":1188.9,"avg_utilization":23.8},{"date":"2025-04-20","avg_stock":1223.7,"avg_utilization":24.5},{"date":"2025-07-13","avg_stock":1561.0,"avg_utilization":31.2},{"date":"2025-10-05","avg_stock":1572.5,"avg_utilization":31.4},{"date":"2025-12-28","avg_stock":1480.0,"avg_utilization":29.6}]};

// ─── COLORS & THEME ─────────────────────────────────────────────────────
const FOREST = {
  deep: "#1a2e1a", bark: "#2d1b0e", moss: "#3d5a3d", pine: "#4a7c59",
  birch: "#c8b88a", lichen: "#8faa80", frost: "#d4e4d4", snow: "#f0f4ef",
  amber: "#d4a44c", rust: "#b85c38", water: "#5b8fa8", mist: "#94a89c",
  copper: "#b87333", sage: "#87a878", cream: "#faf5eb",
};
const CHART_COLORS = [FOREST.pine, FOREST.amber, FOREST.water, FOREST.rust, FOREST.copper, FOREST.sage];
const WOOD_COLORS = { "Mäntytukki": "#4a7c59", "Kuusitukki": "#5b8fa8", "Koivutukki": "#d4a44c", "Mäntykuitu": "#87a878", "Kuusikuitu": "#8faa80", "Koivukuitu": "#b87333" };

const fmt = (n) => n >= 1e6 ? `€${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `€${(n/1e3).toFixed(0)}K` : `€${n}`;
const fmtV = (n) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M m³` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K m³` : `${n} m³`;

// ─── COMPONENTS ─────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, color, icon }) => (
  <div style={{ background: FOREST.cream, border: `1px solid ${FOREST.frost}`, borderRadius: 8, padding: "18px 20px", flex: 1, minWidth: 180, borderLeft: `4px solid ${color || FOREST.pine}` }}>
    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: FOREST.mist, fontWeight: 600 }}>{icon} {label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: FOREST.deep, marginTop: 4, fontFamily: "'DM Serif Display', Georgia, serif" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: FOREST.moss, marginTop: 2 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 16, marginTop: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: FOREST.deep, margin: 0, fontFamily: "'DM Serif Display', Georgia, serif", borderBottom: `2px solid ${FOREST.pine}`, paddingBottom: 6, display: "inline-block" }}>{children}</h2>
    {sub && <p style={{ fontSize: 13, color: FOREST.mist, margin: "4px 0 0 0" }}>{sub}</p>}
  </div>
);

const Tab = ({ active, label, onClick }) => (
  <button onClick={onClick} style={{ padding: "8px 20px", border: "none", borderBottom: active ? `3px solid ${FOREST.pine}` : "3px solid transparent", background: "none", color: active ? FOREST.deep : FOREST.mist, fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>{label}</button>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: FOREST.cream, border: `1px solid ${FOREST.frost}`, borderRadius: 6, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: FOREST.deep, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color || FOREST.moss, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── AI COPILOT ─────────────────────────────────────────────────────────
const AICopilot = () => {
  const [messages, setMessages] = useState([{ role: "assistant", content: "I'm your Wood Supply Intelligence Copilot. I have access to procurement, inventory, pricing, supplier, and optimization data. Ask me anything — for example:\n\n• Which region has the highest cost per m³?\n• How is on-time delivery trending?\n• What did the transport optimization find?\n• Compare supplier performance across regions" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    const systemPrompt = `You are a Business Controlling AI Copilot for Stora Enso's Wood Supply division. You analyze operational and financial data to provide actionable insights.

You have access to this dataset summary:

PROCUREMENT 2025:
- Total cost: €22.4M across 500,542 m³
- Average on-time rate: 73.7%
- 50 active suppliers across 6 Finnish regions

QUARTERLY TRENDS (cost/m³): 2023Q1:€43.41 → 2024Q3:€48.26 (peak) → 2025Q4:€43.47
REGIONAL COSTS: Keski-Suomi €47.40/m³ (highest), Kaakkois-Suomi €42.81/m³ (lowest)
REGIONAL ON-TIME: Länsi-Suomi 76.2% (best), Kaakkois-Suomi 71.0% (worst)

WOOD TYPES by avg price: Kuusitukki €77.47, Mäntytukki €72.14, Koivutukki €52.27, Kuusikuitu €23.98, Mäntykuitu €21.87, Koivukuitu €20.06

INVENTORY: 6 depots, utilization 18.6%-41.2%. Varkaus Mill highest stock (12,366 m³), Oulu Terminal lowest (5,566 m³). Several depots have critical/low stock items.

TOP SUPPLIERS: Supplier_049 (reliability 96.9, on-time 93.8%), Supplier_050 (reliability 94.3, quality 98.5)
BOTTOM: Supplier_031 (reliability 62.5), Supplier_034 (reliability 64.7)

OPTIMIZATION: LP model minimized transport cost to €34,596/week (18.7% savings vs naive allocation). 144 variables, 84 constraints. Top route: Kotka Terminal→Imatra Mill at 1,197 m³.

Answer concisely with specific numbers. When relevant, suggest actionable business recommendations. Format key numbers in bold. Keep responses under 200 words.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: messages.filter(m => m.role !== "assistant" || messages.indexOf(m) !== 0).concat([{ role: "user", content: userMsg }]).slice(-10),
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "I couldn't process that request. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: FOREST.cream, border: `1px solid ${FOREST.frost}`, borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", height: 420 }}>
      <div style={{ background: FOREST.deep, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
        <span style={{ color: FOREST.snow, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Business Controlling AI Copilot</span>
        <span style={{ color: FOREST.mist, fontSize: 11, marginLeft: "auto" }}>Powered by Claude</span>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%", padding: "10px 14px", borderRadius: 12,
              background: m.role === "user" ? FOREST.pine : FOREST.snow,
              color: m.role === "user" ? "#fff" : FOREST.deep,
              fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap",
              fontFamily: "'DM Sans', sans-serif",
              borderBottomRightRadius: m.role === "user" ? 2 : 12,
              borderBottomLeftRadius: m.role === "assistant" ? 2 : 12,
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: 10 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: FOREST.pine, animation: `bounce 1s ${i*0.15}s infinite` }} />)}
          </div>
        )}
      </div>
      <div style={{ padding: 12, borderTop: `1px solid ${FOREST.frost}`, display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask about procurement, suppliers, costs..." style={{ flex: 1, padding: "10px 14px", border: `1px solid ${FOREST.frost}`, borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: FOREST.snow }} />
        <button onClick={sendMessage} disabled={loading} style={{ padding: "10px 20px", background: FOREST.pine, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13, opacity: loading ? 0.5 : 1 }}>Send</button>
      </div>
    </div>
  );
};

// ─── OPTIMIZATION VIEW ──────────────────────────────────────────────────
const OptimizationView = () => {
  const { optim } = DATA;
  const routeData = optim.routes.map(r => ({ name: `${r.depot.split(' ')[0]}→${r.mill.split(' ')[0]}`, volume: r.volume_m3, cost: r.cost_per_m3, utilization: r.utilization_pct }));

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <KPICard label="Optimized Cost" value={`€${optim.total_cost.toLocaleString()}`} sub="Per week" color={FOREST.pine} icon="⚡" />
        <KPICard label="Savings" value={`${optim.savings.savings_pct}%`} sub={`€${(optim.savings.naive_cost_eur - optim.savings.optimized_cost_eur).toLocaleString()} saved`} color={FOREST.amber} icon="💰" />
        <KPICard label="Active Routes" value={optim.routes.length} sub={`${optim.stats.variables} vars, ${optim.stats.constraints} constraints`} color={FOREST.water} icon="🔀" />
        <KPICard label="Model Status" value={optim.status} sub="LP solved by PuLP/CBC" color={FOREST.moss} icon="✓" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, color: FOREST.deep, marginBottom: 12 }}>Route Volumes (m³/week)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={routeData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={FOREST.frost} />
              <XAxis type="number" tick={{ fontSize: 11, fill: FOREST.mist }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: FOREST.deep }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" radius={[0,4,4,0]}>
                {routeData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 style={{ fontSize: 15, color: FOREST.deep, marginBottom: 12 }}>Route Cost Efficiency (€/m³)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={routeData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={FOREST.frost} />
              <XAxis type="number" tick={{ fontSize: 11, fill: FOREST.mist }} domain={[0, 10]} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: FOREST.deep }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" radius={[0,4,4,0]}>
                {routeData.map((e, i) => <Cell key={i} fill={e.cost > 7 ? FOREST.rust : e.cost > 6 ? FOREST.amber : FOREST.pine} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: 20, background: FOREST.snow, borderRadius: 8, padding: 16, border: `1px solid ${FOREST.frost}` }}>
        <h3 style={{ fontSize: 14, color: FOREST.deep, marginBottom: 8 }}>Model Formulation</h3>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: FOREST.moss, lineHeight: 1.8 }}>
          <div><strong style={{ color: FOREST.deep }}>min</strong> Σ<sub>d,m,w</sub> c<sub>dmw</sub> · x<sub>dmw</sub></div>
          <div><strong style={{ color: FOREST.deep }}>s.t.</strong> Σ<sub>m</sub> x<sub>dmw</sub> ≤ supply<sub>dw</sub> &nbsp;&nbsp;∀ d∈Depots, w∈WoodTypes</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Σ<sub>d</sub> x<sub>dmw</sub> ≥ demand<sub>mw</sub> &nbsp;∀ m∈Mills, w∈WoodTypes</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Σ<sub>w</sub> x<sub>dmw</sub> ≤ cap<sub>dm</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;∀ d∈Depots, m∈Mills</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x<sub>dmw</sub> ≥ 0</div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────────
export default function WoodSupplyDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [priceFilter, setPriceFilter] = useState("all");

  const filteredPrices = DATA.prices;
  const woodKeys = priceFilter === "tukki" ? ["Mäntytukki","Kuusitukki","Koivutukki"] : priceFilter === "kuitu" ? ["Mäntykuitu","Kuusikuitu","Koivukuitu"] : Object.keys(WOOD_COLORS);

  const supplierRadar = DATA.suppliers_top.slice(0, 4).map(s => ({
    supplier: s.supplier.replace("Supplier_", "S"),
    Reliability: s.reliability_score,
    Quality: s.quality_score,
    "Price Comp.": s.price_competitiveness,
    "On-Time": s.on_time_pct,
  }));
  const radarFields = ["Reliability", "Quality", "Price Comp.", "On-Time"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: `linear-gradient(135deg, ${FOREST.snow} 0%, #e8efe8 100%)`, minHeight: "100vh", color: FOREST.deep }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=DM+Mono:wght@400;500&display=swap');
        @keyframes bounce { 0%,80%,100% { transform: translateY(0) } 40% { transform: translateY(-6px) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${FOREST.mist}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: FOREST.deep, padding: "24px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: "100%", background: `linear-gradient(135deg, transparent 0%, ${FOREST.moss}22 100%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>🌲</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: FOREST.snow, fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: 0.5 }}>Wood Supply Intelligence</h1>
              <p style={{ margin: "2px 0 0 0", fontSize: 13, color: FOREST.lichen }}>Business Controlling Dashboard — Stora Enso Wood & Energy</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 11, color: FOREST.mist }}>Portfolio Project by</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: FOREST.birch }}>Luukas · Aalto University</div>
              <div style={{ fontSize: 11, color: FOREST.mist }}>Systems Sciences & Applied Mathematics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: FOREST.cream, borderBottom: `1px solid ${FOREST.frost}`, padding: "0 32px", display: "flex", gap: 4 }}>
        {[
          ["overview", "Overview"],
          ["procurement", "Procurement"],
          ["inventory", "Inventory & Suppliers"],
          ["optimization", "Optimization"],
          ["copilot", "AI Copilot"],
        ].map(([key, label]) => <Tab key={key} active={activeTab === key} label={label} onClick={() => setActiveTab(key)} />)}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 32px 48px", maxWidth: 1200, margin: "0 auto" }} className="fade-in">

        {/* ──── OVERVIEW ──── */}
        {activeTab === "overview" && (
          <div>
            <SectionTitle sub="FY 2025 Summary">Key Performance Indicators</SectionTitle>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <KPICard label="Total Procurement" value={fmt(DATA.summary.total_procurement_cost_2025)} sub="FY 2025" color={FOREST.pine} icon="📊" />
              <KPICard label="Total Volume" value={fmtV(DATA.summary.total_volume_2025)} sub="FY 2025" color={FOREST.water} icon="🪵" />
              <KPICard label="On-Time Rate" value={`${DATA.summary.avg_on_time_rate_2025}%`} sub="Avg across all suppliers" color={DATA.summary.avg_on_time_rate_2025 > 80 ? FOREST.pine : FOREST.rust} icon="⏱" />
              <KPICard label="Active Suppliers" value={DATA.summary.supplier_count} sub="Across 6 regions" color={FOREST.amber} icon="🤝" />
            </div>

            <SectionTitle sub="Quarterly cost per m³ and volume trends">Cost & Volume Trends</SectionTitle>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={DATA.quarterly} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={FOREST.frost} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: FOREST.mist }} angle={-30} textAnchor="end" height={50} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: FOREST.mist }} label={{ value: "€/m³", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: FOREST.mist } }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: FOREST.mist }} label={{ value: "Volume (m³)", angle: 90, position: "insideRight", style: { fontSize: 11, fill: FOREST.mist } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area yAxisId="right" dataKey="total_volume" name="Volume" fill={`${FOREST.water}30`} stroke={FOREST.water} strokeWidth={1.5} />
                <Line yAxisId="left" dataKey="cost_per_m3" name="Cost/m³" stroke={FOREST.pine} strokeWidth={2.5} dot={{ r: 4, fill: FOREST.pine }} />
                <Line yAxisId="left" dataKey="on_time_rate" name="On-Time %" stroke={FOREST.amber} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: FOREST.amber }} />
              </ComposedChart>
            </ResponsiveContainer>

            <SectionTitle sub="Average regional price per m³ (€/m³)">Regional Cost Comparison</SectionTitle>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DATA.regional} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={FOREST.frost} />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: FOREST.mist }} />
                <YAxis tick={{ fontSize: 11, fill: FOREST.mist }} domain={[40, 50]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost_per_m3" name="€/m³" radius={[4,4,0,0]}>
                  {DATA.regional.map((r, i) => <Cell key={i} fill={r.cost_per_m3 === Math.max(...DATA.regional.map(x=>x.cost_per_m3)) ? FOREST.rust : CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ──── PROCUREMENT ──── */}
        {activeTab === "procurement" && (
          <div>
            <SectionTitle sub="Monthly price evolution by wood assortment">Timber Price Tracker</SectionTitle>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[["all","All"],["tukki","Logs (Tukki)"],["kuitu","Pulpwood (Kuitu)"]].map(([k,l]) => (
                <button key={k} onClick={() => setPriceFilter(k)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${priceFilter===k ? FOREST.pine : FOREST.frost}`, background: priceFilter===k ? FOREST.pine : "transparent", color: priceFilter===k ? "#fff" : FOREST.moss, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{l}</button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={filteredPrices} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={FOREST.frost} />
                <XAxis dataKey="date_label" tick={{ fontSize: 10, fill: FOREST.mist }} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: FOREST.mist }} label={{ value: "€/m³", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: FOREST.mist } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {woodKeys.map(w => <Line key={w} dataKey={w} stroke={WOOD_COLORS[w]} strokeWidth={2} dot={false} name={w} />)}
              </LineChart>
            </ResponsiveContainer>

            <SectionTitle sub="Volume and cost breakdown by wood assortment (2025)">Wood Type Distribution</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={DATA.wood_dist} dataKey="total_volume" nameKey="wood_type" cx="50%" cy="50%" outerRadius={100} label={({name, percent}) => `${name.substring(0,5)} ${(percent*100).toFixed(0)}%`} labelLine={{ stroke: FOREST.mist }} style={{ fontSize: 11 }}>
                    {DATA.wood_dist.map((_, i) => <Cell key={i} fill={Object.values(WOOD_COLORS)[i]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                {DATA.wood_dist.sort((a,b) => b.avg_price - a.avg_price).map((w, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: FOREST.snow, borderRadius: 6, border: `1px solid ${FOREST.frost}` }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: WOOD_COLORS[w.wood_type] }} />
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{w.wood_type}</div>
                    <div style={{ fontSize: 13, color: FOREST.moss }}>{fmtV(w.total_volume)}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: FOREST.deep }}>€{w.avg_price}/m³</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──── INVENTORY & SUPPLIERS ──── */}
        {activeTab === "inventory" && (
          <div>
            <SectionTitle sub="Current stock status across all depots">Depot Inventory Health</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {DATA.depots.map((d, i) => (
                <div key={i} style={{ background: FOREST.cream, border: `1px solid ${FOREST.frost}`, borderRadius: 8, padding: 16, borderTop: `3px solid ${d.critical > 0 ? FOREST.rust : d.low > 0 ? FOREST.amber : FOREST.pine}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: FOREST.deep, marginBottom: 8 }}>{d.depot}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: FOREST.deep, fontFamily: "'DM Serif Display', Georgia, serif" }}>{d.total_stock.toLocaleString()} m³</div>
                  <div style={{ marginTop: 8, height: 8, background: FOREST.frost, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${d.avg_utilization}%`, background: d.avg_utilization > 35 ? FOREST.amber : FOREST.pine, borderRadius: 4, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: FOREST.mist }}>
                    <span>Utilization: {d.avg_utilization}%</span>
                    <span>{d.critical > 0 ? `⚠️ ${d.critical} critical` : d.low > 0 ? `${d.low} low` : "✓ OK"}</span>
                  </div>
                </div>
              ))}
            </div>

            <SectionTitle sub="Top suppliers by composite reliability score">Supplier Performance</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 14, color: FOREST.pine, marginBottom: 12 }}>Top Performers</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {DATA.suppliers_top.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: FOREST.snow, borderRadius: 6, border: `1px solid ${FOREST.frost}` }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: FOREST.pine, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i+1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.supplier}</div>
                        <div style={{ fontSize: 11, color: FOREST.mist }}>{s.region}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: FOREST.pine }}>{s.reliability_score}</div>
                        <div style={{ fontSize: 10, color: FOREST.mist }}>On-time: {s.on_time_pct}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 14, color: FOREST.deep, marginBottom: 12 }}>Radar Comparison (Top 4)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarFields.map(f => {
                    const entry = { field: f };
                    supplierRadar.forEach(s => { entry[s.supplier] = s[f]; });
                    return entry;
                  })}>
                    <PolarGrid stroke={FOREST.frost} />
                    <PolarAngleAxis dataKey="field" tick={{ fontSize: 11, fill: FOREST.deep }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                    {supplierRadar.map((s, i) => (
                      <Radar key={s.supplier} name={s.supplier} dataKey={s.supplier} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ──── OPTIMIZATION ──── */}
        {activeTab === "optimization" && (
          <div>
            <SectionTitle sub="Linear Programming model for minimum-cost wood transport allocation">Transport Cost Optimization</SectionTitle>
            <OptimizationView />
          </div>
        )}

        {/* ──── AI COPILOT ──── */}
        {activeTab === "copilot" && (
          <div>
            <SectionTitle sub="Natural-language interface to query supply chain data and get actionable insights">AI Copilot — Business Controlling Assistant</SectionTitle>
            <AICopilot />
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { title: "Use Case 1: Anomaly Detection", desc: "LLM identifies unusual cost spikes, delivery delays, or inventory patterns and generates plain-language alerts for controllers." },
                { title: "Use Case 2: Report Summarization", desc: "Copilot digests weekly Power BI exports and produces executive summaries with key changes highlighted." },
                { title: "Use Case 3: Scenario Q&A", desc: "Controllers ask what-if questions ('What if pine demand rises 20%?') and get instant quantified impact estimates." },
                { title: "Use Case 4: Data Cleaning Assistant", desc: "LLM helps identify and fix SAP data quality issues — missing fields, duplicate entries, unit mismatches." },
                { title: "Use Case 5: Procurement Copilot", desc: "AI suggests optimal order quantities and timing based on price trends, inventory levels, and demand forecasts." },
                { title: "Use Case 6: Supplier Risk Monitor", desc: "Continuous assessment of supplier performance with early warning signals and recommended actions." },
              ].map((uc, i) => (
                <div key={i} style={{ background: FOREST.cream, border: `1px solid ${FOREST.frost}`, borderRadius: 8, padding: 16, borderLeft: `3px solid ${CHART_COLORS[i % CHART_COLORS.length]}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: FOREST.deep, marginBottom: 6 }}>{uc.title}</div>
                  <div style={{ fontSize: 12, color: FOREST.moss, lineHeight: 1.5 }}>{uc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, padding: "20px 0", borderTop: `1px solid ${FOREST.frost}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: FOREST.mist }}>
          <div>Wood Supply Intelligence Dashboard — Portfolio Project</div>
          <div>Data: Synthetic (based on Finnish timber market structure) · Optimization: PuLP/CBC · AI: Claude API</div>
          <div>Luukas · Aalto University · 2025</div>
        </div>
      </div>
    </div>
  );
}
