@echo off

:: Altera para o diretorio onde o script esta localizado
cd /d %~dp0

:menu
cls
echo Diretorio atual: %cd%
echo =====================================
echo     GIT AUTOMATION MENU
echo =====================================
echo 1. Verificar status do repositorio (git status)
echo 2. Adicionar todas as alteracoes (git add .)
echo 3. Fazer commit (git commit -m "...")
echo 4. Fazer push para o GitHub (git push)
echo 5. Fazer pull do repositorio (git pull)
echo 6. Mostrar log de commits (git log)
echo 7. Obter link do projeto (git remote -v)
echo 8. Outras opcoes
echo 9. Sair
echo =====================================
set /p escolha="Escolha uma opcao: "

if %escolha%==1 goto status
if %escolha%==2 goto add
if %escolha%==3 goto commit
if %escolha%==4 goto push
if %escolha%==5 goto pull
if %escolha%==6 goto log
if %escolha%==7 goto link
if %escolha%==8 goto outras_opcoes
if %escolha%==9 goto fim
goto menu

:status
echo Diretorio atual: %cd%
echo Verificando o status do repositorio...
git status
pause
goto menu

:add
echo Diretorio atual: %cd%
echo Adicionando todas as alteracoes...
git add .
pause
goto menu

:commit
set /p comentario="Digite o comentario do commit: "
echo Diretorio atual: %cd%
git commit -m "%comentario%"
pause
goto menu

:push
echo Diretorio atual: %cd%
echo Fazendo push para o GitHub...
git push
pause
goto menu

:pull
echo Diretorio atual: %cd%
echo Fazendo pull do repositorio...
git pull
pause
goto menu

:log
echo Diretorio atual: %cd%
echo Mostrando log de commits...
git log --oneline
pause
goto menu

:link
echo Diretorio atual: %cd%
echo Exibindo link do projeto remoto...
git remote -v
pause
goto menu

:outras_opcoes
cls
echo Outras opcoes
echo ========================================================
echo 1. Restaurar arquivos deletados (git checkout -- .)
echo 2. Sincronizar com repositorio (git fetch origin)
echo 3. Fazer fetch do repositorio (git fetch)
echo 4. Fazer merge de branches (git merge ^<branch^>)
echo 5. Inicializar um novo repositorio (git init)
echo 6. Desfazer alteracoes (git reset)
echo 7. Descartar todas as alteracoes (git checkout .)
echo 8. Listar branches (git branch)
echo 9. Voltar para um commit especifico (git checkout ^<hash^>)
echo 10. Voltar ao menu principal
echo ========================================================
set /p escolha_outras="Escolha uma opcao: "

if %escolha_outras%==1 goto restaurar
if %escolha_outras%==2 goto sincronizar
if %escolha_outras%==3 goto fetch
if %escolha_outras%==4 goto merge
if %escolha_outras%==5 goto init
if %escolha_outras%==6 goto reset
if %escolha_outras%==7 goto descartar
if %escolha_outras%==8 goto branch
if %escolha_outras%==9 goto checkout_commit
if %escolha_outras%==10 goto menu
goto outras_opcoes

:restaurar
echo Restaurando arquivos deletados...
git checkout -- .
pause
goto outras_opcoes

:sincronizar
echo Sincronizando com repositorio...
git fetch origin
pause
goto outras_opcoes

:fetch
echo Fazendo fetch do repositorio...
git fetch
pause
goto outras_opcoes

:merge
set /p branch_merge="Digite o nome da branch para fazer merge: "
echo Fazendo merge da branch %branch_merge%...
git merge %branch_merge%
pause
goto outras_opcoes

:init
echo Inicializando um novo repositorio...
git init
pause
goto outras_opcoes

:reset
set /p reset_options="Digite as opcoes para o reset (ex: HEAD~1): "
echo Desfazendo alteracoes com 'git reset %reset_options%'
git reset %reset_options%
pause
goto outras_opcoes

:descartar
echo Descartando todas as alteracoes locais...
git checkout .
pause
goto outras_opcoes

:branch
echo Listando todas as branches...
git branch -a
pause
goto outras_opcoes

:checkout_commit
cls
echo Voltando para um commit especifico...
set /p commit_hash="Digite o hash do commit: "
if not defined commit_hash (
    echo Nenhuma hash de commit foi inserida. Operacao cancelada.
) else (
    echo Executando: git checkout %commit_hash%
    git checkout %commit_hash%
)
pause
goto outras_opcoes

:fim
echo Saindo...
pause