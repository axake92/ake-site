@echo off
chcp 65001 >nul
echo ============================================
echo   AKE Records - Setup section Merch
echo ============================================
set SRC=%USERPROFILE%\Desktop\Merch Ake Records
set DST=%USERPROFILE%\Desktop\AKE\akerecords.fr\merch\logos

if not exist "%DST%" mkdir "%DST%"

echo Copie des logos...
copy /Y "%SRC%\logo_merch_v1_transparent.png"        "%DST%\" >nul
copy /Y "%SRC%\logo_merch_orange_ake_colored.png"    "%DST%\" >nul
copy /Y "%SRC%\logo_merch_rose_ake_colored.png"      "%DST%\" >nul
copy /Y "%SRC%\logo_merch_rouge_ake_colored.png"     "%DST%\" >nul
copy /Y "%SRC%\logo_merch_violet_ake_colored.png"    "%DST%\" >nul
copy /Y "%SRC%\logo_drip_silver_transparent.png"     "%DST%\" >nul
copy /Y "%SRC%\logo_drip_orange_transparent.png"     "%DST%\" >nul
copy /Y "%SRC%\logo_drip_rose_transparent.png"       "%DST%\" >nul
copy /Y "%SRC%\logo_drip_rouge_transparent.png"      "%DST%\" >nul
copy /Y "%SRC%\logo_drip_violet_transparent.png"     "%DST%\" >nul
copy /Y "%SRC%\logo_ake_arch_silver_transparent.png" "%DST%\" >nul
copy /Y "%SRC%\logo_ake_vertical_transparent.png"    "%DST%\" >nul
copy /Y "%SRC%\trenches_nobg.png"                    "%DST%\" >nul

REM nettoyage fichier temporaire
if exist "%USERPROFILE%\Desktop\AKE\akerecords.fr\index_navtmp.txt" del "%USERPROFILE%\Desktop\AKE\akerecords.fr\index_navtmp.txt"

echo.
echo Logos copies dans : %DST%
dir /b "%DST%"
echo.
echo Termine ! Ouvre merch\index.html pour tester localement.
echo Puis lance PUSH.bat a la racine pour deployer sur akerecords.fr
pause
