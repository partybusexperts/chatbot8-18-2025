"use client";

import { useState } from 'react';
import { fetchQuote, QuoteRequest } from '../lib/api';

const VEHICLE_IMAGES: Record<string, string> = {
  'party_buses': 'https://img.icons8.com/color/96/party-bus.png',
  'limousines': 'https://img.icons8.com/color/96/limousine.png',
  'shuttle_buses': 'https://img.icons8.com/color/96/bus.png',
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
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Top 3 Vehicle Choices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {result.main_options.map((v: any, i: number) => {
              const type = v.category || 'Default';
              const img = v.image && v.image.trim() ? v.image : (VEHICLE_IMAGES[type] || VEHICLE_IMAGES['Default']);
              const h = hours;
              const priceTable = v.price_table || {};
              return (
                <div key={i} className="rounded-xl shadow-lg bg-white p-3 flex flex-col items-center border border-blue-200 hover:border-blue-500 transition min-h-[220px] w-full">
                  <div className="w-16 h-16 mb-2 flex items-center justify-center bg-gray-100 rounded overflow-hidden border">
                    <img src={img} alt={v.name} className="object-cover w-full h-full max-w-[64px] max-h-[64px]" onError={e => { (e.target as HTMLImageElement).src = VEHICLE_IMAGES[type] || VEHICLE_IMAGES['Default']; }} />
                  </div>
                  <div className="font-bold text-base mb-1 text-center">{v.name}</div>
                  <span className={`inline-block px-2 py-1 mb-2 rounded text-xs font-semibold uppercase tracking-wide ${type === 'party_buses' ? 'bg-pink-200 text-pink-800' : type === 'limousines' ? 'bg-purple-200 text-purple-800' : type === 'shuttle_buses' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <div className="text-gray-700 mb-1">Capacity: <span className="font-semibold">{v.capacity}</span></div>
                  <table className="mt-1 text-xs w-full border rounded bg-gray-50">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-1 py-1">Hours</th>
                        <th className="px-1 py-1">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[Math.max(1, h-1), h, h+1].map(hr => (
                        <tr key={hr} className={hr === h ? 'bg-blue-100 font-bold' : ''}>
                          <td className="px-1 py-1 text-center">{hr}</td>
                          <td className="px-1 py-1 text-center">{priceTable[String(hr)] !== undefined && priceTable[String(hr)] !== null ? `$${priceTable[String(hr)]}` : <span className="text-gray-400">N/A</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
          {/* All other vehicles in 3 columns below, each with 3-hour price table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Party Buses */}
            <div>
              <div className="sticky top-0 z-10 bg-white pb-2 mb-2 border-b flex items-center gap-2"><img src={VEHICLE_IMAGES['party_buses']} alt="Party Bus" className="w-6 h-6" /><span className="font-bold text-pink-800">Party Buses</span></div>
              {result.backups.party_buses.length === 0 && <div className="text-gray-400 italic">No party buses found.</div>}
              {result.backups.party_buses.map((v: any, i: number) => {
                const img = v.image && v.image.trim() ? v.image : VEHICLE_IMAGES['party_buses'];
                const h = hours;
                const priceTable = v.price_table || {};
                return (
                  <div key={i} className="rounded-lg border-2 border-pink-200 bg-pink-50 p-3 mb-3 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={img} alt={v.name} className="w-10 h-10 object-cover rounded border" onError={e => { (e.target as HTMLImageElement).src = VEHICLE_IMAGES['party_buses']; }} />
                      <div className="font-semibold text-pink-900">{v.name}</div>
                    </div>
                    <div className="text-xs text-gray-600">Capacity: {v.capacity}</div>
                    <table className="mt-1 text-xs w-full border rounded bg-white">
                      <thead>
                        <tr className="bg-pink-100">
                          <th className="px-1 py-1">Hours</th>
                          <th className="px-1 py-1">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[Math.max(1, h-1), h, h+1].map(hr => (
                          <tr key={hr} className={hr === h ? 'bg-pink-200 font-bold' : ''}>
                            <td className="px-1 py-1 text-center">{hr}</td>
                            <td className="px-1 py-1 text-center">{priceTable[String(hr)] !== undefined && priceTable[String(hr)] !== null ? `$${priceTable[String(hr)]}` : <span className="text-gray-400">N/A</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
            {/* Limousines */}
            <div>
              <div className="sticky top-0 z-10 bg-white pb-2 mb-2 border-b flex items-center gap-2"><img src={VEHICLE_IMAGES['limousines']} alt="Limousine" className="w-6 h-6" /><span className="font-bold text-purple-800">Limousines</span></div>
              {result.backups.limousines.length === 0 && <div className="text-gray-400 italic">No limousines found.</div>}
              {result.backups.limousines.map((v: any, i: number) => {
                const img = v.image && v.image.trim() ? v.image : VEHICLE_IMAGES['limousines'];
                const h = hours;
                const priceTable = v.price_table || {};
                return (
                  <div key={i} className="rounded-lg border-2 border-purple-200 bg-purple-50 p-3 mb-3 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={img} alt={v.name} className="w-10 h-10 object-cover rounded border" onError={e => { (e.target as HTMLImageElement).src = VEHICLE_IMAGES['limousines']; }} />
                      <div className="font-semibold text-purple-900">{v.name}</div>
                    </div>
                    <div className="text-xs text-gray-600">Capacity: {v.capacity}</div>
                    <table className="mt-1 text-xs w-full border rounded bg-white">
                      <thead>
                        <tr className="bg-purple-100">
                          <th className="px-1 py-1">Hours</th>
                          <th className="px-1 py-1">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[Math.max(1, h-1), h, h+1].map(hr => (
                          <tr key={hr} className={hr === h ? 'bg-purple-200 font-bold' : ''}>
                            <td className="px-1 py-1 text-center">{hr}</td>
                            <td className="px-1 py-1 text-center">{priceTable[String(hr)] !== undefined && priceTable[String(hr)] !== null ? `$${priceTable[String(hr)]}` : <span className="text-gray-400">N/A</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
            {/* Shuttle Buses */}
            <div>
              <div className="sticky top-0 z-10 bg-white pb-2 mb-2 border-b flex items-center gap-2"><img src={VEHICLE_IMAGES['shuttle_buses']} alt="Shuttle Bus" className="w-6 h-6" /><span className="font-bold text-green-800">Shuttle Buses</span></div>
              {result.backups.shuttle_buses.length === 0 && <div className="text-gray-400 italic">No shuttle buses found.</div>}
              {result.backups.shuttle_buses.map((v: any, i: number) => {
                const img = v.image && v.image.trim() ? v.image : VEHICLE_IMAGES['shuttle_buses'];
                const h = hours;
                const priceTable = v.price_table || {};
                return (
                  <div key={i} className="rounded-lg border-2 border-green-200 bg-green-50 p-3 mb-3 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={img} alt={v.name} className="w-10 h-10 object-cover rounded border" onError={e => { (e.target as HTMLImageElement).src = VEHICLE_IMAGES['shuttle_buses']; }} />
                      <div className="font-semibold text-green-900">{v.name}</div>
                    </div>
                    <div className="text-xs text-gray-600">Capacity: {v.capacity}</div>
                    <table className="mt-1 text-xs w-full border rounded bg-white">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="px-1 py-1">Hours</th>
                          <th className="px-1 py-1">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[Math.max(1, h-1), h, h+1].map(hr => (
                          <tr key={hr} className={hr === h ? 'bg-green-200 font-bold' : ''}>
                            <td className="px-1 py-1 text-center">{hr}</td>
                            <td className="px-1 py-1 text-center">{priceTable[String(hr)] !== undefined && priceTable[String(hr)] !== null ? `$${priceTable[String(hr)]}` : <span className="text-gray-400">N/A</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
