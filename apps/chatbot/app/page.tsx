"use client";
import { useState } from 'react';
import { fetchQuote, QuoteRequest } from '../lib/api';

export default function HomePage() {
  const [zip, setZip] = useState('');
  const [passengers, setPassengers] = useState(10);
  const [hours, setHours] = useState(4);
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleQuote(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const req: QuoteRequest = {
        zip_code: zip,
        passengers,
        hours,
        date,
        event_type: eventType,
      };
      const data = await fetchQuote(req);
      setResult(data);
    } catch (err: any) {
      setError('Failed to fetch quote.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Party Bus Quoting Chatbot</h1>
      <form className="grid grid-cols-2 gap-4 mb-6" onSubmit={handleQuote}>
        <input required value={zip} onChange={e => setZip(e.target.value)} placeholder="Pickup ZIP code" className="col-span-1 p-2 border rounded" />
        <input required type="number" min={1} value={passengers} onChange={e => setPassengers(Number(e.target.value))} placeholder="Passengers" className="col-span-1 p-2 border rounded" />
        <input required type="number" min={1} value={hours} onChange={e => setHours(Number(e.target.value))} placeholder="Hours" className="col-span-1 p-2 border rounded" />
        <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="col-span-1 p-2 border rounded" />
        <input value={eventType} onChange={e => setEventType(e.target.value)} placeholder="Event type (optional)" className="col-span-2 p-2 border rounded" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded disabled:opacity-50" disabled={loading}>Get Quote</button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div>Loading...</div>}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Top 3 Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {result.main_options.map((v: any, i: number) => (
              <div key={i} className="border rounded p-3 bg-white shadow">
                <div className="font-bold">{v.name}</div>
                <div>Capacity: {v.capacity}</div>
                <div>Price: ${v.price}</div>
                <div>Type: {v.type || v.category || '-'}</div>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold mb-2">More Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="font-bold mb-1">Party Buses</div>
              {result.backups.party_buses.map((v: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2 bg-gray-50">
                  {v.name} (${v.price})
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-1">Limousines</div>
              {result.backups.limousines.map((v: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2 bg-gray-50">
                  {v.name} (${v.price})
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-1">Shuttle Buses</div>
              {result.backups.shuttle_buses.map((v: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2 bg-gray-50">
                  {v.name} (${v.price})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
