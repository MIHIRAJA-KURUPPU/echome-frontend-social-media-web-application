import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import API from '../../api/axios';
import './search.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, activeTab]);

  const performSearch = async () => {
    setLoading(true);
    try {
      let endpoint = '/search';
      if (activeTab === 'users') endpoint = '/search/users';
      else if (activeTab === 'posts') endpoint = '/search/posts';
      
      const res = await API.get(`${endpoint}?q=${encodeURIComponent(query)}`);
      
      if (activeTab === 'all') {
        setResults({
          users: res.data.data.users.results || [],
          posts: res.data.data.posts.results || []
        });
      } else if (activeTab === 'users') {
        setResults({ users: res.data.data || [], posts: [] });
      } else if (activeTab === 'posts') {
        setResults({ users: [], posts: res.data.data || [] });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar />
      <div className="searchContainer">
        <Sidebar />
        <div className="searchMain">
          <div className="searchHeader">
            <h2>Search results for "{query}"</h2>
            <div className="searchTabs">
              <button
                className={activeTab === 'all' ? 'active' : ''}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
              <button
                className={activeTab === 'posts' ? 'active' : ''}
                onClick={() => setActiveTab('posts')}
              >
                Posts
              </button>
            </div>
          </div>

          {loading ? (
            <div className="searchLoading">Searching...</div>
          ) : (
            <div className="searchResults">
              {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                <div className="searchSection">
                  <h3>Users</h3>
                  {results.users.map(user => (
                    <div
                      key={user._id}
                      className="searchUserItem"
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      <img
                        src={user.profilePicture || '/assets/person/noAvatar.png'}
                        alt=""
                        className="searchUserImg"
                      />
                      <div className="searchUserInfo">
                        <span className="searchUserName">{user.username}</span>
                        {user.desc && <span className="searchUserDesc">{user.desc}</span>}
                        <span className="searchUserStats">
                          {user.followers?.length || 0} followers • {user.followings?.length || 0} following
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <div className="searchSection">
                  <h3>Posts</h3>
                  {results.posts.map(post => (
                    <div key={post._id} className="searchPostItem">
                      <div className="searchPostHeader">
                        <img
                          src={post.userId?.profilePicture || '/assets/person/noAvatar.png'}
                          alt=""
                          className="searchPostUserImg"
                        />
                        <div>
                          <span className="searchPostUsername">{post.userId?.username}</span>
                          <span className="searchPostDate">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="searchPostContent">{post.desc}</p>
                      {post.img && (
                        <img src={post.img} alt="" className="searchPostImg" />
                      )}
                      <div className="searchPostStats">
                        {post.likes?.length || 0} likes
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && results.users.length === 0 && results.posts.length === 0 && (
                <div className="searchEmpty">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
