import express from 'express';
import AdminController from '../controllers/Admin.controller.js';
import requireAdminAuth from '../middlewares/RequireAdminAuth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', AdminController.login);

// Protected routes (require admin authentication)
router.get('/check-auth', requireAdminAuth, AdminController.checkAuth);
router.post('/change-password', requireAdminAuth, AdminController.changePassword);

// User Management Routes
router.get('/users', requireAdminAuth, AdminController.getAllAccounts);
router.get('/users/search', requireAdminAuth, AdminController.searchAccounts);
router.delete('/users/:accountId', requireAdminAuth, AdminController.deleteAccount);
router.put('/users/:accountId/limit', requireAdminAuth, AdminController.updateAccountLimit);

// Roadmap Management Routes
router.get('/roadmaps', requireAdminAuth, AdminController.getAllRoadmaps);
router.get('/roadmaps/search', requireAdminAuth, AdminController.searchRoadmaps);
router.delete('/roadmaps/:roadmapId', requireAdminAuth, AdminController.deleteRoadmap);
router.put('/roadmaps/:roadmapId/visibility', requireAdminAuth, AdminController.updateRoadmapVisibility);

// Statistics
router.get('/statistics', requireAdminAuth, AdminController.getStatistics);

export default router;
