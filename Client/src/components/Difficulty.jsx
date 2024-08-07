import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

const Difficulty = () => {
  const [difficulties, setDifficulties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(null);
  const [newDifficulty, setNewDifficulty] = useState({ name: '', description: '', isActive: true });
  const [errors, setErrors] = useState({ name: '', description: '' }); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDifficulties();
  }, []);

  const fetchDifficulties = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/difficulties');
      setDifficulties(response.data.difficulties);
    } catch (error) {
      console.error('Error fetching difficulties:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDifficulty(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleIsActive = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await axios.put(`http://localhost:3000/api/difficulties/${id}`, { isActive: updatedStatus });
      setDifficulties(difficulties.map(diff =>
        diff._id === id ? { ...diff, isActive: updatedStatus } : diff
      ));
      toast.success('Difficulty status updated successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error updating difficulty status', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error updating difficulty status:', error);
    }
  };

  const validateFields = () => {
    const newErrors = {};
  if (!newDifficulty.name) {newErrors.name = 'Name is required to be filled';}
  if (!newDifficulty.description) {newErrors.description = 'Description is required to be filled';}
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOrUpdateDifficulty = async () => {
    if(!validateFields()){
      return;
    }
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:3000/api/difficulties/${currentDifficulty._id}`, newDifficulty);
        setDifficulties(difficulties.map(diff => (diff._id === currentDifficulty._id ? response.data.updateDifficulty : diff)));
        toast.success('Difficulty updated successfully', {
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        const response = await axios.post('http://localhost:3000/api/difficulties', newDifficulty);
        setDifficulties([...difficulties, response.data]);
        toast.success('Difficulty added successfully', {
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error('Error saving difficulty', {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error saving difficulty:', error);
    }
    setShowModal(false);
    setNewDifficulty({ name: '', description: '', isActive: true });
    setIsEditing(false);
    setCurrentDifficulty(null);
  };

  const handleEditClick = (difficulty) => {
    setNewDifficulty({
      name: difficulty.name,
      description: difficulty.description,
      isActive: difficulty.isActive,
    });
    setCurrentDifficulty(difficulty);
    setIsEditing(true);
    setShowModal(true);
  };


  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };
  

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/difficulties/${deleteId}`);
      setDifficulties(difficulties.filter(diff => diff._id !== deleteId));
      toast.success('Difficulty deleted successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error deleting difficulty', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error deleting difficulty:', error);
    }
    setShowConfirmModal(false);
  };
  const cancelDelete = () => { 
    setShowConfirmModal(false);
    setDeleteId(null);
  };


  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/difficulties/${id}`);
      setDifficulties(difficulties.filter(diff => diff._id !== id));
      toast.success('Difficulty deleted successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error deleting difficulty', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error deleting difficulty:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
        <h1>Difficulty</h1>
        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{ width: '200px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {isEditing ? 'Edit Difficulty' : 'Add Difficulty'}
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {difficulties.map(difficulty => (
              <tr key={difficulty._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{difficulty.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{difficulty.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => toggleIsActive(difficulty._id, difficulty.isActive)}
                    style={{
                      backgroundColor: difficulty.isActive ? 'green' : 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}>
                    {difficulty.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleEditClick(difficulty)}
                    style={{ color: 'white', border: 'none', borderRadius: '5px', width: '80px', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }} className='btn btn-info'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(difficulty._id)}
                    style={{ color: 'white', border: 'none', borderRadius: '5px', width: '80px', padding: '5px 10px', cursor: 'pointer' }} className='btn btn-danger'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
            <div style={{ backgroundColor: '#2C3539', padding: '20px', borderRadius: '10px', width: '800px',height:'700px' }}>
              <h2 style={{ color: 'white', textAlign: 'center' }}>{isEditing ? 'Edit Difficulty' : 'Add Difficulty'}</h2>
              <input
                type="text"
                name="name"
                value={newDifficulty.name}
                onChange={handleInputChange}
                placeholder="Name"
                style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              {errors.name && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.name}</div>}
              <input
                type="text"
                name="description"
                value={newDifficulty.description}
                onChange={handleInputChange}
                placeholder="Description"
                style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
              />
               {errors.description && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.description}</div>} 
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={addOrUpdateDifficulty} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  {isEditing ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => { setShowModal(false); setIsEditing(false); setNewDifficulty({ name: '', description: '', isActive: true }); }}
                  style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
         {showConfirmModal && ( 
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' }}>
            <p style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Are You Sure To DELETE This?</p>
              <div style={{ marginTop: '20px' }}>
                <button onClick={confirmDelete} style={{ width: '100px', marginRight: '10px', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Yes
                </button>
                <button onClick={cancelDelete} style={{ width: '100px', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Difficulty;
