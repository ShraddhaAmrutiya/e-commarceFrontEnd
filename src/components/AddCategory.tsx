

import React, { useState, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast"

interface CategoryResponse {
    message: string;
    category?: {
      _id: string;
      name: string;
      description?: string;
    };
  }
const AddCategory: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post<CategoryResponse>("/category/add", {
        name,
        description,
      });

      setMessage(res.data.message || "Category created successfully!");
      setName("");
      setDescription("");
    }  catch (error: unknown) {
                toast.error("Error in add category");
            console.error((error as Error).message) 
              }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Add Category</h2>
      {message && <p className="mb-4 text-blue-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">Category Name</label>
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
          <label htmlFor="description" className="block font-semibold mb-1">Description</label>
          <textarea
            id="description"
            className="w-full border px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
