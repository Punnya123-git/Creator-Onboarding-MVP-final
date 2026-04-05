import { useState, useEffect } from "react";

// Modal for editing category
import CategoryEditorModal from "./CategoryEditorModal";

// Firebase delete and add logic
import { deleteCategory, addCategory } from "./CategoryActions";

function CategoryManager({ creatorData, setCreatorData }) {

    // STATE MANAGEMENT
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editing, setEditing] = useState(false);
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
    const [newCategory, setNewCategory] = useState("");
    const [preview, setPreview] = useState(null);

    // INITIAL LOAD
    useEffect(() => {
        if (creatorData?.extra_categories?.length > 0) {
            setSelectedCategory(creatorData.extra_categories[0].name);
        }
    }, [creatorData]);

    // ADD CATEGORY FUNCTION
    async function handleAddCategory() {

        // prevent empty input
        if (!newCategory.trim()) return;

        try {
            const updated = await addCategory(newCategory, creatorData);

            // update UI instantly
            setCreatorData((prev) => ({
                ...prev,
                extra_categories: updated,
            }));

            // reset input
            setNewCategory("");

        } catch (err) {
            console.error("Add category failed:", err);
        }
    }

    // DELETE CATEGORY
    async function handleDeleteCategory(category) {
        const confirmDelete = window.confirm("Delete this category?");
        if (!confirmDelete) return;

        try {
            const updated = await deleteCategory(category, creatorData);

            setCreatorData((prev) => ({
                ...prev,
                extra_categories: updated,
            }));

        } catch (err) {
            console.error("Delete failed:", err);
        }
    }

    // CURRENT CATEGORY
    const currentCategory = creatorData?.extra_categories?.find(
        (cat) => cat.name === selectedCategory
    );

    // UI STARTS HERE
    return (
        <div className="card shadow border-0 rounded-4 mb-4">
            <div className="card-body p-4">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Categories</h5>
                </div>

                {/* CATEGORY LIST  */}
                <div className="d-flex flex-wrap gap-3 mb-4">
                    {creatorData?.extra_categories?.map((cat) => (

                        <div
                            key={cat.name}
                            className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill border 
                            ${selectedCategory === cat.name
                                    ? "bg-dark text-white border-dark"
                                    : "bg-light"
                                }`}
                        >

                            {/* CATEGORY NAME */}
                            <span
                                style={{ cursor: "pointer", fontSize: "0.9rem" }}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                {cat.name}
                            </span>

                            {/* ACTION BUTTON GROUP */}
                            <div className="btn-group btn-group-sm">

                                {/* EDIT */}
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setSelectedCategoryObj(cat);
                                        setEditing(true);
                                    }}
                                >
                                    ✏
                                </button>

                                {/* DELETE */}
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDeleteCategory(cat)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


                {/*  MEDIA GRID (CARD STYLE)*/}
                {currentCategory?.media?.length > 0 ? (
                    <div className="row g-4">
                        {currentCategory.media.map((url) => {
                            const isVideo = /\.(mp4|mov|webm)$/i.test(url);

                            return (
                                <div
                                    className="col-6 col-md-4 col-lg-3 "
                                    key={url}>

                                    {/* MEDIA CARD */}
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                                            onClick={() => setPreview({ url, isVideo })}>

                                        {isVideo ? (
                                            <video
                                                src={url}
                                                controls
                                                className="w-100"
                                                style={{
                                                    height: "170px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={url}
                                                alt="media"
                                                className="w-100"
                                                style={{
                                                    height: "170px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                ) : (

                    // EMPTY STATE 
                    <div className="text-center py-5 text-muted">
                        <p className="mb-1 fw-semibold">No media available</p>
                        <small>Add media to get started</small>
                    </div>
                )}
            </div>

            {/* ADD CATEGORY UI */}
            <div className="d-flex gap-2 mb-4">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />

                <button
                    className="btn btn-dark"
                    onClick={handleAddCategory}
                >
                    Add
                </button>

            </div>

            {/* EDIT MODAL */}
            <CategoryEditorModal
                show={editing}
                onClose={() => setEditing(false)}
                category={selectedCategoryObj}
                creatorData={creatorData}
                setCreatorData={setCreatorData}
            />

            {/* Preview Modal */}
                {preview && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 20
                        }}
                        onClick={() => setPreview(null)}
                    >
                        {preview.isVideo ? (
                            <video
                                src={preview.url}
                                controls
                                autoPlay
                                style={{ maxHeight: "80%", maxWidth: "90%" }}
                            />
                        ) : (
                            <img
                                src={preview.url}
                                alt=""
                                style={{ maxHeight: "80%", maxWidth: "90%" }}
                            />
                        )}
                    </div>
                )}
        </div>
    );
}

export default CategoryManager;