@echo off
echo ========================================
echo  Dormitory Management System - Git Push
echo ========================================
echo.

echo Checking Git installation...
git --version
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/download/windows
    pause
    exit /b 1
)

echo.
echo Setting up repository for obu-dms...
echo.

echo Updating remote URL...
git remote set-url origin git@github.com:Berah-esak/obu-dms.git

echo.
echo Current remote configuration:
git remote -v

echo.
echo Checking repository status...
git status

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Complete Dormitory Management System with Maintenance Request functionality

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

echo.
echo Pushing to GitHub repository...
echo Repository: git@github.com:Berah-esak/obu-dms.git
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Code pushed to GitHub
    echo ========================================
    echo.
    echo Repository URL: https://github.com/Berah-esak/obu-dms
    echo.
    echo Your Dormitory Management System is now on GitHub!
) else (
    echo.
    echo ========================================
    echo   PUSH FAILED - Trying HTTPS
    echo ========================================
    echo.
    echo Switching to HTTPS and trying again...
    git remote set-url origin https://github.com/Berah-esak/obu-dms.git
    git push -u origin main
    
    if %errorlevel% equ 0 (
        echo.
        echo SUCCESS! Code pushed using HTTPS
        echo Repository URL: https://github.com/Berah-esak/obu-dms
    ) else (
        echo.
        echo PUSH FAILED. Please check:
        echo 1. Repository exists: https://github.com/Berah-esak/obu-dms
        echo 2. You have access to the repository
        echo 3. Your GitHub credentials are correct
        echo.
        echo You can also try pushing manually using the Git Push Guide.
    )
)

echo.
pause