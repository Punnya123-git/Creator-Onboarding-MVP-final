import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../context/Firebase";

const CATEGORIES = [
    "Fitness",
    "Beauty",
    "Tech",
    "Food",
    "Travel",
    "Fashion",
    "Gaming",
    "Education",
];

function ProfileSetup() {
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState(null);
    const [sampleFiles, setSampleFiles] = useState([]);
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");

    function handleProfileImage(e) {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    }

    function handleSampleFiles(e) {
        const selected = Array.from(e.target.files);

        // Merge with previous files
        const updatedFiles = [...sampleFiles, ...selected];

        // Remove duplicates 
        const uniqueFiles = Array.from(
            new Map(updatedFiles.map(file => [file.name, file])).values()
        );

        if (uniqueFiles.length < 3 || uniqueFiles.length > 5) {
            setError("You must have total 3 to 5 files.");
            return;
        }

        setError("");
        setSampleFiles(uniqueFiles);
    }
    async function uploadFile(file, path) {
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const uid = auth.currentUser?.uid;

        // Safety check
        if (!uid) {
            setError("User not logged in.");
            return;
        }
        console.log("user is loged in")
        
        // Validations
        if (!profileImage) return setError("Please upload a profile picture.");
        if (sampleFiles.length < 3 || sampleFiles.length > 5)
            return setError("Please upload 3 to 5 sample files.");
        if (!category) return setError("Please select a category.");

        setLoading(true);
        console.log("validation successful")

        try {
            // 1. Upload profile image
            setProgress("Uploading profile picture...");
            const profileImageUrl = await uploadFile(
                profileImage,
                `creators/${uid}/profile/${Date.now()}-${profileImage.name}`
            );
            console.log("Uploaded profileimage successfully"  , profileImageUrl );
            
            // 2. Upload sample files (parallel ⚡)
            setProgress("Uploading sample content...");
            const sampleUrls = await Promise.all(
                sampleFiles.map((file) =>
                    uploadFile(
                        file,
                        `creators/${uid}/samples/${Date.now()}-${file.name}`
                    )
                )
            );
            console.log("Uploaded samples successfully"  , sampleUrls );

            // 3. Update Firestore
            setProgress("Saving your profile...");
            await updateDoc(doc(db, "creators", uid), {
                profile_image_url: profileImageUrl,
                sample_content_urls: sampleUrls,
                category: category,
                profileComplete: true,
            });

            console.log("Uploaded successfully" , );

            // 4. Redirect
            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        }

        setLoading(false);
        setProgress("");
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "550px" }}>
            <h2 className="mb-2 text-center">Set Up Your Creator Profile</h2>
            <p className="text-center text-muted mb-4">
                Almost there! Fill in your profile details.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            {progress && (
                <div className="alert alert-info d-flex align-items-center gap-2">
                    <div className="spinner-border spinner-border-sm" role="status" />
                    {progress}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* Profile Image */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Profile Picture</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleProfileImage}
                        required
                    />

                    {profileImage && (
                        <img
                            src={URL.createObjectURL(profileImage)}
                            alt="preview"
                            className="mt-2 rounded-circle"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                    )}
                </div>

                {/* Sample Files */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">
                        Sample Content (3–5 files)
                    </label>

                    <input
                        type="file"
                        className="form-control"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleSampleFiles}
                    />

                    {/* Sample files */}
                    {sampleFiles.length > 0 && (
                        <div className="mt-3">
                            <label className="form-label">Selected Files:</label>

                            <ul className="list-group">
                                {sampleFiles.map((file, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {file.name}

                                        <span className="badge bg-primary rounded-pill">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                >
                    {loading ? "Saving Profile..." : "Complete Profile Setup"}
                </button>
            </form>
        </div>
    );
}

export default ProfileSetup;