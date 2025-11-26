import './ItemPost.css'
import { useEffect, useState } from "react";
import Comment from "../Comment/Comment.jsx";
import ItemComment from "../ItemComment/ItemComment.jsx";
import EditPost from "../EditPost/EditPost.jsx"

import api from '#utils/api.js'
import DeletePost from '../DeletePost/DeletePost.jsx';
export default function ItemPost(props){
    const {key,user,post,comments,handleEditPost,handleDeletePost,handleComment,handleEditComment,handleDeleteComment} = props;
    const [openComment,setComment] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [avatar,setAvatar] = useState("");
    const [openEdit,setOpenEdit] = useState(false);
    const [openDelete,setOpenDelete] = useState(false);
    const [teacherEdit,setTeacherEdit] = useState(false);
    useEffect(()=>{
        if(user.accountId === post.accountId){
            setTeacherEdit(true);
        }
        setAvatar(user.avatar)
    },[])
    const visibleComments = showAll 
    ? comments 
    : comments.slice(-3);
    
    return( 
    <>
    
    {/* <form onSubmit={handleDelete}> */}
        <div className="item-post" id={`post-${post.id}`} key={key}>
        <div className="header-post">
                <div className='post-author-info'>
                    <img 
                        src={post.avatar || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-66.jpg"} 
                        className="post-avatar" 
                        alt="avatar"
                    />
                    <div className="post-author-details">
                        <h3 className="post-author-name">{post.name}</h3>
                        <span className="post-date">
                            <i className="bi bi-clock me-1"></i>
                            {post.createDate}
                        </span>
                    </div>
                </div>
                    {teacherEdit && (
                        <div className='post-dropdown dropdown'>
                            <button 
                                className='post-dropdown-toggle' 
                                id="dropdownMenu2" 
                                type="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <i className="bi bi-three-dots"></i>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <li>
                                    <button 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#exampleModal" 
                                        className="dropdown-item edit-item" 
                                        type='button' 
                                        onClick={() => setOpenEdit(true)}
                                    >
                                        <i className="bi bi-pencil-fill"></i>
                                        Edit
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button 
                                        className="dropdown-item delete-item" 
                                        type='button' 
                                        onClick={() => setOpenDelete(true)}
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
               
        </div>
        <div className="body-post">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        <div className="comment">
            {visibleComments.map((comment)=>(
                <ItemComment key={comment.id} user={user}post={post}comment={comment} handleEditComment={handleEditComment} handleDeleteComment={handleDeleteComment} />
            ))}
            {comments.length > 3 && (
            <button
              type="button"
              className="show-more-comments-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <i className="bi bi-chevron-up"></i>
                  Ẩn bớt bình luận
                </>
              ) : (
                <>
                  <i className="bi bi-chevron-down"></i>
                  Xem thêm {comments.length - 3} bình luận
                </>
              )}
            </button>
          )}
            {openComment && <Comment post={post} avatar = {avatar} handleComment={handleComment}/>}
        </div>
        </div>
    {/* </form> */}
     {openEdit&&<EditPost post = {post} setCloseEdit={()=>setOpenEdit(false)} handleEditPost={handleEditPost}/>}
     {openDelete&&<DeletePost post = {post} onClose={()=>setOpenDelete(false)} handleDeletePost={handleDeletePost}/>}   
    </>
    )
}