// 📁 Modal to EDIT category (add/delete media)

import { useState } from "react";
import { deleteMedia, addMedia } from "./CategoryActions";

function CategoryEditorModal({
    show,
    onClose,
    category,
    creatorData,
    setCreatorData,
}) {


    //     STATE MANAGEMENT
    // Stores selected files for upload
    const [files, setFiles] = useState([]);

    //     SAFETY CHECK
    // If modal is closed OR no category -> don't render anything
    if (!show || !category) return null;

    const currentCategory = creatorData?.extra_categories?.find(
        (cat) => cat.name === category.name
    );

    //     DELETE MEDIA
    async function handleDeleteMedia(url) {
        try {
            // Call firebase delete logic
            const updated = await deleteMedia(url, category, creatorData);

            // ✅ Update UI instantly (VERY IMPORTANT)
            setCreatorData((prev) => ({
                ...prev,
                extra_categories: updated,
            }));

        } catch (err) {
            console.error("Delete failed:", err);
        }
    }

    //     ADD MEDIA
    async function handleAddMedia() {

        // Prevent empty upload
        if (files.length === 0) return;

        try {
            // Call firebase upload logic
            const updated = await addMedia(files, category, creatorData);

            // Update UI instantly
            setCreatorData((prev) => ({
                ...prev,
                extra_categories: updated,
            }));

            // Reset file input
            setFiles([]);

        } catch (err) {
            console.error("Upload failed:", err);
        }
    }

    // UI   
    return (
        <div
            className="modal d-block"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={onClose} // click outside to close
        >

            <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()} // prevent close on inside click
            >

                <div className="modal-content p-3">

                    {/*     TITLE */}
                    <h5 className="mb-3">
                        Edit Category: {category.name}
                    </h5>


                    {/*  FILE INPUT */}
                    <input
                        type="file"
                        multiple
                        className="form-control mb-2"
                        onChange={(e) =>
                            setFiles([...e.target.files])
                        }
                    />

                    {/*     ADD MEDIA BUTTON */}
                    <button
                        className="btn btn-primary w-100 mb-3"
                        onClick={handleAddMedia}
                    >
                        Add Media
                    </button>

                    {/*  MEDIA LIST*/}
                    {currentCategory?.media?.length > 0 ? (

                        currentCategory.media.map((url) => (

                            <div
                                key={url}
                                className="d-flex justify-content-between align-items-center mb-2"
                            >

                                {/* MEDIA LABEL */}
                                <span className="text-truncate">
                                    Media
                                </span>

                                {/*DELETE BUTTON */}
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        handleDeleteMedia(url)
                                    }
                                >
                                    Delete
                                </button>

                            </div>
                        ))

                    ) : (

                        // EMPTY STATE
                        <p className="text-muted text-center">
                            No media available
                        </p>
                    )}


                    {/*  CLOSE BUTTON */}
                    <button
                        className="btn btn-secondary w-100 mt-2"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
}

export default CategoryEditorModal;