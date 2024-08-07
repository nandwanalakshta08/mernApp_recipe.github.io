import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar'; 

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/allrecipe');
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error in recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  const deleteRecipe = async () => {
    if (recipeToDelete === null) return;
    try {
      const response = await axios.delete(`http://localhost:3000/api/deleterecipe/${recipeToDelete}`);
      setRecipes(recipes.filter(recipe => recipe._id !== recipeToDelete));

      if (response.data.message === "Recipe Deleted Successfully") {
        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.error("Recipe not found", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error('There was an error in deleting', {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error in deleting', error);
    }
    setShowModal(false);
    setRecipeToDelete(null);
  };

  const handleDeleteClick = (id) => {
    setRecipeToDelete(id);
    setShowModal(true);
  }

  const updateRecipeStatus = async (id, status) => {
    try {
      const response = await axios.post('http://localhost:3000/api/updatestatus', { id, status });
      setRecipes(recipes.map(recipe => recipe._id === id ? { ...recipe, status } : recipe));
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      toast.error('There was an error in updating status', {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error in updating status:', error);
    }
  };

  const handleAddRecipeClick = () => {
    navigate('/addrecipe');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> 
      <div style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}>
        <h1>All Recipes</h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button
            onClick={handleAddRecipeClick}
            style={{ width: '200px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            className="btn btn-primary mx-2"
          >
            Add Recipe
          </button>
        </div>
        {recipes.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '100px' }}>No Recipes To Show</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(recipe => (
                <tr key={recipe._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{recipe.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{recipe.category}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button
                      onClick={() => updateRecipeStatus(recipe._id, !recipe.status)}
                      style={{ backgroundColor: recipe.status ? 'green' : 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      {recipe.status ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <img src={`http://localhost:3000/${recipe.image}`} alt={recipe.title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <Link to={`/view/${recipe._id}`} style={{width:'70px', marginRight: '10px', textDecoration: 'none', color: 'white',marginBottom:'5px' }} className='btn btn-info mx-1'>View</Link>
                    <Link to={`/edit/${recipe._id}`} style={{width:'70px', marginRight: '10px', textDecoration: 'none', color: 'white',marginBottom:'5px' }} className='btn btn-primary mx-1'>Edit</Link>
                    <button className='btn btn-danger mx-1' onClick={() => handleDeleteClick(recipe._id)} style={{width:'70px', textDecoration: 'none', color: 'white', border: 'none', cursor: 'pointer',marginTop:'-5px' }} >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' }}>
              <p style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Are You Sure To DELETE This?</p>
              <button onClick={deleteRecipe} style={{ width: '100px', marginRight: '10px', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Yes</button>
              <button onClick={() => setShowModal(false)} style={{ width: '100px', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>No</button>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AllRecipes;

// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AllRecipes = () => {
//   const [recipes, setRecipes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRecipes = async () =>{
//       try {
//         const response = await axios.get('http://localhost:3000/api/allrecipe');
//         setRecipes(response.data.recipes);
//       } catch (error) {
//         console.error("Error fetching recipes:", error);
//       }
//     };

//   fetchRecipes();
//   }, []);

//   const deleteRecipe = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3000/api/deleterecipe${id}`);
//       setRecipes(recipes.filter(recipe => recipe._id !== id));
//     } catch (error) {
//       console.error("Error deleting recipe:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>All Recipes</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Category</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {recipes.map(recipe => (
//             <tr key={recipe._id}>
//               <td>{recipe.title}</td>
//               <td>{recipe.category}</td>
//               <td>
//                 <Link to={"/viewrecipe"}>View</Link>
//                 <Link to={'/editrecipe'}>Edit</Link>
//                 <button onClick={() => deleteRecipe(recipe._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AllRecipes;