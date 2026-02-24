import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

return (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 antialiased">
    
    <main className="flex w-full max-w-md flex-col items-center">
      
      {/* Logo */}
      <div className="group mb-12">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="absolute inset-0 rounded-3xl border border-slate-100 pointer-events-none" />
          <img 
            src="/Trippy_logo.png" 
            className="h-16 w-16 object-contain" 
            alt="Trippy Logo"
          />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Trippy<span className="text-blue-600">.</span>
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-600">
          Clean trip operations, <br />
          <span className="text-slate-900">built for daily speed.</span>
        </p>
      </div>

      {/* Action Card */}
      <div className="w-full rounded-3xl border border-slate-300 bg-white p-3 shadow-xl">
        <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white px-8 py-10">
          
          <div className="mb-8 w-full">
            <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-500">
              Secure Sign In
            </h2>
          </div>

          <div className="flex w-full justify-center transition-transform hover:scale-105 active:scale-95">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const res = await axios.post(
                  "http://localhost:5000/user/auth/google",
                  { credential: credentialResponse.credential }
                );
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/home");
              }}
              onError={() => console.log("Login failed")}
              useOneTap
              theme="filled_blue"
              shape="rectangular"
              text="continue_with"
              width="200"
              size="large"
              
              
            />
          </div>

          <p className="mt-8 text-xs font-medium text-slate-400">
            Continue to access your dashboard.
          </p>

        </div>
      </div>

    </main>
  </div>
);
};

export default Landing;
