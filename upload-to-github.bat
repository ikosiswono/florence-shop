@echo off
setlocal
title Florence Network - Upload ke GitHub
echo ========================================================
echo   FLORENCE NETWORK STORE - UPLOAD KE GITHUB OTOMATIS
echo ========================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\gcm;%PATH%"

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git tidak ditemukan.
    pause
    exit /b 1
)

echo Menyimpan semua perubahan file terbaru...
git add .
git commit -m "Update web store Florence Network" >nul 2>&1

echo.
echo Menghubungkan ke repository: https://github.com/ikosiswono/florence-shop.git
git remote set-url origin https://github.com/ikosiswono/florence-shop.git >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin https://github.com/ikosiswono/florence-shop.git
)

git branch -M main

echo.
echo ========================================================
echo Mengunggah ke GitHub...
echo (Jika muncul jendela popup GitHub di browser, klik 'Sign in with your browser' / 'Authorize')
echo ========================================================
echo.

git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   BERHASIL! Semua file sudah aktif di GitHub:
    echo   https://github.com/ikosiswono/florence-shop
    echo ========================================================
) else (
    echo ========================================================
    echo   [PERHATIAN] Upload memerlukan izin autentikasi GitHub.
    echo ========================================================
)
echo.
pause
