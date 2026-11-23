@echo off
setlocal
cd /d "%~dp0"

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm could not be found. Install Node.js, then try again.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Setting up the project for first use. This may take a minute...
  call npm.cmd install
  if errorlevel 1 (
    echo Setup did not finish. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo Starting HelpingHands Hub. Leave this window open while using the app.
call npm.cmd run dev -- --open
pause
