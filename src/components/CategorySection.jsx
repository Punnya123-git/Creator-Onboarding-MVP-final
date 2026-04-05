function CategorySection({ creatorData }) {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <p><strong>Category:</strong> {creatorData?.category}</p>
                <p><strong>Platform:</strong> {creatorData?.platform}</p>
            </div>
        </div>
    );
}
export default CategorySection;