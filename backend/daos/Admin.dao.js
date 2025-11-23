import db from '../utils/db.js';
import RoadmapSchemaModel from "../models/RoadmapSchema.model.js";
import QuizSchemaModel from "../models/QuizSchema.model.js";
import QuizResultSchemaModel from "../models/QuizResultSchema.model.js";
import { v4 as uuidv4 } from 'uuid';

class AdminDAO {
  async getAdminByUsername(username) {
    const result = await db('Admin')
      .where({ username })
      .first();
    return result;
  }

  async getAdminById(id) {
    const result = await db('Admin')
      .where({ id })
      .first();
    return result;
  }

  async createAdmin(username, password) {
    const id = uuidv4();
    await db('Admin').insert({
      id,
      username,
      password
    });
    return { id, username };
  }

  async updateAdminPassword(id, password) {
    const result = await db('Admin')
      .where({ id })
      .update({ password });
    return result > 0;
  }

  // User Management Methods
  async getAllAccounts(limit = 100, offset = 0) {
    return await db('Account as a')
      .leftJoin('Profile as p', 'a.id', 'p.accountId')
      .select(
        'a.id', 'a.username', 'a.email', 'a.googleId', 'a.picture', 'a.classroomLimit',
        'p.fullname', 'p.github', 'p.linkedin', 'p.avatar'
      )
      .orderBy('a.username')
      .limit(limit)
      .offset(offset);
  }

  async getTotalAccountsCount() {
    const result = await db('Account')
      .count('* as total')
      .first();
    return result.total;
  }

  async searchAccounts(searchTerm, limit = 100, offset = 0) {
    const searchPattern = `%${searchTerm}%`;
    return await db('Account as a')
      .leftJoin('Profile as p', 'a.id', 'p.accountId')
      .select(
        'a.id', 'a.username', 'a.email', 'a.googleId', 'a.picture', 'a.classroomLimit',
        'p.fullname', 'p.github', 'p.linkedin', 'p.avatar'
      )
      .where('a.username', 'like', searchPattern)
      .orWhere('a.email', 'like', searchPattern)
      .orWhere('p.fullname', 'like', searchPattern)
      .orderBy('a.username')
      .limit(limit)
      .offset(offset);
  }

  async deleteAccountById(accountId) {
    // Delete related data first (due to foreign keys)
    await db('Profile').where({ accountId }).del();
    await db('RefreshToken').where({ accountId }).del();
    await db('Friend').where('senderId', accountId).orWhere('receiverId', accountId).del();
    await db('Notification').where('senderId', accountId).orWhere('receiverId', accountId).del();
    await db('LearnRoadmap').where({ accountId }).del();
    await db('LearnTopic').where({ accountId }).del();
    await db('MarkRoadmap').where({ accountId }).del();
    await db('Post').where({ accountId }).del();
    await db('Comment').where({ accountId }).del();
    await db('TeamMember').where({ accountId }).del();
    await db('StudentClassroom').where({ studentId: accountId }).del();
    await db('Classroom').where({ teacherId: accountId }).del();
    await db('Roadmap').where({ accountId }).del();
    // Delete related schemas and results
    await RoadmapSchemaModel.deleteMany({ accountId });
    await QuizSchemaModel.deleteMany({ accountId });
    await QuizResultSchemaModel.deleteMany({ accountId });
    
    // Finally delete account
    const result = await db('Account').where({ id: accountId }).del();
    return result > 0;
  }

  async updateAccountClassroomLimit(accountId, newLimit) {
    const result = await db('Account')
      .where({ id: accountId })
      .update({ classroomLimit: newLimit });
    return result > 0;
  }

  // Roadmap Management Methods
  async getAllRoadmaps(limit = 100, offset = 0) {
    return await db('Roadmap as r')
      .leftJoin('Account as a', 'r.accountId', 'a.id')
      .leftJoin('Team as t', 'r.teamId', 't.id')
      .select(
        'r.*',
        'a.username as ownerUsername',
        'a.email as ownerEmail',
        't.name as teamName'
      )
      .orderBy('r.learning', 'desc')
      .orderBy('r.teaching', 'desc')
      .limit(limit)
      .offset(offset);
  }

  async getTotalRoadmapsCount() {
    const result = await db('Roadmap')
      .count('* as total')
      .first();
    return result.total;
  }

  async searchRoadmaps(searchTerm, limit = 100, offset = 0) {
    const searchPattern = `%${searchTerm}%`;
    return await db('Roadmap as r')
      .leftJoin('Account as a', 'r.accountId', 'a.id')
      .leftJoin('Team as t', 'r.teamId', 't.id')
      .select(
        'r.*',
        'a.username as ownerUsername',
        'a.email as ownerEmail',
        't.name as teamName'
      )
      .where(function() {
        this.where('r.name', 'like', searchPattern)
          .orWhere('r.description', 'like', searchPattern)
          .orWhere('a.username', 'like', searchPattern);
      })
      .orderBy('r.learning', 'desc')
      .orderBy('r.teaching', 'desc')
      .limit(limit)
      .offset(offset);
  }

  async deleteRoadmapById(roadmapId) {
    // Delete related data first
    await db('LearnRoadmap').where({ roadmapId }).del();
    await db('MarkRoadmap').where({ roadmapId }).del();
    await db('RoadmapFeedback').where({ roadmapId }).del();
    await db('Classroom').where({ roadmapId }).update({ roadmapId: null });
    // Also consider deleting related RoadmapSchema, QuizSchema, QuizResult if needed
    await RoadmapSchemaModel.deleteMany({ roadmapId });
    await QuizSchemaModel.deleteMany({ roadmapId });
    await QuizResultSchemaModel.deleteMany({ roadmapId });
    
    // Delete roadmap
    const result = await db('Roadmap').where({ id: roadmapId }).del();
    return result > 0;
  }

  async updateRoadmapVisibility(roadmapId, isPublic) {
    const result = await db('Roadmap')
      .where({ id: roadmapId })
      .update({ isPublic });
    return result > 0;
  }

  // Statistics
  async getStatistics() {
    const stats = {};
    
    // Total users
    const userCount = await db('Account').count('* as count').first();
    stats.totalUsers = userCount.count;
    
    // Total roadmaps
    const roadmapCount = await db('Roadmap').count('* as count').first();
    stats.totalRoadmaps = roadmapCount.count;
    
    // Public roadmaps
    const publicRoadmapCount = await db('Roadmap')
      .where({ isPublic: 1 })
      .count('* as count')
      .first();
    stats.publicRoadmaps = publicRoadmapCount.count;
    
    // Total classrooms
    const classroomCount = await db('Classroom').count('* as count').first();
    stats.totalClassrooms = classroomCount.count;
    
    // Total teams
    const teamCount = await db('Team').count('* as count').first();
    stats.totalTeams = teamCount.count;
    
    return stats;
  }
}

export default new AdminDAO();
