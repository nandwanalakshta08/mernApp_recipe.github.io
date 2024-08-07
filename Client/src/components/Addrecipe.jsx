import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    totalTime: '',
    servings: '',
    category: '',
    cuisine: '',
    difficulty: '',
    notes: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: [{ step: '', description: '' }],
    nutrition: { calories: '', fat: '', carbohydrates: '', protein: '' },
    author: { name: '', profileUrl: '' },
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [difficulties, setDifficulties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    const fetchDifficulties = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/difficulties');
        setDifficulties(response.data.difficulties);
      } catch (error) {
        console.error('Failed to fetch difficulties', error);
      }
    };
    fetchDifficulties();
  }, []);

    
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

   
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cuisines');
        setCuisines(response.data.cuisines);
      } catch (error) {
        console.error('Failed to fetch cuisines', error);
      }
    };
    fetchCuisines();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    if (nameParts.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        [nameParts[0]]: {
          ...prevData[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleIngredientChange = (index, event) => {
    const values = [...formData.ingredients];
    values[index][event.target.name] = event.target.value;
    setFormData((prevData) => ({ ...prevData, ingredients: values }));
    setErrors((prev) => ({ ...prev, [`ingredient${event.target.name}${index}`]: '' }));
  };

  const handleInstructionChange = (index, event) => {
    const values = [...formData.instructions];
    values[index][event.target.name] = event.target.value;
    setFormData((prevData) => ({ ...prevData, instructions: values }));
    setErrors((prev) => ({ ...prev, [`instructionDescription${index}`]: '' }));
  };

  const addIngredient = () => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.push({ name: '', quantity: '', unit: '' });
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const deleteIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = [...formData.ingredients];
      updatedIngredients.splice(index, 1);
      setFormData({ ...formData, ingredients: updatedIngredients });
    }
  };

  const addInstruction = () => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions.push({ step: updatedInstructions.length + 1, description: '' });
    setFormData({ ...formData, instructions: updatedInstructions });
  };

  const deleteInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const updatedInstructions = [...formData.instructions];
      updatedInstructions.splice(index, 1);
      updatedInstructions.forEach((instruction, i) => {
        instruction.step = i + 1;
      });
      setFormData({ ...formData, instructions: updatedInstructions });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.prepTime) newErrors.prepTime = 'Prep time is required';
    if (!formData.cookTime) newErrors.cookTime = 'Cook time is required';
    if (!formData.totalTime) newErrors.totalTime = 'Total time is required';
    if (!formData.servings) newErrors.servings = 'Servings are required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.cuisine) newErrors.cuisine = 'Cuisine is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!formData.notes) newErrors.notes = 'Notes are required';
    if (!image) newErrors.image = 'Image is required';
    if (!formData.author.name) newErrors['author.name'] = 'Author name is required';
    if (!formData.author.profileUrl) newErrors['author.profileUrl'] = 'Author profile URL is required';
    if (!formData.nutrition.calories) newErrors['nutrition.calories'] = 'Calories are required';
    if (!formData.nutrition.fat) newErrors['nutrition.fat'] = 'Fat is required';
    if (!formData.nutrition.carbohydrates) newErrors['nutrition.carbohydrates'] = 'Carbohydrates are required';
    if (!formData.nutrition.protein) newErrors['nutrition.protein'] = 'Protein is required';

    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name) newErrors[`ingredientname${index}`] = 'Ingredient name is required';
      if (!ingredient.quantity) newErrors[`ingredientquantity${index}`] = 'Ingredient quantity is required';
      if (!ingredient.unit) newErrors[`ingredientunit${index}`] = 'Ingredient unit is required';
    });

    formData.instructions.forEach((instruction, index) => {
      if (!instruction.description) newErrors[`instructionDescription${index}`] = 'Instruction description is required';
      if (!instruction.step) newErrors[`instructionstep${index}`] = 'Instruction step is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formDataWithImage = new FormData();
    for (const key in formData) {
      if (key === 'ingredients' || key === 'instructions' || key === 'nutrition' || key === 'author') {
        formDataWithImage.append(key, JSON.stringify(formData[key]));
      } else {
        formDataWithImage.append(key, formData[key]);
      }
    }
    formDataWithImage.append('image', image);

    try {
      const response = await axios.post('http://localhost:3000/api/addrecipe', formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      console.log('response :>> ', response);

      if (response.status === 201) {
        console.log('response.status :>> ', response.status);
        toast.success("recipe add suceessfully", {
        // onClose: () => navigate('/home'),
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
        setTimeout(()=>{

          navigate('/home')
        },3000)
      } else {
        console.log('=error=', response.message);
        toast.error("Failed to Add Recipe!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log('=error=', error.message);
      toast.error("Failed to Add Recipe!", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div style={{ maxWidth: '700px', marginTop: '20px', marginLeft: '410px', padding: '20px', backgroundColor: '#2C3539', borderRadius: '8px', border: '2px solid white' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Add Recipe</h1>
     
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.title && <div style={{ color: 'red' }}>{errors.title}</div>}
        </div>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
          {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
        </div>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Prep Time:</label>
          <input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.prepTime && <div style={{ color: 'red' }}>{errors.prepTime}</div>}
        </div>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cook Time:</label>
          <input type="text" name="cookTime" value={formData.cookTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.cookTime && <div style={{ color: 'red' }}>{errors.cookTime}</div>}
        </div>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Total Time:</label>
          <input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.totalTime && <div style={{ color: 'red' }}>{errors.totalTime}</div>}
        </div>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Servings:</label>
          <input type="number" name="servings" value={formData.servings} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.servings && <div style={{ color: 'red' }}>{errors.servings}</div>}
        </div>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}>
            <option value="">Select Category</option>
            {categories.filter(category => category.isActive).map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
        </div>

      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cuisine:</label>
          <select id="cuisine" name="cuisine" value={formData.cuisine} onChange={handleChange}  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}>
            <option value="">Select Cuisine</option>
            {cuisines.filter(cuisine => cuisine.isActive).map((cuisine) => (
              <option key={cuisine._id} value={cuisine._id}>
                {cuisine.name}
              </option>
            ))}
          </select>
          {errors.cuisine && <div style={{ color: 'red' }}>{errors.cuisine}</div>}
        </div>

       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Difficulty:</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} >
            <option value="">Select Difficulty</option>
            {difficulties.filter(difficulty => difficulty.isActive).map((difficulty) => (
              <option key={difficulty._id} value={difficulty._id}>
                {difficulty.name}
              </option>
            ))}
          </select>
          {errors.difficulty && <div style={{ color: 'red' }}>{errors.difficulty}</div>}
        </div>
      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Notes:</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
          {errors.notes && <div style={{ color: 'red' }}>{errors.notes}</div>}
        </div>
      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Name:</label>
          <input type="text" name="author.name" value={formData.author.name} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors['author.name'] && <div style={{ color: 'red' }}>{errors['author.name']}</div>}
        </div>
      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Profile URL:</label>
          <input type="text" name="author.profileUrl" value={formData.author.profileUrl} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors['author.profileUrl'] && <div style={{ color: 'red' }}>{errors['author.profileUrl']}</div>}
        </div>
      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Calories:</label>
          <input type="number" name="nutrition.calories" value={formData.nutrition.calories} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors['nutrition.calories'] && <div style={{ color: 'red' }}>{errors['nutrition.calories']}</div>}
        </div>
      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Fat:</label>
          <input type="number" name="nutrition.fat" value={formData.nutrition.fat} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors['nutrition.fat'] && <div style={{ color: 'red' }}>{errors['nutrition.fat']}</div>}
        </div>
      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Carbohydrates:</label>
          <input type="number" name="nutrition.carbohydrates" value={formData.nutrition.carbohydrates} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors['nutrition.carbohydrates'] && <div style={{ color: 'red' }}>{errors['nutrition.carbohydrates']}</div>}
        </div>
    
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Protein:</label>
          <input type="number" name="nutrition.protein" value={formData.nutrition.protein} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors['nutrition.protein'] && <div style={{ color: 'red' }}>{errors['nutrition.protein']}</div>}
        </div>
      
        <div style={{ marginBottom: '15px' }}>
  <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Ingredients:</label>
  {formData.ingredients.map((ingredient, index) => (
    <div key={index} style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <input  type="text"  name="name"  placeholder="Name"  value={ingredient.name}  onChange={(event) => handleIngredientChange(index, event)}  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors[`ingredientname${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientname${index}`]}</div>}
        </div>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <input  type="number"  name="quantity"  placeholder="Quantity"  value={ingredient.quantity}  onChange={(event) => handleIngredientChange(index, event)} 
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors[`ingredientquantity${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientquantity${index}`]}</div>}
        </div>
        <div style={{ flex: 1 }}>
          <input  type="text"  name="unit"  placeholder="Unit"  value={ingredient.unit}  onChange={(event) => handleIngredientChange(index, event)} 
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors[`ingredientunit${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientunit${index}`]}</div>}
        </div>
        {index > 0 && (
          <button   type="button"  onClick={() => deleteIngredient(index)}  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
          Delete
          </button>
        )}
      </div>
    </div>
  ))}
  <button type="button"  onClick={addIngredient} 
 style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }}
  >
    Add Ingredient
  </button>
