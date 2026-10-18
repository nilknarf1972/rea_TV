<#
.SYNOPSIS
    Step 4: Build (if needed) and install the ultra-lightweight Rea TV Home Screen (~12 MB RAM),
    set it as the default HOME launcher, optionally disable the stock ad-heavy launcher so the TV boots straight to Rea TV Home,
    and compare Free RAM before vs. after.
#>
param(
    [Parameter(Mandatory = $false)]
    [switch]$DisableStockLauncher = $false
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$LauncherDir = Join-Path $ProjectRoot "launcher-app"
$ApkPath = Join-Path $LauncherDir "app\build\outputs\apk\debug\app-debug.apk"
$DistApkPath = Join-Path $ProjectRoot "dist\rea-tv-launcher.apk"
$StateDir = Join-Path $ProjectRoot "state"
$LogFile = Join-Path $StateDir "changes_log.json"

if (-not (Test-Path $ApkPath) -and (Test-Path $DistApkPath)) {
    $ApkPath = $DistApkPath
}

if (-not (Test-Path $ApkPath)) {
    Write-Host "[1/4] Building Rea TV Home APK ..." -ForegroundColor Cyan
    Push-Location $LauncherDir
    try {
        .\gradlew.bat assembleDebug --no-daemon
    } finally {
        Pop-Location
    }
}

Write-Host "[2/4] Installing Rea TV Home ($ApkPath) onto Android TV ..." -ForegroundColor Cyan
adb install -r $ApkPath

Write-Host "[3/4] Setting Rea TV Home as default home activity ..." -ForegroundColor Cyan
adb shell cmd package set-home-activity com.reatv.launcher/.MainActivity 2>$null

if ($DisableStockLauncher) {
    $StockLaunchers = @(
        "com.google.android.tvlauncher",
        "com.google.android.leanbacklauncher"
    )
    $Installed = (adb shell pm list packages -e) | ForEach-Object { ($_ -replace "^package:", "").Trim() }
    $ExistingLogs = @()
    if (Test-Path $LogFile) {
        $raw = Get-Content $LogFile -Raw | ConvertFrom-Json
        if ($raw) { $ExistingLogs = @($raw) }
    }

    foreach ($sl in $StockLaunchers) {
        if ($Installed -contains $sl) {
            Write-Host "      Disabling stock ad-launcher '$sl' so TV boots straight to Rea TV Home ..." -ForegroundColor Yellow
            adb shell pm disable-user --user 0 $sl
            $ExistingLogs += [PSCustomObject]@{
                Timestamp   = (Get-Date).ToString("o")
                Action      = "disable-stock-launcher"
                Package     = $sl
                UndoCommand = "adb shell pm enable $sl"
            }
        }
    }
    $ExistingLogs | ConvertTo-Json -Depth 4 | Set-Content -Path $LogFile -Encoding UTF8
}

# Launch Rea TV Home immediately
adb shell input keyevent KEYCODE_HOME

Write-Host "[4/4] Measuring Free RAM after optimization ..." -ForegroundColor Cyan
$MemInfoRaw = adb shell cat /proc/meminfo
$MemTotalKb = 0
$MemAvailKb = 0
foreach ($line in $MemInfoRaw) {
    if ($line -match "^MemTotal:\s+(\d+)") { $MemTotalKb = [int]$Matches[1] }
    if ($line -match "^MemAvailable:\s+(\d+)") { $MemAvailKb = [int]$Matches[1] }
}
$MemTotalMb = [math]::Round($MemTotalKb / 1024, 0)
$MemAvailMb = [math]::Round($MemAvailKb / 1024, 0)
$MemFreePct = if ($MemTotalMb -gt 0) { [math]::Round(($MemAvailMb / $MemTotalMb) * 100, 1) } else { 0 }

$AuditFile = Join-Path $StateDir "baseline_audit.json"
if (Test-Path $AuditFile) {
    $Baseline = Get-Content $AuditFile -Raw | ConvertFrom-Json
    $BeforeMb = $Baseline.BaselineFreeMb
    $GainMb = $MemAvailMb - $BeforeMb
    $GainPct = if ($BeforeMb -gt 0) { [math]::Round(($GainMb / $BeforeMb) * 100, 1) } else { 0 }
    Write-Host "`n================ MEMORY COMPARISON ================" -ForegroundColor Green
    Write-Host "   Before : $BeforeMb MB free"
    Write-Host "   After  : $MemAvailMb MB free of $MemTotalMb MB ($MemFreePct%)"
    Write-Host "   Change : +$GainMb MB (+$GainPct% free RAM)" -ForegroundColor Cyan
} else {
    Write-Host "`nCurrent Free RAM: $MemAvailMb MB / $MemTotalMb MB ($MemFreePct%)" -ForegroundColor Green
}
