# Rea TV (`rea_TV`) — Android TV Debloater & Ultra-Light Custom Home Screen

Set up from [@justansub's Android TV Revival Blueprint](https://x.com/justansub/status/2111571310187053361) (*"Claude made my Old Android TV feel Brand New!"*) and grounded in the [Genesis Protocol](file:///c:/projects/rea_TV/genesis_manifest.md).

## What This Project Does

1. **Audits & Categorizes Every App over Wi-Fi (`scripts/1-connect-and-audit.ps1`)**
   - Connects via ADB over Wi-Fi (`<TV_IP>:5555`).
   - Measures baseline Free vs. Total RAM.
   - Splits all installed packages into three plain-English lists saved to `state/baseline_audit.json`:
     1. **Safe to Turn Off** (sponsored home rows, telemetry, Chromecast ambient backdrop, deprecated Play Movies/Music/Games)
     2. **Apps You Use / Streaming** (YouTube, Netflix, Prime Video, Disney+, Plex, Spotify, Apple TV, etc.)
     3. **Needed by the TV (Protected Essentials)** (Google Play Store & Services, Virtual Keyboards/Gboard, Bluetooth for your remote, HDMI & Live TV input services)

2. **Reversible Debloating with Hard Safety Guardrails (`scripts/2-debloat-tv.ps1`)**
   - Uses `pm disable-user --user 0` to turn bloatware off without deleting it (and `pm uninstall -k --user 0` only for apps you explicitly choose to remove).
   - Hard-blocks turning off **Google Play**, **Keyboards**, **Bluetooth**, or **HDMI inputs**.
   - Logs every single change to `state/changes_log.json`.

3. **System Speed & Power Tuning (`scripts/3-optimize-tv.ps1`)**
   - Turns off window, transition, and animator animations (`0.0`).
   - Disables the memory-heavy screensaver.
   - Sets sleep timeout to **5 minutes** (`300000` ms).

4. **Ultra-Lightweight Custom Home Screen APK (`launcher-app/` & `scripts/4-install-launcher.ps1`)**
   - Pre-compiled native Android TV launcher (`com.reatv.launcher`) built with zero heavy third-party dependencies (**~17 KB APK**, **~12 MB RAM**).
   - Features:
     - **Big Clock & Date** + live **Free RAM badge** in the header
     - **Favorite Streaming Apps Grid** (hold `OK` on your remote on any app to **Pin / Unpin** it, or click **All Apps** to view everything installed)
     - **Direct HDMI Inputs & System Row** (auto-discovers hardware HDMI ports via `TvInputManager`, plus 1-click tiles for **Wi-Fi & Network**, **Settings**, and **Manage Apps**)
     - **Zero ads, zero sponsored rows, zero recommendations**

5. **One-Command Undo (`scripts/undo-all.ps1`)**
   - Restores every disabled or uninstalled package, re-enables the stock launcher, and resets animations/screensaver with a single command.

---

## Step-by-Step: Preparing Your TV (Takes ~2 Minutes)

1. On your Android TV, open **Settings** → **Device Preferences** (or **System**) → **About**.
2. Scroll down to **Build** and press **OK** on your remote **7 times** until it says *"You are now a developer."*
3. Go back one menu, open **Developer options**, and turn ON **USB debugging** (and **Network debugging** / **Wireless debugging** if listed).
4. Find your TV's IP address in **Settings** → **Network & Internet** → select your Wi-Fi network (looks like `192.168.1.XX`).
5. When we connect for the first time, a prompt will appear on your TV: *"Allow USB debugging?"* — tick **Always allow from this computer** and press **Allow**.

---

## Quick Commands

```powershell
# 1. Connect to your TV and view the 3-list plain-English audit + baseline RAM
.\scripts\1-connect-and-audit.ps1 -TvIp 192.168.1.XX

# 2. Safely turn off bloatware (asks before each change by default)
.\scripts\2-debloat-tv.ps1 -AskBeforeEach

# 3. Turn off animations, disable screensaver, and set 5-minute sleep timer
.\scripts\3-optimize-tv.ps1 -SleepMinutes 5

# 4. Install the custom Rea TV Home Screen & compare Free RAM before vs. after
.\scripts\4-install-launcher.ps1 -DisableStockLauncher

# Undo everything at any time with one command:
.\scripts\undo-all.ps1
```


---
### 🤝 Hall of Kudos & Open-Source Attributions
See [CREDITS.md](./CREDITS.md) or open [kudos.html](./kudos.html) to view the people, open-source creators, libraries, and AI pair-programming partners recognized across the **Primo IT Tech LLC** ecosystem.

