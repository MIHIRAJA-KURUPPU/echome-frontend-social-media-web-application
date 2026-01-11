import "./online.css";

export default function Online({user}) {
  const PF =process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="rightbarFriend">
    <div className="rightbarFriendImgContainer">
        <img className="rightbarProfileImg" src={PF+user.profilePicture} alt="profile" />
        <span className="rightbarOnline"></span>  {/* Green circle */}
    </div>
    <span className="rightbarUsername">{user.username}</span>
</li>
  )
}
