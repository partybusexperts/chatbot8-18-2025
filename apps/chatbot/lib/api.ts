import axios from 'axios';

export interface QuoteRequest {
  zip_code: string;
  passengers: number;
  hours: number;
  date: string; // YYYY-MM-DD
  event_type?: string;
}

export async function fetchQuote(req: QuoteRequest) {
  const res = await axios.get('http://localhost:8000/quote', { params: req });
  return res.data;
}
