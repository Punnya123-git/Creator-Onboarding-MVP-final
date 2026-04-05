import { doc, updateDoc } from "firebase/firestore";
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../context/Firebase";

//ADD CATEGORY
export async function addCategory(name, creatorData) {

    const newCat = {
        name,
        media: [],
    };

    const updated = [
        ...(creatorData.extra_categories || []),
        newCat,
    ];

    //update firestore 
    return updated; 
}

// DELETE FULL CATEGORY + ALL MEDIA
export async function deleteCategory(category, creatorData) {
    const user = auth.currentUser;
    if (!user) return;

    // delete all files from storage
    await Promise.all(
        category.media.map(async (url) => {
            try {
                await deleteObject(ref(storage, url));
            } catch (err) {
                console.warn("File delete failed:", err);
            }
        })
    );

    // remove category from array
    const updated = creatorData.extra_categories.filter(
        (c) => c.name !== category.name
    );

    // update firestore
    await updateDoc(doc(db, "creators", user.uid), {
        extra_categories: updated,
    });

    return updated; // return updated data to UI
}

// DELETE SINGLE MEDIA
export async function deleteMedia(url, category, creatorData) {
    const user = auth.currentUser;
    if (!user) return;

    // delete file from storage
    await deleteObject(ref(storage, url));

    // remove media from that category
    const updated = creatorData.extra_categories.map((c) => {
        if (c.name === category.name) {
            return {
                ...c,
                media: c.media.filter((m) => m !== url),
            };
        }
        return c;
    });

    await updateDoc(doc(db, "creators", user.uid), {
        extra_categories: updated,
    });

    return updated;
}

//ADD MEDIA TO CATEGORY
export async function addMedia(files, category, creatorData) {
    const user = auth.currentUser;
    if (!user) return;

    // upload all files
    const urls = await Promise.all(
        files.map(async (file) => {
            const fileRef = ref(
                storage,
                `categories/${user.uid}/${Date.now()}-${file.name}`
            );
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        })
    );

    // add new media to category
    const updated = creatorData.extra_categories.map((c) => {
        if (c.name === category.name) {
            return {
                ...c,
                media: [...c.media, ...urls],
            };
        }
        return c;
    });

    await updateDoc(doc(db, "creators", user.uid), {
        extra_categories: updated,
    });

    return updated;
}