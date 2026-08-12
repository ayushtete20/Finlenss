/**
 * rateLimiter.js
 * 
 * Lightweight in-memory sliding-window IP rate limiter middleware.
 * Protects sensitive endpoints (login brute-force, consultation spam, feedback flooding).
 */

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes default
  max = 100,                  // Max requests per window
  message = 'Too many requests from this IP address, please try again later.'
} = {}) => {
  const ipHits = new Map();

  // Periodic cleanup every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipHits.entries()) {
      if (now - data.startTime > windowMs) {
        ipHits.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!ipHits.has(ip)) {
      ipHits.set(ip, {
        count: 1,
        startTime: now
      });
      return next();
    }

    const data = ipHits.get(ip);

    // Reset window if expired
    if (now - data.startTime > windowMs) {
      data.count = 1;
      data.startTime = now;
      return next();
    }

    // Increment count
    data.count += 1;

    if (data.count > max) {
      const retryAfterSeconds = Math.ceil((data.startTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds
      });
    }

    next();
  };
};

export default createRateLimiter;
