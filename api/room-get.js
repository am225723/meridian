const { json, normalizeRoomKey, redisCommand } = require('./kv');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const key = normalizeRoomKey(req.query && req.query.key);
  if (!key) return json(res, 400, { error: 'Room key must start with room:' });

  try {
    const value = await redisCommand(['GET', key]);
    return json(res, 200, { value: value == null ? null : value });
  } catch (error) {
    return json(res, error.statusCode || 500, { error: error.message });
  }
};
