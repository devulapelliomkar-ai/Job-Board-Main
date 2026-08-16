import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Form Elements

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

const loading = document.getElementById("loading");

const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

// ----------------------------
// Show / Hide Password
// ----------------------------

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

// ----------------------------
// Login
// ----------------------------

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const userEmail = email.value.trim();
    const userPassword = password.value.trim();

    if (userEmail === "" || userPassword === "") {

        alert("Please enter Email and Password.");

        return;

    }

    loading.style.display = "flex";

    try {

        await signInWithEmailAndPassword(

            auth,
            userEmail,
            userPassword

        );

        alert("Login Successful!");

        window.location.href = "profile.html";

    }

    catch (error) {

        let message = "Login Failed.";

        switch (error.code) {

            case "auth/invalid-email":
                message = "Invalid Email Address.";
                break;

            case "auth/user-not-found":
                message = "User not found.";
                break;

            case "auth/wrong-password":
                message = "Incorrect Password.";
                break;

            case "auth/invalid-credential":
                message = "Invalid Email or Password.";
                break;

            case "auth/too-many-requests":
                message = "Too many attempts. Try again later.";
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

// ----------------------------
// Forgot Password
// ----------------------------

forgotPassword.addEventListener("click", async (e) => {

    e.preventDefault();

    const userEmail = prompt("Enter your registered Email:");

    if (!userEmail) return;

    try {

        await sendPasswordResetEmail(

            auth,
            userEmail

        );

        alert("Password reset link has been sent to your email.");

    }

    catch (error) {

        alert(error.message);

    }

});