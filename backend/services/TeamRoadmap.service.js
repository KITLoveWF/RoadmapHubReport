import RoadmapDAO from "../daos/Roadmap.dao.js";
import TeamMemberDAO from "../daos/TeamMember.dao.js";

class TeamRoadmapService {
  async assertMembership(teamId, accountId) {
    const role = await TeamMemberDAO.getMemberRole(teamId, accountId);
    if (!role) {
      throw new Error("Bạn không thuộc nhóm này");
    }
    return role;
  }

  async assertRole(teamId, accountId, allowedRoles) {
    const role = await this.assertMembership(teamId, accountId);
    if (!allowedRoles.includes(role)) {
      throw new Error("Bạn không có quyền thực hiện thao tác này");
    }
    return role;
  }

  async listRoadmaps(teamId, accountId) {
    await this.assertMembership(teamId, accountId);
    const roadmaps = await RoadmapDAO.getTeamRoadmaps(teamId);
    return roadmaps;
  }

  async createRoadmap(teamId, accountId, payload) {
  await this.assertRole(teamId, accountId, ["leader"]);

    const { name, description = "", isPublic = false } = payload;
    if (!name || !name.trim()) {
      return { success: false, message: "Tên roadmap không được để trống" };
    }

    const check = await RoadmapDAO.checkTeamRoadmap(name.trim(), teamId, "create");
    if (!check.success) {
      return check;
    }

    const response = await RoadmapDAO.createRoadmap(
      name.trim(),
      description,
      accountId,
      isPublic,
      teamId
    );

    return response;
  }

  async updateRoadmap(teamId, roadmapId, accountId, payload) {
    await this.assertRole(teamId, accountId, ["leader", "edit"]);

    if (payload.name) {
      const check = await RoadmapDAO.checkTeamRoadmap(payload.name, teamId, "edit");
      if (!check.success) {
        return check;
      }
    }

    return await RoadmapDAO.updateTeamRoadmap(roadmapId, teamId, payload);
  }

  async deleteRoadmap(teamId, roadmapId, accountId) {
    await this.assertRole(teamId, accountId, ["leader"]);
    return await RoadmapDAO.deleteRoadmap(roadmapId, null, teamId);
  }

  async getRoadmapDetail(teamId, roadmapId, accountId) {
    await this.assertMembership(teamId, accountId);
    const roadmap = await RoadmapDAO.getRoadmapById(roadmapId);
    if (!roadmap || roadmap.teamId !== teamId) {
      return null;
    }
    return roadmap;
  }

  async getRoadmapNodes(teamId, roadmapId, accountId) {
    await this.assertMembership(teamId, accountId);
    return await RoadmapDAO.viewRoadmap(roadmapId);
  }

  async saveRoadmapNodes(teamId, roadmapId, accountId, body) {
    await this.assertRole(teamId, accountId, ["leader", "edit"]);
    const roadmap = await RoadmapDAO.getRoadmapById(roadmapId);
    if (!roadmap || roadmap.teamId !== teamId) {
      return { success: false, message: "Roadmap không tồn tại" };
    }
    const nodes = Array.isArray(body.nodes) ? body.nodes : [];
    const edges = Array.isArray(body.edges) ? body.edges : [];
    await RoadmapDAO.upsertTeamRoadmapNodes(teamId, roadmapId, roadmap.name, nodes, edges);
    return { success: true };
  }
}

export default new TeamRoadmapService();
