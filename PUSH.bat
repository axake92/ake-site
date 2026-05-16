@echo off
chcp 65001 >nul
SET PATH=C:\Program Files\Git\cmd;C:\Program Files\nodejs;C:\Users\axela\AppData\Roaming\npm;%PATH%
cd /d C:\Users\axela\Desktop\AKE\akerecords.fr
echo.
echo ====================================
echo   PUSH — akerecords.fr
echo   github.com/axake92/akerecords.fr
echo ====================================
echo.
git add .
git commit -m "update" 2>nul || echo (rien a committer)
git push origin main
echo.
echo === NETLIFY redeploit automatiquement ===
echo.
pause
