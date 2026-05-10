import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-hot-toast";
import { HTTP_BACKEND } from "../../config";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link as LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Signin() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
        const response = await api.post(`/api/auth/signin`, {
            email: email.trim(),
            password
        });

        localStorage.setItem("token", response.data.token);
        
        
        navigate("/dashboard");
        toast.success("Signed in successfully!");
    } catch(error) {
        if (error.response?.status === 401) {
          setError("Invalid email or password");
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] p-4 pt-10 font-sans selection:bg-orange-100">
      
      <Link to="/" className="mb-12 flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
        <div className="bg-orange-600 p-1.5 rounded-xl transition-transform group-hover:-rotate-12 shadow-sm">
          <LinkIcon className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-extrabold text-3xl tracking-tight text-slate-900">
          Snip
        </span>
      </Link>

      <Card className="w-full max-w-sm rounded-2xl shadow-lg shadow-slate-200/50 border-slate-200 bg-white">
        <CardHeader className="pb-0 text-center">
          <CardTitle className="text-xl font-bold text-slate-900">Welcome back</CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access your links
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  autoFocus
                  placeholder="hello@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading}
                  className="focus-visible:ring-orange-500 border-slate-200 placeholder:text-slate-500 text-slate-900 rounded-xl"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={loading}
                  className="focus-visible:ring-orange-500 border-slate-200 placeholder:text-slate-500 text-slate-900 rounded-xl"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {error && (
              <div className="w-full p-2 bg-red-50 border border-red-300 rounded-xl text-center">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={loading || !email.trim() || !password.trim()} 
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold h-11 rounded-xl transition-all hover:-translate-y-[1px] active:scale-95 shadow-sm disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-sm text-center text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-slate-900 hover:text-orange-600 transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}