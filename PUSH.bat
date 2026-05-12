@echo off
cd /d "C:\Users\axela\Desktop\AKE\akerecords.fr"
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/axake92/akerecords-fr.git
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" add -A
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: studio light theme + stripe + beatmaker links + netlify function"
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo DONE - verifie app.netlify.com
pause