import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import { FaUserCircle } from "react-icons/fa";

const ViewRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState({});
  const [images, setImages] = useState([]); 

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/viewrecipe/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reviews/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchRecipe();
    fetchReviews();
  }, [id]);


  const handleImageChange = (e) => {
    setImages([...e.target.files]); 
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (rating === 0) {
      errors.rating = "Please select a rating out of 5";
    }
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('recipeId', id);
      formData.append('rating', rating);
      formData.append('comment', comment);
      images.forEach((image) => {
        formData.append('images', image); 
      });

      const response = await axios.post('http://localhost:3000/api/reviews', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data', 
        },
      });

      if (response.data && response.data.review) {
        setReviews([...reviews, response.data.review]);
        setRating(0);
        setComment('');
        setImages([]); 
        setError({});
        toast.success("Review Added Successfully", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
        const updatedReviews = await axios.get(`http://localhost:3000/api/reviews/${id}`);
        setReviews(updatedReviews.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("You have already given review for this recipe", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
        setRating(0);
        setComment('');
        setImages([]);
      } else {
        console.error("Error submitting review:", error);
      }
    }
  };

  const handleRatingClick = (rate) => {
    setRating(rate);
    if (error.rating) {
      setError((prev) => ({ ...prev, rating: '' }));
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} onClick={() => handleRatingClick(i)} style={{ cursor: 'pointer', color: i <= rating ? '#FFD700' : '#ddd' }}>
          <FaStar />
        </span>
      );
    }
    return stars;
  };

 const renderReviewStars = (rating)=>{
    const stars=[];
    for(let i = 1; i<=5 ; i++){
      stars.push(<FaStar key={i} style={{color: i <= rating ? '#FFD700' : '#ddd',marginRight: '2px'}}/>);
    }
    return <div style={{ display: 'flex' }}>{stars}</div>;
  }

  if (!recipe) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>;
  }

  return (
    <>
    <Navbar/>
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{paddingBottom: '10px',padding: '25px',marginLeft: '-20px',fontFamily: 'Georgia, serif',fontSize: '2.5rem',textTransform: 'uppercase',letterSpacing: '3px',textAlign: 'center'}}>
  Presenting Recipe: {recipe.title}
</h1>

<div style={{display: 'flex',gap: '20px',padding: '20px',backgroundColor: '#1F2833',borderRadius: '10px',margin: '20px 0'}}>
  <div style={{ flex: '1', maxWidth: '30%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ border: '2px solid #4E5D6C', borderRadius: '5px', padding: '5px', backgroundColor: '#C5C6C7' }}>
      {recipe.images && recipe.images.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recipe.images.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:3000/${image}`}
              alt={recipe.title}
              style={{width: '100%',height: 'auto',objectFit: 'cover',borderRadius: '5px'}}/>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#C5C6C7' }}>No images available</p>
      )}
    </div>
    {recipe.video && (
      <div style={{ border: '2px solid #4E5D6C', borderRadius: '5px', padding: '5px', backgroundColor: '#C5C6C7' }}>
        <video
          controls
          style={{width: '100%',height: 'auto',borderRadius: '5px',}}>
          <source src={`http://localhost:3000/${recipe.video}`} type='video/mp4' />
        </video>
      </div>
    )}
  </div>

  <div style={{flex: '2',padding: '15px',backgroundColor: '#0B0C10', borderRadius: '5px',color: '#C5C6C7',fontFamily: 'Arial, sans-serif'}}>
    <p style={{fontSize:'12px'}}><h5>Description:</h5> {recipe.description}</p>
    <h5>Ingredients:</h5>
    <ul style={{ paddingLeft: '20px' }}>
      {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
        <li style={{fontSize:'12px'}} key={index}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
      ))}
    </ul>
    <h5>Instructions:</h5>
    <ol style={{ paddingLeft: '20px' }}>
      {recipe.instructions && recipe.instructions.map((instruction, index) => (
        <li style={{fontSize:'12px'}} key={index}>Step {index + 1}: {instruction.description}</li>
      ))}
    </ol>
     <div style={{fontSize:'15px'}} >
    <p style={{fontSize:'12px'}}><h5>Preparation Time:</h5> {recipe.prepTime}</p>
    <p style={{fontSize:'12px'}}><h5>Cooking Time:</h5> {recipe.cookTime}</p>
    <p style={{fontSize:'12px'}}><h5>Total Time:</h5> {recipe.totalTime}</p>
    <p style={{fontSize:'12px'}}><h5>Servings:</h5> {recipe.servings}</p>
    <p style={{fontSize:'12px'}}><h5>Category:</h5> {recipe.category ? recipe.category.name : 'NA'}</p>
    <p style={{fontSize:'12px'}}><h5>Cuisine:</h5> {recipe.cuisine ? recipe.cuisine.name : 'NA'}</p>
    <p style={{fontSize:'12px'}}><h5>Difficulty:</h5> {recipe.difficulty ? recipe.difficulty.name : 'NA'}</p>
    <p style={{fontSize:'12px'}}><h5>Notes:</h5> {recipe.notes}</p>
    </div>
    <h5>Nutrition Content:</h5>
    <p style={{fontSize:'12px'}}><strong>Calories:</strong> {recipe.nutrition.calories}</p>
    <p style={{fontSize:'12px'}}><strong>Fat:</strong> {recipe.nutrition.fat} g</p>
    <p style={{fontSize:'12px'}}><strong>Carbohydrates:</strong> {recipe.nutrition.carbohydrates} g</p>
    <p style={{fontSize:'12px'}}><strong>Carbohydrates:</strong> {recipe.nutrition.carbohydrates} g</p>
    <p style={{fontSize:'12px'}}><strong>Protein:</strong> {recipe.nutrition.protein} g</p>

    <h5>Author Details:</h5>
    <p style={{fontSize:'13px'}}><strong>Name:</strong> {recipe.author.name}</p>
    {recipe.author.profileUrl && (
      <p style={{fontSize:'12px'}}><strong>Profile:</strong> <a href={recipe.author.profileUrl} target="_blank" rel="noopener noreferrer">View Profile</a></p>
    )}
    <p style={{ fontSize: '12px', textAlign: 'right' }}>Created on: {new Date(recipe.created_at).toLocaleDateString()}</p>
  </div>
