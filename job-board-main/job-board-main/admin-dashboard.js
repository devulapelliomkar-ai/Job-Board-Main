import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    collection, getDocs, deleteDoc, doc, updateDoc, query, where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const jobsContainer = document.getElementById("jobsContainer");
const jobTemplate = document.getElementById("jobTemplate");
const logoutBtn = document.getElementById("logoutBtn");
const loading = document.getElementById("loading");

// Modal Elements
const appsModal = document.getElementById("appsModal");
const closeBtn = document.querySelector(".close-btn");
const appsList = document.getElementById("appsList");

// =======================
// Check Admin Login
// =======================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "admin-login.html";
        return;
    }
    loadJobs();
});

// =======================
// Load Jobs
// =======================
async function loadJobs() {
    loading.style.display = "flex";
    jobsContainer.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "jobs"));

        if (querySnapshot.empty) {
            jobsContainer.innerHTML = "<h3>No Jobs Available.</h3>";
            return;
        }

        querySnapshot.forEach((document) => {
            const job = document.data();
            const card = jobTemplate.content.cloneNode(true);

            card.querySelector(".job-title").textContent = job.title;
            card.querySelector(".company").textContent = job.company;
            card.querySelector(".location").textContent = job.location;
            card.querySelector(".salary").textContent = job.salary;
            card.querySelector(".experience").textContent = job.experience;
            card.querySelector(".jobType").textContent = job.jobType;
            card.querySelector(".lastDate").textContent = job.lastDate;

            // View Applications Button
            card.querySelector(".view-apps-btn").addEventListener("click", () => {
                openApplicationsModal(document.id, job.title);
            });

            // Edit Button
            card.querySelector(".edit-btn").addEventListener("click", () => {
                window.location.href = `add-job.html?id=${document.id}`;
            });

            // Delete Button
            card.querySelector(".delete-btn").addEventListener("click", async () => {
                const confirmDelete = confirm("Are you sure you want to delete this job?");
                if (!confirmDelete) return;
                await deleteJob(document.id);
            });

            jobsContainer.appendChild(card);
        });
    } catch (error) {
        alert("Error loading jobs: " + error.message);
    } finally {
        loading.style.display = "none";
    }
}

// =======================
// Delete Job
// =======================
async function deleteJob(jobId) {
    loading.style.display = "flex";
    try {
        await deleteDoc(doc(db, "jobs", jobId));
        alert("Job Deleted Successfully.");
        loadJobs();
    } catch (error) {
        alert(error.message);
    } finally {
        loading.style.display = "none";
    }
}

// =======================
// Applications Logic
// =======================
async function openApplicationsModal(jobId, jobTitle) {
    appsModal.style.display = "flex";
    appsList.innerHTML = "<p>Loading applications...</p>";

    try {
        // Query to find only applications matching this specific Job ID
        const q = query(collection(db, "applications"), where("jobId", "==", jobId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            appsList.innerHTML = "<p style='color: var(--text-light); text-align: center; padding: 20px;'>No applications received for this role yet.</p>";
            return;
        }

        appsList.innerHTML = ""; // Clear loading text

        querySnapshot.forEach((docSnap) => {
            const app = docSnap.data();
            const appId = docSnap.id;
            
            // Format status styling
            let statusClass = "status-pending";
            if(app.status === "Accepted") statusClass = "status-accepted";
            if(app.status === "Rejected") statusClass = "status-rejected";

            // Create App Card
            const appCard = document.createElement("div");
            appCard.className = "app-card";
            appCard.innerHTML = `
                <h4>${app.applicantName} <span class="status-badge ${statusClass}" id="status-${appId}">${app.status || 'Pending'}</span></h4>
                <p><strong>Email:</strong> ${app.applicantEmail}</p>
                <p><strong>Phone:</strong> ${app.applicantPhone}</p>
                <p><strong>Applied:</strong> ${app.appliedAt ? new Date(app.appliedAt.toDate()).toLocaleDateString() : 'Recently'}</p>
                
                <div class="app-actions">
                    <a href="${app.resumeData || '#'}" download="${app.applicantName.replace(/\s+/g, '_')}_Resume.pdf" class="btn-resume">
                        <i class="fa-solid fa-file-pdf"></i> Download Resume
                    </a>
                    <button class="btn-accept" onclick="updateAppStatus('${appId}', 'Accepted', '${app.applicantEmail}', '${jobTitle}')">
                        <i class="fa-solid fa-check"></i> Accept
                    </button>
                    <button class="btn-reject" onclick="updateAppStatus('${appId}', 'Rejected', '${app.applicantEmail}', '${jobTitle}')">
                        <i class="fa-solid fa-xmark"></i> Reject
                    </button>
                </div>
            `;
            appsList.appendChild(appCard);
        });
    } catch (error) {
        console.error(error);
        appsList.innerHTML = `<p style="color:red;">Error loading applications: ${error.message}</p>`;
    }
}

// Make update function globally available so inline onclick works
window.updateAppStatus = async function(appId, newStatus, email, jobTitle) {
    if(!confirm(`Are you sure you want to mark this application as ${newStatus}?`)) return;
    
    try {
        // 1. Update Database
        await updateDoc(doc(db, "applications", appId), {
            status: newStatus
        });

        // 2. Update UI instantly
        const badge = document.getElementById(`status-${appId}`);
        badge.textContent = newStatus;
        badge.className = `status-badge ${newStatus === 'Accepted' ? 'status-accepted' : 'status-rejected'}`;

        // 3. Trigger Email Draft
        let subject = encodeURIComponent(`Application Update: ${jobTitle} at GCC CareersHub`);
        let body = "";
        
        if (newStatus === "Accepted") {
            body = encodeURIComponent(`Hello,\n\nWe are pleased to inform you that your application for the ${jobTitle} role has been accepted for the next round. Our HR team will reach out to you shortly with further details regarding your interview schedule.\n\nBest regards,\nGCC CareersHub Team`);
        } else {
            body = encodeURIComponent(`Hello,\n\nThank you for taking the time to apply for the ${jobTitle} role. After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe appreciate your interest and wish you the best in your job search.\n\nBest regards,\nGCC CareersHub Team`);
        }

        // Open user's default email client
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    } catch (error) {
        alert("Error updating status: " + error.message);
    }
};

// Close Modal Logic
closeBtn.onclick = () => appsModal.style.display = "none";
window.onclick = (e) => {
    if (e.target == appsModal) appsModal.style.display = "none";
}

// =======================
// Logout
// =======================
logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "admin-login.html";
});