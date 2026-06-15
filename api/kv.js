const DEFAULT_ROOM_TTL_SECONDS = Number(process.env.ROOM_TTL_SECONDS || 60 * 60 * 24);

function normalizeRoomKey(key) {
  if (typeof key !== 'string') return '';
  const normalized = key.trim().toUpperCase();
  return /^ROOM:[A-Z0-9]{4,12}$/.test(normalized) ? normalized : '';
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

async function redisCommand(command) {
  const { url, token } = getRedisConfig();
  if (!url || !token) {
    const err = new Error('KV_REST_API_URL and KV_REST_API_TOKEN are required.');
    err.statusCode = 503;
    throw err;
  }

  const response = await fetch(`${url.replace(/\/$/, '')}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const message = await response.text();
    const err = new Error(`Redis command failed: ${message || response.statusText}`);
    err.statusCode = 502;
    throw err;
  }

  const payload = await response.json();
  if (payload && payload.error) {
    const err = new Error(payload.error);
    err.statusCode = 502;
    throw err;
  }
  return payload ? payload.result : null;
}

module.exports = {
  DEFAULT_ROOM_TTL_SECONDS,
  json,
  normalizeRoomKey,
  redisCommand,
};
