export const OPEN = 8;
export const CLOSE = 20;
export const HOURS = Array.from({ length: CLOSE - OPEN }, (_, i) => OPEN + i);
export const NOISE = ['quiet', 'moderate', 'lively'];
export const NOISE_LABEL = { quiet: '🤫 Quiet focus', moderate: '💬 Light discussion', lively: '🎉 Group work' };

export const fmt = (h) => `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`;

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function clampHour() {
  return Math.min(CLOSE - 1, Math.max(OPEN, new Date().getHours()));
}

// state of one room at one hour: free | class | booked | occupied
export function slot(room, h, bookings) {
  const c = room.classes.find((x) => h >= x.start && h < x.end);
  if (c) return { state: 'class', label: c.course };
  const b = bookings.find((x) => x.roomId === room.id && h >= x.start && h < x.end);
  if (b) return { state: 'booked', label: b.group };
  if (room.busy.includes(h)) return { state: 'occupied', label: 'Occupied (sensor)' };
  return { state: 'free', label: 'Free' };
}

// number of consecutive free hours starting at hour h
export function freeRun(room, h, bookings) {
  let n = 0;
  while (h + n < CLOSE && slot(room, h + n, bookings).state === 'free') n++;
  return n;
}

// Scores rooms that are free for the whole requested period (0-100)
export function recommend(rooms, bookings, { size, noise, needs, start, dur }) {
  return rooms
    .filter((r) => r.capacity >= size && freeRun(r, start, bookings) >= dur)
    .map((r) => {
      const why = [];
      const fit = Math.max(0, 1 - (r.capacity - size) / r.capacity);
      let score = Math.round(fit * 35);
      why.push(r.capacity === size ? 'Perfect size for your group' : `Seats ${r.capacity} for your group of ${size}`);

      const gap = Math.abs(NOISE.indexOf(r.noise) - NOISE.indexOf(noise));
      score += [30, 12, 0][gap];
      why.push(gap === 0 ? 'Matches your noise preference' : 'Noise level differs from your preference');

      const missing = needs.filter((n) => !r.facilities.includes(n));
      score += needs.length ? Math.round(((needs.length - missing.length) / needs.length) * 35) : 35;
      if (needs.length) why.push(missing.length ? `Missing: ${missing.join(', ')}` : 'Has all the facilities you need');

      return { room: r, score: Math.min(100, score), why };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
