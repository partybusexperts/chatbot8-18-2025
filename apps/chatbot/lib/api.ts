import axios from 'axios';

export interface QuoteRequest {
  zip_code: string;
  passengers: number;
  hours: number;
  date: string; // YYYY-MM-DD
  event_type?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export async function fetchQuote(req: QuoteRequest) {
  const res = await axios.get(`${API_BASE}/quote`, { params: req });
  return res.data;
}
