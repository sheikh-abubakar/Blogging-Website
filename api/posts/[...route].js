import app from '../index.js';

export default function handler(req, res) {
  // Forward to Express app
  return app(req, res);
}