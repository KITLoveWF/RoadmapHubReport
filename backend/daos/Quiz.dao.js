import connectDB from '../utils/dbmongo.js';
import Quiz from "../models/QuizSchema.model.js";
import QuizResult from "../models/QuizResultSchema.model.js";
import db from "../utils/db.js";
class QuizDAO{
    async getQuizClassroom({ userCreateQuiz, roadmapId, classroomId }){
        const filter = { userCreateQuiz, roadmapId, classroomId };
        const quizzes = await Quiz.find(filter);
        return quizzes;

    }
    async updateQuizClassroom({ userCreateQuiz, userDoQuiz, roadmapId, classroomId, topics }){
        const filter = { userCreateQuiz, roadmapId, classroomId };
        const update = { userCreateQuiz, userDoQuiz, roadmapId, classroomId, topics };
        const quiz = await Quiz.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
        });
        return quiz;

    }
    async getQuizById({userDoQuiz,roadmapId,classroomId}){
        const filter = { userDoQuiz, roadmapId, classroomId };
        const quizzes = await QuizResult.find(filter);
        return quizzes;
    }
    async doQuiz({userDoQuiz, roadmapId, classroomId, topics}){
        const filter = { userDoQuiz, roadmapId, classroomId };
        const update = { userDoQuiz, roadmapId, classroomId, topics };
        const quizResult = await QuizResult.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
        });
        return quizResult;
    }
    async getScoreStudent({ classroomId }){
        const quizResults = await QuizResult.find({ classroomId });
        return quizResults;
    }
    async getStudentsInClassroom({ classroomId }){
        const results = await db('studentclassroom')
                             .join('account', 'studentclassroom.studentId', 'account.id')
                             .join('profile', 'studentclassroom.studentId', 'profile.accountId')
                             .where({ classroomId })
                             .select('account.id', 'account.username', 'account.email','profile.avatar');
        return results;
    }
    
}
export default new QuizDAO();