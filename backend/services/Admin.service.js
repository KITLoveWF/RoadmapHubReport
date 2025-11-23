import AdminDAO from '../daos/Admin.dao.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

class AdminService {
  async loginAdmin(username, password) {
    const admin = await AdminDAO.getAdminByUsername(username);
    if (!admin) {
      return null;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return null;
    }

    // Return admin without password
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  async getAdminById(id) {
    const admin = await AdminDAO.getAdminById(id);
    if (!admin) {
      return null;
    }
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  async createAdmin(username, password) {
    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );
    return await AdminDAO.createAdmin(username, hashedPassword);
  }

  async updateAdminPassword(id, oldPassword, newPassword) {
    const admin = await AdminDAO.getAdminById(id);
    if (!admin) {
      return { success: false, message: 'Admin not found' };
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return { success: false, message: 'Old password is incorrect' };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );

    const updated = await AdminDAO.updateAdminPassword(id, hashedPassword);
    return {
      success: updated,
      message: updated ? 'Password updated successfully' : 'Failed to update password'
    };
  }

  // User Management
  async getAllAccounts(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const accounts = await AdminDAO.getAllAccounts(limit, offset);
    const total = await AdminDAO.getTotalAccountsCount();
    
    return {
      accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async searchAccounts(searchTerm, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const accounts = await AdminDAO.searchAccounts(searchTerm, limit, offset);
    const total = accounts.length; // For search, we count results
    
    return {
      accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      searchTerm
    };
  }

  async deleteAccount(accountId) {
    return await AdminDAO.deleteAccountById(accountId);
  }

  async updateAccountClassroomLimit(accountId, newLimit) {
    return await AdminDAO.updateAccountClassroomLimit(accountId, newLimit);
  }

  // Roadmap Management
  async getAllRoadmaps(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const roadmaps = await AdminDAO.getAllRoadmaps(limit, offset);
    const total = await AdminDAO.getTotalRoadmapsCount();
    
    return {
      roadmaps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async searchRoadmaps(searchTerm, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const roadmaps = await AdminDAO.searchRoadmaps(searchTerm, limit, offset);
    const total = roadmaps.length; // For search, we count results
    
    return {
      roadmaps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      searchTerm
    };
  }

  async deleteRoadmap(roadmapId) {
    return await AdminDAO.deleteRoadmapById(roadmapId);
  }

  async updateRoadmapVisibility(roadmapId, isPublic) {
    return await AdminDAO.updateRoadmapVisibility(roadmapId, isPublic);
  }

  // Statistics
  async getStatistics() {
    return await AdminDAO.getStatistics();
  }
}

export default new AdminService();
