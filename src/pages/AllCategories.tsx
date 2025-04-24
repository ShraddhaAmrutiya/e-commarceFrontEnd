import { FC, useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Category } from "../models/Category";

const AllCategories: FC = () => {
  const dispatch = useAppDispatch();
  const allCategories = useAppSelector((state) => state.productReducer.categories);
  const token: string = localStorage.getItem("accessToken") ?? "";
  const Role: string = localStorage.getItem("Role") ?? "";
  const descriptionRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

 

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
      dispatch(addCategories(data)); // Dispatch fetched categories to Redux store
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, [fetchCategories]);

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
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Error updating category");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`http://localhost:5000/category/delete/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      toast.success("Category deleted");
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting category");
      setShowModal(false);
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        descriptionRef.current?.focus();
                      }
                    }}
                  />

                  <input
                    ref={descriptionRef}
                    className="w-full p-1 mb-2 text-black"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUpdate();
                      }
                    }}
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

      {showModal && <DeleteConfirmModal onConfirm={confirmDelete} onCancel={() => setShowModal(false)} />}
    </div>
  );
};

// Confirmation Modal Component
const DeleteConfirmModal: FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center w-80">
        <h2 className="text-lg font-semibold mb-4 text-black">Confirm Deletion</h2>
        <p className="text-black mb-4">Are you sure you want to delete this category?</p>
        <div className="flex justify-center gap-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
