import { useState } from 'react';
import { HOURS, fmt, slot, freeRun } from '../utils.js';

export default function BookingModal({ room, start: initial, bookings, onClose, onConfirm }) {
  const [start, setStart] = useState(initial);
  const [dur, setDur] = useState(1);
  const [group, setGroup] = useState('');
  const [size, setSize] = useState(2);
  const [purpose, setPurpose] = useState('Group project');

  const freeHours = HOURS.filter((h) => slot(room, h, bookings).state === 'free');
  const maxDur = Math.min(3, freeRun(room, start, bookings));
  const d = Math.min(dur, maxDur);

  const submit = (e) => {
    e.preventDefault();
    onConfirm({ roomId: room.id, start, end: start + d, group: group.trim() || 'My study group', size: Number(size), purpose });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" role="dialog" aria-modal="true" aria-label={`Book ${room.name}`} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Book {room.name}</h2>
        <div className="mu">{room.building} · seats up to {room.capacity}</div>
        <label>Start time
          <select value={start} onChange={(e) => setStart(Number(e.target.value))}>
            {freeHours.map((h) => <option key={h} value={h}>{fmt(h)}</option>)}
          </select>
        </label>
        <label>Duration
          <select value={d} onChange={(e) => setDur(Number(e.target.value))}>
            {Array.from({ length: maxDur }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} hour{n > 1 ? 's' : ''} (until {fmt(start + n)})</option>)}
          </select>
        </label>
        <label>Group name
          <input type="text" value={group} placeholder="e.g. DBMS project team" onChange={(e) => setGroup(e.target.value)} />
        </label>
        <label>Number of people
          <input type="number" min="1" max={room.capacity} value={size} onChange={(e) => setSize(e.target.value)} />
        </label>
        <label>Purpose
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option>Group project</option><option>Study session</option><option>Group discussion</option><option>Presentation practice</option>
          </select>
        </label>
        <div className="row end">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Confirm booking</button>
        </div>
      </form>
    </div>
  );
}
