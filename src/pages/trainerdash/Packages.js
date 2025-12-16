import React, { useState, useEffect } from 'react';
import '../../styles/Packages.css';
import TrainerSidebar from '../../components/TrainerSidebar';
import TrainerNav from '../../components/TrainerNav';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [newRow, setNewRow] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editedPackage, setEditedPackage] = useState(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/packages');
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error('❌ Failed to fetch packages:', err);
      }
    };
    fetchPackages();
  }, []);

  const handleAddNewRow = () => {
    setNewRow({ name: '', type: '', price: '', duration: '' });
    setEditIndex(null);
    setMenuOpenIndex(null);
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditedPackage({ ...editedPackage, [name]: value });
    } else {
      setNewRow({ ...newRow, [name]: value });
    }
  };

  const handleSaveNew = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/packages/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (res.ok) {
        const saved = await res.json();
        setPackages(prev => [...prev, saved]);
        setNewRow(null);
        alert('✅ Package added successfully.');
      } else {
        alert('❌ Failed to add package.');
      }
    } catch (err) {
      alert('❌ Error while saving package.');
      console.error(err);
    }
  };

  const handleCancelNew = () => {
    setNewRow(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedPackage({ ...packages[index] });
    setNewRow(null);
    setMenuOpenIndex(null);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/packages/update/${editedPackage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedPackage),
      });

      if (res.ok) {
        const updated = await res.json();
        const updatedList = [...packages];
        updatedList[editIndex] = updated;
        setPackages(updatedList);
        setEditIndex(null);
        alert('✅ Package updated successfully.');
      } else {
        alert('❌ Failed to update package.');
      }
    } catch (err) {
      alert('❌ Error updating package.');
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedPackage(null);
  };

  const handleDelete = async (index) => {
    const pkg = packages[index];
    try {
      await fetch(`http://localhost:5000/api/packages/delete/${pkg._id}`, {
        method: 'DELETE',
      });
      setPackages(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('❌ Failed to delete package', err);
    }
  };

  const toggleMenu = (index) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  return (
    <div className="trainer-dash">
      <div className="background-overlay"></div>
      <TrainerSidebar />
      <div className="main-content">
        <TrainerNav />

        <div className="trainerpackages-container">
          <div className="packageprice-table-wrapper">
            <table className="packageprice-table">
              <thead>
                <tr>
                  <th>PACKAGE NAME</th>
                  <th>TYPE</th>
                  <th>PRICE</th>
                  <th>DURATION</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr key={index}>
                    {editIndex === index ? (
                      <>
                        <td><input name="name" value={editedPackage.name} onChange={(e) => handleChange(e, true)} /></td>
                        <td><input name="type" value={editedPackage.type} onChange={(e) => handleChange(e, true)} /></td>
                        <td><input name="price" value={editedPackage.price} onChange={(e) => handleChange(e, true)} /></td>
                        <td><input name="duration" value={editedPackage.duration} onChange={(e) => handleChange(e, true)} /></td>
                        <td>
                          <button className="packagepricesave-btn" onClick={handleSaveEdit}>Save</button>
                          <button className="packagepricecancel-btn" onClick={handleCancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{pkg.name}</td>
                        <td>{pkg.type}</td>
                        <td>{pkg.price}</td>
                        <td>{pkg.duration}</td>
                        <td className="packagepriceaction-cell">
                          <span className="packagepricedots" onClick={() => toggleMenu(index)}>⋮</span>
                          {menuOpenIndex === index && (
                            <div className="packagepricedropdown-menu">
                              <div onClick={() => handleEdit(index)}>Edit</div>
                              <div onClick={() => handleDelete(index)}>Delete</div>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {newRow && (
                  <tr>
                    <td><input name="name" value={newRow.name} onChange={handleChange} /></td>
                    <td><input name="type" value={newRow.type} onChange={handleChange} /></td>
                    <td><input name="price" value={newRow.price} onChange={handleChange} /></td>
                    <td><input name="duration" value={newRow.duration} onChange={handleChange} /></td>
                    <td>
                      <button onClick={handleSaveNew} className="packagepricesave-btn">Save</button>
                      <button onClick={handleCancelNew} className="packagepricecancel-btn">Cancel</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="add-packageprice-btn" onClick={handleAddNewRow}>+ Add Package</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;