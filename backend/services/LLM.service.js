import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

class LLMService {
  //hàm tạo id ngâu nhiên
  getRandomId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
  //các hàm xử lý response của LLM
  revertToBasicForm = (nodesInput, edgesInput) => {
    // Lọc nodes chỉ lấy type = "topic"
    const topicNodes = nodesInput.filter(n => n.type === "topic");
    // Tạo nodes tối giản
    const simpleNodes = topicNodes.map(n => ({
      id: n.id,
      data: {
        label: n.data.label||'',
        titleTopic: n.data.titleTopic||'',
        descriptionTopic: n.data.descriptionTopic ||'',
      }
    }));
    // Tạo edges tối giản (chỉ giữ source và target, nếu source & target đều là topic)
    const simpleEdges = edgesInput
      .filter(e => topicNodes.some(n => n.id === e.source) && topicNodes.some(n => n.id === e.target))
      .map(e => ({
        source: e.source,
        target: e.target
      }));
    return {
      nodes: simpleNodes,
      edges: simpleEdges
    };
  };
  convertToFlow = (nodesInput) => {
    const resNodes = [];
    const resEdges = [];

    const baseX = 0; // X cố định cho topic chính
    let baseY = 0;   // Y gốc, sẽ tăng theo topic chính
    const stepY = 150; // Khoảng cách Y giữa các topic chính
    const subXStep = 200; // Bước nhảy X cho subNodes
    const subY = 100; // Y của subNode so với topic chính

    let prevTopicId = null; // Lưu topic trước để tạo edge nối giữa các topic chính

    nodesInput.forEach((nodeObj) => {
      const topicId = this.getRandomId();

      // Thêm node chính
      resNodes.push({
        id: topicId,
        type: "topic",
        position: { x: baseX, y: baseY },
        data: { 
          label: nodeObj.data.label,
          width: 180,
          height: 45
        },
        measured: { width: 180, height: 45 },
        selected: false,
        dragging: false
      });

      // Nếu có topic trước, tạo edge nối topic lớn liền kề
      if (prevTopicId) {
        resEdges.push({
          source: prevTopicId,
          sourceHandle: "top-source",
          target: topicId,
          targetHandle: "bottom-target",
          type: "default",
          id: `xy-edge__${prevTopicId}-source-${topicId}-target`
        });
      }

      prevTopicId = topicId;

      // Nếu có subNodes
      if (nodeObj.data.subNodes && nodeObj.data.subNodes.length > 0) {
        let subX = baseX + subXStep; // subNode sẽ nằm lệch sang phải
        nodeObj.data.subNodes.forEach((subNode, index) => {
          const subId = this.getRandomId();

          resNodes.push({
            id: subId,
            type: "topic",
            position: { x: subX, y: baseY + subY }, // Y của subNode so với topic chính
            data: {
              label: subNode?.label||subNode?.data?.label,
              width: 180,
              height: 45
            },
            measured: { width: 180, height: 45 },
            selected: false,
            dragging: false
          });

          // Tạo edge từ topic cha -> subNode
          resEdges.push({
            source: topicId,
            sourceHandle: "top-source",
            target: subId,
            targetHandle: "bottom-target",
            type: "default",
            id: `xy-edge__${topicId}-source-${subId}-target`
          });

          subX += subXStep; // nếu có nhiều subNode, sẽ nằm kế nhau sang phải
        });
      }

      // Sau khi xử lý xong topic chính và subNodes, tăng baseY cho topic tiếp theo
      baseY += stepY;
    });

    return { resNodes, resEdges };
  };
  getJsonInResponse = async(text) => {
    console.log(text);
     try {
      // Tìm vị trí { đầu tiên và } cuối cùng
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON found');
      // Cắt chuỗi JSON
      const jsonString = text.slice(firstBrace, lastBrace + 1);
      // Chuyển sang object
      const jsonObject = JSON.parse(jsonString);
      return jsonObject;
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return null;
    }
  }
  createRoadmapCase = async(text) => {
    const systemPrompt=
    `
    CRITICAL OUTPUT RULE:
    Your response must contain ONLY valid JSON. No explanations, no introductory text, no code blocks, no markdown formatting.
    STRUCTURE RULES:
    - The roadmap contains "nodes" array
    - Each node has a "data" object with required fields:
    - "label": short, unique identifier (max 20 chars)
    - "titleTopic": the topic title
    - "descriptionTopic": brief description (max 100 chars)
    - Nodes may contain "subNodes" array (optional)
    - SubNodes have same structure as nodes but cannot contain further subNodes
    CONTENT RULES:
    - Generate topics relevant to the requested theme
    - Use concise, professional language
    - Avoid redundant or overly similar topics
    - Each topic (node) is numbered sequentially as 1, 2, 3, ... and each subtopic (subNode) follows the format of its parent topic number, such as 1.1, 1.2, 2.1, etc. The 'label' field remains the short, unique identifier, but the numbering must appear before the 'titleTopic' to indicate hierarchy. Example: 'titleTopic': '1. Warm-up and Stretching', subTopic: '1.1 Treadmill Workout'.
    SCOPE RULES:
    - Main topics only: Generate exactly 8-10 nodes without subNodes
    - Main topics with subtopics: Generate exactly 4-5 nodes, each with 1-3 subNodes
    - If request is ambiguous, default to main topics only
    OUTPUT FORMAT:
    Start immediately with { and end with }

    {
      "nodes": [
        {
          "data": {
            "label": "1 Warm-up",
            "titleTopic": "Warm-up and Stretching",
            "descriptionTopic": "Essential exercises to prepare for your workout",
            "subNodes": [
              {
                "label": "1.1 Treadmill",
                "titleTopic": "Treadmill Workout",
                "descriptionTopic": "Effective treadmill exercises for cardio"
              }
            ]
          }
        }
      ]
    }
    `
    const response = await fetch(`${process.env.LM_HOST_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta-llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text } 
        ],
        temperature: 0,
        top_k: 40,
        top_p: 0.95,
        repeat_penalty: 1.1,
        }),
      });
      const data = await response.json();
      const jsonResponse = data?.choices?.[0]?.message?.content;
      //console.log(jsonResponse);
      return jsonResponse;
  }
  editRoadmapCase = async(text, nodes, edges) => {
    const systemPrompt=
    `
    You are a JSON-only generator.
====================
OUTPUT RULES:
====================
1. Output ONLY a single JSON ARRAY of strings.
   Example:
   ["2.1 Subtopic A","2.2 Subtopic B","2.3 Subtopic C","2.4 Subtopic D"]

2. Each item in the array must:
   - Be a string.
   - Start with "2." followed by a number (e.g., "2.1", "2.2", ...).
   - Contain a short descriptive topic name (2–5 words).

3. The array must contain between 3 and 5 items.
4. Output MUST:
   - Start with '[' and end with ']'.
   - Be valid JSON (parsable by JSON.parse).
   - Contain no explanations, no markdown, no text outside the array.

5. If you cannot comply, output [].

====================
CONTEXT (for understanding):
====================
You are expanding a JSON roadmap of topics.
Each topic is represented by a numeric label (e.g., "1", "2", "2.1", etc.).
The roadmap can belong to **any domain** (e.g., mathematics, computer science, fitness, etc.).
You must generate subtopics that match the theme of the provided nodes.

========================
Here are the current roadmap nodes:
========================
${JSON.stringify(nodes, null, 2)}
====================
YOUR RESPONSE:
====================
Output the array only.

    `
    //console.log(systemPrompt);
    const response = await fetch(`${process.env.LM_HOST_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta-llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text } 
        ],
        temperature: 0.8,
        top_k: 40,
        top_p: 0.95,
        repeat_penalty: 1.1,
        min_p:0.05
        }),
      });
      const data = await response.json();
      const jsonResponse = data?.choices?.[0]?.message?.content;
      //console.log(jsonResponse);
      return jsonResponse;
  }
  editRoadmapCaseStep2 = async(nodes, changedData, text) => {
    const systemPrompt=
    `
You are a JSON-only generator.

TASK:
- Build a single JSON object with key "nodes".
- Each node represents a topic in a roadmap.
- You are given existing nodes and a few new subtopic labels to add.

====================
STRUCTURE RULES:
====================
1. The JSON must follow EXACTLY this structure:

{
  "nodes": [
    {
      "data": {
        "label": "1 Fundamentals",
        "titleTopic": "",
        "descriptionTopic": ""
      }
    },
    {
      "data": {
        "label": "1.1 Example Topic",
        "titleTopic": "",
        "descriptionTopic": ""
      }
    },
    ...
  ]
}

2. Each "data" object must include:
   - "label": string
   - "titleTopic": string (can be empty)
   - "descriptionTopic": string (can be empty)

3. DO NOT include:
   - id
   - parent_id
   - subNodes
   - metadata
   - explanations, comments, or markdown

4. Output MUST:
   - Start with '{' and end with '}'.
   - Be valid JSON (parsable by JSON.parse).
   - Contain no text outside the JSON.

5. Preserve all existing nodes.
   Insert new nodes for topic need to change using the labels you are given.
   Place them right after the topic node.

6. Maintain numeric order of labels (1.x before 2, 2.x after 2, etc.).
========================
Here are the current roadmap nodes:
========================
${JSON.stringify(nodes, null, 2)}
data need to change
${changedData}
====================
EXAMPLE OUTPUT:
{
  "nodes": [
    { "data": { "label": "1 Overview", "titleTopic": "", "descriptionTopic": "" } },
    { "data": { "label": "1.1 Introduction", "titleTopic": "", "descriptionTopic": "" } },
    { "data": { "label": "1.2 Basic Concepts", "titleTopic": "", "descriptionTopic": "" } },
    { "data": { "label": "2 Core Topics", "titleTopic": "", "descriptionTopic": "" } },
    { "data": { "label": "2.1 Subtopic A", "titleTopic": "", "descriptionTopic": "" } },
    { "data": { "label": "2.2 Subtopic B", "titleTopic": "", "descriptionTopic": "" } },
    { "data": { "label": "3 Advanced Topics", "titleTopic": "", "descriptionTopic": "" } }
  ]
}

This roadmap may belong to any field (math, computer science, etc.), not only English learning.
    `
    //console.log(systemPrompt);
    const response = await fetch(`${process.env.LM_HOST_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta-llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text } 
        ],
        temperature: 0,
        top_k: 40,
        top_p: 0.95,
        repeat_penalty: 1.1,
        min_p: 0.05
        }),
      });
      const data = await response.json();
      const jsonResponse = data?.choices?.[0]?.message?.content;
      //console.log(jsonResponse);
      return jsonResponse;
  }
  editRoadmapCaseStep3 = async(nodes) => {
    const systemPrompt=
    `
    You are a precise JSON hierarchy builder. 
Your task is to convert a flat list of nodes into a nested JSON structure based on their numeric "label" patterns.

RULES (follow strictly):
1. Input JSON always has the form:
   {
     "nodes": [
       { "data": { "label": "1 Fundamentals", "titleTopic": "", "descriptionTopic": "" } },
       { "data": { "label": "1.1 Treadmill", "titleTopic": "", "descriptionTopic": "" } },
       { "data": { "label": "1.2 Stretching", "titleTopic": "", "descriptionTopic": "" } },
       { "data": { "label": "2 Vocabulary", "titleTopic": "", "descriptionTopic": "" } },
       ...
     ]
   }
here is in put
${JSON.stringify(nodes, null, 2)}
2. The "label" determines the hierarchy:
   - A label with one number (e.g. '1', '2', '3') is a **main topic**.
   - A label with two numbers (e.g. '1.1', '1.2') is a **sub-topic of the first number**.
   - You may assume there are no deeper levels (like 1.1.1).

3. Your output must be valid JSON, exactly like this format:
   {
     "nodes": [
       {
         "data": {
           "label": "1 Fundamentals",
           "titleTopic": "",
           "descriptionTopic": "",
           "subNodes": [
             {
               "label": "1.1 Treadmill",
               "titleTopic": "",
               "descriptionTopic": ""
             },
             {
               "label": "1.2 Stretching",
               "titleTopic": "",
               "descriptionTopic": ""
             }
           ]
         }
       },
       {
         "data": {
           "label": "2 Vocabulary",
           "titleTopic": "",
           "descriptionTopic": "",
           "subNodes": []
         }
       }
     ]
   }
    `
    //console.log(systemPrompt);
    const response = await fetch(`${process.env.LM_HOST_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta-llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt }
        ],
        temperature: 0,
        top_k: 40,
        top_p: 0.95,
        repeat_penalty: 1.1,
        min_p: 0.05
        }),
      });
      const data = await response.json();
      const jsonResponse = data?.choices?.[0]?.message?.content;
      //console.log(jsonResponse);
      return jsonResponse;
  }
  //LLM local
  getLLMResponse = async (req, res, next) => {
    try {
      const { text, nodes, edges, demoNodes, demoEdges } = req.body;
      // console.log(nodes);
      // console.log(edges);
      let safeNodes = Array.isArray(demoNodes) ? demoNodes : [];
      let safeEdges = Array.isArray(demoEdges) ? demoEdges : [];
      const systemPrompt = 
      `
      You are an intent classifier for roadmap messages. Classify any message into one of 4 intents: Create roadmap, Edit roadmap, Edit demo, or Other.
      Rules:
      - Create roadmap: If the message is requesting to create a brand new roadmap, even if it mentions main topics, subtopics, or a simple outline. Keywords often include "tạo", "lập", "make", "create", "khởi tạo", "lập mới". Reply "Create roadmap" in this case.
      - Edit roadmap: If the message is about editing, adding, removing, or modifying topics or subtopics in an existing original (gốc) roadmap. Keywords often include "gốc", "original", "chỉnh sửa roadmap gốc", "cập nhật roadmap". Reply "Edit roadmap" in this case.
      - Edit demo: If the message is about editing, adding, removing, or modifying topics or subtopics in the demo version of a roadmap, or continuing edits from a previous demo session. Keywords often include "demo", "thử", "preview", "tiếp tục demo", "thử nghiệm". Reply "Edit demo" in this case.
      - Other: If the message is not about creating or editing a roadmap, reply "Other". This includes greetings, questions not related to roadmap content, or general comments.
      - Reply only one of these words: Create roadmap, Edit roadmap, Edit demo, Other. Do NOT explain your choice.
      Examples:
      Message: "Tạo roadmap mới về món ăn" → Create roadmap
      Message: "Tạo một roadmap đơn giản cho học tiếng Anh" → Create roadmap
      Message: "Hãy lập roadmap cho dự án mới" → Create roadmap
      Message: "Tạo một roadmap đơn giản cho học tiếng Anh. Chỉ cần các topic chính." → Create roadmap
      Message: "Hãy lập một roadmap mới về kỹ năng mềm cho sinh viên" → Create roadmap
      Message: "Tạo roadmap mới về lập trình web, chỉ cần các chủ đề chính" → Create roadmap
      Message: "Thêm 3 topic con cho topic 'Nấu thịt bò'" → Edit roadmap
      Message: "Xóa topic 'Học tiếng Anh' khỏi roadmap gốc" → Edit roadmap
      Message: "Chỉnh sửa roadmap gốc để cập nhật nội dung mới" → Edit roadmap
      Message: "Sửa roadmap demo để thử layout mới" → Edit demo
      Message: "Tiếp tục chỉnh sửa roadmap demo hôm trước" → Edit demo
      Message: "Thêm vài topic con cho roadmap demo" → Edit demo
      Message: "Xin chào, bạn khỏe không?" → Other
      Message: "Có nên thêm phần đồ họa vào roadmap?" → Other
      Message: "Gợi ý cách sắp xếp các topic" → Other
      `;
      const response = await fetch(`${process.env.LM_HOST_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta-llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text } 
        ],
        temperature: 0
        }),
      });
      const data = await response.json();
      console.log(data?.choices?.[0]?.message?.content);
      const intent = data?.choices?.[0]?.message?.content
      let responseText
      if(intent === "Create roadmap"){
        responseText="Đã tạo roadmap mẫu thành công. Bạn có thể xem nơi phần DEMO"
        const rawJsonResopnse = await this.createRoadmapCase(text);
        const jsonResponse = await this.getJsonInResponse(rawJsonResopnse);
        const roadampDemo = this.convertToFlow(jsonResponse.nodes);
        safeNodes = roadampDemo?.nodes;
        safeEdges = roadampDemo?.edges;
      }
      else if(intent === "Edit roadmap"){
        responseText="Đã sửa roadmap thành công. Bạn có thể xem nơi phần DEMO"
        const basicRoadmapForm = this.revertToBasicForm(nodes, edges)
        //console.log("input nodes", JSON.stringify(basicRoadmapForm.nodes, null, 2))
        const rawJsonResopnseStep1 = await this.editRoadmapCase(text, basicRoadmapForm.nodes, basicRoadmapForm.edges);
        //console.log("rawJsonResopnseStep1: ", rawJsonResopnseStep1);
        // const jsonResponseStep1 = await this.getJsonInResponse(rawJsonResopnseStep1);
        const rawJsonResopnseStep2 = await this.editRoadmapCaseStep2(basicRoadmapForm.nodes, rawJsonResopnseStep1, text);
        //console.log("rawJsonResopnseStep2: ", rawJsonResopnseStep2);
        const jsonResponseStep2 = await this.getJsonInResponse(rawJsonResopnseStep2);
        const rawJsonResopnseStep3 = await this.editRoadmapCaseStep3(jsonResponseStep2);
        //console.log("rawJsonResopnseStep3: ", rawJsonResopnseStep3);
        const jsonResponseStep3 = await this.getJsonInResponse(rawJsonResopnseStep3);
        const roadampDemo = this.convertToFlow(jsonResponseStep3.nodes);
        safeNodes = roadampDemo?.nodes;
        safeEdges = roadampDemo?.edges;
      }
      else if(intent === "Edit demo"){
        responseText="Đã sửa tiếp roadmap mẫu thành công. Bạn có thể xem nơi phần DEMO"
        const basicRoadmapForm = this.revertToBasicForm(safeNodes, safeEdges)
        const rawJsonResopnseStep1 = await this.editRoadmapCase(text, basicRoadmapForm.nodes, basicRoadmapForm.edges);
        const rawJsonResopnseStep2 = await this.editRoadmapCaseStep2(basicRoadmapForm.nodes, rawJsonResopnseStep1, text);
        const jsonResponseStep2 = await this.getJsonInResponse(rawJsonResopnseStep2);
        const rawJsonResopnseStep3 = await this.editRoadmapCaseStep3(jsonResponseStep2);
        const jsonResponseStep3 = await this.getJsonInResponse(rawJsonResopnseStep3);
        const roadampDemo = this.convertToFlow(jsonResponseStep3.nodes);
        safeNodes = roadampDemo?.nodes;
        safeEdges = roadampDemo?.edges;
      }
      else{
        responseText="Ờm...! Tôi có thể giúp bạn tạo mới và sửa roadmap đó"
      }
      return res.status(200).json({status: "success", data: responseText, demoNodes: safeNodes, demoEdges: safeEdges});
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }
  //n8n webhook call api
  getGeminiResponse = async (req, res, next) => {
    const { text, nodes, demoNodes } = req.body;
    const response = await fetch(`http://localhost:5678/webhook/genRoadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        nodes: nodes,
        demoNodes: demoNodes
      })
    });
    const result = await response.json();
    const {resNodes, resEdges} = this.convertToFlow(result.data);
    console.log(result.data);
    res.json({status:response.status, message: result.message, nodes: resNodes, edges: resEdges});
  }
}

export default new LLMService();