</div>

<div style={{ marginBottom: '15px' }}>
        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Instructions:</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input  type="text" name="step" placeholder="Step" value={instruction.step} onChange={(event) => handleInstructionChange(index, event)}
                style={{ flex: 1, marginRight: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}/>
              {index > 0 && (
                <button type="button" onClick={() => deleteInstruction(index)}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white' }}>
                  Delete
                </button>
              )}
            </div>
            {errors[`instructionstep${index}`] && <div style={{ color: 'red', marginBottom: '10px' }}>{errors[`instructionstep${index}`]}</div>}
            <div style={{ marginBottom: '10px' }}>
              <textarea name="description" placeholder="Description" value={instruction.description} onChange={(event) => handleInstructionChange(index, event)}
             style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}/>
              {errors[`instructiondescription${index}`] && <div style={{ color: 'red' }}>{errors[`instructiondescription${index}`]}</div>}
            </div>
          </div>
        ))}
        <button
          type="button" onClick={addInstruction} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }} >
          Add Instruction
        </button>
      </div>


        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Images:</label>
          <input type="file" name="images" onChange={handleImageChange} multiple style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.images && <div style={{ color: 'red' }}>{errors.images}</div>}
        </div>
      
        <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddRecipe;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AddRecipe = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     prepTime: '',
//     cookTime: '',
//     totalTime: '',
//     servings: '',
//     category: '',
//     cuisine: '',
//     difficulty: '',
//     notes: '',
//     image: null,
//     ingredients: [],
//     instructions: [],
//     nutrition: [],
//     author: {
//       name: '',
//       email: '',
//       bio: ''
//     }
//   });

//   const [errors, setErrors] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [cuisines, setCuisines] = useState([]);
//   const [difficulties, setDifficulties] = useState([]);

//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       try {
//         const [categoryRes, cuisineRes, difficultyRes] = await Promise.all([
//           axios.get('/api/categories'),
//           axios.get('/api/cuisines'),
//           axios.get('/api/difficulties')
//         ]);
//         setCategories(categoryRes.data);
//         setCuisines(cuisineRes.data);
//         setDifficulties(difficultyRes.data);
//       } catch (error) {
//         console.error('Error fetching dropdown data:', error);
//       }
//     };

