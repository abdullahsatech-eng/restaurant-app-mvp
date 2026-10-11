function notFound(req, res) { res.status(404).json({ message: 'Route not found' }); }
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(400).json({ message: err.message });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with that unique value already exists.' });
  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Internal server error.' });
}
module.exports = { notFound, errorHandler };
