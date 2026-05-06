@echo off
echo AKE Records -- Git Push
cd /d "C:\Users\axela\Desktop\AKE\SITE"
"C:\Program Files\Git\cmd\git.exe" add -A
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: light theme + dossier videos inner circle"
"C:\Program Files\Git\cmd\git.exe" push
echo.
echo Deploiement Netlify en cours automatiquement...
pause
