# Wood Supply Intelligence

**Business Controlling & AI Portfolio Project — Stora Enso Wood Supply Trainee Application**

> An end-to-end data analytics platform that demonstrates how AI, optimization, and modern dashboarding can transform wood supply chain operations. Built as a portfolio project to showcase skills in data engineering, operations research, business intelligence, and generative AI integration.

**Author:** Luukas · Aalto University · Systems Sciences & Applied Mathematics  
**Tech Stack:** Python (pandas, PuLP), React (Recharts), Claude API

---

## What This Project Demonstrates

| Requirement from Job Description | How This Project Addresses It |
|---|---|
| *Identifying pain points and translating them into AI prototypes* | Transport cost optimization model + 6 documented Gen AI use cases |
| *Working with data from SAP/Power BI to clean, combine, analyze* | Full Python data pipeline generating realistic supply chain datasets |
| *Building dashboards and analytical summaries* | Interactive React dashboard with 5 views and 20+ KPIs |
| *Experimenting with generative AI tools* | Working AI Copilot powered by Claude API for natural-language data querying |
| *Financial/operational reporting and cost efficiency analysis* | Regional cost comparisons, quarterly trends, supplier scorecards |

---

## Project Structure

```
wood-supply-intelligence/
├── data_pipeline.py            # Synthetic data generation (Finnish wood supply chain)
├── optimization_model.py       # LP transport cost optimization (PuLP/CBC)
├── prepare_dashboard_data.py   # Data aggregation and JSON export
├── wood_supply_dashboard.jsx   # Interactive React dashboard + AI Copilot
├── README.md
└── data/                       # Generated datasets
    ├── timber_prices.csv       # 1,296 monthly price records
    ├── procurement_data.csv    # 4,289 purchase orders
    ├── inventory_data.csv      # 5,652 weekly depot snapshots
    ├── transport_costs.csv     # 36 depot-mill route costs
    └── supplier_scorecard.csv  # 50 supplier performance profiles
```

---

## 1. Data Pipeline (`data_pipeline.py`)

Generates realistic synthetic data modeled on the Finnish timber market structure (based on publicly available data from Luke / Natural Resources Institute Finland):

- **6 Finnish regions** with location-based capacity factors
- **6 wood assortments** (3 log types + 3 pulpwood types) with distinct pricing dynamics
- **50 suppliers** with performance characteristics
- **6 depots** and **6 mills** across Finland

### Key features:
- Seasonal price patterns (summer harvesting premium)
- Long-term price trends with regional variation
- Delivery performance simulation (on-time probability modeling)
- Inventory dynamics with safety stock thresholds
- Supplier composite scoring (reliability, quality, price competitiveness)

---

## 2. Transport Optimization (`optimization_model.py`)

A minimum-cost transportation LP model solved by PuLP/CBC:

**Decision variables:** `x[depot][mill][wood_type]` = volume transported (m³/week)

**Objective:** Minimize total transport cost

**Constraints:**
- Supply at each depot ≤ available stock
- Demand at each mill ≥ required volume
- Transport capacity per route ≤ maximum

**Results:**
- **Optimal solution found** — 144 variables, 84 constraints
- **18.7% cost savings** versus naive equal-split allocation
- 8 active routes identified with full utilization analysis

This demonstrates the kind of operational optimization that drives real cost efficiency in wood supply logistics.

---

## 3. Interactive Dashboard (`wood_supply_dashboard.jsx`)

Five integrated views:

### Overview
- KPI cards: Total procurement (€22.4M), volume (500K m³), on-time rate (73.7%), supplier count
- Quarterly cost/volume trend with dual-axis chart
- Regional cost comparison (highlighting Keski-Suomi at €47.40/m³ as highest)

### Procurement
- Timber price tracker with category filtering (Logs vs Pulpwood)
- Wood type distribution (pie chart + detail cards)
- Price evolution across 2023–2025

### Inventory & Suppliers
- Depot health cards with utilization bars and alert indicators
- Top supplier ranking with composite scores
- Radar chart comparing top 4 suppliers across 4 dimensions

### Optimization
- LP model results with route volume and cost efficiency charts
- Mathematical formulation display
- Savings comparison (optimized vs naive allocation)

### AI Copilot
- Natural-language chat interface powered by Claude API
- Contextual data awareness (all KPIs, trends, supplier data)
- 6 documented generative AI use cases for Business Controlling

---

## 4. Generative AI Use Cases

Documented concepts for how Gen AI can enhance Business Controlling workflows:

1. **Anomaly Detection** — LLM-powered alerts for unusual cost/delivery patterns
2. **Report Summarization** — Automated executive summaries from Power BI exports
3. **Scenario Q&A** — What-if analysis through natural language queries
4. **Data Cleaning Assistant** — SAP data quality improvement
5. **Procurement Copilot** — AI-suggested order quantities and timing
6. **Supplier Risk Monitor** — Continuous performance assessment with early warnings

---

## Running the Project

```bash
# Install dependencies
pip install pandas numpy pulp

# Generate data
python data_pipeline.py

# Run optimization
python optimization_model.py

# Prepare dashboard data
python prepare_dashboard_data.py

# The React dashboard (wood_supply_dashboard.jsx) runs as a
# standalone React component with recharts dependency
```

---

## Skills Demonstrated

- **Data Engineering:** Python data pipeline, realistic synthetic data generation, ETL
- **Operations Research:** LP formulation, transport optimization, PuLP solver
- **Business Intelligence:** KPI design, dashboard development, data visualization
- **Generative AI:** Claude API integration, prompt engineering, use case documentation
- **Domain Knowledge:** Finnish timber market structure, supply chain operations, inventory management
- **Financial Analysis:** Cost per unit metrics, regional comparisons, trend analysis
- **Communication:** Translating technical findings into business insights

---

## About the Author

Second-year Aalto University student in Systems Sciences and Applied Mathematics (Technical Physics and Mathematics program), specializing in operations research and optimization. Currently working part-time in the construction retail industry, with hands-on experience in Finnish construction technology and lean scheduling systems.

This project bridges academic expertise in mathematical optimization with practical industry knowledge of supply chain operations and modern AI capabilities.
