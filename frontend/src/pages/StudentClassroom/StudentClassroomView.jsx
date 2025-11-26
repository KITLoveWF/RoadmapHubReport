import SideBarClassroom from '#components/Classroom/SideBarClassroom/SideBarClassroom.jsx'
import ForumStudentClass from '#components/StudentClassroom/ForumStudentClassroom/ForumStudentClassroom.jsx'
import RoadmapStudentClassroom from '#components/StudentClassroom/RoadmapStudentClassroom/RoadmapStudentClassroom.jsx'
import ClassroomStudentSettings from '#components/StudentClassroom/ClassroomStudentSettings/ClassroomStudentSettings.jsx'
import { useParams,useNavigate,useLocation } from "react-router-dom";
import api from '#utils/api.js'
import './StudentClassroomView.css'
import { useState,useEffect } from 'react'
import {useCheckLogin} from "#hooks/userCheckLogin";
export default function StudentClassroomView(){
    const navigate = useNavigate();
    const { name,classroomId } = useParams();
    const location = useLocation();
    const [activeNav, setActiveNav] = useState('Forum');
    const [classes, setClassess] = useState([{name:name,id:classroomId}]);
    const [selectedClass, setSelectedClass] = useState({name:name,id:classroomId});
    const { isLoggedIn, profile } = useCheckLogin();
    const navItems = [
        { id: 'Forum', label: 'Forum', icon: '👤' },
        { id: 'Roadmap', label: 'Roadmap', icon: '👥' },
        { id: 'Settings', label: 'Settings', icon: '⚙️' },
    ];
    const renderContent = () => {
        switch (activeNav) {
          case "Forum": return <ForumStudentClass classroomId={classroomId} key={classroomId} />;
          case "Roadmap": return <RoadmapStudentClassroom classroomId={classroomId}  key={classroomId}/>;
          case "Settings": return <ClassroomStudentSettings classroomId={classroomId} key={classroomId} profile={profile} classroomName={name} />;
          default: return null;
        }
      };
    useEffect( ()=>{
          async function checkLogin(){
            const response = await api.post('/classrooms/checkLearningClass',{classroomId:classroomId},{
              withCredentials: true
            }) ;
            // //console.log(response)
            if(!response.data.success){
            navigate("/");
            }
          }
          checkLogin()
        },[name, location.pathname])
    useEffect(() => {
        const getClasses = async () =>{
                const response = await api.get('/classrooms/getLearningClass', {
                    withCredentials: true
                });
                //console.log(response)
                setClassess([...response.data.map(classItem => ({name:classItem.name,id:classItem.classroomId}))]);
                } 
        getClasses();
    }, []);
     useEffect(() => {
           navigate(`/classroom/view-student/${selectedClass.name}/${selectedClass.id}`);
    }, [selectedClass]);
    return(<>
     <div className="profile-container">
            <SideBarClassroom activeNav={activeNav}navItems={navItems} handleNavClick = {setActiveNav} selectedClass = {selectedClass} setSelectedClass={setSelectedClass} classes={classes}/>
            <div className="main-content">
                <div className="content-center-wrapper">
                    {renderContent()}
                </div>
            </div>
     </div>

    </>)
}