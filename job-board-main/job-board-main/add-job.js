import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ----------------------
// Elements
// ----------------------

const jobForm = document.getElementById("jobForm");

const pageTitle = document.getElementById("pageTitle");
const saveBtn = document.getElementById("saveBtn");

const logoutBtn = document.getElementById("logoutBtn");
const loading = document.getElementById("loading");

const title = document.getElementById("title");
const company = document.getElementById("company");
const location = document.getElementById("location");
const salary = document.getElementById("salary");
const jobType = document.getElementById("jobType");
const experience = document.getElementById("experience");
const skills = document.getElementById("skills");
const description = document.getElementById("description");
const lastDate = document.getElementById("lastDate");

// ----------------------
// Get Job Id
// ----------------------

const params = new URLSearchParams(window.location.search);

const jobId = params.get("id");

// ----------------------
// Check Login
// ----------------------

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "admin-login.html";

        return;

    }

    if (jobId) {

        pageTitle.textContent = "Edit Job";

        saveBtn.textContent = "Update Job";

        loadJob();

    }

});

// ----------------------
// Load Job
// ----------------------

async function loadJob() {

    loading.style.display = "flex";

    try {

        const docRef = doc(db, "jobs", jobId);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {

            alert("Job not found.");

            window.location.href = "admin-dashboard.html";

            return;

        }

        const job = docSnap.data();

        title.value = job.title || "";
        company.value = job.company || "";
        location.value = job.location || "";
        salary.value = job.salary || "";
        jobType.value = job.jobType || "";
        experience.value = job.experience || "";
        skills.value = job.skills || "";
        description.value = job.description || "";
        lastDate.value = job.lastDate || "";

    }

    catch (error) {

        alert(error.message);

    }

    finally {

        loading.style.display = "none";

    }

}

// ----------------------
// Save / Update Job
// ----------------------

jobForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    loading.style.display = "flex";

    const jobData = {

        title: title.value.trim(),

        company: company.value.trim(),

        location: location.value.trim(),

        salary: salary.value.trim(),

        jobType: jobType.value,

        experience: experience.value.trim(),

        skills: skills.value.trim(),

        description: description.value.trim(),

        lastDate: lastDate.value

    };

    try {

        if (jobId) {

            await updateDoc(

                doc(db, "jobs", jobId),

                jobData

            );

            alert("Job Updated Successfully.");

        }

        else {

            jobData.createdAt = serverTimestamp();

            await addDoc(

                collection(db, "jobs"),

                jobData

            );

            alert("Job Added Successfully.");

            jobForm.reset();

        }

        window.location.href = "admin-dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

    finally {

        loading.style.display = "none";

    }

});

// ----------------------
// Logout
// ----------------------

logoutBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    await signOut(auth);

    window.location.href = "admin-login.html";

});