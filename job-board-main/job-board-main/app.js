import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const jobListingsContainer = document.getElementById("job-listings");
const loadingIndicator = document.getElementById("loading");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

let allJobs = [];

async function fetchJobs() {
    try {
        const jobsCollectionRef = collection(db, "jobs");
        
        // --- BYPASS TEST: We are skipping the orderBy query ---
        // const q = query(jobsCollectionRef, orderBy("postedDate", "desc"));
        // const querySnapshot = await getDocs(q);
        
        // We are fetching the collection directly instead:
        const querySnapshot = await getDocs(jobsCollectionRef);
        // ------------------------------------------------------
        
        allJobs = [];
        querySnapshot.forEach((doc) => {
            allJobs.push({ id: doc.id, ...doc.data() });
        });

        loadingIndicator.style.display = "none";
        renderJobs(allJobs);
    } catch (error) {
        // Updated to show the exact Firebase error message!
        console.error("Firebase Error Details: ", error.message);
        loadingIndicator.innerHTML = `<p>Failed to load jobs: ${error.message}</p>`;
    }
}

function renderJobs(jobsArray) {
    jobListingsContainer.innerHTML = "";

    if (jobsArray.length === 0) {
        jobListingsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No opportunities match your current criteria.</div>`;
        return;
    }

    jobsArray.forEach((job) => {
        const card = document.createElement("div");
        card.classList.add("job-card");
        
        card.innerHTML = `
            <span class="badge">${job.employmentType || "Full-Time"}</span>
            <div>
                <h3>${job.title}</h3>
                <div class="company">
                    🏢 ${job.company}
                </div>
                <div class="job-details-meta">
                    <div class="meta-item">
                        <span class="meta-icon">📍</span>
                        <span>${job.location}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">💰</span>
                        <span>${job.salary || "Salary Undisclosed"}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">⭐</span>
                        <span>${job.experienceReq || "Entry Level"}</span>
                    </div>
                </div>
            </div>
            <a href="job-details.html?id=${job.id}" class="apply-btn">View Details</a>
        `;
        jobListingsContainer.appendChild(card);
    });
}

function handleSearchAndFilters() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filtered = allJobs.filter(job => {
        // Fallbacks added in case fields are missing in Firestore docs
        const titleMatch = (job.title || "").toLowerCase().includes(searchText);
        const companyMatch = (job.company || "").toLowerCase().includes(searchText);
        const locationMatch = (job.location || "").toLowerCase().includes(searchText);
        
        const matchesSearch = titleMatch || companyMatch || locationMatch;
        const matchesCategory = selectedCategory === "" || job.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderJobs(filtered);
}

searchBtn.addEventListener("click", handleSearchAndFilters);
searchInput.addEventListener("input", handleSearchAndFilters);
categoryFilter.addEventListener("change", handleSearchAndFilters);

window.addEventListener("DOMContentLoaded", fetchJobs);