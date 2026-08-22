// Keep-alive util
//
// The interval logic was submitted by using hack-render (marufk21/hack-render).
// It periodically pings a list of URLs so that free-tier hosting (Render) does
// not put the services to sleep after inactivity.
//
// Configuration (env):
//   KEEP_ALIVE_INTERVAL_SECONDS  - how often to ping, in seconds (default: 880 => ~15 min)
//   KEEP_ALIVE_URLS              - comma-separated list of URLs to keep alive
//                                  (default: falls back to the list below)
//
// NOTE: A keep-alive running *inside* a sleeping free-tier service cannot wake
// itself up. To reliably keep Vibesta warm you still want an always-on external
// pinger (e.g. your separate `hack-render` service / an UptimeRobot monitor).

const DEFAULT_URLS = [
  'https://vibesta.onrender.com/login',
  'https://streamtalk.onrender.com/',
];

const toUrlList = (raw) =>
  (raw || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

const pingAll = (targets) => {
  targets.forEach((url) => {
    fetch(url, { method: 'GET' })
      .then((res) => {
        console.log(`[keep-alive] ${res.ok ? 'OK' : 'HTTP ' + res.status} ${url}`);
      })
      .catch((error) => {
        console.error(`[keep-alive] error ${url}: ${error.message}`);
      });
  });
};

export const startKeepAlive = () => {
  const intervalSeconds = Number(process.env.KEEP_ALIVE_INTERVAL_SECONDS) || 880;
  const urls = toUrlList(process.env.KEEP_ALIVE_URLS);
  const targets = urls.length > 0 ? urls : DEFAULT_URLS;
  const intervalMs = intervalSeconds * 1000;

  // Immediate first ping, then repeat on a timer.
  pingAll(targets);
  setInterval(() => pingAll(targets), intervalMs);

  console.log(
    `[keep-alive] started: every ${intervalSeconds}s -> ${targets.join(', ')}`
  );
};