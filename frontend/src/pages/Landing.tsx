import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 antialiased">
      {/* Brand Mark */}
      <div className="mb-16">
        <div className="h-20 w-20 md:h-24 md:w-24">
          <img rel="icon" src="/Trippy_logo.png" />
        </div>{" "}
        {/* Just a simple black square rotated */}
      </div>

      <main className="flex w-full max-w-[320px] flex-col space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-[22px] font-medium tracking-tight text-black">
            Log in to your account
          </h1>
          <p className="text-[14px] text-gray-500">
            Select your Google account to continue.
          </p>
        </div>

        <div className="flex justify-center border-t border-gray-100 pt-8">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const res = await axios.post(
                "http://localhost:5000/user/auth/google",
                {
                  credential: credentialResponse.credential,
                },
              );
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("user", JSON.stringify(res.data.user));

              navigate("/home");
            }}
            onError={() => console.log("Login failed")}
            useOneTap
            theme="outline"
            shape="rectangular"
            width="320"
            size="large"
          />
        </div>
      </main>
    </div>
  );
};

export default Landing;
