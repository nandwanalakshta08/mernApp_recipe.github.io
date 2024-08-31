import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewId, setReviewId] = useState(null); 
  
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchReviews = async () =>{
      try{
        const response = await axios.get('http://localhost:3000/api/reviews');
        console.log('review :>> ', response.data.reviews);
        setReviews(response.data.reviews); 
      } catch (error){
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async()=>{
    try {
      const response = await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
  
      setReviews(reviews.filter(review => review._id !== reviewId));
      toast.success("Review deleted successfully", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      
    }
    setShowConfirmModal(false);
  }

  const confirmDelete = (id)=>{
    setReviewId(id);
    setShowConfirmModal(true);
    
  }
  const cancelDelete = () => { 
    setShowConfirmModal(false);
    setReviewId(null);
  };


  const handleEdit = (reviewId)=>{
    navigate(`/editreview/${reviewId}`);
  }

  const handleView = (recipeId) => {
    navigate(`/view/${recipeId}`);
  };

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
        <h1></h1>
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop:'73px' }}>
          <thead>
            <tr>
              <th style={{border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833'}}>User Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833'}}>Recipe Title</th>
              <th style={{border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>Comment</th>
              <th style={{border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833'}}>Rating</th>
              <th style={{border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833'}}>Images</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#1F2833' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) =>(
                <tr key={review._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`${review.user.first_name} ${review.user.last_name}`}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{review.recipe.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{review.comment || 'No comment'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{review.rating}/5</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {review.images && review.images.length > 0 ? (
                      review.images.map((img, index) => (
                        <img 
                          key={index} 
                          src={`http://localhost:3000/reviewimg/${img}`} 
                          alt={`Review ${index}`} 
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} 
                        />
                      ))
                    ) : (
                      <span>No images</span>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px'}}>
                    <button onClick={() => handleView(review.recipe._id)} style={{ width: '70px', textDecoration: 'none', color: 'white', marginBottom:'5px' }} className='btn btn-info mx-1'>View</button>
                    <button onClick={() => handleEdit(review._id)} style={{ width: '70px', textDecoration: 'none', color: 'white', marginBottom:'5px' }} className='btn btn-primary mx-1'>Edit</button>
                    <button onClick={() => confirmDelete(review._id)} className='btn btn-danger mx-1' style={{ width: '70px', textDecoration: 'none', color: 'white', border: 'none', cursor: 'pointer', backgroundColor:'#fa0f0f', marginBottom:'5px'}}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>No reviews available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showConfirmModal && ( 
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' }}>
            <p style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Are You Sure To DELETE This?</p>
              <div style={{ marginTop: '20px' }}>
                <button onClick={handleDelete}  style={{ width: '100px', marginRight: '10px', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
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
  );
};
export default Review;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sidebar from "./Sidebar";
// import { Link, useNavigate } from 'react-router-dom';

// const Review = () => {
//   const [reviews, setReviews] = useState([]);

//   const navigate = useNavigate();  

//   useEffect(() => {
//     const fetchReviews = async () =>{
//       try{
//         const response = await axios.get('http://localhost:3000/api/reviews');
//         console.log('review :>> ', response.data.reviews);
//         setReviews(response.data.reviews); 
//       } catch (error){
//         console.error("Error fetching reviews:", error);
//       }
//     };
//     fetchReviews();
//   }, []);

//   const handleDelete = async(reviewId)=>{
//     try {
//       const response = await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
//       setReviews(reviews.filter(review => review._id !== reviewId));
//       alert("Review deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting review:", error);
//       alert("Failed to delete review.");
//     }
//   }

//   const handleEdit = (reviewId)=>{
//     navigate(`/edit/${recipeId}`);
//   }
//   const handleView = (recipeId) => {
//     navigate(`/view/${recipeId}`);
//   };

//   return (
//     <div style={{display:'flex'}}>
//          <Sidebar />
//          <div style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
//       <h1></h1>
//       <table style={{width: '100%', borderCollapse: 'collapse',marginTop:'73px' }}>
//         <thead>
//           <tr>
//             <th style={{border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833'}}>User Name</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833'}}>Recipe Title</th>
//             <th style={{border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>Comment</th>
//             <th style={{border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833'}}>Rating</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#1F2833' }}>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reviews.length > 0 ? (
//             reviews.map((review) =>(
//               <tr key={review._id}>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`${review.user.first_name} ${review.user.last_name}`}</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{review.recipe.title}</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{review.comment || 'No comment'}</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{review.rating}/5</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', gap: '5px' }}>
//                   <button onClick={()=> handleView(review.recipe._id)}  style={{ width: '70px', textDecoration: 'none', color: 'white',marginBottom:'5px' }} className='btn btn-info mx-1'>View</button>
//                   <Link to={`/editreview/${review._id}`}  style={{width: '70px', textDecoration: 'none', color: 'white',marginBottom:'5px' }} className='btn btn-primary mx-1'>Edit</Link>
//                   <button onClick={() => handleDelete(review._id)} className='btn btn-danger mx-1' style={{ width: '70px', textDecoration: 'none', color: 'white', border: 'none', cursor: 'pointer',backgroundColor:'#fa0f0f',marginBottom:'5px'}}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>No reviews available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//     </div>
//     );
// };
// export default Review;