//     fetchDropdownData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleImageChange = (e) => {
//     setFormData({
//       ...formData,
//       image: e.target.files[0]
//     });
//   };

//   const handleIngredientChange = (index, e) => {
//     const { name, value } = e.target;
//     const ingredients = [...formData.ingredients];
//     ingredients[index][name] = value;
//     setFormData({ ...formData, ingredients });
//   };

//   const addIngredient = () => {
//     setFormData({
//       ...formData,
//       ingredients: [...formData.ingredients, { name: '', quantity: '', unit: '' }]
//     });
//   };

//   const deleteIngredient = (index) => {
//     const ingredients = [...formData.ingredients];
//     ingredients.splice(index, 1);
//     setFormData({ ...formData, ingredients });
//   };

//   const handleInstructionChange = (index, e) => {
//     const { name, value } = e.target;
//     const instructions = [...formData.instructions];
//     instructions[index][name] = value;
//     setFormData({ ...formData, instructions });
//   };

//   const addInstruction = () => {
//     setFormData({
//       ...formData,
//       instructions: [...formData.instructions, { step: formData.instructions.length + 1, description: '' }]
//     });
//   };

//   const deleteInstruction = (index) => {
//     const instructions = [...formData.instructions];
//     instructions.splice(index, 1);
//     setFormData({ ...formData, instructions });
//   };

//   const handleNutritionChange = (index, e) => {
//     const { name, value } = e.target;
//     const nutrition = [...formData.nutrition];
//     nutrition[index][name] = value;
//     setFormData({ ...formData, nutrition });
//   };

//   const addNutrition = () => {
//     setFormData({
//       ...formData,
//       nutrition: [...formData.nutrition, { name: '', quantity: '', unit: '' }]
//     });
//   };

//   const deleteNutrition = (index) => {
//     const nutrition = [...formData.nutrition];
//     nutrition.splice(index, 1);
//     setFormData({ ...formData, nutrition });
//   };

//   const handleAuthorChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       author: {
//         ...formData.author,
//         [name]: value
//       }
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title) newErrors.title = 'Title is required';
//     if (!formData.description) newErrors.description = 'Description is required';
//     if (!formData.prepTime) newErrors.prepTime = 'Preparation Time is required';
//     if (!formData.cookTime) newErrors.cookTime = 'Cooking Time is required';
//     if (!formData.totalTime) newErrors.totalTime = 'Total Time is required';
//     if (!formData.servings) newErrors.servings = 'Servings are required';
//     if (!formData.category) newErrors.category = 'Category is required';
//     if (!formData.cuisine) newErrors.cuisine = 'Cuisine is required';
//     if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
//     if (!formData.image) newErrors.image = 'Image is required';
//     if (formData.ingredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';
//     if (formData.instructions.length === 0) newErrors.instructions = 'At least one instruction is required';
//     if (formData.nutrition.length === 0) newErrors.nutrition = 'At least one nutrition information is required';
//     if (!formData.author.name || !formData.author.email) newErrors.author = 'Author information is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const formDataToSend = new FormData();
//     for (const key in formData) {
//       if (key === 'image') {
//         formDataToSend.append(key, formData[key]);
//       } else if (key === 'ingredients' || key === 'instructions' || key === 'nutrition') {
//         formDataToSend.append(key, JSON.stringify(formData[key]));
//       } else if (key === 'author') {
//         formDataToSend.append(key, JSON.stringify(formData[key]));
//       } else {
//         formDataToSend.append(key, formData[key]);
//       }
//     }

//     try {
//       await axios.post('/api/recipes', formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       navigate('/home');
//     } catch (error) {
//       console.error('Error submitting the form:', error);
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
//       <h2>Add Recipe</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Title Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//           {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
//         </div>

//         {/* Description Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//           {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
//         </div>

//         {/* Image Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Image:</label>
//           <input
//             type="file"
//             name="image"
//             onChange={handleImageChange}
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//           {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
//         </div>

//         {/* Ingredients Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Ingredients:</label>
//           {formData.ingredients.map((ingredient, index) => (
//             <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
//               <input
//                 type="text"
//                 name="name"
//                 value={ingredient.name}
//                 onChange={(e) => handleIngredientChange(index, e)}
//                 placeholder="Name"
//                 style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//               />
//               <input
//                 type="text"
//                 name="quantity"
//                 value={ingredient.quantity}
//                 onChange={(e) => handleIngredientChange(index, e)}
//                 placeholder="Quantity"
//                 style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//               />
//               <input
//                 type="text"
//                 name="unit"
//                 value={ingredient.unit}
//                 onChange={(e) => handleIngredientChange(index, e)}
//                 placeholder="Unit"
//                 style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//               />
//               <button type="button" onClick={() => deleteIngredient(index)} style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
//                 Delete
//               </button>
//             </div>
//           ))}
//           <button type="button" onClick={addIngredient} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
//             Add Ingredient
//           </button>
//           {errors.ingredients && <span style={{ color: 'red' }}>{errors.ingredients}</span>}
//         </div>

//         {/* Instructions Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Instructions:</label>
//           {formData.instructions.map((instruction, index) => (
//             <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
//               <input
//                 type="text"
//                 name="description"
//                 value={instruction.description}
//                 onChange={(e) => handleInstructionChange(index, e)}
//                 placeholder="Description"
//                 style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//               />
//               <button type="button" onClick={() => deleteInstruction(index)} style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
//                 Delete
//               </button>
//             </div>
//           ))}
//           <button type="button" onClick={addInstruction} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
//             Add Instruction
//           </button>
//           {errors.instructions && <span style={{ color: 'red' }}>{errors.instructions}</span>}
//         </div>

