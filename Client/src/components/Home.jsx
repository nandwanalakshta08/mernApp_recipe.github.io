import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from "react-icons/fa";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('name');
  const [difficulties, setDifficulties] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const recipesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDifficulties = async () => {
      try{
        const response = await axios.get('http://localhost:3000/api/difficulties');
        setDifficulties(response.data.difficulties);
      }catch (error){
        console.error('Error fetching difficulties:', error);
      }
    };
    fetchDifficulties();
  }, []);

  useEffect(() =>{
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data.categories);
      }catch (error){
        console.error('Error fetching categories:',error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() =>{
    const fetchCuisines = async () =>{
      try{
        const response = await axios.get('http://localhost:3000/api/cuisines');
        setCuisines(response.data.cuisines);
      }catch (error) {
        console.error('Error fetching cuisines:',error);
      }
    };
    fetchCuisines();
  }, []);
  
  const fetchAllRecipes = async () =>{
    try{
      const response = await axios.get('http://localhost:3000/api/getallrecipe', {
      });
      setRecipes(response.data.recipes);
      setTotalPages(Math.ceil(response.data.totalRecipes/recipesPerPage));
    }catch (error) {
      toast.error('There was an error fetching recipes', {
        position: 'top-center',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error fetching recipes:',error);
    }
  };
  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/getallrecipe', {
        params:{
          page: currentPage,limit: recipesPerPage,search: searchQuery,filter,
          difficulty: selectedDifficulty,category: selectedCategory,cuisine: selectedCuisine,
        },
      });
      setRecipes(response.data.recipes);
      setTotalPages(Math.ceil(response.data.totalRecipes/recipesPerPage));
    } catch (error){
      toast.error('There was an error fetching recipes', {
        position: 'top-center',
        autoClose: 1000,
        theme: 'dark',
        transition: Bounce,
      });
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = () =>{
    setCurrentPage(1); 
    fetchRecipes();
  };

  const handleReset = () =>{
    setSearchQuery('');
    setFilter('name');
    setSelectedDifficulty('');
    setSelectedCategory('');
    setSelectedCuisine('');
    setCurrentPage(1); 
    fetchAllRecipes();
   };

  useEffect(() =>{
    fetchRecipes();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewRecipe = (id) => {
    navigate(`/view/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleCuisineChange = (e) => {
    setSelectedCuisine(e.target.value);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '48px', color: 'white', marginBottom: '40px' }}>Our Best Recipes</h1>
       <div style={{ marginBottom: '20px' }}>
        <input  type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search recipes..." style={{padding: '10px', width: '200px', marginRight: '10px',outline:'none',borderRadius:'8px', }}/>
          <select value={filter} onChange={handleFilterChange} style={{padding: '10px', marginRight: '10px',outline:'none',borderRadius:'8px',}}>
            <option value="name">Recipe Name</option>
            <option value="ingredient">Ingredient Name</option>
          </select>
          <select value={selectedDifficulty} onChange={handleDifficultyChange} style={{ padding: '10px', marginRight: '10px',outline:'none',borderRadius:'8px',}}>
            <option value="">All Difficulties</option>
            {difficulties.map(difficulty => (
              <option key={difficulty._id} value={difficulty._id}>{difficulty.name}</option>
            ))}
          </select>
          <select value={selectedCategory} onChange={handleCategoryChange} style={{ padding: '10px', marginRight: '10px',outline:'none',borderRadius:'8px', }}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <select value={selectedCuisine} onChange={handleCuisineChange} style={{outline:'none',borderRadius:'8px', padding: '10px', marginRight: '10px' }}>
            <option value="">All Cuisines</option>
            {cuisines.map(cuisine => (
              <option key={cuisine._id} value={cuisine._id}>{cuisine.name}</option>
            ))}
          </select>
          <button onClick={handleSearch} style={{ padding: '10px', backgroundColor: '#1F2833', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',transition: 'background-color 0.3s ease' }}><FaSearch style={{ fontSize: '20px', marginRight: '5px' }} /></button>
          <button onClick={handleReset} style={{ padding: '10px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginLeft: '10px' }}>Reset</button>
        </div>
        
        {recipes.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '100px', color: '#777' }}>No Active Recipes</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {recipes.map(recipe => (
              <div key={recipe._id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff', transition: 'transform 0.3s ease' }}>
                {recipe.images && recipe.images.length > 0 ? (
                  <img src={`http://localhost:3000/${recipe.images[0]}`} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '15px', borderRadius: '8px' }} />
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>No image</p>
                )}
                <h2 style={{ fontSize: '28px', fontFamily: 'sans-serif, serif', marginBottom: '10px', color: '#1F2833', fontWeight: 'bold' }}>{recipe.title}</h2>
                <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Description: </strong>{recipe.description}</p>
                <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Difficulty: </strong>{recipe.difficulty ? recipe.difficulty.name : 'NA'}</p>
                <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Category: </strong>{recipe.category ? recipe.category.name : 'NA'}</p>
                <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Cuisine: </strong>{recipe.cuisine ? recipe.cuisine.name : 'NA'}</p>
                <button onClick={() => handleViewRecipe(recipe._id)} style={{ padding: '10px', backgroundColor: '#1F2833', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>View Recipe</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {pageNumbers.map(number => (
            <button key={number} onClick={() => handlePageChange(number)} style={{ padding: '8px',margin:'5px', backgroundColor: number === currentPage ? '#4CAF50' : '#1F2833', color: '#fff', border: number === currentPage ? '1px solid white' : 'none', borderRadius: '5px', cursor: 'pointer' }}>{number}</button>
          ))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;




//  <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>description:</strong>{recipe.description}</p>
//                 <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Difficulty:</strong>{recipe.difficulty.name}</p>
//                 <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Category:</strong>{recipe.category.name}</p>
//                 <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Cuisine:</strong>{recipe.cuisine.name}</p> 

// import React, { useEffect, useState } from 'react';
// import Navbar from './Navbar';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Home = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filter, setFilter] = useState('name'); 
//   const [difficulties, setDifficulties] = useState([]); // State for difficulties
//   const [selectedDifficulty, setSelectedDifficulty] = useState(''); // State for selected difficulty
//   const recipesPerPage = 5;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDifficulties = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/difficulties');
//         setDifficulties(response.data.difficulties);
//       } catch (error) {
//         console.error('Error fetching difficulties:', error);
//       }
//     };

//     fetchDifficulties();
//   }, []);

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/getallrecipe', {
//           params: {
//             page: currentPage,
//             limit: recipesPerPage,
//             search: searchQuery,
//             filter,
//             difficulty: selectedDifficulty, // Pass selected difficulty as a query parameter
//           },
//         });
//         setRecipes(response.data.recipes);
//         setTotalPages(Math.ceil(response.data.totalRecipes / recipesPerPage));
//       } catch (error) {
//         toast.error('There was an error fetching recipes', {
//           position: 'top-center',
//           autoClose: 1000,
//           theme: 'dark',
//           transition: Bounce,
//         });
//         console.error('Error fetching recipes:', error);
//       }
//     };
//     fetchRecipes();
//   }, [currentPage, searchQuery, filter, selectedDifficulty]);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleViewRecipe = (id) => {
//     navigate(`/view/${id}`);
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     setFilter(e.target.value);
//   };

//   const handleDifficultyChange = (e) => {
//     setSelectedDifficulty(e.target.value);
//   };

//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//         <h1 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '48px', color: 'white', marginBottom: '40px' }}>
//           Our Best Recipes
//         </h1>
        
//         <div style={{ marginBottom: '20px' }}>
//           <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search recipes..." style={{ padding: '10px', width: '200px', marginRight: '10px' }}/>
//           <select value={filter} onChange={handleFilterChange} style={{ padding: '10px', marginRight: '10px' }}>
//             <option value="name">Recipe Name</option>
//             <option value="ingredient">Ingredient Name</option>
//           </select>
//           <select value={selectedDifficulty} onChange={handleDifficultyChange} style={{ padding: '10px' }}>
//             <option value="">All Difficulties</option>
//             {difficulties.map(difficulty => (
//               <option key={difficulty._id} value={difficulty._id}>{difficulty.name}</option>
//             ))}
//           </select>
//         </div>
        
//         {recipes.length === 0 ? (
//           <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '100px', color: '#777' }}>No Active Recipes</p>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
//             {recipes.map(recipe => (
//               <div key={recipe._id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff', transition: 'transform 0.3s ease' }}>
//                 {recipe.images && recipe.images.length > 0 ? (
//                   <img src={`http://localhost:3000/${recipe.images[0]}`} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '15px', borderRadius: '8px' }} />
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#999' }}>No image</p>
//                 )}
//                 <h2 style={{ fontSize: '28px', fontFamily: 'sans-serif, serif', marginBottom: '10px', color: '#1F2833', fontWeight: 'bold' }}>{recipe.title}</h2>
//                 <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.5' }}><strong>Description:</strong> {recipe.description}</p>
//                 <p style={{ color: '#777' }}><strong>Category:</strong> {recipe.category ? recipe.category.name : 'NA'}</p>
//                 <p style={{ color: '#777' }}><strong>Difficulty:</strong> {recipe.difficulty ? recipe.difficulty.name : 'NA'}</p> 
//                 <button onClick={() => handleViewRecipe(recipe._id)} style={{ backgroundColor: '#1F2833', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', marginTop: '15px', transition: 'background-color 0.3s ease' }}
//                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0b3d91'}
//                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1F2833'}
//                 >View More</button>
//               </div>
//             ))}
//           </div>
//         )}
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           {pageNumbers.map(pageNumber => (
//             <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}
//               style={{ margin: '0 5px', padding: '10px 20px', backgroundColor: currentPage === pageNumber ? '#0b3d91' : '#1F2833', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//               {pageNumber}
//             </button>
//           ))}
//         </div>
//         <ToastContainer />
//       </div>
//     </>
//   );
// };

// export default Home;




// import React, { useEffect, useState } from 'react';
// import Navbar from './Navbar';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Home = () => {
//   const [recipes, setRecipes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/getallrecipe');
//         setRecipes(response.data);
//       } catch (error) {
//         toast.error('There was an error fetching recipes', {
//           position: 'top-center',
//           autoClose: 1000,
//           theme: 'dark',
//           transition: Bounce,
//         });
//         console.error('Error fetching recipes:', error);
//       }
//     };
//     fetchRecipes();
//   }, []);

//   const handleViewRecipe = (id) => {
//     navigate(`/view/${id}`);
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: '20px',maxWidth:'1200px',margin:'0 auto' }}>
//       <h1 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '48px', color: 'white', marginBottom: '40px' }}>Our Best Recipes</h1>
//         {recipes.length === 0 ? (
//           <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '100px',color:'#777' }}>No Active Recipes</p>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
//             {recipes.map(recipe => (
//               <div key={recipe._id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)',backgroundColor:'#fff',transition:'transform 0.3s ease' }}>
//                 {recipe.images && recipe.images.length > 0 ? (
//                   <img src={`http://localhost:3000/${recipe.images[0]}`} alt={recipe.title} style={{ width: '100%', height: '200px',objectFit:'cover',marginBottom:'15px',  borderRadius: '8px'}} />
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#999' }}>No image</p>
//                 )}
                
//                 <h2 style={{ fontSize: '28px',fontFamily:'san serif,serif', marginBottom: '10px',color:'#1F2833',fontWeight:'bold' }}>{recipe.title}</h2>
//                 <p style={{margin: '10px 0', color: '#555', lineHeight: '1.5'}}><strong>Description:</strong> {recipe.description}</p>
//                 <p style={{ color: '#777' }}><strong>Category:</strong>  {recipe.category ? recipe.category.name : 'NA'}</p>
//                 <button onClick={() => handleViewRecipe(recipe._id)} style={{backgroundColor: '#1F2833', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', marginTop: '15px', transition: 'background-color 0.3s ease' }}
//                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0b3d91'}
//                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1F2833'}>View More</button>
//               </div>
//             ))}
//           </div>
//         )}
//         <ToastContainer />
//       </div>
//     </>
//   );
// };

// export default Home;
