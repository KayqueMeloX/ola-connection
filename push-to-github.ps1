# Script para enviar as atualizacoes para o GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Enviando ola-connection para o GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

$gitCmd = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitCmd) {
    Write-Host "`n[AVISO] Git nao encontrado no PATH do sistema." -ForegroundColor Yellow
    Write-Host "Tentando localizar Git em instalacoes padrao..." -ForegroundColor Yellow
    
    $commonGitPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files\Git\cmd\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\cmd\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe",
        "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe"
    )
    
    $foundGit = $null
    foreach ($path in $commonGitPaths) {
        $resolved = Resolve-Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($resolved) {
            $foundGit = $resolved.Path
            break
        }
    }
    
    if ($foundGit) {
        Write-Host "Git localizado em: $foundGit" -ForegroundColor Green
        Set-Alias git $foundGit
    } else {
        Write-Host "`n[ERRO] Git nao esta instalado na máquina." -ForegroundColor Red
        Write-Host "Instale o Git em https://git-scm.com/download/win ou use o arquivo ZIP gerado:" -ForegroundColor Cyan
        Write-Host "C:\Users\Kayque Melo\.gemini\antigravity\scratch\ola-connection-atualizado.zip" -ForegroundColor Yellow
        exit 1
    }
}

Set-Location -Path $PSScriptRoot

if (-not (Test-Path ".git")) {
    Write-Host "`nInicializando repositorio Git..." -ForegroundColor Cyan
    git init
    git branch -M main
    git remote add origin https://github.com/KayqueMeloX/ola-connection.git
}

Write-Host "`nAdicionando arquivos..." -ForegroundColor Cyan
git add .

Write-Host "Criando commit..." -ForegroundColor Cyan
git commit -m "feat: clone completo quiz sarava com audio, assets e funil"

Write-Host "Enviando para o branch main no GitHub..." -ForegroundColor Cyan
git push -u origin main --force

Write-Host "`nSucesso! Repositorio atualizado no GitHub." -ForegroundColor Green
