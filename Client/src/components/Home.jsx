import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getallrecipe');
        setRecipes(response.data);
      } catch (error) {
        toast.error('There was an error fetching recipes', {
          position: 'top-center',
          autoClose: 1000,
          theme: 'dark',
          transition: Bounce,
        });
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleViewRecipe = (id) => {
    navigate(`/view/${id}`);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Recipes</h1>
        {recipes.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '100px' }}>No Active Recipes</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {recipes.map(recipe => (
              <div key={recipe._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                <img src={`http://localhost:3000/${recipe.image}`} alt={recipe.title} style={{ width: '300px', height: '300px',  borderRadius: '8px'}} />
                <h2 style={{ fontSize: '20px', marginTop: '10px', flex: '1' }}>{recipe.title}</h2>
                <p style={{ margin: '10px 0', flex: '1' }}>{recipe.description}</p>
                <p><strong>Category:</strong> {recipe.category}</p>
                <button onClick={() => handleViewRecipe(recipe._id)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer', marginTop: '10px' }}>View</button>
              </div>
            ))}
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Home;
