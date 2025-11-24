import React, { useState } from 'react';
import './ProfilePage.css';
import ProfileComponent from '../../../components/ProfileComponent/ProfileComponent/ProfileComponent.jsx';
import SettingComponent from '../../../components/ProfileComponent/SettingComponent/SettingComponent.jsx';
import FriendsComponent from '../../../components/ProfileComponent/FriendsComponent/FriendsComponent.jsx';
import RoadmapsComponent from '../../../components/ProfileComponent/RoadmapsComponent/RoadmapsComponent.jsx';
//import {useCheckLogin} from '../../../hooks/userCheckLogin.jsx'

const ProfilePage = () => {
    //side bar data
    const [activeNav, setActiveNav] = useState('Profile');
    // const { user } = useCheckLogin();
    // //console.log(user);

    const changeIntoSetting = () => {
        setMainContent(setting);
        setActiveNav('Setting');
    };

    const profile = <ProfileComponent changeIntoSetting={changeIntoSetting}/>;
    const setting = <SettingComponent/>;
    const friends = <FriendsComponent/>;
    const roadmaps = <RoadmapsComponent/>;

    const [mainContent, setMainContent] = useState(profile);
    const handleNavClick = (navId) => {
        setActiveNav(navId);
        if (navId === 'Profile') {setMainContent(profile);}
        else if (navId === 'Setting') {setMainContent(setting);}
        else if (navId === 'Friends') {setMainContent(friends);}
        else if (navId === 'Roadmaps') {setMainContent(roadmaps);}
    };

    // const teams = [
    //     'Lê Văn Việt Hoàng',
    //     'Nguyễn Văn A',
    //     'Trần Thị B',
    //     'Lê Văn C',
    //     'Hoàng Đức D'
    // ];

    const navItems = [
        { id: 'Profile', label: 'Profile', icon: '👤' },
        { id: 'Friends', label: 'Friends', icon: '👥' },
        { id: 'Roadmaps', label: 'Roadmaps', icon: '🗺️' },
        { id: 'Setting', label: 'Setting', icon: '⚙️' }
    ];

    return (
        <div className="profile-container">
        <div className="sidebar">
        <nav className="sidebar-nav">
            {navItems.map((item) => (
                <div
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                </div>
            ))}
            </nav>
        </div>
            <div className="main-content">
                <div className="content-center-wrapper">
                    {mainContent}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