//         {/* Nutrition Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Nutrition:</label>
//           {formData.nutrition.map((nutrition, index) => (
//             <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
//               <input
//                 type="text"
//                 name="name"
//                 value={nutrition.name}
//                 onChange={(e) => handleNutritionChange(index, e)}
//                 placeholder="Name"
//                 style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//               />
//               <input
//                 type="text"
//                 name="quantity"
//                 value={nutrition.quantity}
//                 onChange={(e) => handleNutritionChange(index, e)}
//                 placeholder="Quantity"
//                 style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//               />
//               <input
//                 type="text"
//                 name="unit"
//                 value={nutrition.unit}
//                 onChange={(e) => handleNutritionChange(index, e)}
//                 placeholder="Unit"
//                 style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//               />
//               <button type="button" onClick={() => deleteNutrition(index)} style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
//                 Delete
//               </button>
//             </div>
//           ))}
//           <button type="button" onClick={addNutrition} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
//             Add Nutrition
//           </button>
//           {errors.nutrition && <span style={{ color: 'red' }}>{errors.nutrition}</span>}
//         </div>

//         {/* Author Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author:</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.author.name}
//             onChange={handleAuthorChange}
//             placeholder="Name"
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.author.email}
//             onChange={handleAuthorChange}
//             placeholder="Email"
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
//           />
//           <textarea
//             name="bio"
//             value={formData.author.bio}
//             onChange={handleAuthorChange}
//             placeholder="Bio"
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//           {errors.author && <span style={{ color: 'red' }}>{errors.author}</span>}
//         </div>

//         {/* Category Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           >
//             <option value="">Select Category</option>
//             {categories.map((category) => (
//               <option key={category._id} value={category._id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//           {errors.category && <span style={{ color: 'red' }}>{errors.category}</span>}
//         </div>

//         {/* Cuisine Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cuisine:</label>
//           <select
//             name="cuisine"
//             value={formData.cuisine}
//             onChange={handleChange}
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           >
//             <option value="">Select Cuisine</option>
//             {cuisines.map((cuisine) => (
//               <option key={cuisine._id} value={cuisine._id}>
//                 {cuisine.name}
//               </option>
//             ))}
//           </select>
//           {errors.cuisine && <span style={{ color: 'red' }}>{errors.cuisine}</span>}
//         </div>

