const DEFAULT_ROOM_TTL_SECONDS = 60 * 60 * 24;

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

function normalizeRoomKey(key) {
  if (typeof key !== 'string') return '';
  const trimmed = key.trim();
  return trimmed.startsWith('room:') ? trimmed : '';
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function getRedisConfig() {
  return {
    url: REST_URL,
    token: REST_TOKEN,
  };
}

function missingRedisConfigError() {
  const missing = [];
  if (!REST_URL) missing.push('UPSTASH_REDIS_REST_URL or KV_REST_API_URL');
  if (!REST_TOKEN) missing.push('UPSTASH_REDIS_REST_TOKEN or KV_REST_API_TOKEN');

  const err = new Error(`Missing Redis configuration: ${missing.join(', ')}.`);
  err.statusCode = 503;
  return err;
}

async function redisCommand(command) {
  const { url, token } = getRedisConfig();
  if (!url || !token) {
    throw missingRedisConfigError();
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
