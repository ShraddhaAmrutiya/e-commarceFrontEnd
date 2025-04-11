
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Type for axios error
type AxiosErrorLike = {
  response: {
    data: {
      message: string;
    };
  };
};

// Reusable input component
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-white">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={name !== "phone" && name !== "gender"}
      className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    Role: "Customer",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Validate age
    if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast.error("Please enter a valid age.");
      return;
    }
  
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
      };
  
      console.log("Form Data..............................:", payload);
  
      const res = await axios.post("http://localhost:5000/users/register", payload);
      const data = res.data as { success: boolean; message?: string };
  
      if (data.success) {
        toast.success("Registration successful! Redirecting to login...");
  
        // Delay navigation to allow the toast message to show
        setTimeout(() => {
          navigate("/login");
        }, 2000);  // Redirect after 2 seconds
      } else {
        toast.success(data.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as AxiosErrorLike;
        toast.error(errorObj.response.data.message || "Registration failed.");
      } else {
        toast.error("Registration failed.");
      }
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Create Account
        </h2>

        <InputField
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <InputField
          type="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          type="tel"
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputField
          type="number"
          label="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <InputField
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Role
          </label>
          <select
            name="Role"
            value={formData.Role}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
          >
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
        >
          Register
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Register;
