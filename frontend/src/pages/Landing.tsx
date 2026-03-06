import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

return (
  <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-6">

    <main className="w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white p-9 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.25)]">

      {/* Wordmark */}
      <div className="mb-10 flex items-center gap-3">
        <img
          src="/Trippy_logo.png"
          alt="Trippy Logo"
          className="h-9 w-9 object-contain"
        />
        <h1 className="text-2xl font-[1000] tracking-tight uppercase leading-none text-gray-900">
          <span className="tracking-widest text-blue-600">
            Trippy<span className="text-gray-900">.</span>
          </span>
        </h1>
      </div>

      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-[36px] font-['Georgia'] font-extrabold leading-[1.05] tracking-tight text-slate-900">
          Good to
          <br />
          <span className="italic opacity-70">see you.</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Sign in to manage your trips.
        </p>
      </div>

      {/* CTA Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        {/* Label */}
        <div className="mb-5 flex items-center gap-2">
           <div className="h-2 w-2 rounded-full p-1 border-4 border-blue-100 bg-blue-600" />
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
            Secure sign in
          </div>
        </div>

        {/* Google Button */}
        <div className="flex w-full justify-center">
          {isLoading ? (
            <div className="flex w-[210px] items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 py-3 text-sm font-medium text-slate-700">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              Signing you in...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) {
                  setErrorMessage("Google login did not return a credential.");
                  return;
                }

                setErrorMessage("");
                setIsLoading(true);
                try {
                  const res = await axios.post(
                    // "http://localhost:5000/user/auth/google",
                   "https://backend-fake-sand.vercel.app/user/auth/google",
                    { credential: credentialResponse.credential },
                  );
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.user));
                  navigate("/home");
                } catch (error) {
                  console.error("Google login failed:", error);
                  setErrorMessage("Unable to sign in right now. Please try again.");
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => setErrorMessage("Google login failed. Please try again.")}
              // useOneTap
              theme="filled_blue"
              shape="rectangular"
              text="continue_with"
              width="210"
              size="large"
            />
          )}
        </div>
        {errorMessage && (
          <p className="mt-3 text-center text-xs font-medium text-red-600">
            {errorMessage}
          </p>
        )}

        {/* Brand Signature */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[11px] font-semibold tracking-[0.35em] text-slate-400">
            SIMPLE<span className="text-blue-600"> · </span>FAST
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

      </div>

    </main>
  </div>
);
};

export default Landing;
