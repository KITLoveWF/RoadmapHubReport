import { useState } from 'react';
import './ItemComment.css'
import ReactQuill from "react-quill-new";   
import "react-quill-new/dist/quill.snow.css";
import DeleteComment from '../DeleteComment/DeleteComment';
import { useEffect } from 'react';
export default function ItemComment(props) {
        const {user,post,comment,handleEditComment, handleDeleteComment} = props;
        const [contentComment,setContentComment] = useState(comment.content);
        const [openEditComment,setOpenEditComment] = useState(false);
        const [openDeleteComment,setOpenDeleteComment] = useState(false);
        // const handleDelete = (e) => {
        // }
        const [teacherEdit,setTeacherEdit] = useState(false);
        const [userEdit,setUserEdit] = useState(false);
        useEffect(()=>{
                        if(user.accountId === comment.accountId){
                            setUserEdit(true);
                        }
                        if(user.accountId === post.accountId){
                                setTeacherEdit(true);
                        }
                        if(user.accountId==post.accountId && post.accountId === comment.accountId){
                                setUserEdit(true);
                                setTeacherEdit(false);
                        }
               
        },[])
        const handleEdit=(e)=>{
        e.preventDefault();
        if (contentComment.trim()) {
                handleEditComment(contentComment,comment.id);
                setOpenEditComment(false);
        }
        }
        return (<>
        <form onSubmit={handleEdit}>
                <div className="item-comment">
                        <div className='comment-author-info'>
                                <img 
                                        src={comment.avatar || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-66.jpg"} 
                                        className="comment-avatar" 
                                        alt="avatar" 
                                />
                                <div className="comment-content-wrapper">
                                        <div className="comment-header">
                                                <h4 className="comment-author-name">{comment.name}</h4>
                                                <span className="comment-date">
                                                        <i className="bi bi-clock"></i>
                                                        {comment.createDate}
                                                </span>
                                        </div>
                                        {openEditComment ? (
                                                <div className="postcomment">
                                                        <ReactQuill
                                                                value={contentComment}
                                                                onChange={(value) => setContentComment(value)}
                                                                placeholder="Chỉnh sửa bình luận của bạn"
                                                                modules={{
                                                                        toolbar: [["bold", "italic", "underline"], [{ list: "bullet" }]],
                                                                }}
                                                        />
                                                        <div className="comment-edit-actions">
                                                                <button 
                                                                        type="button" 
                                                                        className="comment-edit-btn comment-cancel-btn" 
                                                                        onClick={() => setOpenEditComment(false)}
                                                                >
                                                                        Cancel
                                                                </button>
                                                                <button
                                                                        type="submit"
                                                                        className="comment-edit-btn comment-save-btn"
                                                                >
                                                                        Save
                                                                </button>
                                                        </div>
                                                </div>
                                        ) : (
                                                <div className='comment-body'>
                                                        <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                                                </div>
                                        )}
                                </div>
                        </div>

                        {userEdit && (
                                <div className='comment-dropdown dropdown'>
                                        <button 
                                                className='comment-dropdown-toggle' 
                                                id="dropdownMenuButton1" 
                                                type="button"
                                                data-bs-toggle="dropdown" 
                                                aria-expanded="false"
                                        >
                                                <i className="bi bi-three-dots"></i>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li>
                                                        <button 
                                                                type='button' 
                                                                className="dropdown-item edit-item" 
                                                                onClick={() => setOpenEditComment(true)}
                                                        >
                                                                <i className="bi bi-pencil-fill"></i>
                                                                Edit
                                                        </button>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                        <button 
                                                                type='button'
                                                                className="dropdown-item delete-item" 
                                                                onClick={() => setOpenDeleteComment(true)}
                                                        >
                                                                <i className="bi bi-trash-fill"></i>
                                                                Delete
                                                        </button>
                                                </li>
                                        </ul>
                                </div>
                        )}

                        {teacherEdit && (
                                <div className='comment-dropdown dropdown'>
                                        <button 
                                                className='comment-dropdown-toggle' 
                                                id="dropdownMenuButton1" 
                                                type="button"
                                                data-bs-toggle="dropdown" 
                                                aria-expanded="false"
                                        >
                                                <i className="bi bi-three-dots"></i>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li>
                                                        <button 
                                                                type='button'
                                                                className="dropdown-item delete-item" 
                                                                onClick={() => setOpenDeleteComment(true)}
                                                        >
                                                                <i className="bi bi-trash-fill"></i>
                                                                Delete
                                                        </button>
                                                </li>
                                        </ul>
                                </div>
                        )}
                </div>
        </form>
        {openDeleteComment&&<DeleteComment comment={comment} onClose={()=>setOpenDeleteComment(true)} handleDeleteComment={handleDeleteComment}/>}
        </>)
}