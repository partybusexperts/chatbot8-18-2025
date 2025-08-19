"use client";

import { useState } from 'react';
import { fetchQuote, QuoteRequest } from '../lib/api';

const VEHICLE_IMAGES: Record<string, string> = {
  'Party Bus': 'https://img.icons8.com/color/96/party-bus.png',
  'Limousine': 'https://img.icons8.com/color/96/limousine.png',
  'Shuttle Bus': 'https://img.icons8.com/color/96/bus.png',
  'Default': 'https://img.icons8.com/color/96/transportation.png',
};

export default function HomePage() {
  const [zip, setZip] = useState('');
  const [passengers, setPassengers] = useState(10);
  const [hours, setHours] = useState(4);
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const eventTypes = [
    '',
    'Birthday',
    'Wedding',
    'Prom',
    'Concert',
    'Corporate',
    'Bachelor/Bachelorette',
    'Other',
  ];

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
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow">Party Bus Quote Finder</h1>
      <form className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" onSubmit={handleQuote} aria-label="Quote form">
        <div>
          <label className="block font-semibold mb-1" htmlFor="zip">Pickup ZIP code</label>
          <input id="zip" required value={zip} onChange={e => setZip(e.target.value)} placeholder="e.g. 90210" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="passengers">Passengers</label>
          <input id="passengers" required type="number" min={1} value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="hours">Hours</label>
          <input id="hours" required type="number" min={1} value={hours} onChange={e => setHours(Number(e.target.value))} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="date">Date</label>
          <input id="date" required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="eventType">Event type</label>
          <select id="eventType" value={eventType} onChange={e => setEventType(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400">
            {eventTypes.map((et, i) => (
              <option key={i} value={et}>{et || 'Select event type (optional)'}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2" disabled={loading} aria-busy={loading}>
          {loading && (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          )}
          {loading ? 'Getting Quote...' : 'Get Quote'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4 text-center font-semibold">{error}</div>}
      {result && (
        <section aria-label="Quote results">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Top 3 Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {result.main_options.map((v: any, i: number) => {
              const type = v.type || v.category || 'Default';
              const img = VEHICLE_IMAGES[type] || VEHICLE_IMAGES['Default'];
              return (
                <div key={i} className="rounded-xl shadow-lg bg-white p-5 flex flex-col items-center hover:scale-105 transition">
                  <img src={img} alt={type} className="w-20 h-20 mb-2" />
                  <div className="font-bold text-lg mb-1 text-center">{v.name}</div>
                  <span className={`inline-block px-2 py-1 mb-2 rounded text-xs font-semibold ${type === 'Party Bus' ? 'bg-pink-200 text-pink-800' : type === 'Limousine' ? 'bg-purple-200 text-purple-800' : type === 'Shuttle Bus' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{type}</span>
                  <div className="text-gray-700">Capacity: <span className="font-semibold">{v.capacity}</span></div>
                  <div className="text-blue-700 font-bold text-xl mt-1">${v.price}</div>
                </div>
              );
            })}
          </div>
          <h3 className="text-xl font-semibold mb-3 text-blue-700">More Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-bold mb-2 flex items-center gap-2"><img src={VEHICLE_IMAGES['Party Bus']} alt="Party Bus" className="w-6 h-6" />Party Buses</div>
              {result.backups.party_buses.map((v: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2 bg-pink-50 flex items-center gap-2">
                  <img src={VEHICLE_IMAGES['Party Bus']} alt="Party Bus" className="w-6 h-6" />
                  <span className="font-semibold">{v.name}</span>
                  <span className="ml-auto text-blue-700 font-bold">${v.price}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2 flex items-center gap-2"><img src={VEHICLE_IMAGES['Limousine']} alt="Limousine" className="w-6 h-6" />Limousines</div>
              {result.backups.limousines.map((v: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2 bg-purple-50 flex items-center gap-2">
                  <img src={VEHICLE_IMAGES['Limousine']} alt="Limousine" className="w-6 h-6" />
                  <span className="font-semibold">{v.name}</span>
                  <span className="ml-auto text-blue-700 font-bold">${v.price}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold mb-2 flex items-center gap-2"><img src={VEHICLE_IMAGES['Shuttle Bus']} alt="Shuttle Bus" className="w-6 h-6" />Shuttle Buses</div>
              {result.backups.shuttle_buses.map((v: any, i: number) => (
                <div key={i} className="border rounded p-2 mb-2 bg-green-50 flex items-center gap-2">
                  <img src={VEHICLE_IMAGES['Shuttle Bus']} alt="Shuttle Bus" className="w-6 h-6" />
                  <span className="font-semibold">{v.name}</span>
                  <span className="ml-auto text-blue-700 font-bold">${v.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
