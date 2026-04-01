@echo off
cd /d "%~dp0"
set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"
start "" cmd /c "timeout /t 2 >nul && start \"\" http://localhost:3000"
"%NODE_EXE%" server.js