</div>


      <div style={{ marginTop: '20px' }}>
        {token ? (
          <>
        
          <form onSubmit={handleReviewSubmit} style={{border:'2px solid #4E5D6CFF', padding:'30px',borderRadius:'10px'}}>
            <div style={{ marginBottom: '10px' }}>
            
              {/* <label htmlFor="rating" style={{fontSize:'20px'}}>Rating:</label> */}
              <div id="rating" style={{ display: 'flex', gap: '8px', marginBottom: '10px',fontSize:'35px',marginBottom:'20px' }}>
                <h5 style={{marginTop:'20px'}}>Rate and review</h5>{renderStars()}
              </div>
              {error.rating && <p style={{ color: 'red' }}>{error.rating}</p>}
            </div>
            <div style={{ marginBottom: '15px' }}>

              <textarea placeholder='want to write comment...' id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', 
      padding: '12px', borderRadius: '8px',outline:'none',resize: 'none',fontSize: '16px', lineHeight: '1.5', backgroundColor: '#f9f9f9',color: '#333'}} />
            </div>
            <div style={{marginBottom: '15px'}}>
              <label htmlFor="images" style={{display: 'block',color: '#EAECEE', fontWeight: 'light', fontSize:'13px',fontFamily: 'Arial, sans-serif'}}>Add Images (Optional)</label>
              <input type="file" id="images" multiple onChange={handleImageChange} style={{ display: 'block', marginTop: '5px',padding:'10px', borderRadius: '5px', border: '1px solid #4E5D6CFF', backgroundColor: '#1F2833', color: '#EAECEE', cursor: 'pointer',fontSize: '1rem' }} />
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1F2833', color: '#fff', borderRadius: '5px', cursor: 'pointer',border: '2px solid #4E5D6CFF' }}>
              Add Review
            </button>
          </form>
          </>
        ) : (
          <p style={{ color: 'gray' }}>Please log in to write a review.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Posted Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            review && review.user ? (
             
             <div key={review._id || index} style={{ marginBottom: '5px',  borderBottom: '2px solid #4E5D6CFF', borderRadius: '5px', padding: '10px' }}>

                <h5><FaUserCircle style={{ marginRight: '8px',marginTop:'-5px', color: '#45A29E'}} />{`${review.user.first_name} ${review.user.last_name}`}</h5>

                <h6 style={{ fontSize: '10px', lineHeight: '1' }}>{new Date(review.created_at).toLocaleString()}</h6>
                <h6 style={{fontSize:'16px',marginTop:'15px'}}>{renderReviewStars(review.rating)} </h6>
                {review.comment && <h6 style={{fontWeight:'lighter'}}> {review.comment}</h6>}
                {review.images && review.images.length > 0 && (
                  <div>
    
                    {review.images.map((image, index) => (
                      <img key={index} src={image} alt={`Review ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '3px',border:'2px solid #4E5D6CFF',padding:'2px' }} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div key={index} style={{ marginBottom: '10px' }}>
                <p><strong>Anonymous</strong> - Rating: {review.rating}</p>
                <p>{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div>
                    <h4>Images:</h4>
                    {review.images.map((image, index) => (
                      <img key={index} src={image} alt={`Review ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
                    ))}
                  </div>
                )}
              </div>
            )
          ))
        ) : (
          <p>No reviews yet, Be the first to add a review</p>
        )}
      </div>
