@echo off
title MedDesk — Manual Clínico Digital
cd /d "%~dp0"
echo.
echo  =========================================
echo   MedDesk — Manual Clinico Digital
echo   Abrindo em http://localhost:3001
echo  =========================================
echo.

REM Abrir o browser automaticamente após 2 segundos
start /min "" timeout /t 2 /nobreak >nul
start http://localhost:3001

REM Iniciar o servidor
node server/index.js