//         {/* Difficulty Field */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Difficulty:</label>
//           <select
//             name="difficulty"
//             value={formData.difficulty}
//             onChange={handleChange}
//             style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           >
//             <option value="">Select Difficulty</option>
//             {difficulties.map((difficulty) => (
//               <option key={difficulty._id} value={difficulty._id}>
//                 {difficulty.name}
//               </option>
//             ))}
//           </select>
//           {errors.difficulty && <span style={{ color: 'red' }}>{errors.difficulty}</span>}
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '4px' }}>
//             Submit Recipe
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddRecipe;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AddRecipe = () => {
//   const [formData, setFormData] = useState({ title: '', description: '', prepTime: '', cookTime: '', totalTime: '', servings: '', category: '', cuisine: '', difficulty: '',
//     notes: '', ingredients: '', instructions: '', nutrition: '', author: ''});
//   const [image, setImage] = useState(null);
//   const [difficulties, setDifficulties] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cuisines, setCuisines] = useState([]);

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
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/categories');
//         setCategories(response.data.categories);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);


//   useEffect(() => {
//     const fetchCuisines = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/cuisines');
//         setCuisines(response.data.cuisines);
//       } catch (error) {
//         console.error('Error fetching cuisines:', error);
//       }
//     };
//     fetchCuisines();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({...formData, [e.target.name]: e.target.value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const form = new FormData(); 
//     for (const key in formData) {
//       form.append(key, formData[key]);
//     }
//     if (image) {
//       form.append('image', image);
//     }

//     try {
//       const response = await axios.post('http://localhost:3000/api/recipes', form, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log(response.data);
//     } catch (error) {
//       console.error(error.response.data);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
//       <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
//       <input type="text" name="prepTime" placeholder="Prep Time" onChange={handleChange} required />
//       <input type="text" name="cookTime" placeholder="Cook Time" onChange={handleChange} required />
//       <input type="text" name="totalTime" placeholder="Total Time" onChange={handleChange} required />
//       <input type="number" name="servings" placeholder="Servings" onChange={handleChange} required />
 
//       <select name="category" value={formData.category} onChange={handleChange} required>
//         <option value="">Select Category</option>
//         {categories.map(cat => (
//           <option key={cat._id} value={cat.name}>{cat.name}</option>
//         ))}
//       </select>

//       <select name="cuisine" value={formData.cuisine} onChange={handleChange} required>
//         <option value="">Select Cuisine</option>
//         {cuisines.map(cuisine => (
//           <option key={cuisine._id} value={cuisine.name}>{cuisine.name}</option>
//         ))}
//       </select>
   
//       <select name="difficulty" value={formData.difficulty} onChange={handleChange} required>
//         <option value="">Select Difficulty</option>
//         {difficulties.map(diff => (
//        <option key={diff._id} value={diff.name}>{diff.name}</option>
//         ))}
//       </select>
      
//       <textarea name="notes" placeholder="Notes" onChange={handleChange} required></textarea>
//       <textarea name="ingredients" placeholder="Ingredients" onChange={handleChange} required></textarea>
//       <textarea name="instructions" placeholder="Instructions" onChange={handleChange} required></textarea>
//       <textarea name="nutrition" placeholder="Nutrition" onChange={handleChange} required></textarea>
//       <textarea name="author" placeholder="Author" onChange={handleChange} required></textarea>
//       <input type="file" name="image" onChange={handleFileChange} required />
//       <button type="submit">Add Recipe</button>
//     </form>
//   );
// };

// export default AddRecipe;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddRecipe = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     prepTime: '',
//     cookTime: '',
//     totalTime: '',
//     servings: '',
//     category: '',
//     cuisine: '',
//     difficulty: '',
//     notes: '',
//     ingredients: [{ name: '', quantity: '', unit: '' }],
//     instructions: [{ step: '', description: '' }],
//     nutrition: { calories: '', fat: '', carbohydrates: '', protein: '' },
//     author: { name: '', profileUrl: '' },
//   });
//   const [image, setImage] = useState(null);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const nameParts = name.split('.');
//     if (nameParts.length === 2) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [nameParts[0]]: {
//           ...prevData[nameParts[0]],
//           [nameParts[1]]: value,
//         },
//       }));
//     } else {
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
//     }
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleIngredientChange = (index, event) => {
//     const values = [...formData.ingredients];
//     values[index][event.target.name] = event.target.value;
//     setFormData((prevData) => ({ ...prevData, ingredients: values }));
//     setErrors((prev) => ({ ...prev, [`ingredient${event.target.name}${index}`]: '' }));
//   };

//   const handleInstructionChange = (index, event) => {
//     const values = [...formData.instructions];
//     values[index][event.target.name] = event.target.value;
//     setFormData((prevData) => ({ ...prevData, instructions: values }));
//     setErrors((prev) => ({ ...prev, [`instructionDescription${index}`]: '' }));
//   };

//   const addIngredient = () => {
//     const updatedIngredients = [...formData.ingredients];
//     updatedIngredients.push({ name: '', quantity: '', unit: '' });
//     setFormData({ ...formData, ingredients: updatedIngredients });
//   };

//   const deleteIngredient = (index) => {
//     if (formData.ingredients.length > 1) {
//       const updatedIngredients = [...formData.ingredients];
//       updatedIngredients.splice(index, 1);
//       setFormData({ ...formData, ingredients: updatedIngredients });
//     }
//   };

//   const addInstruction = () => {
//     const updatedInstructions = [...formData.instructions];
//     updatedInstructions.push({ step: updatedInstructions.length + 1, description: '' });
//     setFormData({ ...formData, instructions: updatedInstructions });
//   };

//   const deleteInstruction = (index) => {
//     if (formData.instructions.length > 1) {
//       const updatedInstructions = [...formData.instructions];
//       updatedInstructions.splice(index, 1);
//       updatedInstructions.forEach((instruction, i) => {
//         instruction.step = i + 1;
//       });
//       setFormData({ ...formData, instructions: updatedInstructions });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title) newErrors.title = 'Title is required';
//     if (!formData.description) newErrors.description = 'Description is required';
//     if (!formData.prepTime) newErrors.prepTime = 'Prep time is required';
//     if (!formData.cookTime) newErrors.cookTime = 'Cook time is required';
//     if (!formData.totalTime) newErrors.totalTime = 'Total time is required';
//     if (!formData.servings) newErrors.servings = 'Servings are required';
//     if (!formData.category) newErrors.category = 'Category is required';
//     if (!formData.cuisine) newErrors.cuisine = 'Cuisine is required';
//     if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
//     if (!formData.notes) newErrors.notes = 'Notes are required';
//     if (!image) newErrors.image = 'Image is required';
//     if (!formData.author.name) newErrors['author.name'] = 'Author name is required';
//     if (!formData.author.profileUrl) newErrors['author.profileUrl'] = 'Author profile URL is required';
//     if (!formData.nutrition.calories) newErrors['nutrition.calories'] = 'Calories are required';
//     if (!formData.nutrition.fat) newErrors['nutrition.fat'] = 'Fat is required';
//     if (!formData.nutrition.carbohydrates) newErrors['nutrition.carbohydrates'] = 'Carbohydrates are required';
//     if (!formData.nutrition.protein) newErrors['nutrition.protein'] = 'Protein is required';

//     formData.ingredients.forEach((ingredient, index) => {
//       if (!ingredient.name) newErrors[`ingredientname${index}`] = 'Ingredient name is required';
//       if (!ingredient.quantity) newErrors[`ingredientquantity${index}`] = 'Ingredient quantity is required';
//       if (!ingredient.unit) newErrors[`ingredientunit${index}`] = 'Ingredient unit is required';
//     });

//     formData.instructions.forEach((instruction, index) => {
//       if (!instruction.description) newErrors[`instructionDescription${index}`] = 'Instruction description is required';
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!validateForm()) return;

//     const formDataWithImage = new FormData();
//     for (const key in formData) {
//       if (key === 'ingredients' || key === 'instructions' || key === 'nutrition' || key === 'author') {
//         formDataWithImage.append(key, JSON.stringify(formData[key]));
//       } else {
//         formDataWithImage.append(key, formData[key]);
//       }
//     }
//     formDataWithImage.append('image', image);

//     try {
//       const response = await axios.post('http://localhost:3000/api/addrecipe', formDataWithImage, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });

//       if (response.data.message === "Recipe Created Successfully!") {
//         toast.success(response.data.message, {
//           onClose: () => navigate('/home'),
//           position: "top-right",
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });
//       } else {
//         console.log('=error=', response.message);
//         toast.error("Failed to Add Recipe!", {
//           position: "top-right",
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });
//       }
//     } catch (error) {
//       console.log('=error=', error.message);
//       toast.error("Failed to Add Recipe!", {
//         position: "top-right",
//         autoClose: 1000,
//         theme: "dark",
//         transition: Bounce,
//       });
//     }
//   };

