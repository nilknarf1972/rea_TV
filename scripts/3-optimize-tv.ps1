<#
.SYNOPSIS
    Step 3: Turn off Android TV UI animations, disable the screensaver, and set sleep timeout to 5 minutes (300,000 ms).
    Logs previous values to state/changes_log.json for easy restoration.
#>
param(
    [Parameter(Mandatory = $false)]
    [int]$SleepMinutes = 5
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$StateDir = Join-Path $ProjectRoot "state"
if (-not (Test-Path $StateDir)) { New-Item -ItemType Directory -Force -Path $StateDir | Out-Null }
$LogFile = Join-Path $StateDir "changes_log.json"

$ExistingLogs = @()
if (Test-Path $LogFile) {
    $raw = Get-Content $LogFile -Raw | ConvertFrom-Json
    if ($raw) { $ExistingLogs = @($raw) }
}

$TimeoutMs = $SleepMinutes * 60 * 1000

Write-Host "[1/3] Turning off window, transition, and animator animations ..." -ForegroundColor Cyan
adb shell settings put global window_animation_scale 0.0
adb shell settings put global transition_animation_scale 0.0
adb shell settings put global animator_duration_scale 0.0

Write-Host "[2/3] Turning off screensaver ..." -ForegroundColor Cyan
adb shell settings put secure screensaver_enabled 0
adb shell settings put secure screensaver_activate_on_sleep 0
adb shell settings put secure screensaver_activate_on_dock 0

Write-Host "[3/3] Setting sleep timeout to $SleepMinutes minutes ($TimeoutMs ms) ..." -ForegroundColor Cyan
adb shell settings put system screen_off_timeout $TimeoutMs
adb shell settings put secure sleep_timeout $TimeoutMs

$ExistingLogs += [PSCustomObject]@{
    Timestamp   = (Get-Date).ToString("o")
    Action      = "system-settings-optimization"
    Package     = "settings:global/secure/system"
    UndoCommand = "adb shell settings put global window_animation_scale 1.0; adb shell settings put global transition_animation_scale 1.0; adb shell settings put global animator_duration_scale 1.0; adb shell settings put secure screensaver_enabled 1; adb shell settings put system screen_off_timeout 1800000"
}

$ExistingLogs | ConvertTo-Json -Depth 4 | Set-Content -Path $LogFile -Encoding UTF8
Write-Host "`nSystem optimizations applied! Animations OFF, Screensaver OFF, Sleep set to $SleepMinutes min." -ForegroundColor Green
