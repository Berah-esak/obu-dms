# Git setup script for pushing to obu-dms repository

Write-Host "Setting up Git repository for obu-dms..." -ForegroundColor Green

# Check if git is available
try {
    git --version
    Write-Host "Git is available" -ForegroundColor Green
} catch {
    Write-Host "Error: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/download/windows" -ForegroundColor Yellow
    exit 1
}

# Change remote URL to your repository
Write-Host "Updating remote URL..." -ForegroundColor Yellow
git remote set-url origin git@github.com:Berah-esak/obu-dms.git

# Verify remote URL
Write-Host "Current remote URL:" -ForegroundColor Cyan
git remote -v

# Check current status
Write-Host "`nCurrent repository status:" -ForegroundColor Cyan
git status

# Add all files
Write-Host "`nAdding all files..." -ForegroundColor Yellow
git add .

# Check what will be committed
Write-Host "`nFiles to be committed:" -ForegroundColor Cyan
git status --short

# Create commit
$commitMessage = "Complete Dormitory Management System with Maintenance Request functionality

Features implemented:
- Student dashboard with room assignments
- Admin dashboard with full management capabilities  
- Maintenance request system (submit, approve, reject, status updates)
- Role-based access control (Student, Dorm Admin, Maintenance Staff, System Admin)
- Room assignment system with dorm block integration
- File upload support for maintenance requests
- Real-time filtering and search functionality
- Responsive UI with modern design
- Complete API with authentication and authorization
- Firebase Firestore database integration
- Comprehensive testing and documentation

Backend: Node.js + Express + Firebase
Frontend: React + TypeScript + Tailwind CSS + Vite"

Write-Host "`nCreating commit..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to repository
Write-Host "`nPushing to GitHub repository..." -ForegroundColor Yellow
Write-Host "Repository: git@github.com:Berah-esak/obu-dms.git" -ForegroundColor Cyan

try {
    git push -u origin main
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/Berah-esak/obu-dms" -ForegroundColor Cyan
} catch {
    Write-Host "`n❌ Push failed. This might be because:" -ForegroundColor Red
    Write-Host "1. SSH key not set up for GitHub" -ForegroundColor Yellow
    Write-Host "2. Repository doesn't exist or no access" -ForegroundColor Yellow
    Write-Host "3. Network connectivity issues" -ForegroundColor Yellow
    Write-Host "`nTrying with HTTPS instead..." -ForegroundColor Yellow
    
    # Try with HTTPS
    git remote set-url origin https://github.com/Berah-esak/obu-dms.git
    git push -u origin main
}

Write-Host "`n🎉 Git setup complete!" -ForegroundColor Green
Write-Host "Your Dormitory Management System is now on GitHub!" -ForegroundColor Cyan