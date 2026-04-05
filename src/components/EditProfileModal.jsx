import { useEffect, useState } from "react";

function EditProfileModal({
  show,        // boolean: controls visibility
  onClose,     // fn: close without saving
  onSave,      // fn(formData): called on Save
  creatorData, // object: current profile for pre-filling
  saving,      // boolean: true while Firebase write is in progress
  CATEGORIES,  // string[]: category dropdown options
  PLATFORMS,   // string[]: platform dropdown options
}) {

  // Local form state — only synced when modal opens
  const [form, setForm] = useState({
    name: "",
    social_handle: "",
    location: "",
    platform: "",
    category: "",
  });

  // Pre-fill whenever the modal opens or creatorData changes
  useEffect(() => {
    if (show && creatorData) {
      setForm({
        name:          creatorData.name          || "",
        social_handle: creatorData.social_handle || "",
        location:      creatorData.location      || "",
        platform:      creatorData.platform      || "",
        category:      creatorData.category      || "",
      });
    }
  }, [show, creatorData]);

  // Generic handler for all inputs and selects
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Send updated form data up to Dashboard → Firestore
  function handleSubmit() {
    onSave(form);
  }

  if (!show) return null;

  return (
    // Full-screen backdrop
    <div
      onClick={onClose}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex
      justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.65)", zIndex: 1050 }}
    >
      {/* Modal box — dark card */}
      <div
        className="bg-dark border border-secondary rounded-4 p-4 shadow-lg"
        style={{ width: "100%", maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >

        {/* ── Header ── */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="text-warning fw-semibold m-0">Edit Profile</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Name ── */}
        <div className="mb-3">
          <label className="form-label text-secondary small text-uppercase fw-semibold ls-1">
            Name
          </label>
          <input
            name="name"
            className="form-control bg-black border-secondary text-light"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* ── Platform ── */}
        <div className="mb-3">
          <label className="form-label text-secondary small text-uppercase fw-semibold">
            Platform
          </label>
          <select
            name="platform"
            className="form-select bg-black border-secondary text-light"
            value={form.platform}
            onChange={handleChange}
          >
            <option value="">Select a platform</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* ── Social Handle ── */}
        <div className="mb-3">
          <label className="form-label text-secondary small text-uppercase fw-semibold">
            Social Handle
          </label>
          <div className="input-group">
            <span className="input-group-text bg-black border-secondary text-secondary">@</span>
            <input
              name="social_handle"
              className="form-control bg-black border-secondary text-light"
              placeholder="yourhandle"
              value={form.social_handle}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ── Location ── */}
        <div className="mb-3">
          <label className="form-label text-secondary small text-uppercase fw-semibold">
            Location
          </label>
          <input
            name="location"
            className="form-control bg-black border-secondary text-light"
            placeholder="City, Country"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        {/* ── Category ── */}
        <div className="mb-4">
          <label className="form-label text-secondary small text-uppercase fw-semibold">
            Category
          </label>
          <select
            name="category"
            className="form-select bg-black border-secondary text-light"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ── Buttons ── */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-warning w-100 fw-semibold"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Saving…
              </>
            ) : "Save Changes"}
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditProfileModal;