<#
.SYNOPSIS
    One-Command Rollback: Re-enables every disabled app, restores any user-0 uninstalled preloads,
    re-enables the stock Android TV launcher, and restores default animations and screensaver settings.
#>
$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$StateDir = Join-Path $ProjectRoot "state"
$LogFile = Join-Path $StateDir "changes_log.json"

Write-Host "`n[UNDO] Restoring Android TV changes ..." -ForegroundColor Cyan

if (Test-Path $LogFile) {
    $Logs = Get-Content $LogFile -Raw | ConvertFrom-Json
    foreach ($entry in @($Logs)) {
        if ($entry.Action -eq "disable-user" -or $entry.Action -eq "disable-stock-launcher") {
            Write-Host "   -> Re-enabling $($entry.Package) ..." -ForegroundColor Yellow
            adb shell pm enable $entry.Package
        } elseif ($entry.Action -eq "uninstall-user0") {
            Write-Host "   -> Re-installing preload $($entry.Package) ..." -ForegroundColor Yellow
            adb shell cmd package install-existing $entry.Package
        }
    }
}

# Always ensure stock launchers and standard animations/screensaver are restored
adb shell pm enable com.google.android.tvlauncher 2>$null
adb shell pm enable com.google.android.leanbacklauncher 2>$null
adb shell pm enable com.google.android.tvrecommendations 2>$null

Write-Host "   -> Restoring default animations & screensaver settings ..." -ForegroundColor Yellow
adb shell settings put global window_animation_scale 1.0
adb shell settings put global transition_animation_scale 1.0
adb shell settings put global animator_duration_scale 1.0
adb shell settings put secure screensaver_enabled 1
adb shell settings put system screen_off_timeout 1800000

Write-Host "`n[DONE] All disabled apps, stock launcher, and system settings have been restored!" -ForegroundColor Green
