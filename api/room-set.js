const { DEFAULT_ROOM_TTL_SECONDS, json, normalizeRoomKey, redisCommand } = require('./kv');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const key = normalizeRoomKey(req.body && req.body.key);
  const value = req.body && req.body.value;
  if (!key || typeof value !== 'string') return json(res, 400, { error: 'Invalid room payload' });

  try {
    await redisCommand(['SET', key, value, 'EX', String(DEFAULT_ROOM_TTL_SECONDS)]);
    return json(res, 200, { ok: true, ttlSeconds: DEFAULT_ROOM_TTL_SECONDS });
  } catch (error) {
    return json(res, error.statusCode || 500, { error: error.message });
  }
};
