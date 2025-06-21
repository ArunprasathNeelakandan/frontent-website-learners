
import { useState } from "react";
import Onboarding from "@/components/Onboarding";
import PatientDashboard from "@/components/PatientDashboard";
import CaretakerDashboard from "@/components/CaretakerDashboard";
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type UserType = "patient" | "caretaker" | null;



const Index = () => {
  const navigate = useNavigate()
  
   const user = JSON.parse(localStorage.getItem('user'));
   const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login', { replace: true });
   }
  if (!user) return <p>User not found. Please login again.</p>;

 
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediCare Companion</h1>
              <p className="text-sm text-muted-foreground">
                {user.role === "patient" ? "Patient View" : "Caretaker View"}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-accent transition-colors text-white bg-red-600"
            onClick={logout}
          >
           Log Out
          </Button>
         
        </div>
      </header>

     <main className="max-w-6xl mx-auto p-6">
        {user.role === "patient" ? <PatientDashboard /> : <CaretakerDashboard />}
      </main>
    </div>
  );
};

export default Index;
