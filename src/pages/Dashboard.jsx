import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

import { auth, db } from "../context/Firebase";
import useCreatorData from "../hooks/useCreatorData";

import DashboardHeader from "../components/DashboardHeader";
import ProfileCard from "../components/ProfileCard";
import CategorySection from "../components/CategorySection";
import CategoryManager from "../components/CategoryManager";
import MediaGallery from "../components/MediaGallery";

// Dropdown options — edit here to update all modals 
const CATEGORIES = [
    "Lifestyle", "Fashion", "Tech", "Food", "Travel",
    "Fitness", "Gaming", "Beauty", "Education", "Finance",
];

const PLATFORMS = [
    "Instagram", "YouTube", "TikTok", "Twitter/X",
    "LinkedIn", "Twitch", "Snapchat", "Pinterest",
];

function Dashboard() {
    const navigate = useNavigate();
    const { creatorData, setCreatorData, loading, error } = useCreatorData(navigate);
    const [saving, setSaving] = useState(false);

    // Logout      
    async function logout() {
        await signOut(auth);
        navigate("/login");
    }

    //Save updated fields to Firestore      
    async function save(formData) {
        const user = auth.currentUser;
        if (!user) return;

        setSaving(true);
        try {
            await updateDoc(doc(db, "creators", user.uid), formData);
            // Update local state immediately so UI reflects changes
            setCreatorData((prev) => ({ ...prev, ...formData }));
        } catch (err) {
            console.error("Save failed:", err);
            alert("Couldn't save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    // Loading      
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
                <div className="spinner-border text-warning" role="status" />
            </div>
        );
    }

    //Error      
    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        // Dark background for the entire page
        <div className="bg-dark min-vh-100">

            {/* Sticky top nav */}
            <DashboardHeader onLogout={logout} />

            {/* Page content — constrained width, centered */}
            <div className="container py-4" style={{ maxWidth: 720 }}>

                {/* Profile summary card with edit button */}
                <ProfileCard
                    creatorData={creatorData}
                    onSave={save}
                    saving={saving}
                    CATEGORIES={CATEGORIES}
                    PLATFORMS={PLATFORMS}
                />

                {/* Read-only category display */}
                <CategorySection creatorData={creatorData} />

                {/* Editable category tags */}
                <CategoryManager
                    creatorData={creatorData}
                    setCreatorData={setCreatorData}
                />

                {/* Sample content gallery */}
                <MediaGallery media={creatorData?.sample_content_urls || []} />

            </div>
        </div>
    );
}

export default Dashboard;