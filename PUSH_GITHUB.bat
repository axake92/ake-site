@echo off
title AKE Records - Push GitHub
cd /d "C:\Users\axela\Desktop\AKE\Ake Records - site"
echo === AKE Records - site ===
echo.
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/axake92/ake-site.git
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" add -A
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: site akerecords.fr - version complete"
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo === DONE - akerecords.fr deploye sur Netlify ===
pause
