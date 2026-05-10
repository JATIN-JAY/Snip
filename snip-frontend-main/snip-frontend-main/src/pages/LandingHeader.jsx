import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, Link as LinkIcon } from "lucide-react";
import { Button } from "../components/ui/button";

export function LandingHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!(token && token !== "undefined" && token !== "null"));
    setIsLoading(false);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 relative">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-orange-600 p-1.5 rounded-xl transition-transform group-hover:-rotate-12">
            <LinkIcon className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-[20px] tracking-tight text-slate-900">
            Snip
          </span>
        </Link>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-1.5 shadow-sm">
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, "how-it-works")}
            className="text-[13px] font-medium text-slate-600 hover:text-orange-600 px-4 py-1.5 transition-colors"
          >
            How it works
          </a>

          <a
            href="https://github.com/JATIN-JAY/snip-frontend"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-medium text-slate-600 hover:text-orange-600 px-4 py-1.5 transition-colors"
          >
            GitHub
          </a>

          <Link
            to="/docs"
            className="text-[13px] font-medium text-slate-600 hover:text-orange-600 px-4 py-1.5 transition-colors"
          >
            API Docs
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="w-24 h-9 bg-slate-100 animate-pulse rounded-xl" />
          ) : isLoggedIn ? (
            <Button
              size="sm"
              className="bg-orange-600 text-white hover:bg-orange-500 rounded-xl px-5 transition-all"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-[13px] text-slate-600 hover:text-orange-600 transition-colors bg-transparent hover:bg-transparent"
                onClick={() => navigate("/signin")}
              >
                Log In
              </Button>

              <Button
                size="sm"
                className="bg-orange-600 text-white hover:bg-orange-500 rounded-xl px-5 transition-all"
                onClick={() => navigate("/signup")}
              >
                Sign Up Free
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-50 text-slate-600 border border-transparent hover:border-slate-200 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-6 flex flex-col gap-4">
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, "how-it-works")}
            className="text-[15px] font-medium text-slate-600 hover:text-orange-600 transition-colors"
          >
            How it works
          </a>
          <a
            href="https://github.com/JATIN-JAY/snip-frontend"
            target="_blank"
            rel="noreferrer"
            className="text-[15px] font-medium text-slate-600 hover:text-orange-600 transition-colors"
          >
            GitHub
          </a>
          <Link
            to="/docs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-medium text-slate-600 hover:text-orange-600 transition-colors"
          >
            API Docs
          </Link>
          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-slate-200">
            {isLoggedIn ? (
              <Button
                className="w-full bg-orange-600 text-white hover:bg-orange-500 rounded-xl transition-all"
                onClick={() => {
                  navigate("/dashboard");
                  setIsMobileMenuOpen(false);
                }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 transition-all"
                  onClick={() => {
                    navigate("/signin");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log In
                </Button>
                <Button
                  className="w-full bg-orange-600 text-white hover:bg-orange-500 rounded-xl transition-all"
                  onClick={() => {
                    navigate("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}