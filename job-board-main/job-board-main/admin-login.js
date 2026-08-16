import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const adminLoginForm = document.getElementById("adminLoginForm");

const email = document.getElementById("email");
const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const loading = document.getElementById("loading");

// ============================
// Show / Hide Password
// ============================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});

// ============================
// Admin Login
// ============================

adminLoginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    loading.style.display = "flex";

    try {

        const userCredential = await signInWithEmailAndPassword(

            auth,

            email.value.trim(),

            password.value

        );

        const user = userCredential.user;

        // Change this to your admin email
        const adminEmail = "admin@gcccareershub.com";

        if (user.email !== adminEmail) {

            await signOut(auth);

            alert("Access Denied! You are not an administrator.");

            loading.style.display = "none";

            return;

        }

        alert("Admin Login Successful.");

        window.location.href = "admin-dashboard.html";

    }

    catch (error) {

        let message = "";

        switch (error.code) {

            case "auth/invalid-email":
                message = "Invalid Email Address.";
                break;

            case "auth/user-not-found":
                message = "Admin account not found.";
                break;

            case "auth/wrong-password":
                message = "Incorrect Password.";
                break;

            case "auth/invalid-credential":
                message = "Invalid Email or Password.";
                break;

            default:
                message = error.message;

        }

        alert(message);

    }

    finally {

        loading.style.display = "none";

    }

});