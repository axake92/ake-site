@echo off
echo Configuration Git - Ake Records - site
cd /d "%~dp0"
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/axake92/ake-site.git
"C:\Program Files\Git\cmd\git.exe" branch -M main
echo Remote configure: https://github.com/axake92/ake-site.git
echo.
echo Ajout et commit de tous les fichiers...
"C:\Program Files\Git\cmd\git.exe" add -A
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: reorganisation - site akerecords.fr"
echo.
echo Push vers GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo DONE. Netlify va se deployer automatiquement.
pause