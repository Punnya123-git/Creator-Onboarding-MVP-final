import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, googleProvider } from "../context/Firebase";
import { setDoc } from "firebase/firestore";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    //  Email/Password Login 
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in:", user.uid);

            const docSnap = await getDoc(doc(db, "creators", user.uid));
            if (docSnap.exists() && docSnap.data().profileComplete) {
                navigate("/dashboard");
            } else {
                navigate("/profile-setup");
            }

        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid email or password. Please try again.");
        }

        setLoading(false);
    }

    //  Google Login 
    async function handleGoogleLogin() {
        setError("");
        setLoading(true);

        try {
            const { user } = await signInWithPopup(auth, googleProvider);
            console.log("Google login:", user.uid, user.email);

            const docRef = doc(db, "creators", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                navigate(data.profileComplete ? "/dashboard" : "/profile-setup");
            } else {
                //  First-time Google login -> create user
                await setDoc(docRef, {
                    name: user.displayName || "Creator",
                    email: user.email || "",
                    profile_image_url: user.photoURL || "",
                    social_handle: "",
                    location: "",
                    platform: "",
                    extra_categories: [],
                    isGoogleUser: true,
                    profileComplete: false,
                    createdAt: new Date(),
                });

                console.log("New Google user created from login page");
                navigate("/profile-setup");
            }

        } catch (err) {
            console.error("Google login error:", err);
            setError("Google sign-in failed. Please try again.");
        }

        setLoading(false);
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <h2 className="mb-4 text-center">Creator Log In</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {/*  Google Login Button */}
            <button
                className="btn btn-outline-dark w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
            >
                <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Continue with Google
            </button>

            {/* Divider */}
            <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted small">or log in with email</span>
                <hr className="flex-grow-1" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </form>

            <p className="mt-3 text-center">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}