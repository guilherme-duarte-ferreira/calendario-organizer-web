@echo off
SETLOCAL

:MENU
    cls
    echo.
    echo ---------------------------------------
    echo   Gerenciador do Servidor Node.js
    echo ---------------------------------------
    echo.
    echo 1. Instalar dependencias do projeto (npm install)
    echo 2. Iniciar o servidor (npm run dev)
    echo 0. Sair do script
    echo.
    SET /P CHOICE="Digite sua opcao e pressione Enter: "

    if "%CHOICE%"=="1" goto INSTALL_DEPENDENCIES
    if "%CHOICE%"=="2" goto START_SERVER
    if "%CHOICE%"=="0" goto END_SCRIPT
    
    echo.
    echo Opcao invalida. Por favor, digite 1, 2 ou 0.
    timeout /t 3 >nul
    goto MENU

:INSTALL_DEPENDENCIES
    cls
    echo ---------------------------------------
    echo   Instalando dependencias (npm install)
    echo ---------------------------------------
    echo.
    npm install
    if %ERRORLEVEL% equ 0 (
        echo.
        echo ^> Dependencias instaladas com sucesso!
    ) else (
        echo.
        echo ^> ERRO: Falha ao instalar as dependencias.
        echo ^> Verifique sua conexao com a internet e o arquivo 'package.json'.
    )
    echo.
    pause
    goto MENU

:START_SERVER
    cls
    echo ---------------------------------------
    echo   Iniciando o servidor (npm run dev)
    echo ---------------------------------------
    echo.
    echo ^> O servidor sera iniciado. Esta janela pode ficar ocupada ou uma nova pode abrir.
    echo ^> Pressione Ctrl+C na janela do servidor para parar.
    echo.
    npm run dev
    if %ERRORLEVEL% equ 0 (
        echo.
        echo ^> Servidor Node.js encerrado.
    ) else (
        echo.
        echo ^> ERRO: O comando 'npm run dev' falhou ou o servidor parou com erro.
        echo ^> Verifique o script 'dev' no seu 'package.json' e os logs do servidor.
    )
    echo.
    pause
    goto MENU

:END_SCRIPT
    cls
    echo.
    echo ---------------------------------------
    echo   Encerrando o Gerenciador Node.js
    echo ---------------------------------------
    echo.
    echo ^> Ate mais!
    echo.
    ENDLOCAL
    pause
    EXIT /B 0