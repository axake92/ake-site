@echo off
echo ================================================
echo  AKE Records - Migration des dossiers
echo ================================================
echo.

set SRC=C:\Users\axela\Desktop\AKE\SITE
set DST=C:\Users\axela\Desktop\AKE\Ake Records - site

echo Deplacement depuis SITE vers "Ake Records - site"...
if exist "%SRC%\photos" (
  xcopy /E /I /Y "%SRC%\photos" "%DST%\photos"
  echo  photos OK
)
if exist "%SRC%\.git" (
  xcopy /E /I /Y "%SRC%\.git" "%DST%\.git"
  echo  .git OK
)
if exist "%SRC%\sourire_extrait.mp3" (
  copy /Y "%SRC%\sourire_extrait.mp3" "%DST%\"
  echo  sourire_extrait.mp3 OK
)
if exist "%SRC%\netlify.toml" (
  copy /Y "%SRC%\netlify.toml" "%DST%\"
  echo  netlify.toml OK
)
if exist "%SRC%\package.json" (
  copy /Y "%SRC%\package.json" "%DST%\"
  echo  package.json OK
)
if exist "%SRC%\netlify" (
  xcopy /E /I /Y "%SRC%\netlify" "%DST%\netlify"
  echo  netlify functions OK
)
if exist "%SRC%\AKE_press_kit_2026.html" (
  copy /Y "%SRC%\AKE_press_kit_2026.html" "%DST%\"
  echo  press kit OK
)

echo.
echo TERMINE - Verifie le dossier "Ake Records - site"
echo Tu peux supprimer l'ancien dossier SITE manuellement.
pause
