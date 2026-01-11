import React, { useState, useContext, useEffect } from 'react';
import "./topbar.css";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import NotificationDropdown from '../notification/NotificationDropdown';

export default function Topbar() {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const res = await API.get('/notifications/unread');
                setNotificationsCount(res.data.count || 0);
            } catch (err) {
                // ignore
            }
        };
        fetchNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className ='topbarContainer'>
            <div className="topbarLeft">
                <Link to="/" style={{textDecoration:"none"}}>
                <span className="logo">Echo Me</span>
                </Link>
            </div> 
            <div className="topbarCenter">
                <div className="searchbar">
                    <SearchIcon className="searchIcon"/>
                    <input 
                  placeholder="Search for friend, post or video" 
                  className="searchInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                <span className="topbarLinks">Homepage</span>
                <span className="topbarLinks">Timeline</span>

            </div>    
            <div className="topbarIcons">
                <div className="topbarIconItem">
                    <PersonIcon/>
                    <span className="topbarIconBadge">1</span>
                </div>
                <div className="topbarIconItem">
                    <ChatIcon/>
                    <span className="topbarIconBadge">2</span>
                </div>
                <div className="topbarIconItem"
                     onClick={() => setShowNotifications(!showNotifications)} 
                     style={{cursor:'pointer'}}>
                    <NotificationsIcon/>
                    {notificationsCount > 0 && <span className="topbarIconBadge">{notificationsCount}</span>}
                </div>
            </div>
            <img src={user?.profilePicture || "/assets/person/1.jpg"} alt="" className="topbarImg"/>
            </div>

            <NotificationDropdown 
                show={showNotifications} 
                onClose={() => setShowNotifications(false)}
            />
        </div>
    )
}