🧰 Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Firebase (Authentication + Firestore)
Hosting: Vercel + Firebase Hosting
CI/CD: GitHub Actions
Version Control: Git & GitHub
⚙️ CI/CD Pipeline

This project uses GitHub Actions + Vercel CLI for automated deployment.

Workflow
Code is pushed to main branch
GitHub Actions workflow is triggered automatically
Vercel CLI builds the project
Application is deployed automatically to Vercel
CI/CD Proof
GitHub Actions runs on every push to main
Deployment logs are available in the GitHub Actions tab
Live application updates automatically after every commit
👤 User Features
Users can register an account using email and password
Users can securely log in and log out using Firebase Authentication
Users can update their profile information
Users can delete their account
Users can browse all available job listings
Users can view detailed job information
Users can apply to jobs with a single click
Users can track their applied jobs
🛠 Admin Features
Admin can securely log in to the system
Admin can post new job openings
Admin can edit existing job postings
Admin can delete job postings
Admin can view all job applications submitted by users
Admin can accept or reject applicants for each job
Admin can manage applicant status in real time
🔐 Authentication & Backend
Firebase Authentication is used for secure login and registration for both users and admin
Firestore Database is used to store:
User profiles
Job listings
Job applications
Application status updates
Real-time updates ensure synchronization between user actions and admin dashboard
⚡ Core Workflow
User creates an account and logs in
User browses available job listings
User applies to a job with a single click
Application is stored in Firestore
Admin logs into dashboard
Admin reviews applicants for each job
Admin accepts or rejects candidates
Application status updates in real time
🎯 Key Highlights
Fully functional role-based system (User + Admin)
Real-time job application tracking system
Secure authentication using Firebase
One-click job application system
Complete end-to-end recruitment workflow
🔥 Firebase Setup
Firebase Authentication handles login and registration
Firestore Database stores all job and application data
Secure rules are implemented to protect user data
🚀 Deployment
Vercel Deployment
Connected to GitHub repository
Automatically deploys on every push to main branch
Used for CI/CD production deployment
Firebase Deployment
Used as secondary hosting option
Mirrors production version of the application
📌 Future Improvements
AI-based job recommendations
Resume upload system
Email notifications for applications
Advanced analytics dashboard for admin
Role-based access control improvements
👨‍💻 Author

Anudeep Reddy

📁 Project Structure
🏠 Home Page
├── index.html          # Homepage (Job Board & Search)
├── styles.css          # Global styling
├── firebase-config.js  # Firebase initialization
├── app.js              # Homepage logic (fetch, display jobs, filters)
👤 User Module
login.html
login.css
login.js

register.html
register.css
register.js

profile.html
profile.css
profile.js
🛠 Admin Module
admin-login.html
admin-login.css
admin-login.js

admin-dashboard.html
admin-dashboard.css
admin-dashboard.js

add-job.html
add-job.css
add-job.js
📄 Job Details Page
job-details.html
job-details.css
job-details.js
