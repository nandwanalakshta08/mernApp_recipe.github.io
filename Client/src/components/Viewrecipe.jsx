import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/viewrecipe/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>{recipe.title}</h1>
      <img src={`http://localhost:3000/${recipe.image}`} 
        alt={recipe.title} 
        style={{ width: '300px', height: '300px', marginBottom: '20px' }} // Style the image
      />
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Description:</strong> {recipe.description}</p>
      <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Ingredients</h2>
      <ul style={{ paddingLeft: '20px' }}>
        {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
        ))}
      </ul>
      <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Instructions</h2>
      <ol style={{ paddingLeft: '20px' }}>
        {recipe.instructions && recipe.instructions.map((instruction, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>Step {instruction.step}: {instruction.description}</li>
        ))}
      </ol>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Preparation Time:</strong> {recipe.prepTime}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Cooking Time:</strong> {recipe.cookTime}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Total Time:</strong> {recipe.totalTime}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Servings:</strong> {recipe.servings}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Category:</strong> {recipe.category}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Difficulty:</strong> {recipe.difficulty}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Notes:</strong> {recipe.notes}</p>
      
      <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Nutrition</h2>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Calories:</strong> {recipe.nutrition.calories}</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Fat:</strong> {recipe.nutrition.fat} g</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Carbohydrates:</strong> {recipe.nutrition.carbohydrates} g</p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Protein:</strong> {recipe.nutrition.protein} g</p>
      
      <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Author</h2>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Name:</strong> {recipe.author.name}</p>
      {recipe.author.profileUrl && (
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Profile:</strong> <a href={recipe.author.profileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>View Profile</a></p>
      )}
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Created At:</strong> {new Date(recipe.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default ViewRecipe;
