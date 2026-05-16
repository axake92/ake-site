@echo off
chcp 65001 >nul
SET PATH=C:\Program Files\Git\cmd;C:\Program Files\nodejs;C:\Users\axela\AppData\Roaming\npm;%PATH%
cd /d C:\Users\axela\Desktop\AKE\akerecords.fr
echo.
echo ====================================
echo   PUSH — akerecords.fr
echo ====================================
echo.
echo [1/2] Commit...
git add .
git commit -m "update" 2>nul || echo (rien a committer)
echo.
echo [2/2] Push GitHub...
git push origin main
echo.
echo ====================================
echo   DEPLOY NETLIFY AUTO SUR PUSH
echo   Site: github.com/axake92/akerecords-fr
echo ====================================
echo.
pause
