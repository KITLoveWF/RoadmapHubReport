import React,{useState, useEffect} from "react";
import "./FriendList.css";
import axios from "axios";
import api from "../../../../utils/api";

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const fetchRequests = async () => {
        try {
            const response = await api.get("/friends/friend-list",{
                withCredentials: true
            });
            //console.log(response.data.data);
            //console.log("Friend List:", response.data.data);
            setFriends(response.data.data);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    };
    useEffect(() => {
        fetchRequests();
    }, []);

    const onRemove = async(id)=>{
        await api.post("/friends/friend-list/remove",{id},{
            withCredentials: true
        });
        fetchRequests();
    }
    return (
    <div className="friend-list-card">
        <h2>Danh sách bạn bè</h2>
        {friends?.length === 0 && <p className="friend-list-empty">Không có bạn bè</p>}
        {friends?.map(friend => (
            <div key={friend.id} className="friend-list-item">
            <div>
                <p className="friend-list-email">{friend.email}</p>
            </div>
            <div className="friend-list-actions">
                <button className="friend-list-btn view">
                Xem profile
                </button>
                <button className="friend-list-btn remove" onClick={() => onRemove(friend.id)}>
                Xóa bạn
                </button>
            </div>
            </div>
        ))}
    </div>
    );
}