<ToastContainer />
    </div>
    </>
  );
};

export default ViewRecipe;






// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { FaStar } from 'react-icons/fa';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ViewRecipe = () => {
//   const {id} = useParams();
//   const [recipe, setRecipe] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [error, setError] = useState({});
   
//   const token = localStorage.getItem('authToken');
 
//   useEffect(() => {
//     const fetchRecipe = async () =>{
//       try{
//         const response = await axios.get(`http://localhost:3000/api/viewrecipe/${id}`);
//         setRecipe(response.data);
//       } catch (error) {
//         console.error("Error fetching recipe:", error);
//       }
//     };

//     const fetchReviews = async () =>{
//       try {
//         const response = await axios.get(`http://localhost:3000/api/reviews/${id}`);
//         setReviews(response.data);
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//       }
//     };
//     fetchRecipe();
//     fetchReviews();
//   }, [id]);

//   const handleReviewSubmit = async (e) =>{
//     e.preventDefault();
//     const errors = {};
//     if (rating === 0) {
//       errors.rating = "Please select a rating out of 5";
//     }
//     if (Object.keys(errors).length > 0){
//       setError(errors);
//       return;
//     }
   
//     try {
//       const response = await axios.post('http://localhost:3000/api/reviews', {recipeId: id, rating, comment}, {
//           headers:{
//             Authorization: `Bearer ${localStorage.getItem('authToken')}`
//           }
//         }
//       );
//       if (response.data && response.data.review) {
//         setReviews([...reviews, response.data.review]); 
//         setRating(0);
//         setComment('');
//         setError({});
//         toast.success("Review Added Successfully", {
//           position: "top-right",
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });
//         const updatedReviews = await axios.get(`http://localhost:3000/api/reviews/${id}`);
//         setReviews(updatedReviews.data);
//       }
//     } catch (error){
//       if (error.response && error.response.status === 400) {
//         toast.error("You have already given review for this recipe",{
//           position: "top-right",
//           autoClose: 1000,
//           theme: "dark",
//           transition: Bounce,
//         });
//         setRating(0);
//         setComment('');
//       } else {
//         console.error("Error submitting review:", error);
//       }
//     }
//   };

