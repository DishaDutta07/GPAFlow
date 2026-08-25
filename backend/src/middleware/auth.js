const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gpaflow_super_secret_jwt_key_2026';

function verifyToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in.'
    });
  }
  req.user = user;
  next();
}

function optionalAuth(req, res, next) {
  req.user = verifyToken(req);
  next();
}

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

module.exports = {
  requireAuth,
  optionalAuth,
  generateToken,
  JWT_SECRET
};