//   return (
//     <div style={{ maxWidth: '700px', marginTop: '20px', marginLeft: '410px', padding: '20px', backgroundColor: '#2C3539', borderRadius: '8px', border: '2px solid white' }}>
//       <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Add Recipe</h1>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
//           <input type="text" name="title" value={formData.title} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.title && <div style={{ color: 'red' }}>{errors.title}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
//           <textarea name="description" value={formData.description} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
//           {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Prep Time:</label>
//           <input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.prepTime && <div style={{ color: 'red' }}>{errors.prepTime}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cook Time:</label>
//           <input type="text" name="cookTime" value={formData.cookTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.cookTime && <div style={{ color: 'red' }}>{errors.cookTime}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Total Time:</label>
//           <input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.totalTime && <div style={{ color: 'red' }}>{errors.totalTime}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Servings:</label>
//           <input type="number" name="servings" value={formData.servings} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.servings && <div style={{ color: 'red' }}>{errors.servings}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
//           <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cuisine:</label>
//           <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.cuisine && <div style={{ color: 'red' }}>{errors.cuisine}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Difficulty:</label>
//           <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}>
//             <option value="">Select Difficulty</option>
//             <option value="Easy">Easy</option>
//             <option value="Medium">Medium</option>
//             <option value="Hard">Hard</option>
//           </select>
//           {errors.difficulty && <div style={{ color: 'red' }}>{errors.difficulty}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Notes:</label>
//           <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
//           {errors.notes && <div style={{ color: 'red' }}>{errors.notes}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Name:</label>
//           <input type="text" name="author.name" value={formData.author.name} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors['author.name'] && <div style={{ color: 'red' }}>{errors['author.name']}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Profile URL:</label>
//           <input type="text" name="author.profileUrl" value={formData.author.profileUrl} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors['author.profileUrl'] && <div style={{ color: 'red' }}>{errors['author.profileUrl']}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Calories:</label>
//           <input type="number" name="nutrition.calories" value={formData.nutrition.calories} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors['nutrition.calories'] && <div style={{ color: 'red' }}>{errors['nutrition.calories']}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Fat:</label>
//           <input type="number" name="nutrition.fat" value={formData.nutrition.fat} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors['nutrition.fat'] && <div style={{ color: 'red' }}>{errors['nutrition.fat']}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Carbohydrates:</label>
//           <input type="number" name="nutrition.carbohydrates" value={formData.nutrition.carbohydrates} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors['nutrition.carbohydrates'] && <div style={{ color: 'red' }}>{errors['nutrition.carbohydrates']}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Protein:</label>
//           <input type="number" name="nutrition.protein" value={formData.nutrition.protein} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors['nutrition.protein'] && <div style={{ color: 'red' }}>{errors['nutrition.protein']}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//   <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Ingredients:</label>
//   {formData.ingredients.map((ingredient, index) => (
//     <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
//       <input type="text" name="name" placeholder="Name" value={ingredient.name} onChange={(event) => handleIngredientChange(index, event)} style={{ flex: 1, marginRight: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
//       <input type="number" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={(event) => handleIngredientChange(index, event)} style={{ flex: 1, marginRight: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
//       <input type="text" name="unit" placeholder="Unit" value={ingredient.unit} onChange={(event) => handleIngredientChange(index, event)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
//       {index > 0 && <button type="button" onClick={() => deleteIngredient(index)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white' }}>Delete</button>}
//       {errors[`ingredientname${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientname${index}`]}</div>}
//       {errors[`ingredientquantity${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientquantity${index}`]}</div>}
//       {errors[`ingredientunit${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientunit${index}`]}</div>}
//     </div>
//   ))}
//   <button type="button" onClick={addIngredient} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }}>Add Ingredient</button>
// </div>

// <div style={{ marginBottom: '15px' }}>
//   <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Instructions:</label>
//   {formData.instructions.map((instruction, index) => (
//     <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
//       <input 
//         type="text" 
//         name="step" 
//         placeholder="Step" 
//         value={instruction.step} 
//         onChange={(event) => handleInstructionChange(index, event)} 
//         style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
//       />
//       <textarea 
//         name="description" 
//         placeholder="Description" 
//         value={instruction.description} 
//         onChange={(event) => handleInstructionChange(index, event)} 
//         style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
//       />
//       {index > 0 && <button type="button" onClick={() => deleteInstruction(index)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white' }}>Delete</button>}
//       {errors[`instructionstep${index}`] && <div style={{ color: 'red' }}>{errors[`instructionstep${index}`]}</div>}
//       {errors[`instructiondescription${index}`] && <div style={{ color: 'red' }}>{errors[`instructiondescription${index}`]}</div>}
//     </div>
//   ))}
//   <button type="button" onClick={addInstruction} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }}>Add Instruction</button>
// </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Images:</label>
//           <input type="file" name="images" onChange={handleImageChange} multiple style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.images && <div style={{ color: 'red' }}>{errors.images}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
//           <input type="checkbox" name="status" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.status && <div style={{ color: 'red' }}>{errors.status}</div>}
//         </div>
//         <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Submit</button>
//       </form>
//     </div>
//   );
// };

// export default AddRecipe;





