const jwt = require('jsonwebtoken');
const User = require('../models/User');
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication token required.' });
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email role');
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
    req.user = user; next();
  } catch (error) { return res.status(401).json({ message: 'Invalid or expired token.' }); }
}
function managerOnly(req, res, next) { if (req.user?.role !== 'manager') return res.status(403).json({ message: 'Manager access required.' }); next(); }
module.exports = { protect, managerOnly };
