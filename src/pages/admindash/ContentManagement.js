import React, { useState } from "react";
import "../../styles/ContentManagement.css";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNav from "../../components/AdminNav";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ContentManagement = () => {
  const [pages, setPages] = useState([
    {
      id: 1,
      name: "Homepage",
      lastUpdated: "12-10-2024",
      status: "Published"
    },
    {
      id: 2,
      name: "Signup",
      lastUpdated: "12-10-2024",
      status: "Published"
    },
    {
      id: 3,
      name: "Logout",
      lastUpdated: "12-10-2024",
      status: "Published"
    },
    {
      id: 4,
      name: "Login",
      lastUpdated: "12-10-2024",
      status: "Published"
    },
    {
      id: 5,
      name: "Membership Plans",
      lastUpdated: "12-10-2024",
      status: "Published"
    },
    {
      id: 6,
      name: "Trainer Profiles",
      lastUpdated: "12-10-2024",
      status: "Published"
    },
    {
      id: 7,
      name: "Dashboard",
      lastUpdated: "12-10-2024",
      status: "Published"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [menuOpen, setMenuOpen] = useState(null);
  const navigate = useNavigate();

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPages = [...filteredPages].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date") return new Date(a.lastUpdated) - new Date(b.lastUpdated);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  const handleEditPage = (pageId) => {
    console.log("Editing page:", pageId);
  };

  const handleChangeStatus = (pageId, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "Unpublished" : "Published";
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, status: newStatus } : page
    ));
  };
  const handleDeletePage = (pageId) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      setPages(pages.filter(page => page.id !== pageId));
    }
  };

  return (
    <div className="admin-dash">
      <div className="background-overlay"></div>
      <AdminSidebar />
      <div className="main-content">
        <AdminNav />
        <div className="contentmanage-container">
          
          
          <div className="contentmanagetop-bar">
            <input 
              type="text" 
              placeholder="Search Page" 
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="contentmanagefilter-dropdown">
              <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">A-Z</option>
                <option value="date">Last Updated</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>


          <table className="contentmanagecontent-table">
            <thead>
              <tr>
                <th>PAGE NAME</th>
                <th>LAST UPDATED DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedPages.map((page) => (
                <tr key={page.id}>
                  <td>{page.name}</td>
                  <td>{page.lastUpdated}</td>
                  <td>
  <span className={`status ${page.status === "Published" ? "active" : "inactive"}`}>
    {page.status}
  </span>
</td>

                  <td>
                    <div className="contentmanageaction-menu">
                      <FaEllipsisV 
                        className="contentmanagemenu-icon" 
                        onClick={() => setMenuOpen(menuOpen === page.id ? null : page.id)}
                      />
                      {menuOpen === page.id && (
                        <div className="contentmanagedropdown-menu">
                          <button 
                            onClick={() => handleEditPage(page.id)} 
                            className="view"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleChangeStatus(page.id, page.status)} 
                            className="active"
                          >
                            {page.status === "Published" ? "Unpublish" : "Publish"}
                          </button>
                          <button 
                            onClick={() => handleDeletePage(page.id)} 
                            className="delete"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;