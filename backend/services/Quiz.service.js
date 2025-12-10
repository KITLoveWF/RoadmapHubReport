import QuizDAO from "../daos/Quiz.dao.js"
class QuizService{
   
    async getQuizClassroom({ userCreateQuiz, roadmapId, classroomId }){
            return await QuizDAO.getQuizClassroom({ userCreateQuiz, roadmapId, classroomId});
        }
    async updateQuizClassroom({userCreateQuiz, userDoQuiz, roadmapId, classroomId, topics}){
            return await QuizDAO.updateQuizClassroom({ userCreateQuiz, userDoQuiz, roadmapId, classroomId, topics });
        }
    async getQuizById({userDoQuiz,roadmapId,classroomId}){
        return await QuizDAO.getQuizById({userDoQuiz,roadmapId,classroomId});
    }
    async doQuiz({userDoQuiz, roadmapId, classroomId, topics}){
        return await QuizDAO.doQuiz({userDoQuiz, roadmapId, classroomId, topics});
    }
    async getScoreStudent({ classroomId }){
        return await QuizDAO.getScoreStudent({ classroomId });
    }
    async getStudentsInClassroom({ classroomId }){
        return await QuizDAO.getStudentsInClassroom({ classroomId });
    }
    async createQuizByAI({ topic, text, quiz, userId, history })
    {
        // await this.updateQuizClassroom({userCreateQuiz, roadmapId, classroomId, topics})
        // const prompt = ;
        const response = await fetch(
            "http://localhost:5678/webhook-test/genQuiz", {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                text: text,
                topic: topic,
                quiz: quiz,
                userId: userId,
                history: history
            }
            ) });
        const result = await response.json();
        return result;
    }
}
export default new QuizService(QuizDAO);