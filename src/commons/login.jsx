import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  IdCard,
  Shield,
  Heart,
} from "lucide-react";

const InputField = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  icon: Icon,
  required = false,
  showToggle = false,
  showPassword = false,
  disabled = false,
  onTogglePassword = () => {},
}) => (
  <div className="flex flex-col gap-2">
    <label className="font-medium text-sm text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={showToggle ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        className={`w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 ${
          showToggle ? "pr-10" : ""
        }`}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        required={required}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      {showToggle && (
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={onTogglePassword}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(true); // true = signup, false = login
  const [checked, setChecked] = useState(false); // counsellor status
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [matricOrStaff, setMatricOrStaff] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validation before setting loading state
    if (!profileName || !email || !matricOrStaff || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const role = checked ? "counsellor" : "student";

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: profileName,
            role: role,
          },
        },
      });

      if (authError) throw authError;

      let userId = null;
      if (authData.user) {
        userId = authData.user.id;
      }

      // Insert into users table
      const { error: userInsertError } = await supabase.from("users").insert([
        {
          id: userId,
          email,
          role,
          matric_no: role === "student" ? matricOrStaff : null,
          created_at: new Date(),
        },
      ]);
      if (userInsertError) throw userInsertError;

      // Insert into profile table
      if (role === "student") {
        const { error: studentError } = await supabase
          .from("student_profiles")
          .insert([
            {
              id: userId,
              full_name: profileName,
              matric_no: matricOrStaff,
              department: "",
            },
          ]);
        if (studentError) throw studentError;
      } else {
        const { error: counsellorError } = await supabase
          .from("counsellor_profiles")
          .insert([
            {
              id: userId,
              full_name: profileName,
              staff_id: matricOrStaff,
            },
          ]);
        if (counsellorError) throw counsellorError;
      }

      toast.success("Account created! Check your email for verification.");
      setAccount(false);
      setProfileName("");
      setEmail("");
      setMatricOrStaff("");
      setPassword("");
      setChecked(false);
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation before setting loading state
    if (!loginEmail || !loginPassword) {
      toast.error("Email and password are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      if (data) console.log(data);

      // Get user role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data?.user?.id)
        .single();

      if (userError) console.log(userError);
      if (userData) console.log(userData);

      toast.success("Login successful!");

      // Redirect based on role
      if (userData.role === "counsellor") {
        navigate("/counsellor");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    setAccount(!account);
    // Reset form fields
    setProfileName("");
    setEmail("");
    setMatricOrStaff("");
    setPassword("");
    setLoginEmail("");
    setLoginPassword("");
    setShowPassword(false);
    setShowLoginPassword(false);
  };

  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23e0e7ff%22%20fill-opacity=%220.4%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-white-600 to-blue-600 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%22100%22%20height=%22100%22%20viewBox=%220%200%20100%20100%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22white%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M50%2030c11.046%200%2020%208.954%2020%2020s-8.954%2020-20%2020-20-8.954-20-20%208.954-20%2020-20zm0%205c-8.284%200-15%206.716-15%2015s6.716%2015%2015%2015%2015-6.716%2015-15-6.716-15-15-15z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-4">
                  Mental Health Support Platform
                </h1>
                <p className="text-lg opacity-90 mb-8">
                  Your journey to better mental health starts here. Connect with
                  professional counselors and access personalized resources.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">Caring Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Forms */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              {account ? (
                // SIGNUP FORM
                <form className="space-y-6" onSubmit={handleCreate}>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Create Account
                    </h2>
                    <p className="text-gray-600">
                      Join our supportive community today
                    </p>
                  </div>

                  <div className="space-y-4">
                    <InputField
                      label="Full Name"
                      type="text"
                      placeholder="Enter your full name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      icon={User}
                      name="fullName"
                    />

                    <InputField
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                      required
                    />

                    <InputField
                      label={checked ? "Staff ID" : "Matric Number"}
                      type="text"
                      placeholder={
                        checked ? "Enter staff ID" : "Enter matric number"
                      }
                      value={matricOrStaff}
                      onChange={(e) => setMatricOrStaff(e.target.value)}
                      icon={IdCard}
                      required
                    />

                    <InputField
                      label="Password"
                      type="password"
                      placeholder="Create password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={Lock}
                      required
                      showToggle
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />

                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                        checked={checked}
                        onChange={handleCheck}
                        id="counsellorCheckbox"
                        disabled={loading}
                      />
                      <label
                        htmlFor="counsellorCheckbox"
                        className="text-sm font-medium text-purple-800 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        I'm registering as a counsellor
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-gray-600 text-center">
                      By creating an account, you agree to our{" "}
                      <span className="font-semibold text-purple-600 hover:underline cursor-pointer">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="font-semibold text-purple-600 hover:underline cursor-pointer">
                        Privacy Policy
                      </span>
                    </p>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={handleSwitch}
                        className="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                // LOGIN FORM
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600">
                      Continue your mental health journey
                    </p>
                  </div>

                  <div className="space-y-4">
                    <InputField
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      icon={Mail}
                      required
                    />

                    <InputField
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      icon={Lock}
                      required
                      showToggle
                      showPassword={showLoginPassword}
                      onTogglePassword={() =>
                        setShowLoginPassword(!showLoginPassword)
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Signing In...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={handleSwitch}
                        className="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
