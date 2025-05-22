import { useState } from "react";
import { Link } from "react-router-dom";
import { Save, Users, Settings, ShieldCheck, Warehouse, Users2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./UserAccount.css";

const UserAccount = () => {
  // Mock user data - in a real app, this would come from an API or auth context
  const [isAdmin] = useState(true); // Set to true for mockup
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    discordUsername: "johndoe#1234"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    // In a real app, you'd have a toast notification system
    alert("Profile updated successfully!");
  };

  return (
    <div className="user-account-container">
      <div className="container">
        <div className="content-wrapper">
          {/* Left sidebar with admin functions if applicable */}
          <div className="sidebar">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Account</h2>
              </div>
              <div className="card-content2">
                <button className="ghost-button">
                  <Settings className="icon" />
                  Account Settings
                </button>
                
                {isAdmin && (
                  <>
                    <button className="ghost-button" onClick={() => navigate("/userManagement")}>
                      <Users className="icon" />
                      Manage Clients
                    </button>
                    
                    <button className="ghost-button" onClick={() => window.location.href = "/storage"}>
                      <Warehouse className="icon" />
                      Storage
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Main content - user profile */}
          <div className="main-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">User Profile</h2>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="discordUsername" className="form-label">Discord Username</label>
                  <div className="discord-input-container">
                    <div className="discord-icon">
                      <svg className="discord-svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"></path>
                      </svg>
                    </div>
                    <input
                      id="discordUsername"
                      value={userData.discordUsername}
                      onChange={handleChange}
                      className="discord-input"
                    />
                  </div>
                </div>
                
                <button 
                  className="primary-button"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;