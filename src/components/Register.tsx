
// import { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// type AxiosErrorLike = {
//   response: {
//     data: {
//       message?: string;
//       errors?: Record<string, string>;
//     };
//   };
// };

// const InputField = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   description,
//   error,
// }: {
//   label: string;
//   name: string;
//   type?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   description?: string;
//   error?: string;
// }) => {
//   const isRequired = name !== "phone" && name !== "gender";

//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 dark:text-white">
//         {label}
//         {isRequired && <span className="text-red-500"> *</span>}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={isRequired}
//         className={`w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white ${
//           error ? "border-red-500" : ""
//         }`}
//       />
//       {description && (
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           {description}
//         </p>
//       )}
//       {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };

// const Register = () => {
//   const [formData, setFormData] = useState({
//     userName: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     age: "",
//     gender: "",
//     password: "",
//     Role: "customer",
//   });

//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
//       toast.error("Please enter a valid age.");
//       return;
//     }

//     try {
//       const payload = {
//         ...formData,
//         age: Number(formData.age),
//       };

//       const res = await axios.post("http://localhost:5000/users/register", payload);
//       const data = res.data as {
//         success: boolean;
//         message?: string;
//         token?: string;
//         userId?: string;
//         Role?: string;
//         userName?: string;
//       };

//       if (data.success && data.token && data.userId && data.Role && data.userName) {
//         // Save to localStorage
//         localStorage.setItem("authToken", data.token);
//         localStorage.setItem("accessToken", data.token);
//         localStorage.setItem("userId", data.userId);
//         localStorage.setItem("Role", data.Role);
//         localStorage.setItem("userName", data.userName);

//         // Set default headers globally
//         axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//         axios.defaults.headers.common["userId"] = data.userId;
//         axios.defaults.headers.common["Role"] = data.Role;
//         axios.defaults.headers.common["userName"] = data.userName;

//         toast.success("Registration & login successful!");
//         console.log("🔐 Axios default headers set:", axios.defaults.headers.common);

//         // Force refresh to update all components
//         setTimeout(() => {
//           window.location.href = "/";
//         }, 1500);
//       } else {
//         toast.error(data.message || "Something went wrong.");
//       }
//     } catch (err: unknown) {
//       if (typeof err === "object" && err !== null && "response" in err) {
//         const errorObj = err as AxiosErrorLike;

//         if (errorObj.response.data.errors) {
//           setFieldErrors(errorObj.response.data.errors);
//         }

//         toast.error(errorObj.response.data.message || "Registration failed.");
//       } else {
//         toast.error("Registration failed.");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
//           Create Account
//         </h2>

//         <InputField
//           label="Username"
//           name="userName"
//           value={formData.userName}
//           onChange={handleChange}
//           error={fieldErrors.userName}
//         />
//         <InputField
//           label="First Name"
//           name="firstName"
//           value={formData.firstName}
//           onChange={handleChange}
//           error={fieldErrors.firstName}
//         />
//         <InputField
//           label="Last Name"
//           name="lastName"
//           value={formData.lastName}
//           onChange={handleChange}
//           error={fieldErrors.lastName}
//         />
//         <InputField
//           type="email"
//           label="Email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           error={fieldErrors.email}
//         />
//         <InputField
//           type="tel"
//           label="Phone"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           error={fieldErrors.phone}
//         />
//         <InputField
//           type="number"
//           label="Age"
//           name="age"
//           value={formData.age}
//           onChange={handleChange}
//           error={fieldErrors.age}
//         />

//         {/* Gender */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 dark:text-white">
//             Gender
//           </label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
//           >
//             <option value="">Select Gender</option>
//             <option value="Female">Female</option>
//             <option value="Male">Male</option>
//             <option value="Other">Other</option>
//           </select>
//           {fieldErrors.gender && (
//             <p className="text-sm text-red-500 mt-1">{fieldErrors.gender}</p>
//           )}
//         </div>

//         <InputField
//           type="password"
//           label="Password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           error={fieldErrors.password}
//         />

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 dark:text-white">
//             Role <span className="text-red-500">*</span>
//           </label>
//           <select
//             name="Role"
//             value={formData.Role}
//             onChange={handleChange}
//             className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
//           >
//             <option value="customer">customer</option>
//             <option value="seller">seller</option>
//             <option value="admin">admin</option>
//           </select>
//           {fieldErrors.Role && (
//             <p className="text-sm text-red-500 mt-1">{fieldErrors.Role}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
//         >
//           Register
//         </button>

//         <ToastContainer />
//       </form>
//     </div>
//   );
// };

// export default Register;


import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AxiosErrorLike = {
  response: {
    data: {
      message?: string;
      errors?: Record<string, string>;
    };
  };
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  description,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  error?: string;
}) => {
  const isRequired = name !== "phone" && name !== "gender";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={isRequired}
        className={`w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white ${
          error ? "border-red-500" : ""
        }`}
      />
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    Role: "customer",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast.error("Please enter a valid age.");
      return;
    }
  
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
      };
  
      const res = await axios.post("http://localhost:5000/users/register", payload);
      const data = res.data as {
        success: boolean;
        message?: string;
        token?: string;
        userId?: string;
        Role?: string;
        userName?: string;
      };
  
      if (data.success && data.token && data.userId && data.Role && data.userName) {
        // Save to localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("Role", data.Role);
        localStorage.setItem("userName", data.userName);
  
        // Set default headers globally
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        axios.defaults.headers.common["userId"] = data.userId;
        axios.defaults.headers.common["Role"] = data.Role;
        axios.defaults.headers.common["userName"] = data.userName;
  
        toast.success("Registration & login successful!");
        console.log("🔐 Axios default headers set:", axios.defaults.headers.common);
  
        // Force refresh to update all components
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as AxiosErrorLike;
  
        if (errorObj.response.data.errors) {
          setFieldErrors(errorObj.response.data.errors);
        }
  
        // Check for duplicate username error (MongoDB duplicate key error)
        if (
          errorObj.response.data.message &&
          errorObj.response.data.message.includes("E11000 duplicate key error collection")
        ) {
          toast.error(" please try another username.");
        } else {
          toast.error( "This name is taken, please try another username");
        }
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
          error={fieldErrors.userName}
        />
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={fieldErrors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={fieldErrors.lastName}
        />
        <InputField
          type="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <InputField
          type="tel"
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={fieldErrors.phone}
        />
        <InputField
          type="number"
          label="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          error={fieldErrors.age}
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
          {fieldErrors.gender && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.gender}</p>
          )}
        </div>

        <InputField
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="Role"
            value={formData.Role}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
          >
            <option value="customer">customer</option>
            <option value="seller">seller</option>
            <option value="admin">admin</option>
          </select>
          {fieldErrors.Role && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.Role}</p>
          )}
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
