import React,{useState, useEffect} from "react";
import "./FriendList.css";
import axios from "axios";
import api from "../../../../utils/api";

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const fetchRequests = async () => {
        try {
            const response = await api.get("/friends/friend-list", {
                withCredentials: true,
            });
            setFriends(response.data.data);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    };
    useEffect(() => {
        fetchRequests();
    }, []);

    const onRemove = async (id) => {
        await api.post(
            "/friends/friend-list/remove",
            { id },
            {
                withCredentials: true,
            }
        );
        fetchRequests();
    };
    return (
        <div className="friends-card">
            <header>
                <h2>Friends</h2>
                <p>Danh sách bạn bè hiện tại của bạn.</p>
            </header>
            {friends?.length === 0 ? (
                <p className="friends-empty-state">Bạn chưa có bạn bè nào.</p>
            ) : (
                <ul className="friends-row-list">
                    {friends.map((friend) => (
                        <li key={friend.id} className="friends-row">
                            <div className="friends-row-info">
                                <p className="friends-row-title">{friend.email}</p>
                            </div>
                            <div className="friends-row-actions">
                                <button className="friends-btn outline" type="button">
                                    Xem profile
                                </button>
                                <button className="friends-btn danger" type="button" onClick={() => onRemove(friend.id)}>
                                    Xóa bạn
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