//   const handleRatingClick = (rate) => {
//     setRating(rate);
//     if (error.rating) {setError((prev) => ({ ...prev, rating: '' })); 
//     }
//    };

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1;i <= 5; i++) {
//       stars.push(
//         <span key={i} onClick={() => handleRatingClick(i)} style={{ cursor: 'pointer', color: i <= rating ? '#FFD700' : '#ddd' }}><FaStar /></span>
//       );
//     }
//     return stars;
//   };

//   if (!recipe) {
//     return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>;
//   }

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <h1 style={{ paddingBottom: '10px', backgroundColor: '#1F2833', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', color: '#fff', textAlign: 'center' }}>
//         Recipe: {recipe.title}
//       </h1>

//       <div style={{ display: 'flex', gap: '20px' }}>
//         <div style={{ flex: '1', maxWidth: '20%' }}>
//           <div style={{ marginBottom: '20px' }}>
//             {recipe.images && recipe.images.length > 0 ? (
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//                 {recipe.images.map((image, index) => (
//                   <img key={index} src={`http://localhost:3000/${image}`} alt={recipe.title} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '5px' }}/>
//                 ))}
//               </div>
//             ) : (
//               <p>No images available</p>
//             )}
//           </div>

//           {recipe.video && (
//             <div>
//               <video controls style={{ width: '100%', height: 'auto', borderRadius: '5px' }}>
//                 <source src={`http://localhost:3000/${recipe.video}`} type='video/mp4' />
//               </video>
//             </div>
//           )}
//         </div>

//         <div style={{ flex: '2' }}>
//           <p><strong>Description:</strong> {recipe.description}</p>
//           <h2>Ingredients:</h2>
//           <ul>
//             {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
//               <li key={index}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
//             ))}
//           </ul>
//           <h2>Instructions:</h2>
//           <ol>
//             {recipe.instructions && recipe.instructions.map((instruction, index) => (
//               <li key={index}>Step {index + 1}: {instruction.description}</li>
//             ))}
//           </ol>

//           <p><strong>Preparation Time:</strong> {recipe.prepTime}</p>
//           <p><strong>Cooking Time:</strong> {recipe.cookTime}</p>
//           <p><strong>Total Time:</strong> {recipe.totalTime}</p>
//           <p><strong>Servings:</strong> {recipe.servings}</p>
//           <p><strong>Category:</strong> {recipe.category ? recipe.category.name : 'NA'}</p>
//           <p><strong>Cuisine:</strong> {recipe.cuisine ? recipe.cuisine.name : 'NA'}</p>
//           <p><strong>Difficulty:</strong> {recipe.difficulty ? recipe.difficulty.name : 'NA'}</p>
//           <p><strong>Notes:</strong> {recipe.notes}</p>

//           <h2>Nutrition Content:</h2>
//           <p><strong>Calories:</strong> {recipe.nutrition.calories}</p>
//           <p><strong>Fat:</strong> {recipe.nutrition.fat} g</p>
//           <p><strong>Carbohydrates:</strong> {recipe.nutrition.carbohydrates} g</p>
//           <p><strong>Protein:</strong> {recipe.nutrition.protein} g</p>

//           <h2>Author Details:</h2>
//           <p><strong>Name:</strong> {recipe.author.name}</p>
//           {recipe.author.profileUrl && (
//             <p><strong>Profile:</strong> <a href={recipe.author.profileUrl} target="_blank" rel="noopener noreferrer">View Profile</a></p>
//           )}
//           <p style={{ fontSize: '18px', lineHeight: '1.6' }}><strong>Created At:</strong> {new Date(recipe.created_at).toLocaleDateString()}</p>
//         </div>
//       </div>
      
//       <div style={{ marginTop: '20px' }}>

//       {token ? (
        
//            <form onSubmit={handleReviewSubmit}>
//            <div style={{ marginBottom: '10px' }}>
//            <h2>Submit a Review:</h2>
//              <label htmlFor="rating">Rating:</label>
//              <div id="rating" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
//                {renderStars()}
//              </div>
//              {error.rating && <p style={{ color: 'red' }}>{error.rating}</p>}
//            </div>
//            <div style={{ marginBottom: '10px' }}>
//              <label htmlFor="comment">Comment (Optional):</label>
//              <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
//            </div>
//            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1F2833', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
//              Submit Review
//            </button>
//            </form>
//       ):(
//         <p style={{ color: 'gray' }}>Please log in to write a review.</p> 
//       )}
//       </div>
       
//       <div style={{ marginTop: '20px' }}>
//         <h2>Reviews:</h2>
//         {reviews.length > 0 ? (
//           reviews.map((review, index) => (
//             review && review.user ? (
//               <div key={review._id || index} style={{ marginBottom: '10px',border:'1px solid white',borderRadius:'5px',padding:'10px' }}>
//                 <p><strong>{`${review.user.first_name} ${review.user.last_name}`}</strong></p>
//                 <p><strong>Rating: </strong> {review.rating}/5</p>
//                 {review.comment && <p><strong>Comment: </strong> {review.comment}</p>} 
//               </div>
//             ) : (
//               <div key={index} style={{ marginBottom: '10px' }}>
//                 <p><strong>Anonymous</strong> - Rating: {review.rating}</p>
//                 <p>{review.comment}</p>
//               </div>
//             )
//           ))
//         ) : (
//           <p>No reviews yet, Be the first to add a review</p>
//         )}
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default ViewRecipe;



