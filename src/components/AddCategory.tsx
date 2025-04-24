// import React, { useState, FormEvent } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// interface CategoryResponse {
//   message: string;
//   category?: {
//     _id: string;
//     name: string;
//     description?: string;
//   };
// }
// const AddCategory: React.FC = () => {
//   const [name, setName] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [message] = useState<string>("");

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post<CategoryResponse>("/category/add", {
//         name,
//         description,
//       });

//       toast.success(res.data.message || "Category created successfully!", {
//         position: "top-center",
//         style: {
//           backgroundColor: "#2196F3", // Blue background
//           color: "#fff", // White text
//           borderRadius: "8px",
//           top: "50%",
//           transform: "translateY(-50%)",
//         },
//       });
      
//       setName("");
//       setDescription("");
//     } catch (error: unknown) {
//       if (error instanceof Error) { // Type check to ensure it’s a standard Error
//         if ((error as { response?: { data?: { message?: string } } }).response) {
//           toast.error("This category already exists.");
//         } else {
//           toast.error("Error in add category");
//         }
//         console.error((error as Error).message); // Accessing the message of the Error object
//       } else {
//         // Handle the case when the error is of unknown type
//         toast.error("An unexpected error occurred.");
//         // console.error(error);
//       }}
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 border rounded">
//       <h2 className="text-xl font-bold mb-4">Add Category</h2>
//       {message && <p className="mb-4 text-blue-500">{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="name" className="block font-semibold mb-1">
//             Category Name
//           </label>
//           <input
//             id="name"
//             type="text"
//             className="w-full border px-2 py-1"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="description" className="block font-semibold mb-1">
//             Description
//           </label>
//           <textarea
//             id="description"
//             className="w-full border px-2 py-1"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Create Category
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddCategory;


import React, { useState, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppDispatch } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice"; // Assuming you have this action
import { Category } from "../models/Category";
interface CategoryResponse {
  message: string;
  category?: {
    _id: string;
    name: string;
    description?: string;
  };
}
const AddCategory: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post<CategoryResponse>("/category/add", {
        name,
        description,
      });

      const newCategory: Category = res.data.category!; // Assuming the response contains the new category
      toast.success(res.data.message || "Category created successfully!", {
        position: "top-center",
        style: {
          backgroundColor: "#2196F3", // Blue background
          color: "#fff", // White text
          borderRadius: "8px",
          top: "50%",
          transform: "translateY(-50%)",
        },
      });

      // Dispatch the new category to the Redux store
      dispatch(addCategories([newCategory])); // Add the new category to the list immediately

      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Category already exists.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">
            Category Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full border px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            className="w-full border px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
