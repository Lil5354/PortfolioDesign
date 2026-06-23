@echo off
chcp 65001 > nul
echo ===================================================
echo   CHUONG TRINH TU DONG KHOI DONG UEF GALLERY
echo ===================================================
echo [1/3] Dang don dep cac tien trinh cu bi ket...
taskkill /F /IM UEFGallery.API.exe /T > nul 2>&1
taskkill /F /IM dotnet.exe /T > nul 2>&1
taskkill /F /IM node.exe /T > nul 2>&1

echo.
echo [2/3] Dang khoi dong Backend...
start "Backend" cmd /k "cd UEFGallery.API && dotnet run"

echo [2/3] Dang khoi dong Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo Vui long doi 10 giay de Backend khoi dong hoan tat...
timeout /t 10 /nobreak > nul

echo.
echo [3/3] Dang tu dong nap 200 du lieu an pham...
curl -s http://localhost:5000/api/seed

echo.
echo ===================================================
echo HOAN TAT! Ban hay vao trinh duyet (http://localhost:5173),
echo F5 lai trang va dang nhap bang:
echo Tai khoan: sv@uef.edu.vn
echo Mat khau: test123
echo ===================================================
echo.
pause
