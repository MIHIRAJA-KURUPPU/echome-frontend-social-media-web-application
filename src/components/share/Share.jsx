import "./share.css";
import PermMedia from '@mui/icons-material/PermMedia';
import Label from '@mui/icons-material/Label';
import Room from '@mui/icons-material/Room';
import EmojiEmotions from '@mui/icons-material/EmojiEmotions';
import { useState, useContext } from 'react';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export default function Share() {
    const { user } = useContext(AuthContext);
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleShare = async () => {
        if (!user) return window.alert('Please login to create a post');
        if (!desc.trim() && !file) return window.alert('Please add some content to your post');

        try {
            let imgUrl = '';
            if (file) {
                setUploading(true);
                const form = new FormData();
                form.append('file', file);
                const res = await API.post('/upload/post', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                // Convert relative URL to absolute URL (without /api prefix)
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8800/api';
                const baseUrl = apiUrl.split('/api')[0];
                imgUrl = `${baseUrl}${res.data.data.url}`;
                console.log('Image uploaded, URL:', imgUrl);
                setUploading(false);
            }

            const payload = { userId: user.id, desc, img: imgUrl };
            const response = await API.post('/posts', payload);
            setDesc('');
            setFile(null);
            // Refresh the page to show the new post
            setTimeout(() => window.location.reload(), 500);
        } catch (err) {
            setUploading(false);
            console.error('Share error', err);
            alert(err.response?.data?.message || 'Failed to create post');
        }
    };

    return (
        <div className="share">
            <div className ="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={user?.profilePicture || '/assets/person/1.jpg'} alt="" />
                    <input
                      placeholder="What's in your mind? Share your thoughts!"
                      className="shareInput"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        <button className="shareCancelImg" onClick={() => setFile(null)}>✕</button>
                    </div>
                )}
                <div className="shareBottom">
                    <div className="shareOptions">
                        <label className="shareOption" htmlFor="file">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photo or Video</span>
                            <input
                              id="file"
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" onClick={handleShare} disabled={uploading}>{uploading ? 'Uploading...' : 'Share'}</button>
                </div>
        </div>
    </div>
    );
}