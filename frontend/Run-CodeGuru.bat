@echo off
setlocal
cd /d "%~dp0"
echo Starting CodeGuru frontend...
echo.
call npm run dev -- --open
set "exitCode=%ERRORLEVEL%"
echo.
if not "%exitCode%"=="0" echo CodeGuru stopped with exit code %exitCode%.
pause
exit /b %exitCode%
