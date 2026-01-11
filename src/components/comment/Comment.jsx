import React, { useState, useContext } from 'react';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export default function Comment({ postId, onAdded }) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!user) return alert('Please login to comment');
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await API.post('/comments', { post: postId, content: text });
      setText('');
      onAdded && onAdded();
    } catch (err) {
      console.error('Comment error', err);
      alert(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        style={{ flex: 1 }}
      />
      <button onClick={submit} disabled={submitting}>{submitting ? 'Posting...' : 'Post'}</button>
    </div>
  );
}
