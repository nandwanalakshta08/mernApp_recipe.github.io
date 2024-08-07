import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar'; 
const Cuisine = () => {
  const [cuisines, setCuisines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCuisine, setCurrentCuisine] = useState(null);
  const [newCuisine, setNewCuisine] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: '', description: '' });  
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cuisines');
        setCuisines(response.data.cuisines);
      } catch (error) {
        console.error('Error fetching cuisines:', error);
      }
    };
    fetchCuisines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCuisine(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };


  const toggleIsActive = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await axios.put(`http://localhost:3000/api/cuisines/${id}`, { isActive: updatedStatus });
      setCuisines(cuisines.map(cuii =>
        cuii._id === id ? { ...cuii, isActive: updatedStatus } : cuii
      ));
      toast.success('Cuisine status updated successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error updating Cuisine status', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error updating cuisine status:', error);
    }
  };

  const validateFields = () => {
    const newErrors = {};
  if (!newCuisine.name) {newErrors.name = 'Name is required to be filled';}
  if (!newCuisine.description) {newErrors.description = 'Description is required to be filled';}
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const addOrUpdateCuisine = async () => {
    if(!validateFields()){
      return;
    }
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:3000/api/cuisines/${currentCuisine._id}`, newCuisine);
        setCuisines(cuisines.map(cuisine => (cuisine._id === currentCuisine._id ? response.data : cuisine)));
        toast.success('Cuisine updated successfully', {
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        const response = await axios.post('http://localhost:3000/api/cuisines', newCuisine);
        setCuisines([...cuisines, response.data]);
        toast.success('Cuisine added successfully', {
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error('Error saving cuisine', {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error saving cuisine:', error);
    }
    setShowModal(false);
    setNewCuisine({ name: '', description: '' });
    setIsEditing(false);
    setCurrentCuisine(null);
  };

  const handleEditClick = (cuisine) => {
    setNewCuisine({
      name: cuisine.name,
      description: cuisine.description,
    });
    setCurrentCuisine(cuisine);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => { 
    setDeleteId(id);
    setShowConfirmModal(true);
  };


  const confirmDelete = async () => { 
    try {
      await axios.delete(`http://localhost:3000/api/cuisines/${deleteId}`);
      setCuisines(cuisines.filter(cuii => cuii._id !== deleteId));
      toast.success('Cuisine deleted successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error deleting cuisine', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error deleting cuisine:', error);
    }
    setShowConfirmModal(false);
  };

  const cancelDelete = () => { 
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  const handleDeleteClick = async (id)=>{
    try {
      await axios.delete(`http://localhost:3000/api/cuisines/${id}`);
      setCuisines(cuisines.filter(cuisine => cuisine._id !== id));
      toast.success('Cuisine deleted successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error deleting cuisine', {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error deleting cuisine:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
        <h1>Cuisines</h1>
        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{ width: '200px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {isEditing ? 'Edit Cuisine' : 'Add Cuisine'}
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
            {cuisines.map(cuisine => (
              <tr key={cuisine._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cuisine.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cuisine.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => toggleIsActive(cuisine._id, cuisine.isActive)}
                    style={{
                      backgroundColor: cuisine.isActive ? 'green' : 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}>
                    {cuisine.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleEditClick(cuisine)}
                    style={{ color: 'white', border: 'none', borderRadius: '5px', width: '80px', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }} className='btn btn-info'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cuisine._id)}
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
              <h2 style={{ color: 'white',textAlign:'center' }}>{isEditing ? 'Edit Cuisine' : 'Add Cuisine'}</h2>
              <input
                type="text"
                name="name"
                value={newCuisine.name}
                onChange={handleInputChange}
                placeholder="Name"
                style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
              />
               {errors.name && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.name}</div>}
              <input
                type="text"
                name="description"
                value={newCuisine.description}
                onChange={handleInputChange}
                placeholder="Description"
                style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
              />
                {errors.description && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.description}</div>} 
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={addOrUpdateCuisine} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  {isEditing ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
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
                <button onClick={cancelDelete}  style={{ width: '100px', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
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
export default Cuisine;
