import { slot, HOURS, fmt } from '../utils.js';

export default function Timetable({ rooms, bookings, hour, onBook }) {
  return (
    <section>
      <h2>Today’s timetable</h2>
      <p className="mu">Green slots are free – tap one to book. Classes come from the timetable; “occupied” is a simulated sensor reading.</p>
      <div className="legend">
        <span className="st free">Free</span><span className="st class">Class</span>
        <span className="st booked">Booked</span><span className="st occupied">Occupied</span>
      </div>
      <div className="scroll">
        <table className="tt">
          <thead>
            <tr>
              <th>Room</th>
              {HOURS.map((h) => <th key={h} className={h === hour ? 'now' : ''}>{fmt(h).replace(':00 ', '')}</th>)}
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id}>
                <th scope="row">{r.name}<small>{r.building}</small></th>
                {HOURS.map((h) => {
                  const s = slot(r, h, bookings);
                  return (
                    <td key={h}>
                      {s.state === 'free'
                        ? <button className="cell free" aria-label={`Book ${r.name} at ${fmt(h)}`} onClick={() => onBook(r, h)}>✓</button>
                        : <span className={'cell ' + s.state} title={s.label}>{s.state === 'class' ? 'C' : s.state === 'booked' ? 'B' : '•'}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
