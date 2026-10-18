# Genesis Manifest: `rea_TV` (Android TV Revival & Ultra-Light Launcher)

**Status:** Active Organism  
**Source Blueprint:** [@justansub — "Claude made my Old Android TV feel Brand New!"](https://x.com/justansub/status/2111571310187053361)  
**Canonical Doctrine:** [genesis.md](file:///c:/projects/rea_TV/genesis.md)

---

## Architectural Alignment (The 6 Genesis Pillars)

1. **The Seed (Dream Kernel)**
   - Reclaim an aging, ad-choked 2 GB RAM Android TV and return it to pure, responsive intent: an instant-boot, zero-ad, ~12 MB RAM living-room interface.
2. **The Microcosm (Subterranean Layer)**
   - Background ADB audit and reclamation scripts (`scripts/1-connect-and-audit.ps1`, `scripts/2-debloat-tv.ps1`) inspect `/proc/meminfo`, `dumpsys meminfo`, and package tables, recycling wasted RAM by disabling telemetry, bloatware, and sponsored home rows without destructive permanent deletion.
3. **The Breakthrough (First Emergence)**
   - Wireless ADB (`<TV_IP>:5555`) bridges local laptop automation to physical living-room hardware, replacing sluggish stock launcher layers with a clean, D-pad-native interface.
4. **The First Tree (Connectivity Engine)**
   - **Trunk**: PowerShell ADB orchestration & safety engine (`scripts/`).
   - **Roots**: Reversible state & rollback ledger (`state/changes_log.json` & `scripts/undo-all.ps1`).
   - **Branches**: Protected system services allowlist (Google Play, IME/Keyboard, Bluetooth remote, HDMI `TvInputManager`).
   - **Leaves**: Ultra-lightweight native Android TV Home Screen APK (`launcher-app/`, `com.reatv.launcher`).
5. **The City, the World, the Realms (Governance & Safety)**
   - Strict **Protected Package Allowlist** prevents disabling critical hardware/input services:
     - Google Play Store (`com.android.vending`) & Google Play Services (`com.google.android.gms`)
     - Virtual Keyboards / IME (`com.google.android.inputmethod.*`, `com.android.inputmethod.*`)
     - Bluetooth stack (`com.android.bluetooth`, remote pairing services)
     - HDMI & TV Input Hardware (`com.android.tv`, `android.media.tv`, `com.google.android.tv`, OEM HDMI passthrough packages)
   - Every state change is logged and reversible with a single command (`.\scripts\undo-all.ps1`).
6. **The Living System**
   - The custom launcher dynamically discovers installed streaming apps, HDMI inputs, and system settings while letting the user pin/unpin favorite apps with a long-press of the remote's `OK` button.
