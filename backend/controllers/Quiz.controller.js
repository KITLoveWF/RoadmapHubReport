import QuizService from "../services/Quiz.service.js"
class QuizController{
    async getQuizClassroom(req,res){
        const {userCreateQuiz,roadmapId, classroomId} = req.query;
        const response = await QuizService.getQuizClassroom({ userCreateQuiz, roadmapId, classroomId });
        res.json(response);
    }
    async updateQuizClassroom(req,res){
        const {quiz} = req.body;
        const {userCreateQuiz, userDoQuiz, roadmapId, classroomId, topics } = quiz;
        const response = await QuizService.updateQuizClassroom({ userCreateQuiz, userDoQuiz, roadmapId, classroomId, topics });
        res.json(response);
    }
    async getQuizById (req,res){
        const {roadmapId,classroomId} = req.query;
        const userDoQuiz = req.authenticate.id;
        const response = await QuizService.getQuizById({userDoQuiz,roadmapId,classroomId});
        res.json(response);
    }
    async doQuiz (req,res){
        const {quiz} = req.body;
         const {userDoQuiz, roadmapId, classroomId, topics } = quiz;
        const response = await QuizService.doQuiz({userDoQuiz, roadmapId, classroomId, topics });
        res.json(response);
    }
    async getScoreStudent (req,res){
        const {classroomId} = req.body;
        const quizResults = await QuizService.getScoreStudent({ classroomId });
        const students = await QuizService.getStudentsInClassroom({ classroomId });
        const response = [];
        let totalScore = [];
        quizResults.forEach(quizResult => { 
            quizResult.topics.forEach((topic, topicIndex) => {
                if (!totalScore[topicIndex]) {
                    totalScore[topicIndex] = Array(topic.tests.length).fill(0);
                }
                topic.tests.forEach((test, testIndex) => {
                    if(test.submit) totalScore[topicIndex][testIndex] += test.point;
                    else totalScore[topicIndex][testIndex] += 0;
                });
            });
        });
        let avgScore = totalScore.map(topicTests => topicTests.map(score => score / quizResults.length));
        quizResults.forEach(quizResult => { 
            const student = students.find(s => s.id === quizResult.userDoQuiz);
            if(student)
            {
                let highestScore = 0;
                let lowestScore = 11;
                let averageScore = 0;
                let totalTests = 0;
                response.push({
                id: quizResult.userDoQuiz,
                name: student.username,
                email: student.email,
                avatar: student.avatar,
                topics: quizResult.topics.map((topic, topicIndex) => {
                    topic.tests.forEach(test => {
                        if(test.submit) totalTests += 1;
                        highestScore = Math.max(highestScore, test.point);
                        lowestScore = Math.min(lowestScore, test.point );
                        averageScore += test.point || 0;
                    });
                    return {
                        topicId: topic.topicId,
                        topicName: topic.topicName,
                        quizzes: topic.tests.map((test, testIndex) => ({
                            score: test.point,
                            avgScore: avgScore[topicIndex][testIndex],
                            date: test.startTime
                        })),
                    }
                    
                }),
                stats:{
                    averageScore: averageScore / totalTests,
                    highestScore: highestScore,
                    lowestScore: lowestScore,
                }
                });
            }
            else {
                response.push({
                    id: s.id,
                    name: student.username,
                    email: student.email,
                    topics: []
                }
            );
            }
        });
        res.json(response);
    }
    async createQuizByAI (req,res){
        const {text, topic, quiz, history} = req.body;
        const userId = req.authenticate.id;
        const response = await QuizService.createQuizByAI({ text, topic, quiz, history, userId });
        console.log("AI Response:", response);
        res.json(response);
    }
}
export default new QuizController(QuizService);