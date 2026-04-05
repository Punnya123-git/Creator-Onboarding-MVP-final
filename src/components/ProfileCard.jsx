import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

function ProfileCard({
    creatorData,
    onSave,
    saving,
    CATEGORIES,
    PLATFORMS,
}) {
    const [showEdit, setShowEdit] = useState(false);

    // Await the save, then close modal — ensures modal closes only on success
    async function handleSave(formData) {
        await onSave(formData);
        setShowEdit(false);
    }

    const avatarLetter = creatorData?.name?.[0]?.toUpperCase() || "?";

    return (
        <>
            {/* Modal rendered outside the card to avoid stacking context issues */}
            <EditProfileModal
                show={showEdit}
                onClose={() => setShowEdit(false)}
                onSave={handleSave}
                creatorData={creatorData}
                saving={saving}
                CATEGORIES={CATEGORIES}
                PLATFORMS={PLATFORMS}
            />

            {/* ── Profile Card ── */}
            <div className="card bg-dark border border-secondary rounded-4 shadow mb-4">
                <div className="card-body p-4">

                    {/* Small section label */}
                    <p className="text-warning text-uppercase fw-semibold mb-3"
                        style={{ fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                        ✦ Creator Profile
                    </p>

                    <div className="d-flex align-items-center gap-4 flex-wrap">

                        {/* ── Avatar ── */}
                        {creatorData?.profile_image_url ? (
                            <img
                                src={creatorData.profile_image_url}
                                alt={creatorData.name}
                                className="rounded-circle border border-warning"
                                style={{ width: 88, height: 88, objectFit: "cover", flexShrink: 0 }}
                            />
                        ) : (
                            // Fallback: gold initial on dark background
                            <div
                                className="rounded-circle bg-black border border-warning
                           d-flex align-items-center justify-content-center
                           text-warning fw-bold fs-3 flex-shrink-0"
                                style={{ width: 88, height: 88 }}
                            >
                                {avatarLetter}
                            </div>
                        )}

                        {/* ── Info block ── */}
                        <div className="flex-grow-1">
                            <h4 className="text-light fw-semibold mb-1">
                                {creatorData?.name || "—"}
                            </h4>
                            <p className="text-secondary small mb-2">
                                {creatorData?.email}
                            </p>

                            {/* Metadata badges */}
                            <div className="d-flex flex-wrap gap-2">
                                {creatorData?.platform && (
                                    <span className="badge bg-warning text-dark fw-semibold">
                                        {creatorData.platform}
                                    </span>
                                )}
                                {creatorData?.category && (
                                    <span className="badge bg-secondary">
                                        {creatorData.category}
                                    </span>
                                )}
                                {creatorData?.social_handle && (
                                    <span className="badge border border-secondary text-secondary">
                                        @{creatorData.social_handle}
                                    </span>
                                )}
                                {creatorData?.location && (
                                    <span className="badge border border-secondary text-secondary">
                                        📍 {creatorData.location}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ── Edit button ── */}
                        <button
                            className="btn btn-outline-warning btn-sm align-self-start"
                            onClick={() => setShowEdit(true)}
                            title="Edit profile"
                        >
                            ✏️ Edit
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileCard;