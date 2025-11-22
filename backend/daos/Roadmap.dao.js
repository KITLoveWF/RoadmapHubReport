import db from "../utils/db.js";
//import connectDB from '../utils/dbmongo.js';
//import mongoose from 'mongoose';
//import { v4 as uuidv4 } from 'uuid';
import Roadmap from "../models/Roadmap.model.js";
import geneUUID from "../Helps/genUUID.js";
import RoadmapSchemaModel from "../models/RoadmapSchema.model.js";
import QuizSchemaModel from "../models/QuizSchema.model.js";
import QuizResultSchemaModel from "../models/QuizResultSchema.model.js";
class RoadmapDAO {
  //====================my sql
  async createRoadmap(name, description, accountId, isPublic) {
    const roadmap = new Roadmap(
      geneUUID(),
      accountId,
      null,
      name,
      description,
      isPublic,
      null,
      null
    );
    await db("Roadmap").insert(roadmap);
    return {
      success: true,
      message: "Create roadmap successfully",
      roadmap: roadmap,
    };
  }
  async editRoadmap(name, description, accountId, roadmapId,isPublic) {
    await db("Roadmap")
      .where({ accountId: accountId, id: roadmapId })
      .update({ name: name, description: description, isPublic: isPublic });
    return {
      success: true,
      message: "Edit roadmap successfully",
    };
  }
  async getRoadmapByAccountIdAndName(accountId, name) {
    const roadmap = await db("Roadmap")
      .where({ accountId: accountId, name: name })
      .select()
      .first();
    return roadmap;
  }
  async deleteRoadmap(id, accountId) {
    await db("Roadmap").where({ id }).del();
    await RoadmapSchemaModel.findOneAndDelete({ roadmapId: id });
    await QuizSchemaModel.findOneAndDelete({ roadmapId: id , userCreateQuiz: accountId});
    await QuizResultSchemaModel.findOneAndDelete({ roadmapId: id, userCreateQuiz: accountId });
    return {
      success: true,
      message: "Delete roadmap successfully",
    };
  }
  async checkRoadmap(name, accountId, type) {
    const countResult = await db("Roadmap")
      .where({ name, accountId })
      .count('* as count')
      .first();

    const count = Number(countResult.count);

    if(type==="create"){
      if (count > 0) {
        return {
          success: false,
          message: "Name of roadmap already taken",
          count,
        };
      } else {
        return {
          success: true,
          message: "Roadmap name is available",
          count,
        };
      }
    } 
    else {
      if (count > 1) {
        return {
          success: false,
          message: "Name of roadmap already taken",
          count,
        };
      } else {
        return {
          success: true,
          message: "Roadmap name is available",
          count,
        };
      }
    };
  }
  async searchRoadmap(search, typeSearch, index) {
    const pageSize = 16;
    const offset = (index - 1) * pageSize;
    const searchTerm = search.trim().split(/\s+/).map(word => `${word}*`).join(' ');
    let results = [];
    if(typeSearch==="popular"){
      results = await db("Roadmap")
        .whereRaw(
            'MATCH(name, description) AGAINST(? IN BOOLEAN MODE)',
            [searchTerm]
        )
        // .orderByRaw('MATCH(name, description) AGAINST(?) DESC', [search]) 
        .select('*')
        .limit(pageSize)
        .offset(offset);
    }
    else if(typeSearch==="newest"){
      results = await db("Roadmap")
        .whereRaw(
            'MATCH(name, description) AGAINST(? IN BOOLEAN MODE)',
            [searchTerm]
        )
        .select('*')
        .limit(pageSize)
        .offset(offset)
        .orderBy('createdAt', 'desc');
    }
    else if(typeSearch==="oldest"){
      results = await db("Roadmap")
        .whereRaw(
            'MATCH(name, description) AGAINST(? IN BOOLEAN MODE)',
            [searchTerm]
        )
        .select('*')
        .limit(pageSize)
        .offset(offset)
        .orderBy('createdAt', 'asc');
    }
    return results;
}
  // async editNodeRoadmap(accountId,name,nodes,edges,id) {
  //     const roadmap = RoadmapSchemaModel({accountId,name, roadmapId: id,nodes,edges,id});
  //     await roadmap.save();
  // }
  async getRoadmapByUserId(accountId) {
    const rows = await db("Roadmap")
      .join("Account", "Roadmap.accountId", "Account.id")
      .where("Account.id", accountId)
      .select("Roadmap.*");
    ////console.log("rows: ", rows);
    if (rows.length === 0) {
      return null;
    } else {
      return rows.map((row) => Roadmap.fromRow(row));
    }
  }
  async getRoadmapByTeamId(teamId) {
    await db("Roadmap")
      .join("Team", "Roadmap.teamId", "Team.id")
      .where("Team.id", teamId)
      .select("Roadmap.*");
  }
  async getRoadmapByName(accountId, name) {
    const roadmap = await db("Roadmap")
      .where({ accountId: accountId, name: name })
      .first();
    return roadmap;
  }
  async markRoadmap(accountId, roadmapId) {
    try {
      const roadmapExists = await db("Roadmap").where({ id: roadmapId }).first();
      if (!roadmapExists) {
          throw new Error("Roadmap không tồn tại");
      }
      const existingMark = await db("MarkRoadmap")
          .where({
              accountId: accountId,
              roadmapId: roadmapId
          })
          .first();
      if (existingMark) {
          await db("MarkRoadmap")
              .where({ id: existingMark.id })
              .del();
          return { 
              status: "unmarked", 
              message: "Đã bỏ lưu roadmap" 
          };
      } else {
          const newId = geneUUID();
          await db("MarkRoadmap").insert({
              id: newId,
              accountId: accountId,
              roadmapId: roadmapId
          });
          return { 
              status: "marked", 
              message: "Đã lưu roadmap thành công" 
          };
      }
    } catch (error) {
        console.error("Lỗi markRoadmap:", error);
        throw error; // Hoặc return lỗi tùy theo cách bạn xử lý response
    }
  }

