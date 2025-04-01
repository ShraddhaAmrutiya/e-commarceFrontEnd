// import { FC, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { addCategories } from "../redux/features/productSlice";
// import { Link } from "react-router-dom";

// const AllCategories: FC = () => {
//   const dispatch = useAppDispatch();
//   const allCategories = useAppSelector((state) => state.productReducer.categories);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/category/list");
//         const data = await res.json();
//         dispatch(addCategories(data));
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     if (allCategories.length === 0) fetchCategories();
//   }, [allCategories, dispatch]);

//   return (
//     <div className="container mx-auto min-h-[83vh] p-4 font-karla">
//       <span className="text-lg dark:text-white">Categories</span>
//       <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 my-2">
//         {allCategories &&
//           allCategories.map((category) => (
//             <div
//               key={category._id} // Ensure unique key
//               className="bg-gray-100 dark:bg-slate-600 dark:text-white px-4 py-4 font-karla mr-2 mb-2"
//             >
//               <div className="text-lg">{category.name}</div>
//               <Link to={`/category/${category._id}`} className="hover:underline text-blue-500">
//                 View products
//               </Link>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default AllCategories;


import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice";
import { Link } from "react-router-dom";

const AllCategories: FC = () => {
  const dispatch = useAppDispatch();
  const allCategories = useAppSelector((state) => state.productReducer.categories);

  // Get the JWT token from localStorage (or state/context if needed)
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/category/list", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    console.log("token:",token);
    
        if (!res.ok) {
          const errorText = await res.text(); // Read response as text
          throw new Error(`Server Error: ${errorText}`);
        }
    
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response from server");
        }
    
        const data = await res.json();
        dispatch(addCategories(data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    if (allCategories.length === 0) fetchCategories();
  }, [allCategories, dispatch, token]);

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <span className="text-lg dark:text-white">Categories</span>
      <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 my-2">
        {allCategories &&
          allCategories.map((category) => (
            <div
              key={category._id} 
              className="bg-gray-100 dark:bg-slate-600 dark:text-white px-4 py-4 font-karla mr-2 mb-2"
            >
              <div className="text-lg">{category.name}</div>
              <Link to={`/category/${category._id}`} className="hover:underline text-blue-500">
                View products
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllCategories;
