import TeamRoadmapService from "../services/TeamRoadmap.service.js";

class TeamRoadmapController {
  list = async (req, res) => {
    try {
      const { teamId } = req.params;
      const accountId = req.authenticate.id;
      const roadmaps = await TeamRoadmapService.listRoadmaps(teamId, accountId);
      return res.status(200).json({ status: true, roadmaps });
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { teamId } = req.params;
      const accountId = req.authenticate.id;
      const result = await TeamRoadmapService.createRoadmap(teamId, accountId, req.body || {});
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { teamId, roadmapId } = req.params;
      const accountId = req.authenticate.id;
      const result = await TeamRoadmapService.updateRoadmap(teamId, roadmapId, accountId, req.body || {});
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      const { teamId, roadmapId } = req.params;
      const accountId = req.authenticate.id;
      const result = await TeamRoadmapService.deleteRoadmap(teamId, roadmapId, accountId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  };

  detail = async (req, res) => {
    try {
      const { teamId, roadmapId } = req.params;
      const accountId = req.authenticate.id;
      const roadmap = await TeamRoadmapService.getRoadmapDetail(teamId, roadmapId, accountId);
      if (!roadmap) {
        return res.status(404).json({ status: false, message: "Roadmap không tồn tại" });
      }
      return res.status(200).json({ status: true, roadmap });
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  };

  getNodes = async (req, res) => {
    try {
      const { teamId, roadmapId } = req.params;
      const accountId = req.authenticate.id;
      const graph = await TeamRoadmapService.getRoadmapNodes(teamId, roadmapId, accountId);
      return res.status(200).json({ status: true, roadmap: graph });
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  };

  saveNodes = async (req, res) => {
    try {
      const { teamId, roadmapId } = req.params;
      const accountId = req.authenticate.id;
      const result = await TeamRoadmapService.saveRoadmapNodes(teamId, roadmapId, accountId, req.body || {});
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  };
}

export default new TeamRoadmapController();
