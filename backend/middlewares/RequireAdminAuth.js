import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware để verify JWT token cho admin
 * Sử dụng cho protected admin routes
 */
const requireAdminAuth = (req, res, next) => {
  // Lấy token từ Authorization header
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7); // Bỏ "Bearer " prefix
  }

  // Nếu không có token
  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Access token required',
      code: 'NO_TOKEN',
    });
  }

  try {
    // Verify token
    console.log('RequireAdminAuth - Verifying admin token');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin
    if (!payload.isAdmin) {
      return res.status(403).json({
        status: false,
        message: 'Access denied - Admin privileges required',
        code: 'NOT_ADMIN',
      });
    }

    console.log('RequireAdminAuth - Token valid for admin:', payload);
    req.admin = payload; // Set admin info
    next();
  } catch (error) {
    // Token invalid hoặc expired
    console.log('Admin token verification failed:', error.name);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: 'Admin access token expired',
        code: 'TOKEN_EXPIRED',
        error: error.name,
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: false,
        message: 'Invalid admin token',
        code: 'INVALID_TOKEN',
        error: error.name,
      });
    }

    return res.status(401).json({
      status: false,
      message: 'Admin token verification failed',
      error: error.name,
    });
  }
};

export default requireAdminAuth;
