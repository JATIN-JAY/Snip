import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-6">This page doesn't exist or the link has expired.</p>
      <Button onClick={() => navigate("/")} className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl">
        Back to Home
      </Button>
    </div>
  );
}