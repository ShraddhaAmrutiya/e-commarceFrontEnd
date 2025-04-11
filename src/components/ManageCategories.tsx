import  { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get<Category[]>("/category/list");
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setUpdatedName(category.name);
    setUpdatedDescription(category.description || "");
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
  
    try {
      const res = await axios.put<{
        message: string;
        category: Category;
      }>(`/category/update/${editingCategory._id}`, {
        name: updatedName,
        description: updatedDescription,
      });
  
      toast.success(res.data.message);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };
  

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this category?");
    if (!confirm) return;
  
    try {
      const res = await axios.delete<{ message: string }>(`/category/delete/${id}`);
      toast.success(res.data.message);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };
  
  return (
    <div className="manage-categories-container">
      <h2>Manage Categories</h2>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id} className="category-item">
            <div>
              <strong>{cat.name}</strong> — {cat.description || "No description"}
            </div>
            <div className="actions">
              <button onClick={() => handleEditClick(cat)}>Edit</button>
              <button onClick={() => handleDelete(cat._id)} style={{ color: "red" }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingCategory && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Category</h3>
            <label>
              Name:
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </label>
            <label>
              Description:
              <textarea
                rows={3}
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setEditingCategory(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
