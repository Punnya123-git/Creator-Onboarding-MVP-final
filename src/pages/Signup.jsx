import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, googleProvider } from "../context/Firebase";

const PLATFORMS = ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"];

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        social_handle: "",
        location: "",
        platform: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    //  Email/Password Signup 
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            console.log("User created:", user.uid);

            await setDoc(doc(db, "creators", user.uid), {
                name: formData.name,
                email: formData.email,
                social_handle: formData.social_handle,
                location: formData.location,
                platform: formData.platform,
                profile_image_url: "",
                extra_categories: [], 
                isGoogleUser: false, 
                profileComplete: false,
                createdAt: new Date(),
            });

            console.log("Creator saved to Firestore");
            navigate("/profile-setup");

        } catch (err) {
            console.error("Signup error:", err);
            setError(err.message);
        }

        setLoading(false);
    }

    //  Google Signup
    async function handleGoogleSignup() {
        setError("");
        setLoading(true);

        try {
            // Opens Google popup
            const { user } = await signInWithPopup(auth, googleProvider);
            console.log("Google user:", user.uid, user.displayName, user.email);

            // Check if this user already has a Firestore doc
            // (they might be signing in again, not first time)
            const docRef = doc(db, "creators", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Already registered before → check profile status
                console.log("Existing Google user, redirecting...");
                const data = docSnap.data();
                navigate(data.profileComplete ? "/dashboard" : "/profile-setup");
            } else {
                // First time Google login → create Firestore doc
                // Name + email auto-filled from Google account
                await setDoc(docRef, {
                    name: user.displayName || "Creator",
                    email: user.email || "",
                    profile_image_url: user.photoURL || "",
                    social_handle: "",
                    location: "",
                    platform: "",
                    profileComplete: false,
                    isGoogleUser: true,
                    extra_categories: [],
                    createdAt: new Date(),
                });
                console.log("New Google user saved to Firestore");
                navigate("/profile-setup");
            }

        } catch (err) {
            console.error("Google signup error:", err);
            setError("Google sign-in failed. Please try again.");
        }

        setLoading(false);
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4 text-center">Creator Sign Up</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* ── Google Sign Up Button ── */}
            <button
                className="btn btn-outline-dark w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                onClick={handleGoogleSignup}
                disabled={loading}
            >
                {/* Google SVG icon */}
                <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Continue with Google
            </button>

            {/* ── Divider ── */}
            <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted small">or sign up with email</span>
                <hr className="flex-grow-1" />
            </div>

            {/* ── Email/Password Form ── */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" className="form-control"
                        value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control"
                        value={formData.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" className="form-control"
                        value={formData.password} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Platform</label>
                    <select name="platform" className="form-select"
                        value={formData.platform} onChange={handleChange} required>
                        <option value="">Select platform</option>
                        {PLATFORMS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Social Handle</label>
                    <input type="text" name="social_handle" className="form-control"
                        placeholder="@yourhandle" value={formData.social_handle}
                        onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Location (City, Country)</label>
                    <input type="text" name="location" className="form-control"
                        placeholder="e.g. Mumbai, India" value={formData.location}
                        onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
            </form>

            <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    );
}

export default Signup;