import { useState } from "react";
import { 
  Save, 
  Users, 
  Settings, 
  ShieldCheck, 
  Warehouse, 
  User,
  Package,
  Shield,
  Eye,
  Lock
} from "lucide-react";
import "./userAccount.css";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
  const navigate = useNavigate();
  const [isAdmin] = useState(true); 
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    discordUsername: "johndoe#1234"
  });

  const [userOrders] = useState([
    { id: 1, date: "2025-05-20", status: "Delivered", total: "$45.99", product: "Coach Lol" },
    { id: 2, date: "2025-05-15", status: "Processing", total: "$129.99", product: "Duo Boost" },
    { id: 3, date: "2025-05-10", status: "Shipped", total: "$89.99", product: "League Account" },
  ]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  const menuItems = [
    { id: 'profile', label: 'Account Settings', icon: Settings, adminOnly: false },
    { id: 'orders', label: 'My Orders', icon: Package, adminOnly: false },
    { id: 'security', label: 'Access & Security', icon: Shield, adminOnly: false },
    { id: 'clients', label: 'Manage Clients', icon: Users, adminOnly: true },
    { id: 'storage', label: 'Storage', icon: Warehouse, adminOnly: true },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
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
        );

      case 'orders':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">My Orders</h2>
            </div>
            <div className="card-content">
              <div className="orders-list">
                {userOrders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className="order-id">Order #{order.id}</span>
                      <span className={`order-status status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <p className="order-product">{order.product}</p>
                      <div className="order-meta">
                        <span className="order-date">{order.date}</span>
                        <span className="order-total">{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Access & Security</h2>
            </div>
            <div className="card-content">
              <div className="security-section">
                <h3 className="section-title">Password</h3>
                <p className="section-description">Change your password to keep your account secure</p>
                <button className="secondary-button">
                  <Lock className="button-icon" />
                  Change Password
                </button>
              </div>
              
              <div className="security-section">
                <h3 className="section-title">Two-Factor Authentication</h3>
                <p className="section-description">Add an extra layer of security to your account</p>
                <button className="secondary-button">
                  <Shield className="button-icon" />
                  Enable 2FA
                </button>
              </div>
              
              <div className="security-section">
                <h3 className="section-title">Login Activity</h3>
                <p className="section-description">Review recent login attempts</p>
                <button className="secondary-button">
                  <Eye className="button-icon" />
                  View Activity
                </button>
              </div>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Manage Clients</h2>
            </div>
            <div className="card-content">
              <p className="admin-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam neque qui error corrupti deleniti excepturi libero perspiciatis assumenda accusantium fugit. Eum quisquam animi asperiores perspiciatis pariatur saepe nostrum repellat est!</p>
              <button className="primary-button" onClick={() => navigate('/userManagement')}>
                <Users className="button-icon" />
                View All Clients
              </button>
            </div>
          </div>
        );

      case 'storage':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Storage Control</h2>
            </div>
            <div className="card-content">
              <p className="admin-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam neque qui error corrupti deleniti excepturi libero perspiciatis assumenda accusantium fugit. Eum quisquam animi asperiores perspiciatis pariatur saepe nostrum repellat est!</p>
              <button className="primary-button" onClick={() => navigate('/storage')}>
                <Warehouse className="button-icon" />
                Manage Storage
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="user-account-container">
      <div className="container">
        <div className="content-wrapper">
          <div className="sidebar">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Account</h2>
              </div>
              <div className="card-content2">
                {menuItems.map(item => {
                  const IconComponent = item.icon;
                  if (item.adminOnly && !isAdmin) {
                    return null;
                  }
                  
                  return (
                    <button
                      key={item.id}
                      className={`menu-button ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <IconComponent className="menu-icon" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="main-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;