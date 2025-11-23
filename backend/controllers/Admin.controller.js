import AdminService from '../services/Admin.service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AdminController {
  // Admin Login
  login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: 'Username and password are required'
      });
    }

    try {
      const admin = await AdminService.loginAdmin(username, password);

      if (!admin) {
        return res.status(401).json({
          status: false,
          message: 'Invalid username or password'
        });
      }

      // Create JWT token with admin flag
      const payload = {
        id: admin.id,
        username: admin.username,
        isAdmin: true
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '8h' // Admin sessions last longer
      });

      return res.status(200).json({
        status: true,
        message: 'Admin login successful',
        admin: {
          id: admin.id,
          username: admin.username
        },
        token
      });
    } catch (error) {
      console.error('Admin login error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Check if admin is authenticated
  checkAuth = async (req, res) => {
    try {
      const admin = await AdminService.getAdminById(req.admin.id);
      
      if (!admin) {
        return res.status(404).json({
          status: false,
          message: 'Admin not found'
        });
      }

      return res.status(200).json({
        status: true,
        admin: {
          id: admin.id,
          username: admin.username
        }
      });
    } catch (error) {
      console.error('Admin check auth error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Change admin password
  changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: false,
        message: 'Old password and new password are required'
      });
    }

    try {
      const result = await AdminService.updateAdminPassword(
        req.admin.id,
        oldPassword,
        newPassword
      );

      if (!result.success) {
        return res.status(400).json({
          status: false,
          message: result.message
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Admin change password error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // USER MANAGEMENT ENDPOINTS

  // Get all accounts with pagination
  getAllAccounts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await AdminService.getAllAccounts(page, limit);

      return res.status(200).json({
        status: true,
        ...result
      });
    } catch (error) {
      console.error('Get all accounts error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Search accounts
  searchAccounts = async (req, res) => {
    try {
      const searchTerm = req.query.q || '';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      if (!searchTerm) {
        return res.status(400).json({
          status: false,
          message: 'Search term is required'
        });
      }

      const result = await AdminService.searchAccounts(searchTerm, page, limit);

      return res.status(200).json({
        status: true,
        ...result
      });
    } catch (error) {
      console.error('Search accounts error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Delete account
  deleteAccount = async (req, res) => {
    try {
      const { accountId } = req.params;

      if (!accountId) {
        return res.status(400).json({
          status: false,
          message: 'Account ID is required'
        });
      }

      const deleted = await AdminService.deleteAccount(accountId);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: 'Account not found or already deleted'
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Update account classroom limit
  updateAccountLimit = async (req, res) => {
    try {
      const { accountId } = req.params;
      const { classroomLimit } = req.body;

      if (!accountId || classroomLimit === undefined) {
        return res.status(400).json({
          status: false,
          message: 'Account ID and classroom limit are required'
        });
      }

      const updated = await AdminService.updateAccountClassroomLimit(
        accountId,
        classroomLimit
      );

      if (!updated) {
        return res.status(404).json({
          status: false,
          message: 'Account not found'
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Classroom limit updated successfully'
      });
    } catch (error) {
      console.error('Update account limit error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // ROADMAP MANAGEMENT ENDPOINTS

  // Get all roadmaps with pagination
  getAllRoadmaps = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await AdminService.getAllRoadmaps(page, limit);

      return res.status(200).json({
        status: true,
        ...result
      });
    } catch (error) {
      console.error('Get all roadmaps error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Search roadmaps
  searchRoadmaps = async (req, res) => {
    try {
      const searchTerm = req.query.q || '';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      if (!searchTerm) {
        return res.status(400).json({
          status: false,
          message: 'Search term is required'
        });
      }

      const result = await AdminService.searchRoadmaps(searchTerm, page, limit);

      return res.status(200).json({
        status: true,
        ...result
      });
    } catch (error) {
      console.error('Search roadmaps error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Delete roadmap
  deleteRoadmap = async (req, res) => {
    try {
      const { roadmapId } = req.params;

      if (!roadmapId) {
        return res.status(400).json({
          status: false,
          message: 'Roadmap ID is required'
        });
      }

      const deleted = await AdminService.deleteRoadmap(roadmapId);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: 'Roadmap not found or already deleted'
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Roadmap deleted successfully'
      });
    } catch (error) {
      console.error('Delete roadmap error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // Update roadmap visibility
  updateRoadmapVisibility = async (req, res) => {
    try {
      const { roadmapId } = req.params;
      const { isPublic } = req.body;

      if (!roadmapId || isPublic === undefined) {
        return res.status(400).json({
          status: false,
          message: 'Roadmap ID and visibility status are required'
        });
      }

      const updated = await AdminService.updateRoadmapVisibility(
        roadmapId,
        isPublic
      );

      if (!updated) {
        return res.status(404).json({
          status: false,
          message: 'Roadmap not found'
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Roadmap visibility updated successfully'
      });
    } catch (error) {
      console.error('Update roadmap visibility error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };

  // STATISTICS

  // Get dashboard statistics
  getStatistics = async (req, res) => {
    try {
      const stats = await AdminService.getStatistics();

      return res.status(200).json({
        status: true,
        statistics: stats
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  };
}

export default new AdminController();
