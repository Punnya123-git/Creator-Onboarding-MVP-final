import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../context/Firebase";

export default function useCreatorData(navigate) {
    const [creatorData, setCreatorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                const snap = await getDoc(doc(db, "creators", user.uid));
                if (snap.exists()) {
                    const data = snap.data();
                    if (!data.profileComplete) {
                        navigate("/setup");
                        return;
                    }
                    setCreatorData(data);
                } else {
                    setError("Profile not found");
                }
            } catch {
                setError("Failed to load profile");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    return { creatorData, setCreatorData, loading, error };
}
