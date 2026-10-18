<#
.SYNOPSIS
    Step 2: Safely disable Android TV bloatware (and optionally uninstall unused preloads for user 0)
    with strict protection for Google Play, Keyboards, Bluetooth, and HDMI inputs.
    Logs every change to state/changes_log.json so everything can be undone with one command.
#>
param(
    [Parameter(Mandatory = $false)]
    [string[]]$DisablePackages = @(
        "com.google.android.tvrecommendations",
        "com.google.android.leanbacklauncher.recommendations",
        "com.google.android.backdrop",
        "com.android.dreams.basic",
        "com.android.dreams.phototable",
        "com.google.android.feedback",
        "com.google.android.partnersetup",
        "com.google.android.syncadapters.calendar",
        "com.google.android.syncadapters.contacts",
        "com.android.providers.calendar",
        "com.android.providers.contacts",
        "com.android.printspooler",
        "com.google.android.play.games",
        "com.google.android.videos",
        "com.google.android.music"
    ),
    [Parameter(Mandatory = $false)]
    [string[]]$UninstallPackages = @(),
    [Parameter(Mandatory = $false)]
    [switch]$AskBeforeEach = $true
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$StateDir = Join-Path $ProjectRoot "state"
if (-not (Test-Path $StateDir)) { New-Item -ItemType Directory -Force -Path $StateDir | Out-Null }
$LogFile = Join-Path $StateDir "changes_log.json"

# Hard safety blocklist: NEVER allow turning off Google Play, Keyboard, Bluetooth, or HDMI inputs
$NeverTouchPatterns = @(
    "com\.android\.vending",
    "com\.google\.android\.gms",
    "com\.google\.android\.gsf",
    "inputmethod",
    "leanback\.ime",
    "keyboard",
    "bluetooth",
    "hdmi",
    "tvinput",
    "providers\.tv",
    "^com\.android\.tv$",
    "tv\.settings",
    "systemui",
    "packageinstaller",
    "com\.reatv\.launcher"
)

function Test-IsProtected([string]$Pkg) {
    foreach ($pat in $NeverTouchPatterns) {
        if ($Pkg -match $pat) { return $true }
    }
    return $false
}

$ExistingLogs = @()
if (Test-Path $LogFile) {
    $raw = Get-Content $LogFile -Raw | ConvertFrom-Json
    if ($raw) { $ExistingLogs = @($raw) }
}

$Installed = (adb shell pm list packages -e) | ForEach-Object { ($_ -replace "^package:", "").Trim() }

foreach ($pkg in $DisablePackages) {
    if (Test-IsProtected $pkg) {
        Write-Host "[PROTECTED] Skipping '$pkg' (Google Play / Keyboard / Bluetooth / HDMI guardrail)." -ForegroundColor Red
        continue
    }
    if ($Installed -notcontains $pkg) {
        Write-Host "[SKIP] '$pkg' is not active on this TV." -ForegroundColor DarkGray
        continue
    }

    if ($AskBeforeEach) {
        $ans = Read-Host "Turn off '$pkg' (reversible via pm enable)? [y/N]"
        if ($ans -notmatch "^[yY]") { continue }
    }

    Write-Host "[DISABLE] Turning off $pkg ..." -ForegroundColor Yellow
    adb shell pm disable-user --user 0 $pkg
    $ExistingLogs += [PSCustomObject]@{
        Timestamp   = (Get-Date).ToString("o")
        Action      = "disable-user"
        Package     = $pkg
        UndoCommand = "adb shell pm enable $pkg"
    }
}

foreach ($pkg in $UninstallPackages) {
    if (Test-IsProtected $pkg) {
        Write-Host "[PROTECTED] Refusing to uninstall '$pkg' (Protected Essential)." -ForegroundColor Red
        continue
    }
    if ($Installed -notcontains $pkg) {
        Write-Host "[SKIP] '$pkg' is not installed on this TV." -ForegroundColor DarkGray
        continue
    }

    if ($AskBeforeEach) {
        $ans = Read-Host "Uninstall '$pkg' for user 0 (reversible via install-existing)? [y/N]"
        if ($ans -notmatch "^[yY]") { continue }
    }

    Write-Host "[UNINSTALL] Removing $pkg for user 0 ..." -ForegroundColor Magenta
    adb shell pm uninstall -k --user 0 $pkg
    $ExistingLogs += [PSCustomObject]@{
        Timestamp   = (Get-Date).ToString("o")
        Action      = "uninstall-user0"
        Package     = $pkg
        UndoCommand = "adb shell cmd package install-existing $pkg"
    }
}

$ExistingLogs | ConvertTo-Json -Depth 4 | Set-Content -Path $LogFile -Encoding UTF8
Write-Host "`nAll changes recorded in $LogFile. Run .\scripts\undo-all.ps1 at any time to restore." -ForegroundColor Green
