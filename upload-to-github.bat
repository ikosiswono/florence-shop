@echo off
setlocal
echo ========================================================
echo   FLORENCE NETWORK STORE - UPLOAD KE GITHUB OTOMATIS
echo ========================================================
echo.

set PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git tidak ditemukan.
    pause
    exit /b 1
)

echo Menambahkan perubahan terbaru...
git add .
set /p commit_msg="Masukkan pesan update (atau tekan Enter untuk default): "
if "%commit_msg%"=="" set commit_msg="Update Florence Network Web Store"

git commit -m "%commit_msg%"

echo.
git remote -v | findstr "origin" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Repository GitHub belum dihubungkan.
    set /p repo_url="Masukkan URL Repository GitHub Anda (contoh: https://github.com/username/florence-store.git): "
    if not "%repo_url%"=="" (
        git remote add origin %repo_url%
        git branch -M main
        echo Mengunggah ke GitHub...
        git push -u origin main
    ) else (
        echo [BATAL] URL repository tidak diisi.
    )
) else (
    echo Mengunggah perubahan ke GitHub...
    git push -u origin main
)

echo.
echo ========================================================
echo   SELESAI! Tekan sembarang tombol untuk keluar.
echo ========================================================
pause
