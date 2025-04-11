import { FC, useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Category } from "../models/Category";

const AllCategories: FC = () => {
  const dispatch = useAppDispatch();
  const allCategories = useAppSelector((state) => state.productReducer.categories);
  const token: string = localStorage.getItem("authToken") ?? "";
  const Role: string = localStorage.getItem("Role") ?? ""; // Get user role for RBAC

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/category/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
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
      toast.error("Failed to load categories");
    }
  }, [token, dispatch]); // dependencies required inside fetchCategories
  

  useEffect(() => {
    if (allCategories.length === 0) fetchCategories();
  }, [allCategories.length, fetchCategories]);
  
  const handleEdit = (category: Category) => {
    setEditingId(category._id ?? null);
    setName(category.name);
    setDescription(category.description ?? "");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
console.log(editingId);

    try {
      const res = await fetch(`http://localhost:5000/category/update/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      toast.success("Category updated");
      setEditingId(null);
      fetchCategories(); // Refresh
    } catch (error) {
      console.error(error);
      toast.error("Error updating category");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/category/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      toast.success("Category deleted");
      fetchCategories(); // Refresh
    } catch (error) {
      console.error(error);
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <span className="text-lg dark:text-white">Categories</span>
      <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 my-2">
        {allCategories &&
          allCategories.map((category) => (
            <div
              key={category._id}
              className="bg-gray-100 dark:bg-slate-600 dark:text-white px-4 py-4 font-karla mr-2 mb-2 rounded"
            >
              {editingId === category._id ? (
                <>
                  <input
                    className="w-full p-1 mb-1 text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="w-full p-1 mb-2 text-black"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={handleUpdate}>
                    Save
                  </button>
                  <button className="bg-gray-500 text-white px-2 py-1" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold">{category.name}</div>
                  <p className="text-sm mb-2">{category.description}</p>
                  <Link to={`/category/${category._id}`} className="hover:underline text-blue-500">
                    View products
                  </Link>

                  {/* RBAC: Only show buttons to admin */}
                  {Role === "admin" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="text-sm bg-yellow-400 text-black px-2 py-1"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm bg-red-500 text-white px-2 py-1"
                        onClick={() => handleDelete(category._id!)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllCategories;