/*
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({title: '',description: '',ingredients: [{ name: '', quantity: '', unit: '' }],instructions: [{ step: 1, description: '' }],prepTime: '',cookTime: '',totalTime: '',servings: '',category: '',cuisine: '',difficulty: '',notes: '',nutrition: { calories: '', fat: '', carbohydrates: '', protein: '' },image: '',author: { name: '', profileUrl: '' }});
  const [errors, setErrors] = useState({});

  const handleChange =(e)=>{
    const {name,value} = e.target;
    const nameParts = name.split('.');
    if (nameParts.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        [nameParts[0]]: {
          ...prevData[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    } else {
      setFormData((prevData)=>({ ...prevData, [name]: value }));
    }
    setErrors((prev)=>({ ...prev, [name]: '' }));
  };

  const handleIngredientChange = (index, event) => {
    const values = [...formData.ingredients];
    values[index][event.target.name] = event.target.value;
    setFormData((prevData) => ({ ...prevData, ingredients: values }));
    setErrors((prev) => ({ ...prev, [`ingredient${event.target.name}${index}`]: '' }));
  };

  const handleInstructionChange = (index, event) => {
    const values = [...formData.instructions];
    values[index][event.target.name] = event.target.value;
    setFormData((prevData) => ({ ...prevData, instructions: values }));
    setErrors((prev) => ({ ...prev, [`instructionDescription${index}`]: '' }));
  };

  const addIngredient = ()=>{
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.push({name:'',quantity:'',unit:''});
    setFormData({...formData,ingredients: updatedIngredients});
  }


  const deleteIngredient = (index) => {
    if(formData.ingredients.length > 1){
       const updatedIngredients = [...formData.ingredients];
      updatedIngredients.splice(index, 1);
      setFormData({ ...formData, ingredients: updatedIngredients });
    }

  };
  
  const addInstruction = () => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions.push({ step: updatedInstructions.length + 1, description: '' });
    setFormData({ ...formData, instructions: updatedInstructions });
  };
  
  const deleteInstruction = (index) => {
    if(formData.instructions.length > 1){
      const updatedInstructions = [...formData.instructions];
      updatedInstructions.splice(index, 1);
      updatedInstructions.forEach((instruction, i) => {
        instruction.step = i + 1;
      });
    }
    setFormData({ ...formData, instructions: updatedInstructions });
  };
  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.prepTime) newErrors.prepTime = 'Prep time is required';
    if (!formData.cookTime) newErrors.cookTime = 'Cook time is required';
    if (!formData.totalTime) newErrors.totalTime = 'Total time is required';
    if (!formData.servings) newErrors.servings = 'Servings are required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.cuisine) newErrors.cuisine = 'Cuisine is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!formData.notes) newErrors.notes = 'Notes are required';
    if (!formData.image) newErrors.image = 'Image URL is required';
    if (!formData.author.name) newErrors['author.name'] = 'Author name is required';
    if (!formData.author.profileUrl) newErrors['author.profileUrl'] = 'Author profile URL is required';
    if (!formData.nutrition.calories) newErrors['nutrition.calories'] = 'Calories are required';
    if (!formData.nutrition.fat) newErrors['nutrition.fat'] = 'Fat is required';
    if (!formData.nutrition.carbohydrates) newErrors['nutrition.carbohydrates'] = 'Carbohydrates are required';
    if (!formData.nutrition.protein) newErrors['nutrition.protein'] = 'Protein is required';

    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name) newErrors[`ingredientname${index}`] = 'Ingredient name is required';
      if (!ingredient.quantity) newErrors[`ingredientquantity${index}`] = 'Ingredient quantity is required';
      if (!ingredient.unit) newErrors[`ingredientunit${index}`] = 'Ingredient unit is required';
    });

    formData.instructions.forEach((instruction, index) => {
      if (!instruction.description) newErrors[`instructionDescription${index}`] = 'Instruction description is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/addrecipe', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.data.message === "Recipe Created Successfully!") {
        toast.success(response.data.message, {
          onClose: () => navigate('/home'),
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        console.log('=error=',response.message)
        toast.error("Failed to Add Recipe!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log('=error=',error.message)
      toast.error("Failed to Add Recipe!", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div style={{ maxWidth: '700px', marginTop: '20px', marginLeft: '410px', padding: '20px', backgroundColor: '#2C3539', borderRadius: '8px', border: '2px solid white' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Add Recipe</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.title && <div style={{ color: 'red' }}>{errors.title}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
          {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Prep Time:</label>
          <input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.prepTime && <div style={{ color: 'red' }}>{errors.prepTime}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cook Time:</label>
          <input type="text" name="cookTime" value={formData.cookTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.cookTime && <div style={{ color: 'red' }}>{errors.cookTime}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Total Time:</label>
          <input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.totalTime && <div style={{ color: 'red' }}>{errors.totalTime}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Servings:</label>
          <input type="text" name="servings" value={formData.servings} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.servings && <div style={{ color: 'red' }}>{errors.servings}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cuisine:</label>
          <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.cuisine && <div style={{ color: 'red' }}>{errors.cuisine}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Difficulty:</label>
          <input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.difficulty && <div style={{ color: 'red' }}>{errors.difficulty}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Notes:</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
          {errors.notes && <div style={{ color: 'red' }}>{errors.notes}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ marginBottom: '10px' }}>Nutrition:</h3>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="nutrition.calories" placeholder="Calories" value={formData.nutrition.calories} onChange={handleChange} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            {errors['nutrition.calories'] && <div style={{ color: 'red' }}>{errors['nutrition.calories']}</div>}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="nutrition.fat" placeholder="Fat" value={formData.nutrition.fat} onChange={handleChange} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            {errors['nutrition.fat'] && <div style={{ color: 'red' }}>{errors['nutrition.fat']}</div>}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="nutrition.carbohydrates" placeholder="Carbohydrates" value={formData.nutrition.carbohydrates} onChange={handleChange} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            {errors['nutrition.carbohydrates'] && <div style={{ color: 'red' }}>{errors['nutrition.carbohydrates']}</div>}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="nutrition.protein" placeholder="Protein" value={formData.nutrition.protein} onChange={handleChange} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            {errors['nutrition.protein'] && <div style={{ color: 'red' }}>{errors['nutrition.protein']}</div>}
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Image:</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
          {errors.image && <div style={{ color: 'red' }}>{errors.image}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ marginBottom: '10px' }}>Author:</h3>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="author.name" placeholder="Name" value={formData.author.name} onChange={handleChange} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            {errors['author.name'] && <div style={{ color: 'red' }}>{errors['author.name']}</div>}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="author.profileUrl" placeholder="Profile URL" value={formData.author.profileUrl} onChange={handleChange} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            {errors['author.profileUrl'] && <div style={{ color: 'red' }}>{errors['author.profileUrl']}</div>}
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ marginBottom: '10px' }}>Ingredients:</h3>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input type="text" name="name" placeholder="Name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
              {errors[`ingredientname${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientname${index}`]}</div>}
              <input type="text" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
              {errors[`ingredientquantity${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientquantity${index}`]}</div>}
              <input type="text" name="unit" placeholder="Unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
              {errors[`ingredientunit${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientunit${index}`]}</div>}
              <button type="button" onClick={() => deleteIngredient(index)} style={{  width:'130px',padding: '5px 10px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} style={{  width:'130px',padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Ingredient</button>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ marginBottom: '10px' }}>Instructions:</h3>
          {formData.instructions.map((instruction, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input type="number" name="step" placeholder="Step" value={instruction.step} onChange={(e) => handleInstructionChange(index, e)} readOnly style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
              <textarea name="description" placeholder="Description" value={instruction.description} onChange={(e) => handleInstructionChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '60px' }} />
              {errors[`instructionDescription${index}`] && <div style={{ color: 'red' }}>{errors[`instructionDescription${index}`]}</div>}
              <button type="button" onClick={() => deleteInstruction(index)} style={{width:'130px', padding: '5px 10px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
          <button type="button" onClick={addInstruction} style={{ width:'130px',padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Instruction</button>
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>Add Recipe</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddRecipe;

*/


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddRecipe = () => {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
//   const [instructions, setInstructions] = useState([{ step: 1, description: '' }]);
//   const [image, setImage] = useState('');
//   const [errors, setErrors] = useState({});

// const handleIngredientChange = (index, event) => {
//     const values = [...ingredients];
//     values[index][event.target.name] = event.target.value;
//     setIngredients(values);
//     setErrors(prev=> ({...prev,[`ingredient${event.target.name}${index}`]:''}));
//   };

// const handleInstructionChange = (index, event) => {
//     const values = [...instructions];
//     values[index][event.target.name] = event.target.value;
//     setInstructions(values);
//     setErrors(prev=> ({...prev,[`instructionDescription${index}`]:''}));
//   };

// const handleChange= (e) =>{
//     const { name, value } =e.target;
//     if (name==='title')setTitle(value);
//     if (name==='description')setDescription(value);
//     if (name==='image')setImage(value);
//     setErrors(prev => ({ ...prev, [name]: '' }));
//   };

// const addIngredient =()=>{
//     setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
//   };

// const addInstruction =()=>{
//     setInstructions([...instructions, { step: instructions.length + 1, description: '' }]);
//   };

// const validateForm =()=>{
//     const newErrors = {};
//     if (!title) newErrors.title='Title is required';
//     if (!description) newErrors.description='Description is required';
//     if (!image) newErrors.image='Image URL is required';
//     ingredients.forEach((ingredient,index) => {
//       if (!ingredient.name) newErrors[`ingredientname${index}`]='Ingredient name is required';
//       if (!ingredient.quantity) newErrors[`ingredientquantity${index}`]='Ingredient quantity is required';
//       if (!ingredient.unit) newErrors[`ingredientunit${index}`]='Ingredient unit is required';
//     });
//     instructions.forEach((instruction, index) =>{
//       if (!instruction.description) newErrors[`instructionDescription${index}`]='Instruction description is required';
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length ===0;
//   };

// const handleSubmit = async (event) =>{
//     event.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const response = await axios.post('http://localhost:3000/api/addrecipe', {title, description, ingredients, instructions, image}, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });
//     if (response.data.message === "Recipe Created Successfully!") {
//         toast.success(response.data.message, {
//           onClose: () => navigate('/home'),
//           position: "top-right",
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });
//       }else{
//         toast.error("Failed to Add Recipe!", {
//           position: "top-right",
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });
//       }
//     }catch(error){
//       toast.error("Failed to Add Recipe!", {
//         position: "top-right",
//         autoClose: 1000,
//         theme: "dark",
//         transition: Bounce,
//       });
//     }
//   };

