import './ManageStudent.css'
import { useState } from "react";
import AddStudentForm from '#components/Classroom/ManageStudent/AddStudentForm/AddStudentForm.jsx';
import StudentList from '#components/Classroom/ManageStudent/StudentList/StudentList.jsx';
import ClassroomSettings from '#components/Classroom/ManageStudent/ClassroomSettings/ClassroomSettings.jsx';
export default function ManageStudent(props){
  const [tab, setTab] = useState("students");
    const {classroomId} = props
    return( <div className="students-content-wrapper">
          <div className="students-tab-row">
            <button className={`students-tab-btn${tab==="students" ? " active" : ""}`} onClick={() => setTab("students")}>students</button>
            <button className={`students-tab-btn${tab==="Sent" ? " active" : ""}`} onClick={() => setTab("Sent")}>Add Student</button>
            <button className={`students-tab-btn${tab==="settings" ? " active" : ""}`} onClick={() => setTab("settings")}>Settings</button>
          </div>
          <div className="students-content-main">
            {tab === "Sent" && (
              <div>
                <AddStudentForm classroomId={classroomId}/>
              </div>
            )}
            {tab === "students" && (
              <div>
                <StudentList classroomId={classroomId}/>
              </div>
            )}
            {tab === "settings" && (
            <div>
              <ClassroomSettings classroomId={classroomId} onDelete={() => navigate("/classroom")} />
            </div>
            )}
          </div>
        </div>)
}