import { auth, db } from "./firebase-config.js"; // <-- Removed 'storage'

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// <-- Removed the firebase-storage import entirely

const form = document.getElementById("registerForm");
const loading = document.getElementById("loading");

// Helper function to convert a File into a Base64 String
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const mobile = document.getElementById("mobile").value.trim();
    const country = document.getElementById("country").value.trim();
    const education = document.getElementById("education").value.trim();
    const experience = document.getElementById("experience").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const resumeFile = document.getElementById("resume").files[0];

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (!resumeFile) {
        alert("Please upload your resume.");
        return;
    }

    // Strict 1MB Check for Firestore Document constraints (1,048,576 bytes)
    if (resumeFile.size > 1024 * 1024) {
        alert("File is too large. On the free tier, resumes must be smaller than 1MB.");
        return;
    }

    loading.style.display = "flex";

    try {
        // 1. Create Authentication Account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Convert PDF to Base64 String
        const resumeBase64String = await fileToBase64(resumeFile);

        // 3. Save User Details + Base64 Resume directly into Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName,
            email,
            mobile,
            country,
            education,
            experience,
            skills,
            resumeData: resumeBase64String, // Saved as a long text string
            createdAt: new Date()
        });

        alert("Account Created Successfully.");
        window.location.href = "profile.html";

    } catch (error) {
        console.error("Registration Error: ", error);
        let message = "";

        switch (error.code) {
            case "auth/email-already-in-use":
                message = "Email already registered.";
                break;
            case "auth/invalid-email":
                message = "Invalid email address.";
                break;
            case "auth/weak-password":
                message = "Password should be at least 6 characters.";
                break;
            default:
                message = error.message;
        }
        alert(message);
    } finally {
        loading.style.display = "none";
    }
});