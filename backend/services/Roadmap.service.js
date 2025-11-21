import RoadmapDAO from '../daos/Roadmap.dao.js';
class RoadmapService {
    constructor(roadmapDAO) {
        this.RoadmapDAO = roadmapDAO;
    }
    //function service
    async addNoHandleToNodeOfRoadmap(roadmap) {
        if (!Array.isArray(roadmap?.nodes)) {
            roadmap.nodes = [];
        }
        roadmap.nodes = roadmap.nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                handle: "none"
        }
}));
        return roadmap;
    }
    //====================My sql
    async createRoadmap(name, description, accountId, isPublic) {
        return await RoadmapDAO.createRoadmap(name, description, accountId, isPublic);
    }
    async editRoadmap(name, description,accountId,roadmapId, isPublic) {
        return await RoadmapDAO.editRoadmap(name, description,accountId,roadmapId, isPublic);
    }
    async deleteRoadmap(id, accountId) {
        return await RoadmapDAO.deleteRoadmap(id, accountId);
    }
    async checkRoadmap(name, accountId, type) {
        return await RoadmapDAO.checkRoadmap(name, accountId, type);
    }
    // async editNodeRoadmap(accountId,name,nodes, edges,id) {
    //     return await RoadmapDAO.editNodeRoadmap(accountId,name,nodes, edges,id);
    // }
    async getRoadmapByName(accountId,name) {
        return await RoadmapDAO.getRoadmapByName(accountId,name);
    }
    async getRoadmapByUserId(userId) {
        return await RoadmapDAO.getRoadmapByUserId(userId);
    }
    async getRoadmapByTeamId(teamId) {
        return await RoadmapDAO.getRoadmapByTeamId(teamId);
    }
    async getRoadmapByAccountIdAndName(accountId, name){
        return await RoadmapDAO.getRoadmapByAccountIdAndName(accountId,name);
    }
    //====================mongoDB
    async editNodeRoadmap(accountId,name,roadmapId,nodes, edges) {
        return await RoadmapDAO.editNodeRoadmap(accountId,name,roadmapId,nodes, edges);
    }
    async viewRoadmap(roadmapId){
        return await RoadmapDAO.viewRoadmap(roadmapId);
    }
    async checkRoadmapExist(accountId, name){
        return await RoadmapDAO.checkRoadmapExist(accountId,name);
    }
    async updateRoadmap(accountId, name, nodes, edges){
        return await RoadmapDAO.updateRoadmap(accountId, name, nodes, edges)
    }
    async getTopicRoadmapByUserId(roadmapId){
        return await RoadmapDAO.getTopicRoadmapByUserId(roadmapId);
    }
}
export default new RoadmapService(RoadmapDAO)