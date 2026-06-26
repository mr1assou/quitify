@echo off
REM Creates C:\q -> quitify folder (shorter path for Windows Android native builds)
for %%I in ("%~dp0..") do set "PROJECT=%%~fI"

if exist C:\q\package.json (
  echo C:\q already points to the project.
  exit /b 0
)
if exist C:\q (
  echo C:\q exists but is not this project. Remove it manually first.
  exit /b 1
)
mklink /J C:\q "%PROJECT%"
if errorlevel 1 (
  echo Failed to create junction. Try: Run as Administrator.
  exit /b 1
)
echo OK: C:\q -^> %PROJECT%
