@echo off
cd /d "C:\Users\axela\Desktop\AKE\Ake Records - site"
"C:\Program Files\Git\cmd\git.exe" add -A
"C:\Program Files\Git\cmd\git.exe" commit -m "update: site akerecords.fr"
"C:\Program Files\Git\cmd\git.exe" push
echo.
echo Deploiement Netlify en cours...
pause