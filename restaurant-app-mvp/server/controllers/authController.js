const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const safeUser = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });
exports.register = async (req, res, next) => { try {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (password.length < 8 || !/\d/.test(password)) return res.status(400).json({ message: 'Password must be at least 8 characters and contain a digit.' });
  if (role && role !== 'customer') return res.status(403).json({ message: 'Public registration is available for customers only.' });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered.' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'customer' });
  const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(201).json({ token, user: safeUser(user) });
} catch (e) { next(e); } };
exports.login = async (req, res, next) => { try {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: safeUser(user) });
} catch (e) { next(e); } };
