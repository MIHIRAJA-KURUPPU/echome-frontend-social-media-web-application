import React, { useEffect, useState, useContext } from 'react';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export default function CommentList({ postId, onAdded }) {
  const [comments, setComments] = useState([]);
  const { user } = useContext(AuthContext);

  const fetch = async () => {
    try {
      const res = await API.get(`/comments/post/${postId}`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error('Fetch comments', err);
    }
  };

  useEffect(() => { fetch(); }, [postId]);

  useEffect(() => { if (onAdded) onAdded(fetch); }, [onAdded]);

  const remove = async (id) => {
    if (!user) return alert('Login required');
    try {
      await API.delete(`/comments/${id}`);
      setComments((c) => c.filter(x => x._id !== id));
    } catch (err) {
      console.error('Delete comment', err);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      {comments.map(c => (
        <div key={c._id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <img src={c.author?.profilePicture || '/assets/person/1.jpg'} alt="" style={{ width: 32, height: 32, borderRadius: 16 }} />
            <div style={{ flex: 1 }}>
              <strong>{c.author?.username || 'Unknown'}</strong>
              <div>{c.content}</div>
            </div>
            {user && user.id === (c.author?._id || c.author) && (
              <button onClick={() => remove(c._id)}>Delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
