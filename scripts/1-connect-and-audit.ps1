<#
.SYNOPSIS
    Step 1: Connect to an Android TV over Wi-Fi via ADB, check baseline RAM, and categorize every installed app into 3 plain-English lists:
    1) Safe to Turn Off (Bloatware, Ad-heavy Stock Launchers, Telemetry)
    2) Needed by the TV (Protected Essentials: Google Play, Keyboard, Bluetooth, HDMI Inputs, Core OS)
    3) Apps You Use / Streaming Apps (Candidates to Keep or Uninstall if unused)
#>
param(
    [Parameter(Mandatory = $false)]
    [string]$TvIp = ""
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$StateDir = Join-Path $ProjectRoot "state"
if (-not (Test-Path $StateDir)) { New-Item -ItemType Directory -Force -Path $StateDir | Out-Null }

if ($TvIp) {
    $Target = if ($TvIp -match ":") { $TvIp } else { "${TvIp}:5555" }
    Write-Host "`n[1/4] Connecting to Android TV at $Target ..." -ForegroundColor Cyan
    adb connect $Target
    Start-Sleep -Seconds 2
}

$Devices = adb devices | Select-String -Pattern "\tdevice$"
if (-not $Devices) {
    Write-Host "`n[!] No authorized Android TV connected yet." -ForegroundColor Yellow
    Write-Host "    1. On your TV: Settings -> Device Preferences (or System) -> About -> Press OK on 'Build' 7 times."
    Write-Host "    2. Go back -> Developer options -> Turn ON 'USB debugging' (and 'Network/Wireless debugging')."
    Write-Host "    3. Run: .\scripts\1-connect-and-audit.ps1 -TvIp <YOUR_TV_IP>"
    Write-Host "    4. On the TV screen, tick 'Always allow from this computer' and press Allow.`n"
    exit 1
}

Write-Host "[2/4] Reading TV hardware & baseline memory ..." -ForegroundColor Cyan
$Model = (adb shell getprop ro.product.model).Trim()
$Brand = (adb shell getprop ro.product.brand).Trim()
$AndroidVer = (adb shell getprop ro.build.version.release).Trim()

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

Write-Host "      Device: $Brand $Model (Android $AndroidVer)" -ForegroundColor Green
Write-Host "      Baseline Free Memory: $MemAvailMb MB free of $MemTotalMb MB ($MemFreePct%)" -ForegroundColor Green

Write-Host "[3/4] Auditing installed packages ..." -ForegroundColor Cyan
$EnabledPkgs = (adb shell pm list packages -e) | ForEach-Object { ($_ -replace "^package:", "").Trim() } | Where-Object { $_ } | Sort-Object

# Plain-English dictionary of common Android TV packages
$PlainEnglishNames = @{
    # Safe to Turn Off (Bloatware / Sponsored Rows / Telemetry / Screensavers)
    "com.google.android.tvlauncher"                  = "Stock Android TV Home Screen (shows sponsored rows & ads)"
    "com.google.android.leanbacklauncher"            = "Legacy Android TV Home Launcher"
    "com.google.android.leanbacklauncher.recommendations" = "Home Screen Sponsored Recommendations Row"
    "com.google.android.tvrecommendations"           = "Android TV Sponsored Recommendations & Notifications"
    "com.google.android.backdrop"                    = "Chromecast Ambient Mode / Backdrop Screensaver"
    "com.android.dreams.basic"                       = "Basic Daydream Screensaver"
    "com.android.dreams.phototable"                  = "Photo Table Screensaver"
    "com.google.android.feedback"                    = "Google Market Feedback Agent (Telemetry)"
    "com.google.android.onetimeinitializer"          = "First-Boot Setup Initializer"
    "com.google.android.partnersetup"                = "Google Partner Setup & Tracking"
    "com.google.android.syncadapters.calendar"       = "Google Calendar Background Sync (unneeded on TV)"
    "com.google.android.syncadapters.contacts"       = "Google Contacts Background Sync (unneeded on TV)"
    "com.android.providers.calendar"                 = "Calendar Storage Provider (unneeded on TV)"
    "com.android.providers.contacts"                 = "Contacts Storage Provider (unneeded on TV)"
    "com.google.android.play.games"                  = "Google Play Games"
    "com.google.android.videos"                      = "Google Play Movies & TV (Deprecated)"
    "com.google.android.music"                       = "Google Play Music (Deprecated)"
    "com.google.android.youtube.tvmusic"             = "YouTube Music for TV"
    "com.spotify.tv.android"                         = "Spotify for Android TV"
    "com.apple.atve.androidtv.appletv"               = "Apple TV App"
    "com.android.printspooler"                       = "Printer Spooler Service (unneeded on TV)"
    "com.google.android.marvin.talkback"             = "TalkBack Screen Reader (safe to turn off if unused)"
    "com.google.android.katniss"                     = "Google Assistant Voice Search"
    "com.google.android.tts"                         = "Google Text-to-Speech Engine"

    # Protected Essentials (NEVER Turn Off)
    "com.android.vending"                            = "Google Play Store (Protected Essential)"
    "com.google.android.gms"                         = "Google Play Services (Protected Essential)"
    "com.google.android.gsf"                         = "Google Services Framework (Protected Essential)"
    "com.google.android.inputmethod.latin"           = "Gboard TV Keyboard (Protected Essential)"
    "com.google.android.leanback.ime"                = "Android TV Virtual Keyboard (Protected Essential)"
    "com.android.bluetooth"                          = "Bluetooth Service for TV Remote (Protected Essential)"
    "com.android.tv"                                 = "Live TV & HDMI Input App (Protected Essential)"
    "com.android.providers.tv"                       = "TV & HDMI Channels Provider (Protected Essential)"
    "com.android.tv.settings"                        = "Android TV Settings (Protected Essential)"
    "com.google.android.packageinstaller"            = "App Package Installer (Protected Essential)"
    "com.android.systemui"                           = "Android System UI (Protected Essential)"
    "com.android.shell"                              = "ADB Shell Service (Protected Essential)"
}

$SafeToTurnOffPatterns = @(
    "tvrecommendations", "leanbacklauncher.recommendations", "backdrop", "dreams",
    "feedback", "partnersetup", "syncadapters.calendar", "syncadapters.contacts",
    "providers.calendar", "providers.contacts", "printspooler", "play.games",
    "google.android.videos", "google.android.music", "bugreport", "telemetry",
    "analytics", "demo", "retailmode", "eshop", " gallery", "browser"
)

$ProtectedPatterns = @(
    "vending", "google.android.gms", "google.android.gsf", "inputmethod", "leanback.ime",
    "keyboard", "bluetooth", "hdmi", "tvinput", "providers.tv", "^com\.android\.tv$",
    "tv\.settings", "systemui", "packageinstaller", "permissioncontroller",
    "webview", "wifi", "networkstack", "telephony", "se.omapi", "keychain",
    "media\.module", "providers\.settings", "providers\.media", "providers\.downloads",
    "^android$", "^com\.android\.shell$", "com\.reatv\.launcher"
)

$StreamingPatterns = @(
    "youtube", "smarttube", "netflix", "plex", "jellyfin", "kodi", "primevideo",
    "amazon.avod", "disney", "hulu", "hbo", "max", "peacock", "paramount", "tubi",
    "pluto", "twitch", "vlc", "stremio", "tivimate", "spotify", "appletv", "atve"
)

$SafeList = @()
$ProtectedList = @()
$UserAppsList = @()

foreach ($pkg in $EnabledPkgs) {
    $desc = if ($PlainEnglishNames.ContainsKey($pkg)) { $PlainEnglishNames[$pkg] } else { $pkg }

    $isProtected = $false
    foreach ($pat in $ProtectedPatterns) {
        if ($pkg -match $pat) { $isProtected = $true; break }
    }
    if ($isProtected) {
        $ProtectedList += [PSCustomObject]@{ Package = $pkg; Description = $desc }
        continue
    }

    $isStreaming = $false
    foreach ($pat in $StreamingPatterns) {
        if ($pkg -match $pat) { $isStreaming = $true; break }
    }
    if ($isStreaming) {
        $UserAppsList += [PSCustomObject]@{ Package = $pkg; Description = $desc }
        continue
    }

    $isSafeBloat = $false
    foreach ($pat in $SafeToTurnOffPatterns) {
        if ($pkg -match $pat) { $isSafeBloat = $true; break }
    }
    if ($isSafeBloat) {
        $SafeList += [PSCustomObject]@{ Package = $pkg; Description = $desc }
    } else {
        # Default remaining system packages to Protected unless explicitly identified
        $ProtectedList += [PSCustomObject]@{ Package = $pkg; Description = "$desc (System Component)" }
    }
}

$AuditReport = [PSCustomObject]@{
    Timestamp       = (Get-Date).ToString("o")
    Device          = "$Brand $Model (Android $AndroidVer)"
    TotalRamMb      = $MemTotalMb
    BaselineFreeMb  = $MemAvailMb
    BaselineFreePct = $MemFreePct
    SafeToTurnOff   = $SafeList
    UserAndMediaApps= $UserAppsList
    NeededByTv      = $ProtectedList
}

$AuditFile = Join-Path $StateDir "baseline_audit.json"
$AuditReport | ConvertTo-Json -Depth 5 | Set-Content -Path $AuditFile -Encoding UTF8

Write-Host "`n================ 1. SAFE TO TURN OFF ($($SafeList.Count) apps) ================" -ForegroundColor Yellow
$SafeList | Format-Table -AutoSize

Write-Host "================ 2. APPS YOU USE / STREAMING ($($UserAppsList.Count) apps) ================" -ForegroundColor Cyan
$UserAppsList | Format-Table -AutoSize

Write-Host "================ 3. NEEDED BY THE TV - PROTECTED ($($ProtectedList.Count) packages) ================" -ForegroundColor Green
$ProtectedList | Select-Object -First 25 | Format-Table -AutoSize
if ($ProtectedList.Count -gt 25) {
    Write-Host "   ... plus $($ProtectedList.Count - 25) core OS packages protected automatically." -ForegroundColor DarkGray
}

Write-Host "`n[4/4] Saved full baseline audit to: $AuditFile" -ForegroundColor Green
