import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRecipe = () => {
  const { id } = useParams();
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
    author: { name: '', profileUrl: '' }
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/viewrecipe/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    
    if (nameParts.length > 1) {
      const [key, subKey] = nameParts;
      setFormData(prevData => ({
        ...prevData,
        [key]: {
          ...prevData[key],
          [subKey]: value
        }
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleNestedChange = (index, field, value, type) => {
    setFormData(prevData => {
      const updatedArray = [...prevData[type]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prevData, [type]: updatedArray };
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Title is mandatory to be filled';
    if (!formData.description) newErrors.description = 'Description is mandatory to be filled';
    if (!formData.prepTime) newErrors.prepTime = 'Prep time is mandatory to be filled';
    if (!formData.cookTime) newErrors.cookTime = 'Cook time is mandatory to be filled';
    if (!formData.totalTime) newErrors.totalTime = 'Total time is mandatory to be filled';
    if (!formData.servings) newErrors.servings = 'Servings are mandatory to be filled';
    if (!formData.category) newErrors.category = 'Category is mandatory to be filled';
    if (!formData.cuisine) newErrors.cuisine = 'Cuisine is mandatory to be filled';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is mandatory to be filled';
    if (!formData.notes) newErrors.notes = 'Notes are mandatory to be filled';
    if (!formData.nutrition.calories) newErrors['nutrition.calories'] = 'Calories are mandatory to be filled';
    if (!formData.nutrition.fat) newErrors['nutrition.fat'] = 'Fat is mandatory to be filled';
    if (!formData.nutrition.carbohydrates) newErrors['nutrition.carbohydrates'] = 'Carbohydrates are mandatory to be filled';
    if (!formData.nutrition.protein) newErrors['nutrition.protein'] = 'Protein is mandatory to be filled';
    if (!formData.author.name) newErrors['author.name'] = 'Author name is mandatory to be filled';
    if (!formData.author.profileUrl) newErrors['author.profileUrl'] = 'Author profile URL is mandatory to be filled';

    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
        newErrors[`ingredients[${index}]`] = 'All ingredient fields are mandatory';
      }
    });

    formData.instructions.forEach((instruction, index) => {
      if (!instruction.step || !instruction.description) {
        newErrors[`instructions[${index}]`] = 'All instruction fields are mandatory';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
        for (const nestedKey in formData[key]) {
          formDataToSend.append(`${key}.${nestedKey}`, formData[key][nestedKey]);
        }
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => {
          for (const itemKey in item) {
            formDataToSend.append(`${key}[${index}].${itemKey}`, item[itemKey]);
          }
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
    if (image) {
      formDataToSend.append('image', image);
    }
    try {
      const response = await axios.put(`http://localhost:3000/api/editrecipe/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.message === "Recipe Updated Successfully") {
        toast.success(response.data.message, {
          onClose: () => navigate('/allrecipe'),
          position: 'top-right',
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });

      } else {
        toast.error("Recipe not found", {
          onClose: () => navigate(`/view/${id}`),
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error('Upload the image file', {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('Error in editing:', error);
    }
  };

  return (
    <div style={{ maxWidth: '700px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', padding: '20px', backgroundColor: '#2C3539', borderRadius: '8px', border: '2px solid white' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Edit Recipe</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
     
     
<div style={{ marginBottom: '15px' }}>
<label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
<input type="text" name="title" value={formData.title} onChange={handleChange}  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
{errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
<textarea name="description" value={formData.description} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
{errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Prep Time:</label>
<input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
{errors.prepTime && <p style={{ color: 'red' }}>{errors.prepTime}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cook Time: </label>
<input type="text" name="cookTime" value={formData.cookTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
{errors.cookTime && <p style={{ color: 'red' }}>{errors.cookTime}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Total Time: </label>
<input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
{errors.totalTime && <p style={{ color: 'red' }}>{errors.totalTime}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Servings: </label>
<input type="number" name="servings" value={formData.servings} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
{errors.servings && <p style={{ color: 'red' }}>{errors.servings}</p>}
</div>
 
<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Category: </label>
<input type="text" name="category" value={formData.category} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
{errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cuisine: </label>
<input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
{errors.cuisine && <p style={{ color: 'red' }}>{errors.cuisine}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Difficulty: </label>
<input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
{errors.difficulty && <p style={{ color: 'red' }}>{errors.difficulty}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Notes: </label>
<textarea name="notes" value={formData.notes} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
{errors.notes && <p style={{ color: 'red' }}>{errors.notes}</p>}
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
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Name: </label>
<input type="text" name="author.name" value={formData.author.name} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }}/>
{errors['author.name'] && <p style={{ color: 'red' }}>{errors['author.name']}</p>}
</div>

<div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Profile URL: </label>
<input type="text" name="author.profileUrl" value={formData.author.profileUrl} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }}/>
{errors['author.profileUrl'] && <p style={{ color: 'red' }}>{errors['author.profileUrl']}</p>}
</div>

        {/* Ingredients */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Ingredients:</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
                 <div style={{ display: 'flex' }}>
                 <div style={{ flex: 1, marginRight: '10px' }}>
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => handleNestedChange(index, 'name', e.target.value, 'ingredients')}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} 
              />
              </div>
              <div style={{ flex: 1, marginRight: '10px' }}>
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => handleNestedChange(index, 'quantity', e.target.value, 'ingredients')}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} 
              />
              </div>
              <div style={{flex:1}}>
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => handleNestedChange(index, 'unit', e.target.value, 'ingredients')}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} 
              />
              </div>
              {index > 0 && (
                  <button type="button" onClick={()=>deleteIngredient(index)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
                  Remove
                </button>
              )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addIngredient} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }}>
            Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Instructions:</label>
          {formData.instructions.map((instruction, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Step"
                value={instruction.step}
                onChange={(e) => handleNestedChange(index, 'step', e.target.value, 'instructions')}
                style={{ flex: 1, marginRight: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              {index > 0 && (
                   <button type="button" onClick={() => deleteInstruction(index)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white' }}>
                   Remove
                 </button>
              )}
              </div>
              <div style={{ marginBottom: '10px' }}>
              <textarea
                type="text"
                placeholder="Description"
                value={instruction.description}
                onChange={(e) => handleNestedChange(index, 'description', e.target.value, 'instructions')}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              
            </div>
            </div>
          ))}
          <button type="button" onClick={addInstruction}style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }}>
            Add Instruction
          </button>
        </div>
        <div style={{ marginBottom: '15px' }}>
<label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Image: </label>
<input type="file" name="image" onChange={handleImageChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }}/>
{errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
  </div>

   
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '15px' }}>
          Update Recipe
        </button>

        {Object.keys(errors).length > 0 && (
          <div style={{ color: 'red', marginTop: '20px' }}>
            {Object.values(errors).map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <ToastContainer />
      </form>
    </div>
  );
};

export default EditRecipe;



// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const EditRecipe = () => {
//   const { id } = useParams();
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
//     author: { name: '', profileUrl: '' }
//   });
//   const [image, setImage] = useState(null);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/viewrecipe/${id}`);
//         setFormData(response.data);
//       } catch (error) {
//         console.error("Error fetching recipe:", error);
//       }
//     };
//     fetchRecipe();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const nameParts = name.split('.');
    
//     if (nameParts.length > 1) {
//       const [key, subKey] = nameParts;
//       setFormData(prevData => ({
//         ...prevData,
//         [key]: {
//           ...prevData[key],
//           [subKey]: value
//         }
//       }));
//     } else {
//       setFormData(prevData => ({ ...prevData, [name]: value }));
//     }
//   };

//   const handleNestedChange = (index, field, value, type) => {
//     setFormData(prevData => {
//       const updatedArray = [...prevData[type]];
//       updatedArray[index] = { ...updatedArray[index], [field]: value };
//       return { ...prevData, [type]: updatedArray };
//     });
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
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


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};

//     if (!formData.title) newErrors.title = 'Title is mandatory to be filled';
//     if (!formData.description) newErrors.description = 'Description is mandatory to be filled';
//     if (!formData.prepTime) newErrors.prepTime = 'Prep time is mandatory to be filled';
//     if (!formData.cookTime) newErrors.cookTime = 'Cook time is mandatory to be filled';
//     if (!formData.totalTime) newErrors.totalTime = 'Total time is mandatory to be filled';
//     if (!formData.servings) newErrors.servings = 'Servings are mandatory to be filled';
//     if (!formData.category) newErrors.category = 'Category is mandatory to be filled';
//     if (!formData.cuisine) newErrors.cuisine = 'Cuisine is mandatory to be filled';
//     if (!formData.difficulty) newErrors.difficulty = 'Difficulty is mandatory to be filled';
//     if (!formData.notes) newErrors.notes = 'Notes are mandatory to be filled';
//     if (!formData.nutrition.calories) newErrors['nutrition.calories'] = 'Calories are mandatory to be filled';
//     if (!formData.nutrition.fat) newErrors['nutrition.fat'] = 'Fat is mandatory to be filled';
//     if (!formData.nutrition.carbohydrates) newErrors['nutrition.carbohydrates'] = 'Carbohydrates are mandatory to be filled';
//     if (!formData.nutrition.protein) newErrors['nutrition.protein'] = 'Protein is mandatory to be filled';
//     if (!formData.author.name) newErrors['author.name'] = 'Author name is mandatory to be filled';
//     if (!formData.author.profileUrl) newErrors['author.profileUrl'] = 'Author profile URL is mandatory to be filled';

//     formData.ingredients.forEach((ingredient, index) => {
//       if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
//         newErrors[`ingredients[${index}]`] = 'All ingredient fields are mandatory';
//       }
//     });

//     formData.instructions.forEach((instruction, index) => {
//       if (!instruction.step || !instruction.description) {
//         newErrors[`instructions[${index}]`] = 'All instruction fields are mandatory';
//       }
//     });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
//     setErrors({});

//     const formDataToSend = new FormData();
//     for (const key in formData) {
//       if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
//         for (const nestedKey in formData[key]) {
//           formDataToSend.append(`${key}.${nestedKey}`, formData[key][nestedKey]);
//         }
//       } else if (Array.isArray(formData[key])) {
//         formData[key].forEach((item, index) => {
//           for (const itemKey in item) {
//             formDataToSend.append(`${key}[${index}].${itemKey}`, item[itemKey]);
//           }
//         });
//       } else {
//         formDataToSend.append(key, formData[key]);
//       }
//     }
//     if (image) {
//       formDataToSend.append('image', image);
//     }
//     try {
//       const response = await axios.put(`http://localhost:3000/api/editrecipe/${id}`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.message === "Recipe Updated Successfully") {
//         toast.success(response.data.message, {
//           onClose: () => navigate('/allrecipe'),
//           position: 'top-right',
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });

//       } else {
//         toast.error("Recipe not found", {
//           onClose: () => navigate(`/view/${id}`),
//           position: "top-right",
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });
//       }
//     } catch (error) {
//       toast.error('Upload the image file', {
//         position: "top-right",
//         autoClose: 1000,
//         theme: "dark",
//         transition: Bounce,
//       });
//       console.error('Error in editing:', error);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '700px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', padding: '20px', backgroundColor: '#2C3539', borderRadius: '8px', border: '2px solid white' }}>
//       <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Edit Recipe</h1>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
     
     
// <div style={{ marginBottom: '15px' }}>
// <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
// <input type="text" name="title" value={formData.title} onChange={handleChange}  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
// {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
// <textarea name="description" value={formData.description} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
// {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Prep Time:</label>
// <input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
// {errors.prepTime && <p style={{ color: 'red' }}>{errors.prepTime}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cook Time: </label>
// <input type="text" name="cookTime" value={formData.cookTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
// {errors.cookTime && <p style={{ color: 'red' }}>{errors.cookTime}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Total Time: </label>
// <input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
// {errors.totalTime && <p style={{ color: 'red' }}>{errors.totalTime}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Servings: </label>
// <input type="number" name="servings" value={formData.servings} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
// {errors.servings && <p style={{ color: 'red' }}>{errors.servings}</p>}
// </div>
 
// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Category: </label>
// <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
// {errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Cuisine: </label>
// <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}  />
// {errors.cuisine && <p style={{ color: 'red' }}>{errors.cuisine}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Difficulty: </label>
// <input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
// {errors.difficulty && <p style={{ color: 'red' }}>{errors.difficulty}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Notes: </label>
// <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
// {errors.notes && <p style={{ color: 'red' }}>{errors.notes}</p>}
// </div>




// <div style={{ marginBottom: '15px' }}>
//   <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Calories:</label>
//   <input type="number" name="nutrition.calories" value={formData.nutrition.calories} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//   {errors['nutrition.calories'] && <div style={{ color: 'red' }}>{errors['nutrition.calories']}</div>}
// </div>

// <div style={{ marginBottom: '15px' }}>
//   <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Fat:</label>
//   <input type="number" name="nutrition.fat" value={formData.nutrition.fat} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//   {errors['nutrition.fat'] && <div style={{ color: 'red' }}>{errors['nutrition.fat']}</div>}
// </div>

// <div style={{ marginBottom: '15px' }}>
//   <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Carbohydrates:</label>
//   <input type="number" name="nutrition.carbohydrates" value={formData.nutrition.carbohydrates} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//   {errors['nutrition.carbohydrates'] && <div style={{ color: 'red' }}>{errors['nutrition.carbohydrates']}</div>}
// </div>

// <div style={{ marginBottom: '15px' }}>
//   <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Protein:</label>
//   <input type="number" name="nutrition.protein" value={formData.nutrition.protein} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
//   {errors['nutrition.protein'] && <div style={{ color: 'red' }}>{errors['nutrition.protein']}</div>}
// </div>



//   <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Name: </label>
// <input type="text" name="author.name" value={formData.author.name} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }}/>
// {errors['author.name'] && <p style={{ color: 'red' }}>{errors['author.name']}</p>}
// </div>

// <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Author Profile URL: </label>
// <input type="text" name="author.profileUrl" value={formData.author.profileUrl} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }}/>
// {errors['author.profileUrl'] && <p style={{ color: 'red' }}>{errors['author.profileUrl']}</p>}
// </div>

//         {/* Ingredients */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Ingredients:</label>
//           {formData.ingredients.map((ingredient, index) => (
//             <div key={index} style={{ marginBottom: '10px' }}>
//                  <div style={{ display: 'flex' }}>
//                  <div style={{ flex: 1, marginRight: '10px' }}>
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={ingredient.name}
//                 onChange={(e) => handleNestedChange(index, 'name', e.target.value, 'ingredients')}
//                 style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} 
//               />
//               </div>
//               <div style={{ flex: 1, marginRight: '10px' }}>
//               <input
//                 type="text"
//                 placeholder="Quantity"
//                 value={ingredient.quantity}
//                 onChange={(e) => handleNestedChange(index, 'quantity', e.target.value, 'ingredients')}
//                 style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} 
//               />
//               </div>
//               <div style={{flex:1}}>
//               <input
//                 type="text"
//                 placeholder="Unit"
//                 value={ingredient.unit}
//                 onChange={(e) => handleNestedChange(index, 'unit', e.target.value, 'ingredients')}
//                 style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} 
//               />
//               </div>
//               {index > 0 && (
//                   <button type="button" onClick={()=>deleteIngredient(index)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
//                   Remove
//                 </button>
//               )}
//               </div>
//             </div>
//           ))}
//           <button type="button" onClick={addIngredient} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }}>
//             Add Ingredient
//           </button>
//         </div>

//         {/* Instructions */}
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Instructions:</label>
//           {formData.instructions.map((instruction, index) => (
//             <div key={index} style={{ marginBottom: '10px' }}>
//               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//               <input
//                 type="text"
//                 placeholder="Step"
//                 value={instruction.step}
//                 onChange={(e) => handleNestedChange(index, 'step', e.target.value, 'instructions')}
//                 style={{ flex: 1, marginRight: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
//               />
//               {index > 0 && (
//                    <button type="button" onClick={() => deleteInstruction(index)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'red', color: 'white' }}>
//                    Remove
//                  </button>
//               )}
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//               <textarea
//                 type="text"
//                 placeholder="Description"
//                 value={instruction.description}
//                 onChange={(e) => handleNestedChange(index, 'description', e.target.value, 'instructions')}
//                 style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
//               />
              
//             </div>
//             </div>
//           ))}
//           <button type="button" onClick={addInstruction}style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'green', color: 'white' }}>
//             Add Instruction
//           </button>
//         </div>
//         <div style={{ marginBottom: '15px' }}>
// <label  style={{ marginBottom: '5px', fontWeight: 'bold' }}>Image: </label>
// <input type="file" name="image" onChange={handleImageChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '100px' }}/>
// {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
//   </div>

   
//         <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '15px' }}>
//           Update Recipe
//         </button>

//         {Object.keys(errors).length > 0 && (
//           <div style={{ color: 'red', marginTop: '20px' }}>
//             {Object.values(errors).map((error, index) => (
//               <p key={index}>{error}</p>
//             ))}
//           </div>
//         )}

//         <ToastContainer />
//       </form>
//     </div>
//   );
// };

// export default EditRecipe;




