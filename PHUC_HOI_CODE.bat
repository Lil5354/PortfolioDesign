@echo off
echo Dang khoi phuc file portfolio_system.jsx tu Git...
git checkout HEAD -- portfolio_system.jsx
if %errorlevel% neq 0 (
    echo.
    echo LỖI: Không thể khôi phục file. Vui lòng kiểm tra lại trạng thái Git.
) else (
    echo.
    echo THÀNH CÔNG: Đã khôi phục toàn bộ code gốc của portfolio_system.jsx!
)
echo.
pause
