"""
Prepare all data as a single JSON bundle for the React dashboard.
"""
import pandas as pd
import numpy as np
import json

# Load data
prices = pd.read_csv("timber_prices.csv")
procurement = pd.read_csv("procurement_data.csv")
inventory = pd.read_csv("inventory_data.csv")
transport = pd.read_csv("transport_costs.csv")
suppliers = pd.read_csv("supplier_scorecard.csv")

with open("kpis.json") as f:
    kpis = json.load(f)
with open("optimization_results.json") as f:
    optim = json.load(f)

# --- Price trends (monthly avg by wood type) ---
price_trends = prices.groupby(["date", "wood_type", "category"]).agg(
    avg_price=("price_eur_m3", "mean")
).reset_index()
price_trends["avg_price"] = price_trends["avg_price"].round(2)
# Reduce to monthly for chart
price_monthly = prices.groupby(["year", "month", "wood_type", "category"]).agg(
    avg_price=("price_eur_m3", "mean")
).reset_index()
price_monthly["avg_price"] = price_monthly["avg_price"].round(2)
price_monthly["date_label"] = price_monthly.apply(lambda r: f"{int(r['year'])}-{int(r['month']):02d}", axis=1)

# Pivot for chart: each wood type as a column
price_pivot = price_monthly.pivot_table(index="date_label", columns="wood_type", values="avg_price").reset_index()
price_chart = price_pivot.to_dict(orient="records")

# --- Procurement by quarter and region ---
proc_q = procurement.groupby(["year", "quarter"]).agg(
    total_cost=("total_cost_eur", "sum"),
    total_volume=("volume_m3", "sum"),
    on_time_rate=("on_time", "mean"),
    order_count=("order_id", "count"),
).reset_index()
proc_q["cost_per_m3"] = (proc_q["total_cost"] / proc_q["total_volume"]).round(2)
proc_q["on_time_rate"] = (proc_q["on_time_rate"] * 100).round(1)
proc_q["label"] = proc_q.apply(lambda r: f"{int(r['year'])} {r['quarter']}", axis=1)

# --- Regional breakdown (2025) ---
proc_region = procurement[procurement["year"] == 2025].groupby("region").agg(
    total_cost=("total_cost_eur", "sum"),
    total_volume=("volume_m3", "sum"),
    on_time_rate=("on_time", "mean"),
).reset_index()
proc_region["cost_per_m3"] = (proc_region["total_cost"] / proc_region["total_volume"]).round(2)
proc_region["on_time_rate"] = (proc_region["on_time_rate"] * 100).round(1)
proc_region["total_cost"] = proc_region["total_cost"].round(0)

# --- Inventory latest snapshot ---
latest_date = inventory["date"].max()
inv_latest = inventory[inventory["date"] == latest_date].copy()
inv_by_depot = inv_latest.groupby("depot").agg(
    total_stock=("stock_m3", "sum"),
    avg_utilization=("utilization_pct", "mean"),
    critical=("stock_status", lambda x: (x == "Critical").sum()),
    low=("stock_status", lambda x: (x == "Low").sum()),
    optimal=("stock_status", lambda x: (x == "Optimal").sum()),
    overstocked=("stock_status", lambda x: (x == "Overstocked").sum()),
).reset_index()
inv_by_depot["avg_utilization"] = inv_by_depot["avg_utilization"].round(1)
inv_by_depot["total_stock"] = inv_by_depot["total_stock"].round(0)

# --- Inventory trend (weekly avg across all depots) ---
inv_weekly = inventory.groupby("date").agg(
    avg_stock=("stock_m3", "mean"),
    avg_utilization=("utilization_pct", "mean"),
).reset_index()
inv_weekly["avg_stock"] = inv_weekly["avg_stock"].round(1)
inv_weekly["avg_utilization"] = inv_weekly["avg_utilization"].round(1)
# Sample every 4th week to reduce data
inv_trend = inv_weekly.iloc[::4].to_dict(orient="records")

# --- Supplier top/bottom ---
suppliers_sorted = suppliers.sort_values("reliability_score", ascending=False)
top_suppliers = suppliers_sorted.head(10).to_dict(orient="records")
bottom_suppliers = suppliers_sorted.tail(10).to_dict(orient="records")

# --- Wood type distribution (2025) ---
wood_dist = procurement[procurement["year"] == 2025].groupby("wood_type").agg(
    total_volume=("volume_m3", "sum"),
    total_cost=("total_cost_eur", "sum"),
    avg_price=("unit_price_eur", "mean"),
).reset_index()
wood_dist["avg_price"] = wood_dist["avg_price"].round(2)
wood_dist["total_volume"] = wood_dist["total_volume"].round(0)
wood_dist["total_cost"] = wood_dist["total_cost"].round(0)

# --- Bundle everything ---
dashboard_data = {
    "kpis": kpis,
    "price_chart": price_chart,
    "procurement_quarterly": proc_q.to_dict(orient="records"),
    "procurement_regional": proc_region.to_dict(orient="records"),
    "inventory_depots": inv_by_depot.to_dict(orient="records"),
    "inventory_trend": inv_trend,
    "suppliers_top": top_suppliers,
    "suppliers_bottom": bottom_suppliers,
    "wood_distribution": wood_dist.to_dict(orient="records"),
    "optimization": optim,
    "transport_matrix": transport.to_dict(orient="records"),
}

with open("dashboard_data.json", "w") as f:
    json.dump(dashboard_data, f, indent=2, default=str)

print(f"Dashboard data bundle created: dashboard_data.json")
print(f"  Price chart points: {len(price_chart)}")
print(f"  Procurement quarters: {len(proc_q)}")
print(f"  Regions: {len(proc_region)}")
print(f"  Depots: {len(inv_by_depot)}")
print(f"  Inventory trend points: {len(inv_trend)}")
