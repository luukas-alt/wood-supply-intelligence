"""
Wood Supply Intelligence — Data Pipeline
=========================================
Generates realistic synthetic data for Finnish wood supply chain operations.
Based on publicly available Finnish timber market structures (Luke / Natural Resources Institute).

Author: Luukas (Aalto University — Systems Sciences & Applied Mathematics)
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta

np.random.seed(42)

# --- Configuration ---
REGIONS = {
    "Etelä-Suomi": {"lat": 60.45, "lon": 24.94, "capacity_factor": 1.0},
    "Länsi-Suomi": {"lat": 61.50, "lon": 23.79, "capacity_factor": 0.85},
    "Itä-Suomi": {"lat": 62.89, "lon": 27.68, "capacity_factor": 0.90},
    "Keski-Suomi": {"lat": 62.24, "lon": 25.75, "capacity_factor": 0.80},
    "Pohjois-Suomi": {"lat": 65.01, "lon": 25.47, "capacity_factor": 0.70},
    "Kaakkois-Suomi": {"lat": 61.06, "lon": 28.19, "capacity_factor": 0.95},
}

WOOD_TYPES = {
    "Mäntytukki": {"base_price": 72.0, "volatility": 0.08},       # Pine logs
    "Kuusitukki": {"base_price": 78.0, "volatility": 0.07},       # Spruce logs
    "Koivutukki": {"base_price": 52.0, "volatility": 0.10},       # Birch logs
    "Mäntykuitu": {"base_price": 22.0, "volatility": 0.06},       # Pine pulpwood
    "Kuusikuitu": {"base_price": 24.0, "volatility": 0.05},       # Spruce pulpwood
    "Koivukuitu": {"base_price": 20.0, "volatility": 0.09},       # Birch pulpwood
}

SUPPLIERS = [f"Supplier_{i:03d}" for i in range(1, 51)]
DEPOTS = ["Kotka Terminal", "Rauma Terminal", "Oulu Terminal", "Imatra Mill", "Varkaus Mill", "Kemi Mill"]
MILLS = ["Imatra Mill", "Oulu Mill", "Varkaus Mill", "Kemi Mill", "Kotka Mill", "Heinola Mill"]

START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2025, 12, 31)
N_MONTHS = (END_DATE.year - START_DATE.year) * 12 + END_DATE.month - START_DATE.month + 1


def generate_timber_prices():
    """Generate monthly timber price data with seasonal patterns and trends."""
    records = []
    for month_idx in range(N_MONTHS):
        date = START_DATE + timedelta(days=month_idx * 30)
        for wood, params in WOOD_TYPES.items():
            # Seasonal component (higher in summer harvesting season)
            seasonal = 1.0 + 0.05 * np.sin(2 * np.pi * (month_idx - 3) / 12)
            # Trend component (gradual increase)
            trend = 1.0 + 0.002 * month_idx
            # Random walk
            noise = np.random.normal(0, params["volatility"])
            price = params["base_price"] * seasonal * trend * (1 + noise)

            for region in REGIONS:
                regional_factor = 0.95 + 0.10 * np.random.random()
                records.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "year": date.year,
                    "month": date.month,
                    "quarter": f"Q{(date.month - 1) // 3 + 1}",
                    "wood_type": wood,
                    "region": region,
                    "price_eur_m3": round(price * regional_factor, 2),
                    "category": "Tukki" if "tukki" in wood.lower() else "Kuitu",
                })
    return pd.DataFrame(records)


def generate_procurement_data():
    """Generate procurement/purchasing transaction data."""
    records = []
    order_id = 10000
    for month_idx in range(N_MONTHS):
        date_base = START_DATE + timedelta(days=month_idx * 30)
        n_orders = np.random.randint(80, 160)
        for _ in range(n_orders):
            order_id += 1
            supplier = np.random.choice(SUPPLIERS)
            region = np.random.choice(list(REGIONS.keys()))
            wood = np.random.choice(list(WOOD_TYPES.keys()))
            volume = round(np.random.lognormal(mean=5.5, sigma=0.8), 1)  # m³
            base_price = WOOD_TYPES[wood]["base_price"]
            price_var = np.random.normal(1.0, 0.08)
            unit_price = round(base_price * price_var, 2)
            total_cost = round(volume * unit_price, 2)

            # Delivery performance
            planned_days = np.random.choice([7, 10, 14, 21])
            actual_days = planned_days + np.random.choice([-2, -1, 0, 0, 0, 1, 2, 3, 5, 8],
                                                           p=[0.05, 0.10, 0.35, 0.15, 0.10, 0.10, 0.05, 0.05, 0.03, 0.02])
            on_time = actual_days <= planned_days

            order_date = date_base + timedelta(days=np.random.randint(0, 28))
            delivery_date = order_date + timedelta(days=int(max(1, actual_days)))

            records.append({
                "order_id": f"PO-{order_id}",
                "order_date": order_date.strftime("%Y-%m-%d"),
                "delivery_date": delivery_date.strftime("%Y-%m-%d"),
                "year": order_date.year,
                "month": order_date.month,
                "quarter": f"Q{(order_date.month - 1) // 3 + 1}",
                "supplier": supplier,
                "region": region,
                "wood_type": wood,
                "volume_m3": volume,
                "unit_price_eur": unit_price,
                "total_cost_eur": total_cost,
                "planned_lead_days": planned_days,
                "actual_lead_days": max(1, actual_days),
                "on_time": on_time,
                "category": "Tukki" if "tukki" in wood.lower() else "Kuitu",
            })
    return pd.DataFrame(records)


def generate_inventory_data():
    """Generate daily depot inventory snapshots."""
    records = []
    for depot in DEPOTS:
        for wood in WOOD_TYPES:
            stock = np.random.uniform(500, 2000)
            safety_stock = 400
            max_capacity = 5000
            for day in range(0, (END_DATE - START_DATE).days, 7):  # weekly snapshots
                date = START_DATE + timedelta(days=day)
                # Seasonal demand pattern
                seasonal_demand = 1.0 + 0.3 * np.sin(2 * np.pi * (date.month - 1) / 12)
                inflow = np.random.exponential(150) * seasonal_demand
                outflow = np.random.exponential(160) * seasonal_demand
                stock = max(0, min(max_capacity, stock + inflow - outflow))

                records.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "year": date.year,
                    "month": date.month,
                    "week": date.isocalendar()[1],
                    "depot": depot,
                    "wood_type": wood,
                    "stock_m3": round(stock, 1),
                    "safety_stock_m3": safety_stock,
                    "max_capacity_m3": max_capacity,
                    "stock_status": "Critical" if stock < safety_stock * 0.5
                                    else "Low" if stock < safety_stock
                                    else "Optimal" if stock < max_capacity * 0.8
                                    else "Overstocked",
                    "utilization_pct": round(stock / max_capacity * 100, 1),
                })
    return pd.DataFrame(records)


def generate_transport_cost_matrix():
    """Generate transport cost matrix between depots and mills."""
    records = []
    for depot in DEPOTS:
        for mill in MILLS:
            distance = np.random.uniform(50, 600)
            cost_per_m3 = round(3.5 + distance * 0.018 + np.random.normal(0, 0.5), 2)
            co2_per_m3 = round(distance * 0.035, 2)
            records.append({
                "depot": depot,
                "mill": mill,
                "distance_km": round(distance, 0),
                "transport_cost_eur_m3": max(3.0, cost_per_m3),
                "co2_kg_m3": co2_per_m3,
                "capacity_m3_week": np.random.choice([500, 750, 1000, 1500]),
            })
    return pd.DataFrame(records)


def generate_supplier_scorecard():
    """Generate supplier performance scorecards."""
    records = []
    for supplier in SUPPLIERS:
        region = np.random.choice(list(REGIONS.keys()))
        records.append({
            "supplier": supplier,
            "region": region,
            "reliability_score": round(np.random.beta(8, 2) * 100, 1),
            "quality_score": round(np.random.beta(7, 2) * 100, 1),
            "price_competitiveness": round(np.random.beta(5, 3) * 100, 1),
            "avg_lead_days": round(np.random.gamma(3, 3) + 3, 1),
            "total_volume_m3": round(np.random.lognormal(9, 1), 0),
            "total_orders": np.random.randint(20, 500),
            "on_time_pct": round(np.random.beta(7, 2) * 100, 1),
            "contracts_active": np.random.randint(1, 8),
        })
    return pd.DataFrame(records)


def compute_kpis(procurement_df, inventory_df):
    """Compute key business KPIs from the data."""
    latest_year = procurement_df["year"].max()

    # Procurement KPIs by quarter
    proc_quarterly = procurement_df[procurement_df["year"] == latest_year].groupby("quarter").agg(
        total_volume=("volume_m3", "sum"),
        total_cost=("total_cost_eur", "sum"),
        avg_unit_price=("unit_price_eur", "mean"),
        on_time_rate=("on_time", "mean"),
        order_count=("order_id", "count"),
    ).round(2)
    proc_quarterly["cost_per_m3"] = (proc_quarterly["total_cost"] / proc_quarterly["total_volume"]).round(2)
    proc_quarterly["on_time_rate"] = (proc_quarterly["on_time_rate"] * 100).round(1)

    # Regional cost comparison
    regional = procurement_df[procurement_df["year"] == latest_year].groupby("region").agg(
        total_cost=("total_cost_eur", "sum"),
        total_volume=("volume_m3", "sum"),
        avg_price=("unit_price_eur", "mean"),
        on_time_rate=("on_time", "mean"),
    ).round(2)
    regional["cost_per_m3"] = (regional["total_cost"] / regional["total_volume"]).round(2)

    # Inventory health
    latest_inv = inventory_df[inventory_df["date"] == inventory_df["date"].max()]
    inv_summary = latest_inv.groupby("depot").agg(
        avg_utilization=("utilization_pct", "mean"),
        critical_count=("stock_status", lambda x: (x == "Critical").sum()),
        low_count=("stock_status", lambda x: (x == "Low").sum()),
    ).round(1)

    return {
        "quarterly_kpis": proc_quarterly.reset_index().to_dict(orient="records"),
        "regional_kpis": regional.reset_index().to_dict(orient="records"),
        "inventory_health": inv_summary.reset_index().to_dict(orient="records"),
        "summary": {
            "total_procurement_cost_2025": float(procurement_df[procurement_df["year"] == 2025]["total_cost_eur"].sum()),
            "total_volume_2025": float(procurement_df[procurement_df["year"] == 2025]["volume_m3"].sum()),
            "avg_on_time_rate_2025": float(procurement_df[procurement_df["year"] == 2025]["on_time"].mean() * 100),
            "supplier_count": len(procurement_df["supplier"].unique()),
        }
    }


if __name__ == "__main__":
    print("Generating wood supply chain data...")

    prices_df = generate_timber_prices()
    procurement_df = generate_procurement_data()
    inventory_df = generate_inventory_data()
    transport_df = generate_transport_cost_matrix()
    suppliers_df = generate_supplier_scorecard()
    kpis = compute_kpis(procurement_df, inventory_df)

    # Save to CSV
    prices_df.to_csv("timber_prices.csv", index=False)
    procurement_df.to_csv("procurement_data.csv", index=False)
    inventory_df.to_csv("inventory_data.csv", index=False)
    transport_df.to_csv("transport_costs.csv", index=False)
    suppliers_df.to_csv("supplier_scorecard.csv", index=False)

    # Save KPIs as JSON for the dashboard
    with open("kpis.json", "w") as f:
        json.dump(kpis, f, indent=2, default=str)

    print(f"  Timber prices:   {len(prices_df):>8,} rows")
    print(f"  Procurement:     {len(procurement_df):>8,} rows")
    print(f"  Inventory:       {len(inventory_df):>8,} rows")
    print(f"  Transport costs: {len(transport_df):>8,} rows")
    print(f"  Suppliers:       {len(suppliers_df):>8,} rows")
    print(f"\nKPI Summary (2025):")
    print(f"  Total cost: €{kpis['summary']['total_procurement_cost_2025']:,.0f}")
    print(f"  Total volume: {kpis['summary']['total_volume_2025']:,.0f} m³")
    print(f"  On-time rate: {kpis['summary']['avg_on_time_rate_2025']:.1f}%")
    print("Done!")
