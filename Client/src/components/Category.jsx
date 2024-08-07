import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: '', description: '' }); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };


  const toggleIsActive = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await axios.put(`http://localhost:3000/api/categories/${id}`, { isActive: updatedStatus });
      setCategories(categories.map(cat =>
        cat._id === id ? { ...cat, isActive: updatedStatus } : cat
      ));
      toast.success('category status updated successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error updating category status', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error updating category status:', error);
    }
  };

  const validateFields = () => {
    const newErrors = {};
  if (!newCategory.name) {newErrors.name = 'Name is required to be filled';}
  if (!newCategory.description) {newErrors.description = 'Description is required to be filled';}
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const addOrUpdateCategory = async () => {
    if(!validateFields()){
      return;
    }
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:3000/api/categories/${currentCategory._id}`, newCategory);
        setCategories(categories.map(cat => (cat._id === currentCategory._id ? response.data : cat)));
        toast.success('Category updated successfully', {
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        const response = await axios.post('http://localhost:3000/api/categories', newCategory);
        setCategories([...categories, response.data]);
        toast.success('Category added successfully', {
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error('Error saving category', {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error saving category:', error);
    }
    setShowModal(false);
    setNewCategory({ name: '', description: '' });
    setIsEditing(false);
    setCurrentCategory(null);
  };

  const handleEditClick = (category) => {
    setNewCategory({
      name: category.name,
      description: category.description,
    });
    setCurrentCategory(category);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => { 
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => { 
    try {
      await axios.delete(`http://localhost:3000/api/categories/${deleteId}`);
      setCategories(categories.filter(cat => cat._id !== deleteId));
      toast.success('Category deleted successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error deleting category', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error deleting category:', error);
    }
    setShowConfirmModal(false);
  };

  const cancelDelete = () => { 
    setShowConfirmModal(false);
    setDeleteId(null);
  };



  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      toast.success('Category deleted successfully', {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Error deleting category', {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
      <h1>Category</h1>
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ width: '200px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isEditing ? 'Edit Category' : 'Add Category'}
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
          {categories.map(category => (
            <tr key={category._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{category.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{category.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => toggleIsActive(category._id, category.isActive)}
                  style={{ backgroundColor: category.isActive ? 'green' : 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer'}}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => handleEditClick(category)}
           style={{ color: 'white', border: 'none', borderRadius: '5px', width: '80px', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }} className='btn btn-info'>
                  Edit
                </button>
                <button onClick={() => handleDelete(category._id)} style={{ color: 'white', border: 'none', borderRadius: '5px', width: '80px', padding: '5px 10px', cursor: 'pointer' }} className='btn btn-danger'>
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
            <h2 style={{ color: 'white',textAlign:'center' }}>{isEditing ? 'Edit Category' : 'Add Category'}</h2>
            <input type="text" name="name" value={newCategory.name} onChange={handleInputChange} placeholder="Name" style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}/>
             {errors.name && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.name}</div>}
            <input type="text" name="description" value={newCategory.description} onChange={handleInputChange} placeholder="Description" style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}/>
                {errors.description && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.description}</div>} 
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={addOrUpdateCategory} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {isEditing ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setShowModal(false)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
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
                <button onClick={confirmDelete}  style={{ width: '100px', marginRight: '10px', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
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
export default Category;
