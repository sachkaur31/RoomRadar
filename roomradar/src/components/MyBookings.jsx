import { ROOMS } from '../data.js';
import { fmt } from '../utils.js';

export default function MyBookings({ bookings, hour, onCancel, onRemind, goFind }) {
  const list = [...bookings].sort((a, b) => a.start - b.start);
  return (
    <section>
      <h2>My bookings today</h2>
      <p className="mu">You’ll get a reminder 15 minutes before a booking ends.</p>
      {list.length === 0 && (
        <div className="empty">No bookings yet.<br /><br /><button className="btn" onClick={goFind}>Find a room</button></div>
      )}
      {list.map((b) => {
        const room = ROOMS.find((r) => r.id === b.roomId);
        const status = hour < b.start ? 'Upcoming' : hour < b.end ? 'In progress' : 'Finished';
        return (
          <article className="card" key={b.id}>
            <div className="top">
              <div>
                <h3>{room.name}</h3>
                <div className="mu">{room.building} · {fmt(b.start)} – {fmt(b.end)}</div>
              </div>
              <span className={'st ' + (status === 'In progress' ? 'free' : status === 'Upcoming' ? 'booked' : 'class')}>{status}</span>
            </div>
            <div className="mu">👥 {b.group} · {b.size} people · {b.purpose}</div>
            <div className="row">
              <button className="btn ghost sm" onClick={() => onRemind(b, room)}>⏰ Demo: show reminder</button>
              <button className="btn danger sm" onClick={() => onCancel(b.id)}>Cancel booking</button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
