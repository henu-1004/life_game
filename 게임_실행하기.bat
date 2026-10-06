@echo off
chcp 65001 > nul
title Project 1/8,000,000,000 Launcher
cd /d "%~dp0"

echo ===================================================
echo   🌍 Project 1/8,000,000,000 (80억 분의 1)
echo   독립 실행형 PC 게임 윈도우를 시작합니다...
echo ===================================================

if not exist "dist\index.html" (
    echo [빌드 중] 게임 파일을 패키징합니다...
    call npm.cmd run build
)

echo [실행 중] 게임 화면이 열립니다!
call npx.cmd electron .
