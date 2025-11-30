import express from "express";
import RoadmapController from "../controllers/Roadmap.controller.js";
import requireAuth from "../middlewares/RequireAuth.js";
import authenticate from "../middlewares/AuthMiddleware.js";
const router = express.Router();

// Protected routes (cần authentication)
router.post("/create", requireAuth, RoadmapController.createRoadmap);
router.post("/edit/:name", requireAuth, RoadmapController.editRoadmap);
router.post("/delete", requireAuth, RoadmapController.deleteRoadmap);
router.post("/edit-nodes", requireAuth, RoadmapController.editNodeRoadmap);
router.get("/edit/:name", requireAuth, RoadmapController.getRoadmapByName);
router.get(
  "/search/:search/:typeSearch/:index",
  authenticate,
  RoadmapController.searchRoadmap
);
router.post("/mark/:roadmapId", requireAuth, RoadmapController.markRoadmap);
router.get("/mark", requireAuth, RoadmapController.getMarkRoadmaps);
router.get(
  "/getYourRoadmap/:name",
  requireAuth,
  RoadmapController.getRoadmapByAccountIdAndName
);
router.post(
  "/check-your-roadmap",
  requireAuth,
  RoadmapController.checkYourRoadmap
);
router.get("/edit/view/:roadmapId", requireAuth, RoadmapController.viewRoadmap);
router.get(
  "/getRoadmapByUserId",
  requireAuth,
  RoadmapController.getRoadmapByUserId
);
router.get(
  "/getRoadmapByTeamId/:teamName",
  requireAuth,
  RoadmapController.getRoadmapByTeamId
);
router.get(
  "/getTopicRoadmapByUserId",
  requireAuth,
  RoadmapController.getTopicRoadmapByUserId
);

// Public route (không cần authentication)
router.get(
  "/view/:roadmapId",
  requireAuth,
  RoadmapController.viewRoadmapPublic
);

export default router;