  //====================mongoDB
  async editNodeRoadmap(accountId, name, roadmapId, nodes, edges) {
    ////console.log("lll",accountId,name,nodes,edges);
    //await connectDB();
    const roadmap = RoadmapSchemaModel({
      accountId,
      name,
      roadmapId,
      nodes,
      edges,
    });
    await roadmap.save();
  }
  async updateRoadmap(accountId, name, nodes, edges) {
    //await connectDB();
    const roadmap = await RoadmapSchemaModel.findOneAndUpdate(
      { accountId, name },
      { $set: { nodes, edges } },
      { new: true } // trả về document sau khi update
    );
    if (!roadmap) {
      throw new Error("Roadmap không tồn tại");
    }
    return roadmap;
  }
  async checkRoadmapExist(accountId, name) {
    ////console.log("account Id:", accountId, "; roadmap name:", name);
    //await connectDB();

    const roadmap = await RoadmapSchemaModel.findOne(
      { accountId, name },
      { _id: 1 } // chỉ lấy _id cho nhẹ
    );

    ////console.log("roadmap exist:", !!roadmap);
    return !!roadmap; // trả về true nếu tồn tại, false nếu không
  }
  async viewRoadmap(roadmapId) {
    //await connectDB();
    console.log("Check road map db mongo", roadmapId);
    const roadmap = await RoadmapSchemaModel.findOne(
      { roadmapId },
      { nodes: 1, edges: 1, _id: 0 }
    );

    console.log("roadmap: ", roadmap);
    if (!roadmap) {
      return { nodes: [], edges: [] };
    }
    return roadmap;
  }
  async getTopicRoadmapByUserId(roadmapId) {
    // await connectDB();
    const roadmap = await RoadmapSchemaModel.findOne({ roadmapId: roadmapId });
    return roadmap;
  }
}
export default new RoadmapDAO();
