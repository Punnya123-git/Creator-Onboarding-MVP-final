function DashboardHeader({ onLogout }) {
    return (
        <nav className="navbar sticky-top navbar-dark bg-dark border-bottom border-secondary px-4 py-3">
            {/* Brand */}
            <span className="navbar-brand fw-bold fs-5 text-warning mb-0">
                ✦ CreatorSpace
            </span>

            {/* Logout */}
            <button className="btn btn-outline-warning btn-sm" onClick={onLogout}>
                Log out
            </button>
        </nav>
    );
}

export default DashboardHeader;