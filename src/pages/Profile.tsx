
import { FC, useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
interface Address {
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

interface UserInfo {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: Address;
}

const Profile: FC = () => {
  const [info, setInfo] = useState<UserInfo>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    if (!userId || !token) return;

    fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch((err) => console.error(err.message));
  }, []);

  const handlePasswordChange = async (e:FormEvent) => {
    e.preventDefault();
  
    if (!info?.userName) return toast.error("User not loaded");
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all fields.");
    }
  
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
  
    try {
      const response = await fetch(`${BASE_URL}/users/reset-passwordwitholdpassword/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: info.userName,
          oldPassword,
          newPassword,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.message || "Password update failed.");
        return;
      }
  
      toast.success(data.message || "Password updated successfully!");
  
      // Store the new access token in localStorage
      if (data.token) {
        localStorage.setItem("accessToken", data.token);  // Save the new token
      }
  
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="container mx-auto w-full max-w-5xl dark:text-white bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">Your Account</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-purple-200 to-blue-300 rounded-lg p-6 shadow-lg">
            <table className="w-full">
              <tbody>
                <tr><td className="font-semibold py-3 text-lg">UserName</td><td className="py-3 text-lg">{info?.userName}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">First Name</td><td className="py-3 text-lg">{info?.firstName}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">Last Name</td><td className="py-3 text-lg">{info?.lastName}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">Email</td><td className="py-3 text-lg">{info?.email}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">Phone</td><td className="py-3 text-lg">{info?.phone}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">Age</td><td className="py-3 text-lg">{info?.age}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">Gender</td><td className="py-3 text-lg">{info?.gender}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Password Reset Form */}
          <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