//   return (
//     <div style={{ maxWidth: '700px', marginTop: '20px', marginLeft: '410px', padding: '20px', backgroundColor: '#2C3539', borderRadius: '8px', border: '2px solid white' }}>
//       <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Add Recipe</h1>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
//           <input type="text" name="title" value={title} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.title && <div style={{ color: 'red' }}>{errors.title}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
//           <textarea name="description" value={description} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
//           {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Image URL:</label>
//           <input type="text" name="image" value={image} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//           {errors.image && <div style={{ color: 'red' }}>{errors.image}</div>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <h3 style={{ marginBottom: '10px' }}>Ingredients</h3>
//           {ingredients.map((ingredient, index) => (
//             <div key={index} style={{ marginBottom: '10px' }}>
//               <input type="text" name="name" placeholder="Name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//               {errors[`ingredientname${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientname${index}`]}</div>}
//               <input type="text" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//               {errors[`ingredientquantity${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientquantity${index}`]}</div>}
//               <input type="text" name="unit" placeholder="Unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//               {errors[`ingredientunit${index}`] && <div style={{ color: 'red' }}>{errors[`ingredientunit${index}`]}</div>}
//             </div>
//           ))}
//           <button type="button" onClick={addIngredient} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Ingredient</button>
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <h3 style={{ marginBottom: '10px' }}>Instructions</h3>
//           {instructions.map((instruction, index) => (
//             <div key={index} style={{ marginBottom: '10px' }}>
//               <input type="number" name="step" placeholder="Step" value={instruction.step} onChange={(e) => handleInstructionChange(index, e)} readOnly style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//               <textarea name="description" placeholder="Description" value={instruction.description} onChange={(e) => handleInstructionChange(index, e)} style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '60px' }} />
//               {errors[`instructionDescription${index}`] && <div style={{ color: 'red' }}>{errors[`instructionDescription${index}`]}</div>}
//             </div>
//           ))}
//           <button type="button" onClick={addInstruction} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Instruction</button>
//         </div>
//         <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>Add Recipe</button>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default AddRecipe;

