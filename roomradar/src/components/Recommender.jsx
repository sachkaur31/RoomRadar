import { useState } from 'react';
import Chips from './Chips.jsx';
import RoomCard from './RoomCard.jsx';
import { FACILITIES } from '../data.js';
import { HOURS, NOISE, NOISE_LABEL, fmt, recommend } from '../utils.js';

export default function Recommender({ rooms, bookings, hour, onBook }) {
  const [size, setSize] = useState(4);
  const [noise, setNoise] = useState('quiet');
  const [needs, setNeeds] = useState([]);
  const [start, setStart] = useState(hour);
  const [dur, setDur] = useState(2);
  const [results, setResults] = useState(null);

  const run = (e) => {
    e.preventDefault();
    setResults(recommend(rooms, bookings, { size: Number(size) || 1, noise, needs, start: Number(start), dur: Number(dur) }));
  };

  return (
    <section className="panel">
      <h2>✨ Find my best room</h2>
      <p className="mu">Tell us about your group and we’ll suggest the best available space.</p>
      <form onSubmit={run}>
        <div className="grid">
          <label>Group size
            <input type="number" min="1" max="60" value={size} onChange={(e) => setSize(e.target.value)} />
          </label>
          <label>Noise preference
            <select value={noise} onChange={(e) => setNoise(e.target.value)}>
              {NOISE.map((n) => <option key={n} value={n}>{NOISE_LABEL[n]}</option>)}
            </select>
          </label>
          <label>Start time
            <select value={start} onChange={(e) => setStart(e.target.value)}>
              {HOURS.map((h) => <option key={h} value={h}>{fmt(h)}</option>)}
            </select>
          </label>
          <label>Duration
            <select value={dur} onChange={(e) => setDur(e.target.value)}>
              {[1, 2, 3].map((d) => <option key={d} value={d}>{d} hour{d > 1 ? 's' : ''}</option>)}
            </select>
          </label>
        </div>
        <div className="lbl">Facilities needed</div>
        <Chips options={FACILITIES} value={needs} onChange={setNeeds} />
        <button className="btn" type="submit">Recommend a room</button>
      </form>

      {results && (
        <div className="results">
          {results.length === 0 && <div className="empty">No room is free for that group size and time. Try a shorter duration or another start time.</div>}
          {results.map((r, i) => (
            <RoomCard key={r.room.id} room={r.room} hour={Number(start)} bookings={bookings} onBook={onBook}
              rec={{ score: r.score, why: i === 0 ? ['🏆 Best match', ...r.why] : r.why }} />
          ))}
        </div>
      )}
    </section>
  );
}
