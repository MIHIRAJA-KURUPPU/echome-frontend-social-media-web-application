import "./post.css"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useState, useEffect, useContext} from "react";
import API from "../../api/axios";
import { AuthContext } from '../../context/AuthContext';
import Comment from '../comment/Comment';
import CommentList from '../comment/CommentList';

export default function Post({post}) {
    const [like,setLike]=useState(post.likes?.length || 0)
    const [isLiked,setIsLiked]=useState(post.likes?.includes?.(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '') || false)
    const [commentsCount, setCommentsCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER || '';
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCommentsCount = async () => {
            try {
                const res = await API.get(`/comments/post/${post._id}`);
                setCommentsCount(res.data.data?.length || 0);
            } catch (err) {
                // ignore
            }
        };
        fetchCommentsCount();
    }, [post._id]);

    const likeHandler=async()=>{
        if (!user) return alert('Please login to like posts');
        try {
            await API.put(`/posts/${post._id}/like`, { userId: user.id });
            setLike(isLiked ? like-1 : like+1);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error('Like error', err);
        }
    }

    const userProfileImg = post.user?.profilePicture || '/assets/person/1.jpg';
    const username = post.user?.username || 'Unknown';
    const date = new Date(post.createdAt).toLocaleString();

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img className="postProfileImg" src={userProfileImg} alt="" />
                        <span className="postUsername">{username}</span>
                        <span className="postDate">{date}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVertIcon />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    {post?.img && <img className="postImg" src={post.img} alt="" />}
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
                        <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                                                <span className="postCommentText" style={{cursor:'pointer'}} onClick={()=>setShowComments(!showComments)}>{commentsCount} comments </span>
                    </div>
                </div>
                                {showComments && (
                                    <div style={{ padding: 12 }}>
                                        <Comment postId={post._id} onAdded={() => setCommentsCount(c => c + 1)} />
                                        <CommentList postId={post._id} onAdded={(refetch)=>refetch && refetch()} />
                                    </div>
                                )}
            </div>
        </div>
    );
}
