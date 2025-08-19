from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
import math

app = FastAPI()

# Allow CORS for local dev and Vercel
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'vehicles_sample.csv')

class Vehicle(BaseModel):
  name: str
  zip: str
  capacity: int
  price: float | None = None
  price_table: dict[str, float | None] = {}
  category: str
  image: str = ""
  city: str = ""

class QuoteResponse(BaseModel):
  main_options: list[Vehicle]
  backups: dict[str, list[Vehicle]]

def safe_int(val, default=0):
  try:
    if pd.isna(val) or val is None:
      return default
    return int(float(val))
  except Exception:
    return default

def load_vehicles():
  try:
    df = pd.read_csv(CSV_PATH)
  except Exception as e:
    raise RuntimeError(f"Could not load vehicles.csv: {e}")
  vehicles = []
  for _, row in df.iterrows():
    price_table = {}
    for h in [1,2,3,4,5,6,7,8,9,10]:
      col = f"{h}_hour"
      if col in row:
        price_table[str(h)] = row.get(col, None)
    vehicles.append(Vehicle(
      name=row.get('name', ''),
      zip=str(row.get('zip', '')),
      capacity=safe_int(row.get('capacity', 0)),
      price=row.get('price', None),
      price_table=price_table,
      category=row.get('category', ''),
      image=row.get('image', ''),
      city=row.get('city', ''),
    ))
  return vehicles

from fastapi.responses import JSONResponse
import traceback
@app.get("/quote", response_model=QuoteResponse)
def quote(
  zip_code: str = Query(...),
  passengers: int = Query(...),
  hours: int = Query(...),
  date: str = Query(...),
  event_type: str = Query(None)
):
  try:
    vehicles = load_vehicles()
  except Exception as e:
    print("\n--- ERROR in /quote endpoint ---")
    traceback.print_exc()
    print("--- END ERROR ---\n")
    return JSONResponse(status_code=500, content={"error": str(e)})
  # Filter by zip/city/capacity
  filtered = [v for v in vehicles if v.capacity >= passengers and (zip_code in v.zip or zip_code in v.city)]
  # Fallback: just by capacity
  if not filtered:
    filtered = [v for v in vehicles if v.capacity >= passengers]
  # Sort by price for requested hours
  def get_price(v):
    return v.price_table.get(str(hours), float('inf')) or float('inf')
  filtered.sort(key=get_price)
  main_options = filtered[:3]
  # Backups by category
  backups = {cat: [v for v in vehicles if v.category==cat and v not in main_options][:5] for cat in ['party_buses','limousines','shuttle_buses']}
  return QuoteResponse(main_options=main_options, backups=backups)

  app = FastAPI()

  # Allow CORS for local dev and Vercel
  app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'vehicles.csv')

  class Vehicle(BaseModel):
    name: str
    zip: str
    capacity: int
    price: float | None = None
    price_table: dict[str, float | None] = {}
    category: str
    image: str = ""
    city: str = ""

  class QuoteResponse(BaseModel):
    main_options: list[Vehicle]
    backups: dict[str, list[Vehicle]]

  def load_vehicles():
    df = pd.read_csv(CSV_PATH)
    vehicles = []
    for _, row in df.iterrows():
      price_table = {}
      for h in [1,2,3,4,5,6,7,8,9,10]:
        col = f"{h}_hour"
        if col in row:
          price_table[str(h)] = row.get(col, None)
      vehicles.append(Vehicle(
        name=row.get('name', ''),
        zip=str(row.get('zip', '')),
        capacity=int(row.get('capacity', 0)),
        price=row.get('price', None),
        price_table=price_table,
        category=row.get('category', ''),
        image=row.get('image', ''),
        city=row.get('city', ''),
      ))
    return vehicles

  @app.get("/quote", response_model=QuoteResponse)
  def quote(
    zip_code: str = Query(...),
    passengers: int = Query(...),
    hours: int = Query(...),
    date: str = Query(...),
    event_type: str = Query(None)
  ):
    vehicles = load_vehicles()
    # Filter by zip/city/capacity
    filtered = [v for v in vehicles if v.capacity >= passengers and (zip_code in v.zip or zip_code in v.city)]
    # Fallback: just by capacity
    if not filtered:
      filtered = [v for v in vehicles if v.capacity >= passengers]
    # Sort by price for requested hours
    def get_price(v):
      return v.price_table.get(str(hours), float('inf')) or float('inf')
    filtered.sort(key=get_price)
    main_options = filtered[:3]
    # Backups by category
    backups = {cat: [v for v in vehicles if v.category==cat and v not in main_options][:5] for cat in ['party_buses','limousines','shuttle_buses']}
    return QuoteResponse(main_options=main_options, backups=backups)
  const [eventType, setEventType] = useState<string>("Birthday");
