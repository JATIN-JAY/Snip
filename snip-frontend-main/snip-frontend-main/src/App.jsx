import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { Toaster } from 'react-hot-toast';
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import RedirectHandler from "./pages/RedirectHandler";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/analytics/:id" element={<Analytics/>} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/:shortId" element={<RedirectHandler />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  );
}

export default App;