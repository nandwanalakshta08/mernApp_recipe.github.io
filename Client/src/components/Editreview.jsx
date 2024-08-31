import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditReview = () => {
  const [review, setReview] = useState({});
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState('');
  const { reviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/review/${reviewId}`);
        setReview(response.data);
        setRating(response.data.rating);
        setComment(response.data.comment);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };
    fetchReview();
  }, [reviewId]);

  const handleRatingClick = (rate) => {
    setRating(rate);
  };

  const renderStars = () =>{
    const stars =[];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} onClick={() => handleRatingClick(i)} style={{ cursor: 'pointer', color: i <= rating ? '#FFD700' : '#ddd' }}> <FaStar /> </span>
      );
    }
    return stars;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/reviews/${reviewId}`, {rating, comment});
      toast.success("Review updated successfully", {
        onClose: () => navigate('/review'),
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050}}>
       <div style={{ backgroundColor: '#1F2833', padding: '20px', borderRadius: '10px', width: '800px',height:'700px' }}>
      <h1 style={{color: 'white',textAlign:'center'  }}>Edit Review</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="rating" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}> Rating:</label>
          <div id="rating" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            {renderStars()}
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment: </label>
          <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)}  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px',}} />
        </div>
        <div style={{ marginTop: '15px', textAlign: 'left' }}>
        <button type="submit" style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
          Update Review</button>
          <button onClick={() => navigate('/review')} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
                Cancel</button>
        </div>
         </form>
      </div>
      <ToastContainer />
    </div>
  );
};
export default EditReview;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from 'react-router-dom';
// import { FaStar } from 'react-icons/fa';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const EditReview = () => {
//   const [review, setReview] = useState({});
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [images, setImages] = useState([]);
//   const { reviewId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchReview = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/review/${reviewId}`);
//         setReview(response.data);
//         setRating(response.data.rating);
//         setComment(response.data.comment);
//         setImages(response.data.images || []);
//       } catch (error) {
//         console.error("Error fetching review:", error);
//       }
//     };
//     fetchReview();
//   }, [reviewId]);

//   const handleRatingClick = (rate) => {
//     setRating(rate);
//   };

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span key={i} onClick={() => handleRatingClick(i)} style={{ cursor: 'pointer', color: i <= rating ? '#FFD700' : '#ddd' }}>
//           <FaStar />
//         </span>
//       );
//     }
//     return stars;
//   };

//   const handleImageChange = (e) => {
//     setImages(e.target.files); // Update images state
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('rating', rating);
//     formData.append('comment', comment);
//     Array.from(images).forEach(file => formData.append('images', file)); // Append images to formData

//     try {
//       await axios.put(`http://localhost:3000/api/reviews/${reviewId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       toast.success("Review updated successfully", {
//         onClose: () => navigate('/review'),
//         position: "top-right",
//         autoClose: 1000,
//         theme: "dark",
//         transition: Bounce,
//       });
//     } catch (error) {
//       console.error("Error updating review:", error);
//     }
//   };

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
//       <div style={{ backgroundColor: '#1F2833', padding: '20px', borderRadius: '10px', width: '800px', height: '700px' }}>
//         <h1 style={{ color: 'white', textAlign: 'center' }}>Edit Review</h1>
//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
//           <div style={{ marginBottom: '15px' }}>
//             <label htmlFor="rating" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}> Rating:</label>
//             <div id="rating" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
//               {renderStars()}
//             </div>
//           </div>
//           <div style={{ marginBottom: '15px' }}>
//             <label htmlFor="comment" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment:</label>
//             <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }} />
//           </div>
//           <div style={{ marginBottom: '15px' }}>
//             <label htmlFor="images" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Images:</label>
//             <input type="file" id="images" multiple onChange={handleImageChange} />
//             <div style={{ marginTop: '10px' }}>
//               {Array.from(images).map((image, index) => (
//                 <img key={index} src={URL.createObjectURL(image)} alt={`Review image ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
//               ))}
//             </div>
//           </div>
//           <div style={{ marginTop: '15px', textAlign: 'left' }}>
//             <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//               Update Review
//             </button>
//             <button onClick={() => navigate('/review')} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default EditReview;
