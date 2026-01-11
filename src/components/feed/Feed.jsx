import { useEffect, useState, useContext } from "react";
import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await API.get(`/posts/timeline/${user.id}`);
                
                // Handle both old and new response formats
                const postsData = res.data.success !== undefined 
                    ? (Array.isArray(res.data) ? res.data : [])
                    : (Array.isArray(res.data) ? res.data : []);
                
                setPosts(postsData);
                setError(null);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setError(error.response?.data?.message || "Failed to load posts");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    return (
        <div className='feed'>
            <div className="feedWrapper">
                <Share />
                
                {loading && (
                    <div className="feedLoading">
                        <p>Loading posts...</p>
                    </div>
                )}
                
                {error && (
                    <div className="feedError">
                        <p>{error}</p>
                    </div>
                )}
                
                {!loading && !error && posts.length === 0 && (
                    <div className="feedEmpty">
                        <p>No posts yet. Start following people or create your first post!</p>
                    </div>
                )}
                
                {!loading && posts.map((p) => (
                    <Post key={p._id} post={p} />
                ))}
            </div>
        </div>
    );
}
