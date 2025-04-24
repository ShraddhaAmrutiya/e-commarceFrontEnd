// import axios from "axios";
// import toast from "react-hot-toast"

// export const addToWishlist = async (productId: string, token: string) => {
//   try {
//     const userId = localStorage.getItem("userId"); 
   
//     const response = await axios.post(
//       `http://localhost:5000/wishlist/add`,
//       { productId },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           userId: userId, 
//         },
//       }
//     );
    
//     return response.data;
//   } catch (error) {
//     toast.error("Error in add to wishlist");
//     console.error((error as Error).message)  }
// };


// export const getWishlist = async (token: string, userId: string) => {
//   try {
//     const response = await axios.get(`http://localhost:5000/wishlist${userId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         userId,  
//       },
//     });
//     // console.log("getwishlist fatched");
    
//     return response.data;
//   } catch (error) {
//     toast.error("Error fetching wishlist");
//     console.error(error);
//   }
// };
