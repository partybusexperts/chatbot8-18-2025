# Yet another tiny test change for Vercel sync
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import pandas as pd
from datetime import datetime
import os

app = FastAPI()

# Enable CORS for frontend
# Test change: this comment is for verifying git commit and sync
# Another tiny test change for Vercel sync
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load vehicle data once at startup for performance
VEHICLE_CSV = os.path.join(os.path.dirname(__file__), '../vehicles.csv')
vehicles_df = pd.read_csv(VEHICLE_CSV, dtype=str).fillna("")

# Helper: prom logic
PROM_MONTHS = {3, 4, 5}
def is_prom(date: str, event_type: str = "") -> bool:
    try:
        dt = datetime.strptime(date, "%Y-%m-%d")
        if dt.month in PROM_MONTHS and dt.weekday() == 5:  # Saturday
            return True
    except Exception:
        pass
    if 'prom' in event_type.lower() or 'dance' in event_type.lower():
        return True
    return False

def get_vehicle_name(row):
    return row.get('vehicle_title', row.get('name', ''))

def get_zip_codes(row):
    return str(row.get('zip', ''))

def get_capacity(row):
    try:
        return int(row.get('capacity', '0'))
    except Exception:
        return 0

def get_category(row):
    cats = row.get('categories', '').lower()
    if 'party' in cats:
        return 'party_buses'
    if 'limo' in cats:
        return 'limousines'
    if 'shuttle' in cats or 'coach' in cats:
        return 'shuttle_buses'
    return 'other'

def get_price(row, hours, prom, before5pm):
    # Prom logic
    if prom:
        col = f'prom_price_{hours}hr'
        if col in row and row[col]:
            try:
                return float(row[col])
            except Exception:
                pass
        # fallback to prom_price_6hr if not found
        if 'prom_price_6hr' in row and row['prom_price_6hr']:
            try:
                return float(row['prom_price_6hr'])
            except Exception:
                pass
    # Before 5pm logic
    if before5pm:
        col = f'before5pm_{hours}hr'
        if col in row and row[col]:
            try:
                return float(row[col])
            except Exception:
                pass
    # Standard pricing
    col = f'price_{hours}hr'
    if col in row and row[col]:
        try:
            return float(row[col])
        except Exception:
            pass
    return None

@app.get("/quote")
def get_quote(
    zip_code: str = Query(..., description="Pickup zip code"),
    passengers: int = Query(..., description="Passenger count"),
    hours: int = Query(..., description="Requested hours"),
    date: str = Query(..., description="Event date (YYYY-MM-DD)"),
    event_type: str = Query("", description="Event type (prom, wedding, etc.)")
) -> Dict[str, Any]:
    # Filter by zip code
    filtered = vehicles_df[vehicles_df['zip'].astype(str).str.contains(str(zip_code), na=False)]
    if filtered.empty:
        return {"main_options": [], "backups": {"party_buses": [], "limousines": [], "shuttle_buses": []}}

    prom = is_prom(date, event_type)
    before5pm = False  # You can add logic to set this based on city/time if needed

    # Build result list with robust error handling
    results = []
    for _, row in filtered.iterrows():
        try:
            cap = get_capacity(row)
            if cap < passengers:
                continue
            price = get_price(row, hours, prom, before5pm)
            if price is None:
                continue
            results.append({
                'name': get_vehicle_name(row),
                'zip': get_zip_codes(row),
                'capacity': cap,
                'price': price,
                'category': get_category(row),
                'image': row.get('image_main', ''),
                'city': row.get('city', ''),
            })
        except Exception:
            continue

    # Sort by closest capacity >= passengers, then price
    results = sorted(results, key=lambda x: (x['capacity'], x['price']))

    # Main 3 options
    main_options = results[:3]

    # Backup columns
    backups = {'party_buses': [], 'limousines': [], 'shuttle_buses': []}
    for v in results:
        cat = v['category']
        if cat in backups:
            backups[cat].append(v)

    return {
        "main_options": main_options,
        "backups": backups
    }