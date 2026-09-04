@echo off
setlocal
title ORBIT - Mega-Event Orchestration System

echo ===================================================
echo     ORBIT - AI-Powered Mega-Event Orchestration
echo ===================================================
echo.

:: 1. Navigate to directory containing package.json
if exist "package.json" (
    set "PROJECT_DIR=%cd%"
) else if exist "pillai-main\package.json" (
    cd pillai-main
    set "PROJECT_DIR=%cd%"
) else if exist "..\package.json" (
    cd ..
    set "PROJECT_DIR=%cd%"
) else (
    echo [ERROR] package.json not found!
    echo Please ensure this script is located within the project directory.
    pause
    exit /b 1
)

:: 2. Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

:: 3. Check npm installation
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found in your system PATH!
    pause
    exit /b 1
)

:: 4. Check if dependencies are installed
if not exist "node_modules\" (
    echo [INFO] Dependencies not found. Installing packages...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed.
        pause
        exit /b 1
    )
    echo [INFO] Dependencies installed successfully!
    echo.
)

:: Direct command line arguments support (e.g. run.bat dev)
if /i "%~1"=="dev" goto dev
if /i "%~1"=="build" goto build
if /i "%~1"=="preview" goto preview
if /i "%~1"=="lint" goto lint
if /i "%~1"=="install" goto install

:: 5. Interactive Menu
echo Select an option:
echo   [1] Start Development Server (npm run dev)
echo   [2] Build for Production     (npm run build)
echo   [3] Preview Production Build (npm run preview)
echo   [4] Run Linter               (npm run lint)
echo   [5] Reinstall Dependencies   (npm install)
echo   [6] Exit
echo.

choice /C 123456 /D 1 /T 5 /M "Enter option [1-6] (Auto-starts dev in 5s)"
set OPT=%errorlevel%

if %OPT% equ 6 goto exit
if %OPT% equ 5 goto install
if %OPT% equ 4 goto lint
if %OPT% equ 3 goto preview
if %OPT% equ 2 goto build
if %OPT% equ 1 goto dev
goto dev

:dev
echo.
echo [INFO] Launching Vite development server...
echo [INFO] Opening browser at http://localhost:5173...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"
call npm run dev
goto exit

:build
echo.
echo [INFO] Building production bundle...
call npm run build
echo.
echo [INFO] Build finished. Output saved to dist directory.
goto exit

:preview
echo.
echo [INFO] Starting Vite preview server...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:4173"
call npm run preview
goto exit

:lint
echo.
echo [INFO] Running linter...
call npm run lint
goto exit

:install
echo.
echo [INFO] Running npm install...
call npm install
echo.
echo [INFO] Done.
goto exit

:exit
exit /b 0
