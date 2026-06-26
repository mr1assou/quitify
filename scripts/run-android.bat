@echo off
setlocal
call "%~dp0setup-short-path.bat"
if errorlevel 1 exit /b 1

if not exist C:\gradle mkdir C:\gradle
if not exist C:\tmp mkdir C:\tmp
set GRADLE_USER_HOME=C:\gradle
set TEMP=C:\tmp
set TMP=C:\tmp

cd /d C:\q
if exist android\app\.cxx rmdir /s /q android\app\.cxx
if exist android\app\build rmdir /s /q android\app\build

echo Building from C:\q ...
call npx expo run:android %*
