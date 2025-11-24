import TeamController from "../controllers/Team.controller.js";
import TeamRoadmapController from "../controllers/TeamRoadmap.controller.js";
import express from "express";
import requireAuth from "../middlewares/RequireAuth.js";
const router = express.Router();

// Require authentication for team operations
router.get("/get-teams", requireAuth, TeamController.getTeamByUserId);
router.get("/my-teams", requireAuth, TeamController.getTeamsByAccountId);
router.post("/create", requireAuth, TeamController.createTeam);
router.delete("/:teamId", requireAuth, TeamController.deleteTeam);
router.get("/:teamId/members", requireAuth, TeamController.getTeamMembers);
router.post("/:teamId/members", requireAuth, TeamController.addMember);
router.post("/:teamId/invite", requireAuth, TeamController.inviteMember);
router.delete("/:teamId/members/:memberId", requireAuth, TeamController.removeMember);
router.put("/:teamId/members/:memberId/role", requireAuth, TeamController.updateMemberRole);
router.get("/:teamId/friends-not-in-team", requireAuth, TeamController.getFriendsNotInTeam);
router.get("/:teamId/search-accounts", requireAuth, TeamController.searchAccounts);

// Team roadmap routes
router.get("/:teamId/roadmaps", requireAuth, TeamRoadmapController.list);
router.post("/:teamId/roadmaps", requireAuth, TeamRoadmapController.create);
router.get("/:teamId/roadmaps/:roadmapId", requireAuth, TeamRoadmapController.detail);
router.put("/:teamId/roadmaps/:roadmapId", requireAuth, TeamRoadmapController.update);
router.delete("/:teamId/roadmaps/:roadmapId", requireAuth, TeamRoadmapController.remove);
router.get("/:teamId/roadmaps/:roadmapId/nodes", requireAuth, TeamRoadmapController.getNodes);
router.post("/:teamId/roadmaps/:roadmapId/nodes", requireAuth, TeamRoadmapController.saveNodes);

// Invitation routes
router.get("/invitations/pending", requireAuth, TeamController.getPendingInvitations);
router.post("/invitations/:invitationId/accept", requireAuth, TeamController.acceptInvitation);
router.post("/invitations/:invitationId/reject", requireAuth, TeamController.rejectInvitation);

export default router;
