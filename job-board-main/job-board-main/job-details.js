import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const loadingIndicator = document.getElementById("loading");
const jobContent = document.getElementById("job-content");
const applyBtn = document.getElementById("apply-btn");

// Global Variables to track the state
let currentJobId = null;
let currentUser = null;

// 1. Check if the user is logged in
onAuthStateChanged(auth, (user) => {
    currentUser = user;
});

// 2. Function to fetch and display the job details
async function fetchJobDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    currentJobId = urlParams.get("id");

    if (!currentJobId) {
        loadingIndicator.innerHTML = "<p>No job ID provided. Please go back to the home page.</p>";
        return;
    }

    try {
        const docRef = doc(db, "jobs", currentJobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const job = docSnap.data();

            document.getElementById("detail-title").textContent = job.title || "Untitled Job";
            
            // FIXED PROPERTY NAMES BELOW TO MATCH DATABASE:
            document.getElementById("detail-company").textContent = job.company || "Unknown Company";
            document.getElementById("detail-location").textContent = job.location || "Remote / Unspecified";
            document.getElementById("detail-salary").textContent = job.salary || "Salary Undisclosed";
            document.getElementById("detail-experience").textContent = job.experience || "Entry Level";
            document.getElementById("detail-type").textContent = job.jobType || "Full-Time";
            
            document.getElementById("detail-description").textContent = job.description || "No description provided.";
            document.getElementById("detail-requirements").textContent = job.requirements || "No specific requirements listed.";

            loadingIndicator.style.display = "none";
            jobContent.style.display = "block";
            
            // Check if user already applied to change button text immediately
            checkIfAlreadyApplied();

        } else {
            loadingIndicator.innerHTML = "<p>Job not found. It may have been removed.</p>";
        }
    } catch (error) {
        console.error("Error fetching job details:", error);
        loadingIndicator.innerHTML = `<p>Error loading job details: ${error.message}</p>`;
    }
}

// 3. Helper to check if they already applied
async function checkIfAlreadyApplied() {
    if (!currentUser || !currentJobId) return;
    
    // We use a custom ID format: jobId_userId
    const applicationId = `${currentJobId}_${currentUser.uid}`;
    const appRef = doc(db, "applications", applicationId);
    const appSnap = await getDoc(appRef);
    
    if (appSnap.exists()) {
        applyBtn.textContent = "Already Applied";
        applyBtn.style.backgroundColor = "#64748b"; // Gray color
        applyBtn.disabled = true;
        applyBtn.style.cursor = "not-allowed";
    }
}

// 4. Handle the Apply Button Click
applyBtn.addEventListener("click", async () => {
    // A. Stop them if they aren't logged in
    if (!currentUser) {
        alert("You must be logged in to apply for jobs!");
        window.location.href = "login.html";
        return;
    }

    try {
        // Change button state to show it's working
        applyBtn.textContent = "Submitting...";
        applyBtn.disabled = true;

        // B. Fetch the user's full profile details from the database
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            alert("Could not find your user profile. Please complete registration.");
            applyBtn.textContent = "Apply Now";
            applyBtn.disabled = false;
            return;
        }

        const userData = userDocSnap.data();

        // C. Create the Application Record
        const applicationId = `${currentJobId}_${currentUser.uid}`; 
        
        await setDoc(doc(db, "applications", applicationId), {
            jobId: currentJobId,
            userId: currentUser.uid,
            applicantName: userData.fullName,
            applicantEmail: userData.email,
            applicantPhone: userData.mobile,
            resumeData: userData.resumeData || null,
            status: "Pending Review",
            appliedAt: serverTimestamp() 
        });

        // D. Success UI Update
        alert("Application submitted successfully!");
        applyBtn.textContent = "Applied Successfully";
        applyBtn.style.backgroundColor = "#16a34a"; // Success Green
        applyBtn.style.cursor = "not-allowed";

    } catch (error) {
        console.error("Application Error: ", error);
        alert("Failed to apply. " + error.message);
        applyBtn.textContent = "Apply Now";
        applyBtn.disabled = false;
    }
});

// Run the function when the page loads
window.addEventListener("DOMContentLoaded", fetchJobDetails);