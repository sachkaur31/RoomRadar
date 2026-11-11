import { useEffect, useMemo, useRef, useState } from 'react';
import { ROOMS, FACILITIES } from './data.js';
import { HOURS, fmt, todayStr, clampHour, slot } from './utils.js';
import RoomCard from './components/RoomCard.jsx';
import Recommender from './components/Recommender.jsx';
import Timetable from './components/Timetable.jsx';
import BookingModal from './components/BookingModal.jsx';
import MyBookings from './components/MyBookings.jsx';
import Chips from './components/Chips.jsx';

const KEY = 'roomradar.bookings';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]').filter((b) => b.date === todayStr());
  } catch {
    return [];
  }
}

export default function App() {
  const [tab, setTab] = useState('find');
  const [hour, setHour] = useState(clampHour());
  const [bookings, setBookings] = useState(load);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [f, setF] = useState({ q: '', cap: 1, needs: [], free: false });
  const ref = useRef(bookings);

  const notify = (msg) => {
    setToast(msg);
    try {
      if ('Notification' in window && Notification.permission === 'granted') new Notification('RoomRadar', { body: msg });
    } catch { /* notifications unavailable */ }
  };

  useEffect(() => {
    ref.current = bookings;
    try { localStorage.setItem(KEY, JSON.stringify(bookings)); } catch { /* storage unavailable */ }
  }, [bookings]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  // Real-clock reminder: 15 minutes before a booking ends
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const due = ref.current.filter((b) => {
        if (b.reminded || b.date !== todayStr()) return false;
        const end = new Date();
        end.setHours(b.end, 0, 0, 0);
        const left = (end - now) / 60000;
        return left > 0 && left <= 15;
      });
      if (!due.length) return;
      due.forEach((b) => notify(`⏰ Your booking in ${ROOMS.find((r) => r.id === b.roomId).name} ends in 15 minutes.`));
      setBookings((bs) => bs.map((b) => (due.some((d) => d.id === b.id) ? { ...b, reminded: true } : b)));
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const openBooking = (room, start) => setModal({ room, start });

  const confirm = (b) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission();
    setBookings((bs) => [...bs, { ...b, id: Date.now(), date: todayStr(), reminded: false }]);
    setModal(null);
    setTab('bookings');
    notify(`✅ Booked ${ROOMS.find((r) => r.id === b.roomId).name}, ${fmt(b.start)} – ${fmt(b.end)}.`);
  };

  const cancel = (id) => {
    setBookings((bs) => bs.filter((b) => b.id !== id));
    notify('Booking cancelled.');
  };

  const list = useMemo(
    () => ROOMS.filter((r) =>
      r.capacity >= f.cap &&
      (r.name + r.building + r.type).toLowerCase().includes(f.q.toLowerCase()) &&
      f.needs.every((n) => r.facilities.includes(n)) &&
      (!f.free || slot(r, hour, bookings).state === 'free')),
    [f, hour, bookings]
  );
  const freeNow = ROOMS.filter((r) => slot(r, hour, bookings).state === 'free').length;

  const tabs = [['find', '🔍 Find a room'], ['timetable', '🗓️ Timetable'], ['bookings', `📌 My bookings${bookings.length ? ` (${bookings.length})` : ''}`]];

  return (
    <div className="wrap">
      <header>
        <div className="logo">Room<span>Radar</span></div>
        <div className="clock">
          <label htmlFor="hr">Viewing at</label>
          <select id="hr" value={hour} onChange={(e) => setHour(Number(e.target.value))}>
            {HOURS.map((h) => <option key={h} value={h}>{fmt(h)}</option>)}
          </select>
          <button className="btn ghost sm" onClick={() => setHour(clampHour())}>Now</button>
        </div>
      </header>

      <div className="hero">
        <b>{freeNow} of {ROOMS.length} rooms are free at {fmt(hour)}</b>
        <span>Only authorised campus spaces are listed.</span>
      </div>

      <nav>
        {tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </nav>

      {tab === 'find' && (
        <>
          <Recommender rooms={ROOMS} bookings={bookings} hour={hour} onBook={openBooking} />
          <section className="panel">
            <h2>Browse all rooms</h2>
            <div className="grid">
              <label>Search
                <input type="text" placeholder="Room, building or type…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
              </label>
              <label>Minimum capacity
                <select value={f.cap} onChange={(e) => setF({ ...f, cap: Number(e.target.value) })}>
                  {[1, 4, 6, 10, 20, 30].map((n) => <option key={n} value={n}>{n}+ people</option>)}
                </select>
              </label>
            </div>
            <div className="lbl">Facilities</div>
            <Chips options={FACILITIES} value={f.needs} onChange={(needs) => setF({ ...f, needs })} />
            <label className="check"><input type="checkbox" checked={f.free} onChange={(e) => setF({ ...f, free: e.target.checked })} /> Show only rooms free at {fmt(hour)}</label>
          </section>
          <div className="list">
            {list.map((r) => <RoomCard key={r.id} room={r} hour={hour} bookings={bookings} onBook={openBooking} />)}
            {list.length === 0 && <div className="empty">No rooms match these filters.</div>}
          </div>
        </>
      )}

      {tab === 'timetable' && <Timetable rooms={ROOMS} bookings={bookings} hour={hour} onBook={openBooking} />}

      {tab === 'bookings' && (
        <MyBookings bookings={bookings} hour={hour} onCancel={cancel} goFind={() => setTab('find')}
          onRemind={(b, room) => notify(`⏰ Your booking in ${room.name} ends in 15 minutes.`)} />
      )}

      <footer>Demo MVP: availability is simulated and bookings are stored in your browser only.</footer>

      {modal && <BookingModal room={modal.room} start={modal.start} bookings={bookings} onClose={() => setModal(null)} onConfirm={confirm} />}
      <div id="toast" className={toast ? 'on' : ''} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
