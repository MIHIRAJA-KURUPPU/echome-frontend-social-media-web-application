import { useEffect, useState } from "react";
import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import axios from "axios";

export default function Feed() {
    const [Posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Use relative URL since proxy is set up in package.json
                const res = await axios.get("/api/posts/timeline/67136c0336be2d8647d81ff2");
                
                console.log("Response data:", res.data);
                
                if (Array.isArray(res.data)) {
                    setPosts(res.data);
                    console.log("Posts set in state:", res.data);
                } else {
                    console.warn("Unexpected response format:", res.data);
                    setPosts([]);  // Set empty array in case of unexpected response
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className='feed'>
            <div className="feedWrapper">
                <Share />
                {Posts.map((p) => (
                    // Use _id as the key instead of id
                    <Post key={p._id} post={p} />
                ))}
            </div>
        </div>
    );
}
