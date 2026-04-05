import { useState } from "react";

function MediaGallery({ media = [], title = "Content" }) {

    const [preview, setPreview] = useState(null);

    return (
        <div className="card shadow-sm">
            <div className="card-body">

                {/* Title */}
                <h5 className="card-title mb-3">
                    {title}
                    <span className="text-muted fs-6 fw-normal ms-2">
                        ({media.length} files)
                    </span>
                </h5>

                {/* Grid */}
                {media.length > 0 ? (
                    <div className="row g-3">
                        {media.map((url) => {
                            const isVideo = /\.(mp4|mov|webm)$/i.test(url);

                            return (
                                <div className="col-6 col-md-4" key={url}>
                                    <div
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setPreview({ url, isVideo })}
                                    >
                                        {isVideo ? (
                                            <video
                                                src={url}
                                                muted
                                                playsInline
                                                className="w-100 rounded"
                                                style={{ height: "180px", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <img
                                                src={url}
                                                alt=""
                                                loading="lazy"
                                                className="w-100 rounded"
                                                style={{ height: "180px", objectFit: "cover" }}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-muted">No content available</p>
                )}

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
                            zIndex: 2000
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
        </div>
    );
}

export default MediaGallery;