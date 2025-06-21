import React, { useState } from "react";
import { login, signup } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Users, User, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Loading from "../Loading.jsx"

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    role:"patient"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState("login");
  const [showLoading,setShowLoading] = useState(false)



 
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowLoading(true)

    try {
      const res = await login(loginForm);
      if (res.status === 200) {
        setShowLoading(false)
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      } else {
        if (err.response.data.error){
        return toast.error(err.response.data.error)
      }
      }
    } catch (err) {
      setShowLoading(false)
      if (err.response.data.error){
        return toast.error(err.response.data.error)
      }
      
      toast.error("Login failed. Please check your credentials.");
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowLoading(true)
    try {
      const res = await signup(signupForm);
      setShowForm('login')
      setShowLoading(false)
      toast.success(res.data.message)
    } catch (err) {
      setShowLoading(false)
      if (err.response.data.error){
        return toast.error(err.response.data.error)
      }
      
      toast.error("Signup failed. Try again.");
    }
  };

  const renderLogin = () => {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-blue-700">Login</CardTitle>
          <CardDescription className="text-base">
            Track your medication schedule and maintain your health records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLoginSubmit}>
            <div className="space-y-3 flex flex-col text-sm sm:flex-row gap-2 text-muted-foreground">
              <input
                className="w-full px-4 py-2 outline-none border-b border-b-[1px] border-b-blue-900"
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="Email"
                required
              />

              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 outline-none border-b border-b-[1px] border-b-blue-900"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Password"
                required
              />
            </div>

            <div className="flex gap-3 sm:flex-row flex-col">
              <button
                className=" w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                type="submit"
              >
                Login
              </button>
              <button
                className=" w-full  mt-6 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                onClick={() => {
                  setShowForm("signup");
                }}
                type="button"
              >
                Signup
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderSignup = () => {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 cursor-pointer">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Signup</CardTitle>
          <CardDescription className="text-base">
            Track your medication schedule and maintain your health records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSignupSubmit}
            className="space-y-3  text-sm  text-muted-foreground"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                name="name"
                className="w-full px-4 py-2 outline-none border-b border-b-[1px] border-b-green-900"
                value={signupForm.name}
                onChange={handleSignupChange}
                placeholder="Name"
                required
              />

              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 outline-none border-b border-b-[1px] border-b-green-900"
                value={signupForm.email}
                onChange={handleSignupChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 outline-none border-b border-b-[1px] border-b-green-900"
                value={signupForm.password}
                onChange={handleSignupChange}
                placeholder="Password"
                required
              />
              <select
                className="w-full px-4 py-2 outline-none border-b border-b-[1px] border-b-green-900"
                name="role"
                value={signupForm.role}
                onChange={handleSignupChange}
              >
                <option value="patient">Patient</option>
                <option value="caretaker">Caretaker</option>
              </select>
            </div>
            <div className="flex gap-3 sm:flex-row flex-col">
              <button
                className=" w-full  mt-6 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                type="submit"
              >
                Signup
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

 

  return (
    <>
    {showLoading && <Loading/>}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to MediCare Companion
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner in medication management. Choose your role to
              get started with personalized features.
            </p>
          </div>

          <div className="grid  gap-8 max-w-4xl mx-auto">
            {showForm === "login" && renderLogin()}
            {showForm === "signup" && renderSignup()}

           
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              You can switch between roles anytime after setup
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
