import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const loading = document.getElementById("loading");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const country = document.getElementById("country");
const education = document.getElementById("education");
const experience = document.getElementById("experience");
const skills = document.getElementById("skills");

const resumeLink = document.getElementById("resumeLink");
const profileForm = document.getElementById("profileForm");

const logoutBtn = document.getElementById("logoutBtn");
const deleteBtn = document.getElementById("deleteBtn");

let currentUser;

// ---------------------------
// Check Login & Fetch Data
// ---------------------------

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;
    loading.style.display = "flex";

    try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            userName.textContent = data.fullName;
            userEmail.textContent = data.email;

            fullName.value = data.fullName || "";
            email.value = data.email || "";
            mobile.value = data.mobile || "";
            country.value = data.country || "";
            education.value = data.education || "";
            experience.value = data.experience || "";
            skills.value = data.skills || "";

            // --- UPDATED RESUME LOGIC ---
            if (data.resumeData) {
                resumeLink.href = data.resumeData;
                
                // Create a dynamic filename based on the user's name
                const fileName = data.fullName ? `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf` : "Resume.pdf";
                resumeLink.download = fileName; 
                
                resumeLink.innerText = "Download Resume";
                
                // Remove target="_blank" because base64 strings shouldn't open in new tabs
                resumeLink.removeAttribute("target"); 
            } else {
                resumeLink.innerText = "Resume Not Uploaded";
                resumeLink.removeAttribute("href");
                resumeLink.removeAttribute("download");
            }
            // ----------------------------
        }
    } catch (error) {
        alert("Error fetching profile: " + error.message);
    } finally {
        loading.style.display = "none";
    }
});


// ---------------------------
// Update Profile
// ---------------------------

profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.style.display = "flex";

    try {
        await updateDoc(
            doc(db, "users", currentUser.uid),
            {
                fullName: fullName.value,
                mobile: mobile.value,
                country: country.value,
                education: education.value,
                experience: experience.value,
                skills: skills.value
            }
        );

        userName.textContent = fullName.value;
        alert("Profile Updated Successfully.");
    } catch (error) {
        alert(error.message);
    } finally {
        loading.style.display = "none";
    }
});


// ---------------------------
// Logout
// ---------------------------

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});


// ---------------------------
// Delete Account
// ---------------------------

deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    
    if (!confirmDelete) return;
    
    loading.style.display = "flex";

    try {
        // Delete Firestore Document First
        await deleteDoc(doc(db, "users", currentUser.uid));
        
        // Then Delete Auth User
        await deleteUser(currentUser);
        
        alert("Account Deleted Successfully.");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    } finally {
        loading.style.display = "none";
    }
});