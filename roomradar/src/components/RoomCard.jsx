import { slot, freeRun, NOISE_LABEL } from '../utils.js';

export default function RoomCard({ room, hour, bookings, onBook, rec }) {
  const s = slot(room, hour, bookings);
  const run = freeRun(room, hour, bookings);
  const free = s.state === 'free';
  const text = free ? `Free for ${run} h` : s.state === 'class' ? `In class · ${s.label}` : s.state === 'booked' ? `Booked · ${s.label}` : 'Occupied';

  return (
    <article className={'card' + (rec ? ' rec' : '')}>
      {rec && <div className="match">⭐ {rec.score}% match</div>}
      <div className="top">
        <div>
          <h3>{room.name}</h3>
          <div className="mu">{room.building} · {room.type}</div>
        </div>
        <span className={'st ' + s.state}>{text}</span>
      </div>
      <div className="row">
        <span className="pill">👥 Up to {room.capacity}</span>
        <span className="pill">{NOISE_LABEL[room.noise]}</span>
      </div>
      <div className="mu">✅ {room.access}</div>
      <div className="row">
        {room.facilities.map((f) => <span className="tag" key={f}>{f}</span>)}
      </div>
      {rec && (
        <ul className="why">
          {rec.why.map((w) => <li key={w}>{w}</li>)}
        </ul>
      )}
      <button className="btn" disabled={!free} onClick={() => onBook(room, hour)}>
        {free ? 'Book this room' : 'Not available now'}
      </button>
    </article>
  );
}
