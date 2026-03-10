# PowerShell deployment script untuk mesinpackingotomatis.com
# Menggunakan curl.exe (built-in Windows 10/11) dengan FTPS Explicit

param(
    [string]$ConfigFile = "sftp.json",
    [string]$LocalPath  = ".",
    [switch]$Force      = $false
)

# Load config
if (-not (Test-Path $ConfigFile)) {
    Write-Error "File konfigurasi '$ConfigFile' tidak ditemukan!"
    exit 1
}
$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json

$FTPHost    = $config.host
$FTPPort    = $config.port
$FTPUser    = $config.username
$FTPPass    = $config.password
$RemotePath = $config.remotePath.TrimEnd('/')
$IgnoreList = $config.ignore

# Cek curl tersedia
if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
    Write-Error "curl.exe tidak ditemukan. Pastikan Windows 10/11 atau install curl."
    exit 1
}

# ─────────────────────────────────────────────────────────────
# Cek apakah file/folder harus diabaikan
# ─────────────────────────────────────────────────────────────
function Should-Ignore {
    param([string]$RelPath)
    foreach ($pattern in $IgnoreList) {
        $escaped = [regex]::Escape($pattern).Replace('\*', '.*')
        if ($RelPath -match "(?i)(^|[/\\])$escaped([/\\]|$)") { return $true }
    }
    return $false
}

# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Deploy: mesinpackingotomatis.com" -ForegroundColor Cyan
Write-Host " Server: $FTPHost ($FTPPort) | FTPS Explicit" -ForegroundColor Cyan
Write-Host " Remote: $RemotePath" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

if (-not $Force) {
    $confirm = Read-Host "Lanjutkan deployment? (Y/n)"
    if ($confirm -notin @('Y','y','')) {
        Write-Host "Deployment dibatalkan." -ForegroundColor Yellow
        exit 0
    }
}

$localAbs = (Resolve-Path $LocalPath).Path
$allFiles = Get-ChildItem -Path $localAbs -Recurse -File
$toUpload = @()

foreach ($f in $allFiles) {
    $rel = $f.FullName.Substring($localAbs.Length).TrimStart('\','/')
    if (-not (Should-Ignore -RelPath $rel)) {
        $toUpload += [PSCustomObject]@{ Local = $f.FullName; Rel = $rel }
    }
}

$total   = $toUpload.Count
$success = 0
$failed  = 0
$i       = 0

Write-Host "Total file akan diupload: $total" -ForegroundColor White
Write-Host ""

foreach ($item in $toUpload) {
    $i++
    $remoteUrl  = "ftp://${FTPHost}:${FTPPort}${RemotePath}/" + $item.Rel.Replace('\','/')
    $userArg    = "${FTPUser}:${FTPPass}"

    Write-Host "[$i/$total] $($item.Rel)" -ForegroundColor Gray

    $result = curl.exe --ssl-reqd `
        -u $userArg `
        -T $item.Local `
        $remoteUrl `
        --ftp-create-dirs `
        --insecure `
        --silent `
        --show-error 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "         OK" -ForegroundColor Green
        $success++
    } else {
        Write-Warning "  GAGAL: $result"
        $failed++
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
if ($failed -eq 0) {
    Write-Host " Deployment SELESAI - $success/$total file berhasil" -ForegroundColor Green
} else {
    Write-Host " Deployment selesai dengan error" -ForegroundColor Yellow
    Write-Host " Berhasil: $success | Gagal: $failed" -ForegroundColor Yellow
}
Write-Host "=============================================" -ForegroundColor Cyan

