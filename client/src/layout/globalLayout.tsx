import { Rocket } from "lucide-react";
import AuthForm from "../components/AuthForm";
import { useLocation } from "react-router";

export default function GlobalLayout() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      {/* <nav className="w-full h-[56px] absolute top-0 left-0 border-b-[1px] border-gray-200 px-12 flex justify-between items-center backdrop-blur-md">
        <p>@lucassrblt</p>
        <button className="flex items-center gap-[4px] bg-gradient-to-r from-blue-400 to-purple-400 px-3 py-[5px] rounded-md">
          <Rocket stroke="white" height={20} />
          <p className="font-poppins font-medium text-white text-sm">
            Portfolio
          </p>
        </button>
      </nav> */}

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          {location.pathname === "/login" ? (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back !
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome !</h1>
          )}
          {location.pathname === "/login" ? (
            <p className="text-gray-600">Please sign in to your account</p>
          ) : (
            <p className="text-gray-600">Please create your account</p>
          )}
        </div>
        <AuthForm />
        <div>
          {location.pathname === "/login" ? (
            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-600 font-medium">
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 font-medium">
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
