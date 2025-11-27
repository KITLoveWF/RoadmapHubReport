import { useState, useEffect, useContext, Fragment } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import api from '#utils/api.js';
import './ProcessClassroom.css';
import {useCheckLogin} from "#hooks/userCheckLogin";
import LoadingSpinner from '#components/Common/LoadingSpinner/LoadingSpinner.jsx';

export default function ProcessClassroom({ classroomId }) {
  const { user,loading } = useCheckLogin();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Mock Data - Cấu trúc API mẫu (topics.quizzes với score, avgScore trên thang 10, date)
  const mockStudents = [
    {
      id: 'STU001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      topics: [
        {
          topicId: 'TOPIC001',
          topicName: 'JavaScript Basics',
          quizzes: [
            { score: 8.5, avgScore: 8.2, date: '2025-10-15' },
            { score: 9.0, avgScore: 8.5, date: '2025-10-16' },
            { score: 8.8, avgScore: 8.6, date: '2025-10-17' },
          ],
        },
        {
          topicId: 'TOPIC002',
          topicName: 'React Fundamentals',
          quizzes: [
            { score: 9.2, avgScore: 8.8, date: '2025-10-22' },
            { score: 8.8, avgScore: 8.7, date: '2025-10-23' },
            { score: 8.5, avgScore: 8.6, date: '2025-10-24' },
          ],
        },
        {
          topicId: 'TOPIC003',
          topicName: 'ES6 Features',
          quizzes: [
            { score: 8.8, avgScore: 8.4, date: '2025-10-29' },
            { score: 9.2, avgScore: 8.7, date: '2025-10-30' },
          ],
        },
      ],
      stats: {
        averageScore: 8.87,
        highestScore: 9.2,
        lowestScore: 8.5,
      },
    },
    {
      id: 'STU002',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      topics: [
        {
          topicId: 'TOPIC001',
          topicName: 'JavaScript Basics',
          quizzes: [
            { score: 7.2, avgScore: 7.8, date: '2025-10-18' },
            { score: 7.5, avgScore: 8.0, date: '2025-10-19' },
            { score: 7.0, avgScore: 7.6, date: '2025-10-20' },
          ],
        },
        {
          topicId: 'TOPIC002',
          topicName: 'React Fundamentals',
          quizzes: [
            { score: 6.5, avgScore: 7.2, date: '2025-10-25' },
            { score: 6.8, avgScore: 7.4, date: '2025-10-26' },
            { score: 6.2, avgScore: 7.0, date: '2025-10-27' },
          ],
        },
      ],
      stats: {
        averageScore: 6.85,
        highestScore: 7.5,
        lowestScore: 6.2,
      },
    },
    {
      id: 'STU003',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      topics: [
        {
          topicId: 'TOPIC001',
          topicName: 'JavaScript Basics',
          quizzes: [
            { score: 9.5, avgScore: 8.2, date: '2025-10-16' },
            { score: 9.8, avgScore: 8.5, date: '2025-10-17' },
            { score: 9.1, avgScore: 8.3, date: '2025-10-18' },
          ],
        },
        {
          topicId: 'TOPIC002',
          topicName: 'React Fundamentals',
          quizzes: [
            { score: 9.6, avgScore: 8.8, date: '2025-10-23' },
            { score: 9.4, avgScore: 8.7, date: '2025-10-24' },
            { score: 9.2, avgScore: 8.6, date: '2025-10-25' },
          ],
        },
        {
          topicId: 'TOPIC003',
          topicName: 'ES6 Features',
          quizzes: [
            { score: 9.7, avgScore: 8.4, date: '2025-10-30' },
            { score: 9.5, avgScore: 8.5, date: '2025-10-31' },
          ],
        },
      ],
      stats: {
        averageScore: 9.49,
        highestScore: 9.8,
        lowestScore: 9.1,
      },
    },
  ];

  // Fetch students data
  useEffect(() => {
    console.log(classroomId);
    const fetchStudents = async () => {
      try {
        // Thay bằng API thực khi có
        const response = await api.post(`/quizzes/getScoreStudent`, {
          classroomId: classroomId
        }, {
          withCredentials: true
        });
        console.log('Fetched students data:', response.data);
        setStudents(response.data);
        setSelectedStudent(response.data[0]);
        
        // Sử dụng mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        // setStudents(mockStudents);
        // setSelectedStudent(mockStudents[0]);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // ✅ Xuất Excel - Tất cả học sinh (Mỗi topic một sheet)
  const handleExportExcel = () => {
    try {
      setExportLoading(true);

      // 1. Gom tất cả topics unique
      const topicMap = new Map();
      const allTopics = [];
      
      students.forEach(student => {
        student.topics.forEach(topic => {
          if (!topicMap.has(topic.topicId)) {
            topicMap.set(topic.topicId, topic);
            allTopics.push(topic);
          }
        });
      });

      // 2. Tạo workbook
      const workbook = XLSX.utils.book_new();

      // 3. Tạo một sheet cho mỗi topic
      allTopics.forEach((topic, topicIdx) => {
        const sheetData = [];
        
        // Header row - Tạo header động dựa trên số lượng quizzes
        const headerRow = {
          'STT': '',
          'Họ và tên': '',
          'Email': '',
        };

        // Thêm cột cho từng quiz (Quiz 1, Quiz 2, ...)
        topic.quizzes.forEach((_, idx) => {
          headerRow[`Quiz ${idx + 1} Điểm`] = '';
          headerRow[`Quiz ${idx + 1} TB Lớp`] = '';
        });

        sheetData.push(headerRow);

        // Data rows
        students.forEach((student, studentIdx) => {
          const studentTopic = student.topics.find(t => t.topicId === topic.topicId);
          
          if (studentTopic) {
            const row = {
              'STT': studentIdx + 1,
              'Họ và tên': student.name,
              'Email': student.email,
            };

            // Thêm điểm cho từng quiz trong topic
            studentTopic.quizzes.forEach((quiz, quizIdx) => {
              row[`Quiz ${quizIdx + 1} Điểm`] = quiz.score.toFixed(1);
              row[`Quiz ${quizIdx + 1} TB Lớp`] = quiz.avgScore.toFixed(1);
            });

            sheetData.push(row);
          } else {
            // Nếu sinh viên không có dữ liệu topic này
            const row = {
              'STT': studentIdx + 1,
              'Họ và tên': student.name,
              'Email': student.email,
            };

            // Điền '-' cho các quiz
            topic.quizzes.forEach((_, quizIdx) => {
              row[`Quiz ${quizIdx + 1} Điểm`] = '-';
              row[`Quiz ${quizIdx + 1} TB Lớp`] = '-';
            });

            sheetData.push(row);
          }
        });

        // Tạo worksheet cho topic này
        const worksheet = XLSX.utils.json_to_sheet(sheetData);

        // Điều chỉnh độ rộng cột
        const colWidths = [
          { wch: 5 },    // STT
          { wch: 20 },   // Họ và tên
          { wch: 25 },   // Email
        ];
        
        // Thêm độ rộng cho cột quiz
        topic.quizzes.forEach(() => {
          colWidths.push({ wch: 14 });
        });

        worksheet['!cols'] = colWidths;

        // Định dạng header (bold + background color)
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + '1';
          if (!worksheet[address]) continue;
          worksheet[address].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4472C4' } },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          };
        }

        // Thêm sheet vào workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, `${topic.topicName.substring(0, 25)}`);
      });

      // 4. Tạo sheet tổng hợp (Summary)
      const summaryData = [];
      
      summaryData.push({
        'STT': '',
        'Họ và tên': '',
        'Email': '',
        ...Object.fromEntries(
          allTopics.map(topic => [`${topic.topicName}`, ''])
        ),
      });

      students.forEach((student, idx) => {
        const row = {
          'STT': idx + 1,
          'Họ và tên': student.name,
          'Email': student.email,
        };

        // Thêm TB cho từng topic
        allTopics.forEach(topic => {
          const studentTopic = student.topics.find(t => t.topicId === topic.topicId);
          if (studentTopic) {
            const topicStats = getTopicStats(studentTopic);
            row[`${topic.topicName}`] = topicStats.averageScore.toFixed(1);
          } else {
            row[`${topic.topicName}`] = '-';
          }
        });

        // Tính TB chung
        const allTopicsAvg = allTopics.map(topic => {
          const studentTopic = student.topics.find(t => t.topicId === topic.topicId);
          if (!studentTopic) return 0;
          const topicStats = getTopicStats(studentTopic);
          return topicStats.averageScore;
        }).reduce((a, b) => a + b, 0) / allTopics.length;
        
        row['Điểm TB'] = allTopicsAvg.toFixed(1);

        summaryData.push(row);
      });

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      
      const summaryColWidths = [
        { wch: 5 },
        { wch: 20 },
        { wch: 25 },
      ];
      
      allTopics.forEach(() => {
        summaryColWidths.push({ wch: 16 });
      });
      
      summaryColWidths.push({ wch: 18 });

      summaryWorksheet['!cols'] = summaryColWidths;

      // Format header cho summary sheet
      const summaryRange = XLSX.utils.decode_range(summaryWorksheet['!ref']);
      for (let C = summaryRange.s.c; C <= summaryRange.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1';
        if (!summaryWorksheet[address]) continue;
        summaryWorksheet[address].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '2E7D32' } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        };
      }

      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Tổng hợp');

      // 5. Lưu file
      XLSX.writeFile(
        workbook,
        `Bang_Diem_${new Date().toLocaleDateString('vi-VN')}.xlsx`
      );
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // Tính toán dữ liệu biểu đồ
  const getChartData = () => {
    if (!selectedStudent) return [];
    
    // Gom tất cả quiz từ tất cả topics
    const allQuizzes = selectedStudent.topics.flatMap((topic, topicIdx) => 
      topic.quizzes.map((quiz, quizIdx) => ({
        name: `${topic.topicName.substring(0, 8)}-Q${quizIdx + 1}`,
        score: parseFloat(quiz.score.toFixed(1)),
        avgScore: parseFloat(quiz.avgScore.toFixed(1)),
        maxScore: 10,
        topicName: topic.topicName
      }))
    );
    
    return allQuizzes;
  };

  // Tính toán stats của sinh viên từ topics
  // const getStudentStats = (student) => {
  //   if (!student?.topics?.length) {
  //     return { averageScore: 0, highestScore: 0, lowestScore: 0 };
  //   }
    
  //   const allScores = student.topics.flatMap(topic =>
  //     topic.quizzes.map(quiz => quiz.score || 0)
  //   );
    
  //   if (!allScores.length) {
  //     return { averageScore: 0, highestScore: 0, lowestScore: 0 };
  //   }
    
  //   const average = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  //   const highest = Math.max(...allScores);
  //   const lowest = Math.min(...allScores);
    
  //   return { 
  //     averageScore: average, 
  //     highestScore: highest, 
  //     lowestScore: lowest 
  //   };
  // };

  // Tính toán stats của topic từ quizzes
  const getTopicStats = (topic) => {
    if (!topic?.quizzes?.length) {
      return { averageScore: 0, highestScore: 0, lowestScore: 0 };
    }
    
    const scores = topic.quizzes.map(q => q.score || 0);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    
    return {
      averageScore: average,
      highestScore: highest,
      lowestScore: lowest
    };
  };

  const getScoreDistribution = () => {
    if (!students.length) return [];
    
    // Gom tất cả điểm từ tất cả sinh viên và topics
    const allScores = students.flatMap(student =>
      student.topics.flatMap(topic =>
        topic.quizzes.map(quiz => quiz.score)
      )
    );
    
    if (allScores.length === 0) return [];
    
    const distribution = {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
    };

    allScores.forEach(score => {
      const scoreOn10 = (score / 100 * 10);
      if (scoreOn10 >= 8) distribution.excellent++;
      else if (scoreOn10 >= 6) distribution.good++;
      else if (scoreOn10 >= 5) distribution.average++;
      else distribution.poor++;
    });

    return [
      { name: 'Xuất sắc (8-10)', value: distribution.excellent, color: '#4CAF50' },
      { name: 'Tốt (6-7.9)', value: distribution.good, color: '#2196F3' },
      { name: 'Trung bình (5-5.9)', value: distribution.average, color: '#FF9800' },
      { name: 'Yếu (<5)', value: distribution.poor, color: '#F44336' },
    ];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="process-classroom-container">
      <div className="process-header">
        <h1 style={{ color: 'white' }}>📊 Student Score Management</h1>
        <p className="text-muted">View and manage student scores in the classroom</p>
      </div>

      {/* ✅ Export buttons - Xuất tất cả */}
      <div className="export-section">
        <div className="export-info">
          <p>📥 Export scores of all <strong>{students.length}</strong> students</p>
        </div>
        <div className="export-buttons-main">
          <button
            className="btn btn-success btn-lg"
            onClick={handleExportExcel}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Exporting Excel...
              </>
            ) : (
              <>
                📊 Export Excel
              </>
            )}
          </button>
        </div>
      </div>

      <div id="class-report" className="process-content">
        {/* Left Panel - Student List */}
        <div className="student-list-panel">
          <div className="search-box-process-classroom">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>



          <div className="students-list">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                onClick={() => setSelectedStudent(student)}
              >
                <img src={student.avatar|| "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-66.jpg"} alt={student.name} className="student-avatar" />
                <div className="student-info">
                  <h5>{student.name}</h5>
                  <p>{student.email}</p>
                </div>
                <div className="student-score">
                  <div className="score-value">{Math.round(student.stats.averageScore * 10) / 10}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Student Details */}
        {selectedStudent && (
          <div className="student-details-panel">
            <div className="student-report">
              {/* Header */}
              <div className="report-header">
                <div className="student-profile">
                  <img src={selectedStudent.avatar || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-66.jpg"} alt={selectedStudent.name} />
                  <div>
                    <h2>{selectedStudent.name}</h2>
                    <p>{selectedStudent.email}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid-student-details">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-value">{Math.round(selectedStudent.stats.averageScore * 10) / 10}</div>
                    <div className="stat-label">Average Score</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-content">
                    <div className="stat-value">{selectedStudent.stats.highestScore}</div>
                    <div className="stat-label">Highest Score</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📉</div>
                  <div className="stat-content">
                    <div className="stat-value">{selectedStudent.stats.lowestScore}</div>
                    <div className="stat-label">Lowest Score</div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="charts-section">
                <div className="chart-container">
                  <h3>📈 Comparison of Individual Scores vs Class Average </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip formatter={(value) => `${value}`} />
                      <Legend />
                      <Bar dataKey="score" fill="#4CAF50" name="Individual Score" />
                      <Bar dataKey="avgScore" fill="#2196F3" name="Class Average" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>📊 Trend of Individual Scores vs Class Average </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip formatter={(value) => `${value}`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#4CAF50" 
                        strokeWidth={3}
                        dot={{ fill: '#4CAF50', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Individual Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgScore" 
                        stroke="#2196F3" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#2196F3', r: 4 }}
                        name="Class Average"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}