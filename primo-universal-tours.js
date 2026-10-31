/**
 * Primo IT Tech LLC — Universal Guided Tour Engine (v2.0)
 * Provides both:
 *   1. ⚡ Quick Guided Tour (Fast 4-Step Executive Overview)
 *   2. 🎓 Full Guided Tour (Comprehensive Interactive All-Panels & Controls Walkthrough)
 * Works across the Master Portfolio Hub, all 37+ Gateway Portals (:8090), and all Standalone Apps (:3000, :3800, :3900, :3950, :4173, :5173, :5174, :8788).
 */
(function () {
  if (window.PrimoUniversalTours) return;

  const CATALOG = {
    'master-hub': {
      name: 'Master Portfolio & Guided Tour Command Center',
      quick: [
        { selector: 'header', badge: 'COMMAND CENTER', title: '1. Primo IT Tech LLC Master Command Center', desc: 'Welcome to the Primo IT Tech LLC Universal Portfolio Hub (Genesis 6/6 Active). Launch any of our 36+ live applications, inspect Legal/IP protections, or start a Quick or Full Guided Tour.' },
        { selector: '#tier-flagship', badge: 'TIER 1 FLAGSHIPS', title: '2. Tier 1 — Flagship Apps & Credential Studios', desc: 'Open ID-Access-Scanner (:3000), CardLayoutStudio v3.0, PrimotITcdfimporter (:5174), PrimoIT Wardrobes (:5173), DeBlobisizer-Pro, PrimoITall (:3800), FlockGPScameras, BLOBer, and SLOPDetector.' },
        { selector: '#tier-hardware', badge: 'TIER 2 HARDWARE & R&D', title: '3. Tier 2 — Hardware Innovation Hubs & R&D Suites', desc: 'Explore Primo IT Tech Grinder Proto 02 (:3900), Wingy Dingy Rotary Cooker (:3950 & 3D Dual-Axis), ChirsHallison Proximity Vault (:8788), Pi Boost (:4173), GABOO v5.0, and PPKiosk.' },
        { selector: '#tier-tools', badge: 'TIER 3 STUDIOS & LOOPS', title: '4. Tier 3 — Migration Tools, Media Studios & Genesis Loops', desc: 'Launch CDF Exporter, Cartoon Video Studio, OpenMontage, Proof Drop, Quant Trading Systems, and Autonomous Genesis Loop Engineering portals.' }
      ],
      full: [
        { selector: 'header', badge: 'BRAND & CREST', title: '1. Official Primo IT Tech LLC Shield Crest & Status', desc: 'Displays the Primo IT Tech LLC vector shield emblem, Jupiter Florida corporate badge, and active 6-Pillar Genesis Protocol verification status.' },
        { selector: '#quickTourBtn, #tourBtn', badge: 'TOUR CONTROLS', title: '2. Dual Guided Tour Controls (Quick & Full)', desc: 'Every application in the Primo IT Tech LLC ecosystem features both a ⚡ Quick Guided Tour (4-step summary) and a 🎓 Full Guided Tour (complete deep-dive walkthrough).' },
        { selector: 'button[onclick*="openMasterLegalModal"]', badge: 'LEGAL & GENESIS', title: '3. Legal, IP & 17 U.S.C. § 1201(f) Compliance Modal', desc: 'Click to inspect corporate IP ownership, DMCA § 1201(f) interoperability notices, zero-PII local privacy guarantees, and the 6 Genesis Pillars.' },
        { selector: '#tier-flagship .proj:nth-child(1)', badge: 'FLAGSHIP 1', title: '4. ID-Access-Scanner (PrimoVerify / PockeTracker)', desc: 'Enterprise optical ID/barcode check-in, directional IN/OUT attendance, school guardian desk, site geofencing, and visitor badge printing on Port :3000.' },
        { selector: '#tier-flagship .proj:nth-child(2)', badge: 'FLAGSHIP 2', title: '5. CardLayoutStudio v3.0 & PrimotITcdfimporter', desc: 'CR80 badge design studio and zero-refresh reactive schema bus for migrating legacy RCE/CDF card templates into canonical EliteID v2.0 JSON.' },
        { selector: '#tier-flagship .proj:nth-child(4)', badge: 'FLAGSHIP 3', title: '6. PrimoIT Wardrobes (Smart Digital Closet & 3D Fit)', desc: 'AI Outfit Builder, Color-Blind Safe Styling, Dedicated Tie Studio, and proportional 3D Virtual Fit models on Port :5173.' },
        { selector: '#tier-flagship .proj:nth-child(6)', badge: 'FLAGSHIP 4', title: '7. PrimoITall (16-Tool Hardware & Workstation Suite)', desc: 'Local RFID/Smartcard Reader Configurator, Elatec .BIX Firmware Inspector, Sysinternals, Winget, Printer Spooler, and AI Workstation Manager on Port :3800.' },
        { selector: '#tier-hardware .proj:nth-child(1)', badge: 'HARDWARE 1', title: '8. Primo IT Tech Grinder™ (Prototype 02)', desc: 'Electric herb mill with direct-to-bowl removable tip and momentary jam-clearing reverse rocker, complete with 1080p demo video, BOM, and patent roadmap on Port :3900.' },
        { selector: '#tier-hardware .proj:nth-child(2)', badge: 'HARDWARE 2', title: '9. Wingy Dingy Rotary Cooker (Model WD-001 & v2.0 3D)', desc: 'Motorized oil-less poultry tumble-roaster with 1:1 SVG sheet-metal flat patterns, thermal array specs, and 3D dual-axis simulator on Port :3950.' },
        { selector: '#tier-hardware', badge: 'PROXIMITY & R&D', title: '10. ChirsHallison Vault (:8788), Pi Boost (:4173) & Rea TV', desc: 'Explore the ChirsHallison GPS Proximity & Expiring Vault (:8788), Pi Boost Mining & Games Companion (:4173), GABOO v5.0, PPKiosk, and Rea TV Android TV Debloater.' },
        { selector: '#tier-tools', badge: 'TIER 3 ECOSYSTEM', title: '11. Migration Utilities, Video Studios, Quant & Genesis Loops', desc: 'Access all 18 Tier 3 portals including CDF Exporter, Cartoon Video Studio, MoneyPrinterTurbo, OpenMontage, Proof Drop, Trading Systems, and DreamNet Genesis Loops.' },
        { selector: 'footer', badge: 'FOOTER & KUDOS', title: '12. Hall of Kudos, Open-Source Credits & Legal Footer', desc: 'Open the Hall of Kudos (/kudos.html) to view open-source attributions or review the Florida governing law and zero-telemetry privacy pledge.' }
      ]
    },
    'primoitall': {
      name: 'Primo IT Tech All-in-One Suite',
      quick: [
        { clickSelector: '.tab-btn[data-tab="configurator"]', selector: '#card-reader-config', badge: '1. CONFIGURATOR', title: '1. Hardware Reader & Security Preset Configurator', desc: 'Select your target RFID/Smartcard reader, interrogate active USB config, and apply security presets (DESFire EV3, HID Seos, iCLASS SE, Wiegand bit lengths).' },
        { clickSelector: '.tab-btn[data-tab="devices"]', selector: '#tab-devices', badge: '2. LIVE HARDWARE', title: '2. On-Demand USB / PC-SC / Serial Hardware Discovery', desc: 'Scan connected Elatec TWN4, HID OMNIKEY, and serial readers on demand with full VID/PID telemetry and zero background bus polling.' },
        { clickSelector: '.tab-btn[data-tab="verifier"]', selector: '#tab-verifier', badge: '3. TAP & SWIPE TEST', title: '3. Live Credential Tap & Keyboard Wedge Verifier', desc: 'Test physical badge reads in real time—inspect facility codes, card numbers, bit parity, HEX/DEC translations, and output timing.' },
        { clickSelector: '.tab-btn[data-tab="options"]', selector: '#tab-options', badge: '4. WORKSTATION & BACKUP', title: '4. Workstation Commissioning, Snapshots & 16-Tool Drawer', desc: 'Configure 64-bit SQL Server ODBC DSNs, firewall ports, timestamped project backups, and open "☰ All Tools" for Sysinternals, Winget, Printer Spooler, and AI Cleanup.' }
      ],
      full: [
        { clickSelector: '.tab-btn[data-tab="configurator"]', selector: '#card-reader-config', badge: 'STEP 1 • READER SETUP', title: '1. Target Reader & Deployment Security Preset', desc: 'Choose a connected reader or lab simulator, pick one of 7 enterprise security presets, and tune Wiegand bit length, facility code, buzzer, and LED behavior.' },
        { clickSelector: '.tab-btn[data-tab="configurator"]', selector: '#tab-configurator .card:nth-child(2)', badge: 'STEP 2 • GUARDRAILS', title: '2. Ethical Security Guardrails & Payload Preview', desc: 'Inspect the live configuration payload and ethical compliance verification (strictly blocks card cloning or unauthorized key extraction).' },
        { clickSelector: '.tab-btn[data-tab="devices"]', selector: '#tab-devices', badge: 'STEP 3 • USB INVENTORY', title: '3. Connected Hardware Inventory (PC/SC, USB PnP, COM)', desc: 'View all detected smartcard readers, HID keyboard wedges, and virtual COM ports with instant connection diagnostics.' },
        { clickSelector: '.tab-btn[data-tab="verifier"]', selector: '#tab-verifier', badge: 'STEP 4 • TAP VERIFIER', title: '4. Live Badge Tap & Swipe Diagnostic Bench', desc: 'Swipe or tap a credential to capture raw keystrokes, bitstreams, facility codes, and format diagnostics.' },
        { clickSelector: '.tab-btn[data-tab="presets"]', selector: '#tab-presets', badge: 'STEP 5 • PRESETS', title: '5. Enterprise Security Presets Library', desc: 'Compare High-Security DESFire EV3, Corporate iCLASS SE, Multi-Tech Transition, and Campus Badge presets side by side.' },
        { clickSelector: '.tab-btn[data-tab="site-profiles"]', selector: '#tab-site-profiles', badge: 'STEP 6 • SITE PROFILES', title: '6. Multi-Site Deployment Profiles', desc: 'Save, import, and export site-specific reader configurations and custom key manifests for rapid field commissioning.' },
        { clickSelector: '.tab-btn[data-tab="bix-firmware"]', selector: '#tab-bix-firmware', badge: 'STEP 7 • .BIX FIRMWARE', title: '7. Elatec .BIX / .BAP Firmware Binary Inspector', desc: 'Parse and compare local Elatec firmware images, inspect AppBlaster templates, and generate clean deployment manifests.' },
        { clickSelector: '.tab-btn[data-tab="catalog"]', selector: '#tab-catalog', badge: 'STEP 8 • CREDENTIAL CATALOG', title: '8. RF & Smartcard Credential Reference Catalog', desc: 'Interactive 125 kHz vs. 13.56 MHz vs. NFC/BLE credential encyclopedia with security ratings and compatibility notes.' },
        { clickSelector: '.tab-btn[data-tab="sysinternals"]', selector: '#tab-sysinternals', badge: 'STEP 9 • SYSINTERNALS', title: '9. Microsoft Sysinternals & System Diagnostics', desc: 'Launch Process Explorer, Autoruns, TCPView, and Procmon or run native Windows workstation health checks.' },
        { clickSelector: '.tab-btn[data-tab="winget"]', selector: '#tab-winget', badge: 'STEP 10 • WINGET & PS TOOLS', title: '10. Winget Batch Installer & PowerShell Admin Toolkit', desc: 'Install essential IT utilities via Winget and run safe PowerShell network, DNS, and hardware diagnostics.' },
        { clickSelector: '.tab-btn[data-tab="printers"]', selector: '#tab-printers', badge: 'STEP 11 • PRINTER & WIN11', title: '11. Badge Printer Spooler & Windows 11 Cleanup', desc: 'Clear stuck card printer spooler queues, inspect USB badge printers, and run safe Windows 11 de-bloating routines.' },
        { clickSelector: '.tab-btn[data-tab="ai-tools"]', selector: '#tab-ai-tools', badge: 'STEP 12 • AI WORKSTATION', title: '12. Local AI Apps, IDEs & Safe AI Cache Cleanup', desc: 'Inventory local AI tools (Ollama, Cursor, VS Code, Claude, Antigravity) with explicit user consent and reclaim orphaned cache storage.' },
        { clickSelector: '.tab-btn[data-tab="options"]', selector: '#tab-options', badge: 'STEP 13 • BACKUP & ROLLBACK', title: '13. ODBC Commissioning, Project Snapshots & Rollback', desc: 'Create 1-click timestamped codebase backups, run health analysis, or safely restore any prior project snapshot.' }
      ]
    },
    'primoit-grinder': {
      name: 'Primo IT Tech Grinder™ (Prototype 02)',
      quick: [
        { clickSelector: '.nav-tab[data-tab="overview"]', selector: '#tab-overview', badge: '1. SCHEMATIC', title: '1. Prototype 02 Technical Schematic & Core Innovations', desc: 'Inspect Figure 1 patent schematic: 6061-T6 aluminum body, direct-to-bowl removable 0.50"/0.40" tips, and lateral jam-clearing reverse rocker.' },
        { clickSelector: '.nav-tab[data-tab="video"]', selector: '#tab-video', badge: '2. DEMO VIDEO', title: '2. 1080p Prototype 02 Video Demonstration', desc: 'Watch the full 1080p demonstration showing direct-to-bowl dispensing into a 14mm glass bowl head with zero spillage.' },
        { clickSelector: '.nav-tab[data-tab="bom"]', selector: '#tab-bom', badge: '3. HARDWARE BOM', title: '3. Bill of Materials ($134.60 Proto → $25.28 at 1k Units)', desc: 'Review the complete 11-component hardware BOM comparing prototype CNC/off-the-shelf pricing against 1,000-unit production volume.' },
        { clickSelector: '.nav-tab[data-tab="legal"]', selector: '#tab-legal', badge: '4. PATENT & IP', title: '4. USPTO Patent, Trademark & Florida LLC Roadmap', desc: 'Track the $605 total legal budget covering Florida LLC registration, USPTO Class 7 & 34 trademarks, and Micro-Entity Provisional Patent filing.' }
      ],
      full: [
        { clickSelector: '.nav-tab[data-tab="overview"]', selector: '#tab-overview .card:nth-child(1)', badge: 'STEP 1 • FIGURE 1', title: '1. Prototype 02 Figure 1 Technical Schematic', desc: 'High-resolution engineering callout illustrating the cap-mounted reverse rocker, high-torque planetary gearmotor, conical chute, and threaded bowl nozzle.' },
        { clickSelector: '.nav-tab[data-tab="overview"]', selector: '#tab-overview .card:nth-child(2)', badge: 'STEP 2 • INNOVATIONS', title: '2. Three Core Patentable Differentiators', desc: 'Reviews the Direct-to-Bowl Removable Tip (0.50" & 0.40"), Momentary Jam-Clearing Reverse Rocker, and Ledge-Free 304 Stainless Shear Chamber.' },
        { clickSelector: '.nav-tab[data-tab="video"]', selector: '#tab-video', badge: 'STEP 3 • 1080P VIDEO', title: '3. Full 1080p Product Video & MP4 Download', desc: 'Stream or download the 1080p demonstration video with Roots Reggae Dub soundtrack and 3D cutaway sequence.' },
        { clickSelector: '.nav-tab[data-tab="renders"]', selector: '#tab-renders', badge: 'STEP 4 • RENDERS GALLERY', title: '4. Industrial Renders & Concept Form Gallery', desc: 'Browse photorealistic industrial design renders and ergonomic form studies.' },
        { clickSelector: '.nav-tab[data-tab="bom"]', selector: '#tab-bom', badge: 'STEP 5 • BOM TABLE', title: '5. Interactive 11-Part Bill of Materials (BOM)', desc: 'Detailed part breakdown across CNC housing, 304 SS teeth, 12V planetary gearmotor, DPDT momentary switch, Li-Ion pack, and USB-C PD charging.' },
        { clickSelector: '.nav-tab[data-tab="legal"]', selector: '#tab-legal', badge: 'STEP 6 • IP ROADMAP', title: '6. USPTO Provisional Patent Claims & Filing Checklist', desc: 'Step-by-step legal execution plan for Primo IT Tech LLC including independent claims and trademark classes.' },
        { clickSelector: '.nav-tab[data-tab="specs"]', selector: '#tab-specs', badge: 'STEP 7 • ENGINEERING SPECS', title: '7. Mechanical, Electrical & Sanitary Specifications', desc: 'Full dimensional, torque, RPM, battery protection, and isopropyl-safe maintenance specifications.' },
        { clickSelector: '.nav-tab[data-tab="overview"]', selector: 'button[onclick*="openGrinderLegalModal"]', badge: 'STEP 8 • GENESIS & LEGAL', title: '8. Primo IT Tech LLC Legal & Genesis 6/6 Compliance', desc: 'Click the Legal, IP & Genesis Protocol button in the header anytime to inspect the full corporate notice.' }
      ]
    },
    'new-wingy-dingy-project': {
      name: 'Wingy Dingy Rotary Cooker (Model WD-001)',
      quick: [
        { selector: '#organismPillBar', badge: '1. GENESIS SWARM', title: '1. Genesis Living Organism & Swarm Control Bar', desc: 'Run Microcosm Cycles or Trigger Breakthrough to advance the WD-001 engineering organism across the 6 Genesis Pillars.' },
        { selector: '#specGrid', badge: '2. SPECIFICATIONS', title: '2. Model WD-001 Rotary Cooker Engineering Specs', desc: '8" OD x 12" L 304 Stainless Steel perforated drum, 12V planetary DC drive (8–10 RPM), and 1200W dual quartz infrared + convective blower array.' },
        { selector: '.cad-gallery', badge: '3. 1:1 CAD ASSETS', title: '3. 1:1 Parametric SVG Sheet-Metal Flat Patterns', desc: 'Inspect and regenerate 1:1 laser-cut flat patterns for the Drum Endplate (WD001-01), Drum Shell (WD001-02), and Catchment Drawer (WD001-04).' },
        { selector: '#bomTable', badge: '4. HARDWARE BOM', title: '4. Complete Prototype vs. 1,000-Unit Volume BOM', desc: 'Review part-by-part costs and total prototype vs. volume manufacturing rollups.' }
      ],
      full: [
        { selector: '.hero-header', badge: 'STEP 1 • HEADER & BRAND', title: '1. Wingy Dingy Rotary Cooker (Model WD-001) Showcase', desc: 'Official Primo IT Tech LLC hardware engineering portal for the motorized oil-less poultry tumble-roaster.' },
        { selector: '#organismPillBar', badge: 'STEP 2 • GENESIS ENGINE', title: '2. Interactive Genesis Lifecycle & Swarm Controls', desc: 'Click "Run Microcosm Cycle" or "Trigger Breakthrough" to test live API state transitions.' },
        { selector: '#specGrid', badge: 'STEP 3 • THERMAL & DRIVE', title: '3. Drivetrain, Drum & Thermal Array Specifications', desc: 'Reviews the 304 stainless steel drum, 8–10 RPM gentle tumble speed, and 1200W dual quartz + forced convection system for 3–5 lb wing batches.' },
        { selector: '.gallery-container', badge: 'STEP 4 • CONCEPT ARCHIVE', title: '4. Original Concept Drawings & Target Output Quality', desc: 'Compare the original 1st computer layout, early engineering sketch, and target oil-less crispy wing finish.' },
        { selector: '#btnRegenCad', badge: 'STEP 5 • CAD GENERATOR', title: '5. Live Parametric CAD Asset Regeneration', desc: 'Click "Regenerate CAD Assets" to invoke the local CAD generator and refresh the 1:1 SVG flat patterns.' },
        { selector: '.cad-gallery', badge: 'STEP 6 • SHEET METAL', title: '6. WD001-01, WD001-02 & WD001-04 Flat Patterns', desc: 'Inspect the 14-gauge 304 SS drum endplate, unrolled perforated drum shell, and fat catchment drawer patterns.' },
        { selector: '#costSummary', badge: 'STEP 7 • COST ROLLUP', title: '7. Prototype vs. 1,000-Unit Volume Cost Summary', desc: 'Automatically sums all mechanical, thermal, electrical, and enclosure components.' },
        { selector: '#bomTable', badge: 'STEP 8 • BOM LEDGER', title: '8. Full Hardware Bill of Materials Table', desc: 'Detailed line-item table with part IDs, quantities, prototype unit costs, and engineering categories.' }
      ]
    },
    'chirshallison': {
      name: 'ChirsHallison // Proximity Yield & Expiring Vault',
      quick: [
        { selector: '#corridorSection', badge: '1. GPS CORRIDOR', title: '1. Live GPS Corridor & Auto-Drive Radar', desc: 'Drag the Mile 0–10 slider or click "▶ Auto-Drive Corridor" to simulate driving past resorts, timeshares, restaurants, and your pinned permits.' },
        { selector: '#lockscreenSection', badge: '2. LOCK-SCREEN HUD', title: '2. Hands-Free Lock-Screen Wake & Audio Chimes', desc: 'As you enter a geofence or hit an expiration window, alerts wake here automatically with your custom Web Audio chime and optional voice readout.' },
        { selector: '#vaultSection', badge: '3. SMART VAULT', title: '3. Smart Doc Scanner, 14 Presets & Calendar (.ICS)', desc: 'Scan a receipt/permit photo to auto-fill fields (or save the whole picture with zero typing), tap any of the 14 presets, and export to your Calendar (.ICS).' },
        { selector: '#feedbackSection', badge: '4. LIVE FEEDBACK', title: '4. Live Feedback Direct to Keith Franklin', desc: 'Submit your feature ideas here—every note saves directly to Keith Franklin (Primo IT Tech LLC) in hallison_feedback.json.' }
      ],
      full: [
        { selector: '#roleTabs', badge: 'STEP 1 • APP MODES', title: '1. Three App Modes (Split, Driver App, Supplier App)', desc: 'Switch between Split Simulator, standalone Driver Lock-Screen & Vault App, or Hospitality Supplier Yield Console.' },
        { selector: '#corridorSection', badge: 'STEP 2 • GPS & FUNDS', title: '2. Live Corridor & Verified Spending Power Filter', desc: 'Adjust your GPS Mile (0–10) and Verified Spending Power ($ USD) to filter nearby flash offers.' },
        { selector: '#parkCarBox', badge: 'STEP 3 • FIND MY CAR', title: '3. Find My Car & 1-Tap GPS Walking Guide', desc: 'Drop a 🚙 parked car marker on the corridor, capture real GPS coordinates, and launch Google Maps walking directions.' },
        { selector: '#openSoundStudioBtn', badge: 'STEP 4 • SOUND STUDIO', title: '4. Drive-By Chime & Synth Sound Studio', desc: 'Customize your drive-by alert chime (Luxury Resort, Radar Ping, Coin Drop, Sonar, Arpeggio) and waveform.' },
        { selector: '#lockscreenSection', badge: 'STEP 5 • LOCK-SCREEN HUD', title: '5. Driver Lock-Screen HUD & Instant Pass Claim', desc: 'Claim instant QR redemption passes or view captured receipt photos ranked by expiration urgency.' },
        { selector: '#docScannerBox', badge: 'STEP 6 • DOC SCANNER', title: '6. Smart Doc / Receipt Scanner & 1-Tap Whole-Pic Save', desc: 'Scan a receipt or camera photo to auto-fill fields or save the entire photo with zero typing.' },
        { selector: '#presetBar', badge: 'STEP 7 • 14 PRESETS', title: '7. 14 One-Tap Expiring Category Presets', desc: 'Tap Timeshare Points, Resort Credit, Hotel, Restaurant, Cafe, Coupon, Gift Card, Voucher, Pass, Permit, Ticket, Subscription, Warranty, or Rx.' },
        { selector: '#personalForm', badge: 'STEP 8 • CALENDAR (.ICS)', title: '8. Expiration Planner & .ICS Calendar Export', desc: 'Set exact Place, Date/Time, Corridor Mile, and Reminder window—then save to Vault or download an .ICS calendar event.' },
        { selector: '#supplierSection', badge: 'STEP 9 • SUPPLIER CONSOLE', title: '9. Hospitality, Timeshare & Supplier Flash Dispatch', desc: 'Resorts, timeshares, and restaurants broadcast unoccupied villas/rooms or VIP preview perks to nearby qualified drivers.' },
        { selector: '#feedbackSection', badge: 'STEP 10 • COLLABORATION', title: '10. Chris Hallison Live Feedback & Legal Protections', desc: 'Send live feature notes directly to Keith Franklin (Primo IT Tech LLC) and review the Distracted Driving & Liability Shield.' }
      ]
    },
    'primoit-wardrobes': {
      name: 'Primo Wardrobes — Smart Digital Closet & 3D Fit',
      quick: [
        { selector: 'header, .app-header, nav', badge: '1. MULTI-CLOSET HUB', title: '1. Multi-Closet Switcher & Color-Blind Assist', desc: 'Switch seamlessly between All Closets, Men’s Suits, Casual/Florida Wear, Women’s Closet, Kids, and Restaurant Uniforms with Color-Blind safe badges.' },
        { selector: 'main', badge: '2. TODAY & CAMERA SCAN', title: '2. Today’s Outfit & 3-Step Camera Garment Scanner', desc: 'See Today’s recommended outfit or photograph any shirt/garment to instantly match it against your saved closet items.' },
        { selector: 'nav, [role="navigation"]', badge: '3. OUTFIT & TIE STUDIO', title: '3. 5-Pillar Outfit Builder, Tie Studio & Suit Matrix', desc: 'Build complete outfits, check Collar V-Zone tailoring rules in the Tie Studio, and use the foolproof Suit/Shirt/Tie/Shoe matrix.' },
        { selector: 'footer, main', badge: '4. 3D VIRTUAL FIT', title: '4. US Standard 3D Body Models & Measuring Video', desc: 'Preview garments on proportional 3D Man, Woman, Boy, and Girl models with a step-by-step home measuring video.' }
      ],
      full: [
        { selector: 'header', badge: 'STEP 1 • BRAND & CLOSETS', title: '1. Primo Wardrobes Header & Closet Profile Bar', desc: 'Select active closet profiles (Suits, Florida Casual, Women’s, Kids, Uniforms) or create custom family closets.' },
        { selector: 'main', badge: 'STEP 2 • TODAY VIEW', title: '2. Today’s Curated Outfit & Shirt-to-Closet Matcher', desc: 'View daily weather-ready styling, scan a new shirt to find matching trousers/jackets, and read the Chris & Paul inspiration story.' },
        { clickSelector: 'button:has(svg), nav button:nth-child(2)', selector: 'main', badge: 'STEP 3 • MY WARDROBE', title: '3. Digital Wardrobe & Printable QR Hanger Tags', desc: 'Filter garments by category, inspect verified color family labels, and print scannable QR closet tags.' },
        { clickSelector: 'nav button:nth-child(3)', selector: 'main', badge: 'STEP 4 • OUTFIT BUILDER', title: '4. Interactive 5-Pillar Outfit Coordinator', desc: 'Mix and match tops, bottoms, layers, footwear, and accessories with real-time color harmony scoring.' },
        { clickSelector: 'nav button:nth-child(4)', selector: 'main', badge: 'STEP 5 • TIE STUDIO', title: '5. Dedicated Tie Studio & Collar V-Zone SVG Preview', desc: 'Verify tie width, pattern scale, and color contrast against your shirts and suits, plus compare 4 classic tie knots.' },
        { clickSelector: 'nav button:nth-child(5)', selector: 'main', badge: 'STEP 6 • SUIT GUIDE', title: '6. Formal Suit, Shirt, Tie & Shoe Pairing Matrix', desc: 'Select Navy, Charcoal, Light Grey, Tan, or Black suits for foolproof formal combinations.' },
        { clickSelector: 'nav button:nth-child(6)', selector: 'main', badge: 'STEP 7 • 3D VIRTUAL FIT', title: '7. 3D Virtual Fit Studio & US Standard Presets', desc: 'Switch between Adult Man, Adult Woman, Youth Boy, and Youth Girl 3D silhouettes and watch the measuring guide video.' },
        { clickSelector: 'nav button:nth-child(7)', selector: 'main', badge: 'STEP 8 • ACCESSIBILITY', title: '8. Color-Blind Confusion Profiles & Privacy Settings', desc: 'Customize red-green or navy-charcoal-black confusion aids, themes, and local closet backup exports.' }
      ]
    },
    'primotitcdfimporter': {
      name: 'Primo IT Tech CDF Importer (EliteID v2.0)',
      quick: [
        { selector: 'header, body > div > div:first-child', badge: '1. CDF IMPORTER', title: '1. Primo IT Tech CDF Importer & EliteID v2.0 Header', desc: 'Enterprise migration studio converting legacy RCE / .CDF card templates into Canonical EliteID v2.0 JSON.' },
        { selector: 'main, body > div', badge: '2. IMPORT WIZARD', title: '2. Legacy RCE / CDF Template Import Wizard', desc: 'Load legacy card definitions and automatically extract coordinate layers, barcodes, text bindings, and photo zones.' },
        { selector: 'main, canvas', badge: '3. REACTIVE SCHEMA BUS', title: '3. Zero-Refresh Reactive Schema Bus & Konva.js Stage', desc: 'Create custom cardholder fields on the fly—broadcasting instantaneously to Form, Card, Import, and Reporting engines without reloading.' },
        { selector: 'footer, body > div', badge: '4. CANONICAL EXPORT', title: '4. Reusable Mapping Profiles & Canonical JSON v2.0', desc: 'Save vendor mapping profiles and export production-ready Canonical Card Template JSON v2.0.' }
      ],
      full: [
        { selector: 'header, body > div > div:first-child', badge: 'STEP 1 • STUDIO HEADER', title: '1. Primo IT Tech LLC Shield & Genesis 6/6 Status', desc: 'Displays corporate branding, Legal/IP modal access, and tour controls.' },
        { selector: 'main, body > div', badge: 'STEP 2 • TEMPLATE UPLOAD', title: '2. Step 1: Load Legacy RCE / .CDF Payload', desc: 'Upload a legacy template file or load the built-in campus/corporate sample template.' },
        { selector: 'main, body > div', badge: 'STEP 3 • FIELD MAPPING', title: '3. Step 2: Map Legacy Attributes to Canonical Keys', desc: 'Map FirstName, LastName, Department, BadgeID, and Photo fields or apply saved vendor profiles.' },
        { selector: 'main, body > div', badge: 'STEP 4 • INLINE FIELD CREATOR', title: '4. Step 3: Zero-Refresh Custom Field Creation', desc: 'Add new custom schema fields inline and watch the Reactive Schema Bus update all 4 EliteID engines immediately.' },
        { selector: 'main, body > div', badge: 'STEP 5 • KONVA CANVAS', title: '5. Step 4: Hardware-Accelerated Konva.js Card Preview', desc: 'Inspect front/back CR80 card layers with live sample cardholder data substitution.' },
        { selector: 'main, body > div', badge: 'STEP 6 • PROFILE MANAGER', title: '6. Step 5: Save & Reuse Vendor Mapping Profiles', desc: 'Persist custom field mappings for one-click batch migrations across campus departments.' },
        { selector: 'main, body > div', badge: 'STEP 7 • JSON V2.0 EXPORT', title: '7. Step 6: Inspect & Download Canonical JSON v2.0', desc: 'Open the Canonical JSON v2.0 modal to copy or download the verified EliteID template schema.' },
        { selector: 'footer', badge: 'STEP 8 • LEGAL & DMCA', title: '8. Step 7: 17 U.S.C. § 1201(f) Interoperability Compliance', desc: '100% client-side execution with zero cardholder PII transmitted externally.' }
      ]
    },
    'id-access-scanner': {
      name: 'ID-Access-Scanner (PrimoVerify / PockeTracker)',
      quick: [
        { selector: 'header, aside, main', badge: '1. PRIMOVERIFY HUB', title: '1. PrimoVerify Enterprise Access & Credential Scanner', desc: 'Verify student, staff, and visitor badges via optical camera, USB HID keyboard wedge, or NFC/RFID reader in sub-second time.' },
        { selector: 'main', badge: '2. DIRECTIONAL SCAN', title: '2. Directional IN / OUT Mode & Live Occupancy Meter', desc: 'Track real-time facility occupancy, anti-passback rules, and supervisor PASS/DENY overrides.' },
        { selector: 'aside, nav, main', badge: '3. GEOFENCE & VISITORS', title: '3. Site Geofence Radar, Hall Passes & Guardian Desk', desc: 'Monitor multi-campus geofence perimeters, active student hall passes, and K-12 parent/guardian sign-in.' },
        { selector: 'aside, footer, main', badge: '4. ADMIN & OFFLINE SYNC', title: '4. Offline HUD Allow-List, Roster Import & Audit Reports', desc: 'Operate 100% offline with cached allow-lists, import CSV rosters, customize scan chimes, and export compliance logs.' }
      ],
      full: [
        { selector: 'aside, header', badge: 'STEP 1 • NAVIGATION', title: '1. PrimoVerify Role-Based Navigation & Branding', desc: 'Switch between Access Scanner, Event Door Scan, Site Geofence, Visitors, Parents/Guardians, Scan History, Offline Sync, and Admin.' },
        { selector: 'main', badge: 'STEP 2 • SCANNER BENCH', title: '2. Live Badge Verification & Optical/Wedge Input', desc: 'Scan QR, Code 128, PDF417 driver licenses, or prox badges with instant GREEN/RED visual and audio feedback.' },
        { selector: 'main', badge: 'STEP 3 • OCCUPANCY & HUD', title: '3. Live Occupancy Meter & Offline HUD Allow-List', desc: 'Track room capacity limits and toggle Offline HUD mode for zero-latency local verification.' },
        { selector: 'aside, main', badge: 'STEP 4 • EVENT DOOR SCAN', title: '4. Venue Door Scanner & Conflict Resolution', desc: 'High-throughput event ticket and badge scanning with multi-door sync conflict resolution.' },
        { selector: 'aside, main', badge: 'STEP 5 • SITE GEOFENCE', title: '5. Multi-Site Location Fence & Perimeter Map', desc: 'Define campus polygon/radius geofences and audit on-site terminal check-ins.' },
        { selector: 'aside, main', badge: 'STEP 6 • VISITORS & GUARDIANS', title: '6. Visitor Pre-Registration & School Guardian Desk', desc: 'Check in visitors, verify authorized student pickup guardians, and print instant thermal visitor badges.' },
        { selector: 'aside, main', badge: 'STEP 7 • HALL PASS DOCK', title: '7. Active Hall Pass Timer & Reprint Dock', desc: 'Issue timed student hall passes with live countdown alerts and 1-click thermal pass reprinting.' },
        { selector: 'aside, main', badge: 'STEP 8 • ADMIN & SOUNDS', title: '8. Terminals, Roster Import, Sound Studio & Privacy', desc: 'Configure terminals, import CSV cardholders, customize PASS/DENY synth chimes, and manage FERPA/PII privacy masking.' }
      ]
    },
    'pi-boost': {
      name: 'Pi Boost — Mining Companion, Price & Mini-Games',
      quick: [
        { clickSelector: 'nav a[href="/"]', selector: 'main', badge: '1. MINING CYCLE', title: '1. 24-Hour Pi Mining Session Ring & Boost Calculator', desc: 'Track your 24-hour mining countdown, security circle multiplier, lockup boost, and projected Pi earnings.' },
        { clickSelector: 'nav a[href="/price"]', selector: 'main', badge: '2. LIVE PI PRICE', title: '2. Live Pi IOU Price Tracker & Portfolio Converter', desc: 'Monitor live Pi market price feeds, 24h change, sparkline charts, and convert your mined Pi balance into USD.' },
        { clickSelector: 'nav a[href="/games"]', selector: 'main', badge: '3. ARCADE GAMES', title: '3. Built-In Mini-Games Hub (Click Pigs, Fruit Dodge, Dice)', desc: 'Play arcade mini-games between mining sessions to earn bonus XP and track high scores.' },
        { clickSelector: 'nav a[href="/tools"]', selector: 'main', badge: '4. MINER TOOLS', title: '4. Mining Rate Simulator, Node Checklist & Reminders', desc: 'Simulate lockup configurations, check Pi Node port readiness, and configure browser session notifications.' }
      ],
      full: [
        { clickSelector: 'nav a[href="/"]', selector: 'header', badge: 'STEP 1 • PI BOOST SHELL', title: '1. Pi Boost App Header & Theme Switcher', desc: 'Toggle dark/light mode and access the 5-tab mobile-first navigation bar.' },
        { clickSelector: 'nav a[href="/"]', selector: 'main', badge: 'STEP 2 • SESSION RING', title: '2. Interactive 24-Hour Mining Progress Ring', desc: 'Start or sync your current 24-hour mining cycle and inspect real-time Pi/hr breakdown.' },
        { clickSelector: 'nav a[href="/price"]', selector: 'main', badge: 'STEP 3 • MARKET TICKER', title: '3. Live Pi Price Chart & Fiat Valuation Calculator', desc: 'View live price action and calculate the USD value of your mined and locked Pi balances.' },
        { clickSelector: 'nav a[href="/games"]', selector: 'main', badge: 'STEP 4 • GAMES HUB', title: '4. Miner Arcade: Click Pigs, Fruit Dodge & Dice Roll', desc: 'Launch any of the 3 built-in HTML5 mini-games with persistent local leaderboards.' },
        { clickSelector: 'nav a[href="/tools"]', selector: 'main', badge: 'STEP 5 • RATE CALCULATOR', title: '5. Lockup & Security Circle Boost Simulator', desc: 'Model how 25%–200% lockup durations and referral team activity multiply your hourly mining rate.' },
        { clickSelector: 'nav a[href="/settings"]', selector: 'main', badge: 'STEP 6 • SETTINGS & EXPORT', title: '6. Miner Profile, Session Alerts & JSON Backup', desc: 'Configure mining reminders, customize your handle, and export or import your local state.' }
      ]
    }
  };

  let currentMode = 'quick'; // 'quick' | 'full'
  let activeSteps = [];
  let stepIndex = 0;
  let isOpen = false;

  function detectSlug() {
    if (window.PRIMO_PROJECT_SLUG && CATALOG[window.PRIMO_PROJECT_SLUG]) {
      return window.PRIMO_PROJECT_SLUG;
    }
    const port = window.location.port;
    if (port === '3000') return 'id-access-scanner';
    if (port === '3800') return 'primoitall';
    if (port === '3900') return 'primoit-grinder';
    if (port === '3950') return 'new-wingy-dingy-project';
    if (port === '4173') return 'pi-boost';
    if (port === '5173') return 'primoit-wardrobes';
    if (port === '5174') return 'primotitcdfimporter';
    if (port === '8788') return 'chirshallison';

    const seg = (window.location.pathname || '/').replace(/^\/+/, '').split('/')[0].toLowerCase();
    if (!seg || seg === 'index.html') {
      if (document.getElementById('tier-flagship')) return 'master-hub';
    }
    if (CATALOG[seg]) return seg;
    return seg || 'generic';
  }

  function buildDynamicSteps(mode) {
    const slug = detectSlug();
    if (CATALOG[slug] && CATALOG[slug][mode]) {
      return CATALOG[slug][mode];
    }

    const pageTitle = (document.querySelector('h1')?.textContent || document.title || 'Primo IT Tech Application').trim();

    // Check if page defines its own STEPS / GRINDER_TOUR_STEPS / WINGY_TOUR_STEPS / QUICK_TOUR_STEPS
    const domCards = Array.from(document.querySelectorAll('section.card, .section-card, .card, .proj, section[id], .feature-box, .spec-grid, table')).filter(
      (el) => el.offsetParent !== null
    );

    const allSteps = [];
    const headerEl = document.querySelector('header, .app-header, .hero-header');
    if (headerEl) {
      allSteps.push({
        selector: 'header, .app-header, .hero-header',
        badge: 'OVERVIEW & BRAND',
        title: `1. ${pageTitle}`,
        desc: `Welcome to ${pageTitle} by Primo IT Tech LLC (Genesis 6/6 Active). Use the header controls to access Legal/IP compliance, GitHub links, and Quick or Full Guided Tours.`
      });
    }

    const cliBar = document.querySelector('.cli-bar, .toolbar, .nav-tabs, nav');
    if (cliBar) {
      allSteps.push({
        selector: '.cli-bar, .toolbar, .nav-tabs, nav',
        badge: 'NAVIGATION & CLI',
        title: `${allSteps.length + 1}. Quick-Start Command & Navigation Bar`,
        desc: 'Use the command/navigation bar to run local workflows, switch workspace tabs, or navigate between modules using keyboard shortcuts.'
      });
    }

    domCards.slice(0, 8).forEach((card, idx) => {
      if (!card.id) card.id = `primo-auto-tour-sec-${idx + 1}`;
      const heading = (card.querySelector('h2, h3, h4, strong')?.textContent || `Module ${idx + 1}`).trim();
      const para = (card.querySelector('p, .meta, .card-desc')?.textContent || 'Interactive module and telemetry panel engineered by Primo IT Tech LLC.').trim();
      const badge = (card.querySelector('.card-badge, .badge, .pill')?.textContent || `MODULE ${idx + 1}`).trim().toUpperCase();
      allSteps.push({
        selector: `#${card.id}`,
        badge: badge.slice(0, 28),
        title: heading.replace(/^\d+\.\s*/, `${allSteps.length + 1}. `),
        desc: para.slice(0, 240)
      });
    });

    const footerEl = document.querySelector('footer, .app-footer');
    if (footerEl) {
      allSteps.push({
        selector: 'footer, .app-footer',
        badge: 'COMPLIANCE & KUDOS',
        title: `${allSteps.length + 1}. Corporate IP, Zero-PII Privacy & Hall of Kudos`,
        desc: 'Protected under Florida law and 17 U.S.C. § 1201(f) interoperability standards with 100% local privacy and open-source attributions in Kudos & Credits.'
      });
    }

    if (allSteps.length === 0) {
      allSteps.push({
        selector: 'body',
        badge: 'PRIMO IT TECH LLC',
        title: `1. ${pageTitle}`,
        desc: 'Interactive application portal powered by Primo IT Tech LLC Universal Guided Tour Engine.'
      });
    }

    if (mode === 'quick') {
      if (allSteps.length <= 4) return allSteps;
      return [
        allSteps[0],
        allSteps[1],
        allSteps[Math.floor(allSteps.length / 2)],
        allSteps[allSteps.length - 1]
      ];
    }
    return allSteps;
  }

  function ensureTourStylesAndDom() {
    if (!document.getElementById('primo-universal-tour-styles')) {
      const st = document.createElement('style');
      st.id = 'primo-universal-tour-styles';
      st.textContent = `
        .primo-universal-tour-hi {
          outline: 2.5px solid #38bdf8 !important;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.22), 0 0 32px rgba(56, 189, 248, 0.45) !important;
          border-radius: 10px;
          transition: outline 0.2s ease, box-shadow 0.2s ease !important;
        }
        #primoUniversalCoachMark {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 410px;
          max-width: calc(100vw - 28px);
          background: linear-gradient(160deg, #0f172a 0%, #090d16 100%);
          color: #f8fafc;
          border: 2px solid #38bdf8;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.88), 0 0 24px rgba(56, 189, 248, 0.25);
          z-index: 2147483646;
          display: none;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          text-align: left;
        }
        #primoUniversalTourDock {
          position: fixed;
          bottom: 14px;
          right: 14px;
          z-index: 2147483640;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.94);
          border: 1px solid rgba(56, 189, 248, 0.45);
          border-radius: 999px;
          padding: 5px 10px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }
        #primoUniversalTourDock button {
          border-radius: 999px;
          padding: 5px 11px;
          font-size: 11.5px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          line-height: 1.2;
          min-height: 28px;
        }
        #primoUniversalTourDock .put-btn-quick {
          background: rgba(56, 189, 248, 0.16);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.5);
        }
        #primoUniversalTourDock .put-btn-quick:hover {
          background: #0284c7;
          color: #fff;
        }
        #primoUniversalTourDock .put-btn-full {
          background: rgba(168, 85, 247, 0.18);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.5);
        }
        #primoUniversalTourDock .put-btn-full:hover {
          background: #7e22ce;
          color: #fff;
        }
        .primo-hdr-tour-btn {
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .primo-hdr-quick {
          background: rgba(56, 189, 248, 0.16);
          color: #38bdf8;
          border: 1px solid #38bdf8;
        }
        .primo-hdr-quick:hover {
          background: #0284c7;
          color: #ffffff;
        }
        .primo-hdr-full {
          background: rgba(168, 85, 247, 0.18);
          color: #d8b4fe;
          border: 1px solid #a855f7;
        }
        .primo-hdr-full:hover {
          background: #7e22ce;
          color: #ffffff;
        }
      `;
      document.head.appendChild(st);
    }

    if (!document.getElementById('primoUniversalCoachMark')) {
      const box = document.createElement('div');
      box.id = 'primoUniversalCoachMark';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', 'Primo IT Tech Interactive Guided Tour');
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <span id="putBadge" style="font-size:10.5px;font-weight:800;letter-spacing:0.5px;color:#38bdf8;background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.35);padding:3px 9px;border-radius:99px;"></span>
          <div style="display:flex;align-items:center;gap:6px;">
            <button type="button" id="putSwitchModeBtn" style="background:rgba(168,85,247,0.18);color:#d8b4fe;border:1px solid rgba(168,85,247,0.45);border-radius:99px;padding:3px 9px;font-size:10.5px;font-weight:700;cursor:pointer;"></button>
            <button type="button" id="putCloseBtn" style="background:none;border:none;color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;padding:2px 6px;">✕ Skip</button>
          </div>
        </div>
        <h4 id="putTitle" style="margin:0 0 6px 0;font-size:15px;font-weight:800;color:#ffffff;line-height:1.35;"></h4>
        <p id="putDesc" style="margin:0 0 12px 0;font-size:12.8px;line-height:1.5;color:#cbd5e1;"></p>
        <div id="putDots" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#64748b;font-weight:600;">← / → keys or Esc</span>
          <div style="display:flex;gap:8px;">
            <button type="button" id="putPrevBtn" style="background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;min-height:34px;">← Prev</button>
            <button type="button" id="putNextBtn" style="background:linear-gradient(135deg,#0284c7,#2563eb);color:#ffffff;border:none;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:800;cursor:pointer;min-height:34px;">Next Step →</button>
          </div>
        </div>
      `;
      document.body.appendChild(box);

      document.getElementById('putCloseBtn').addEventListener('click', () => stopTour());
      document.getElementById('putPrevBtn').addEventListener('click', () => stepTour(-1));
      document.getElementById('putNextBtn').addEventListener('click', () => stepTour(1));
      document.getElementById('putSwitchModeBtn').addEventListener('click', () => {
        if (currentMode === 'quick') startFullTour();
        else startQuickTour();
      });
    }
  }

  function clearHighlights() {
    document.querySelectorAll('.primo-universal-tour-hi, .tour-hi, .grinder-tour-highlight, .wingy-tour-highlight').forEach((el) => {
      el.classList.remove('primo-universal-tour-hi');
    });
  }

  function closeLegacyPopovers() {
    ['coachMark', 'grinderCoachMark', 'wingyCoachMark'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function renderCurrentStep() {
    ensureTourStylesAndDom();
    closeLegacyPopovers();
    clearHighlights();

    const box = document.getElementById('primoUniversalCoachMark');
    if (!isOpen || !activeSteps.length) {
      if (box) box.style.display = 'none';
      return;
    }

    const s = activeSteps[stepIndex] || activeSteps[0];
    if (s.clickSelector) {
      try {
        const trigger = document.querySelector(s.clickSelector);
        if (trigger && typeof trigger.click === 'function') trigger.click();
      } catch (e) {}
    }

    box.style.display = 'block';
    const modeLabel = currentMode === 'quick' ? '⚡ QUICK TOUR' : '🎓 FULL TOUR';
    const badgeEl = document.getElementById('putBadge');
    badgeEl.textContent = `${modeLabel} • STEP ${stepIndex + 1}/${activeSteps.length} • ${s.badge || 'FEATURE'}`;
    badgeEl.style.color = currentMode === 'quick' ? '#38bdf8' : '#d8b4fe';
    badgeEl.style.borderColor = currentMode === 'quick' ? 'rgba(56,189,248,0.4)' : 'rgba(168,85,247,0.45)';
    badgeEl.style.background = currentMode === 'quick' ? 'rgba(56,189,248,0.15)' : 'rgba(168,85,247,0.18)';
    box.style.borderColor = currentMode === 'quick' ? '#38bdf8' : '#a855f7';

    document.getElementById('putTitle').textContent = s.title || `Step ${stepIndex + 1}`;
    document.getElementById('putDesc').textContent = s.desc || s.body || '';

    const switchBtn = document.getElementById('putSwitchModeBtn');
    switchBtn.textContent = currentMode === 'quick' ? 'Switch to 🎓 Full Tour' : 'Switch to ⚡ Quick Tour';

    const dots = document.getElementById('putDots');
    dots.innerHTML = '';
    activeSteps.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.title = `Jump to Step ${idx + 1}`;
      dot.style.cssText = `height:6px;width:${idx === stepIndex ? '20px' : '8px'};border-radius:99px;border:none;cursor:pointer;padding:0;min-height:6px;background:${
        idx === stepIndex ? (currentMode === 'quick' ? '#38bdf8' : '#a855f7') : '#334155'
      };transition:all 0.15s ease;`;
      dot.addEventListener('click', () => {
        stepIndex = idx;
        renderCurrentStep();
      });
      dots.appendChild(dot);
    });

    const prevBtn = document.getElementById('putPrevBtn');
    prevBtn.style.display = stepIndex > 0 ? 'inline-flex' : 'none';

    const nextBtn = document.getElementById('putNextBtn');
    nextBtn.textContent = stepIndex === activeSteps.length - 1 ? '✓ Finish Tour' : 'Next Step →';

    setTimeout(() => {
      try {
        const target = s.selector ? document.querySelector(s.selector) : null;
        if (target) {
          target.classList.add('primo-universal-tour-hi');
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (e) {}
    }, 60);
  }

  function startQuickTour() {
    currentMode = 'quick';
    activeSteps = buildDynamicSteps('quick');
    stepIndex = 0;
    isOpen = true;
    renderCurrentStep();
  }

  function startFullTour() {
    currentMode = 'full';
    activeSteps = buildDynamicSteps('full');
    stepIndex = 0;
    isOpen = true;
    renderCurrentStep();
  }

  function stopTour() {
    isOpen = false;
    clearHighlights();
    const box = document.getElementById('primoUniversalCoachMark');
    if (box) box.style.display = 'none';
  }

  function stepTour(delta) {
    if (!isOpen) return;
    const next = stepIndex + delta;
    if (next < 0) return;
    if (next >= activeSteps.length) {
      stopTour();
      return;
    }
    stepIndex = next;
    renderCurrentStep();
  }

  function injectUniversalButtons() {
    ensureTourStylesAndDom();

    // If ChirsHallison already has its native #startQuickTourBtn and #startFullTourBtn, leave them intact
    if (document.getElementById('startQuickTourBtn') && document.getElementById('startFullTourBtn')) {
      return;
    }

    // 1. Check if page has a single legacy Quick Tour button (#tourBtn, #btn-quick-tour, #grinderTourBtn, #wingyTourBtn)
    const legacyBtn =
      document.getElementById('tourBtn') ||
      document.getElementById('btn-quick-tour') ||
      document.getElementById('grinderTourBtn') ||
      document.getElementById('wingyTourBtn');

    if (legacyBtn && !document.getElementById('primoFullTourHeaderBtn')) {
      legacyBtn.innerHTML = '⚡ Quick Guided Tour';
      legacyBtn.onclick = function (e) {
        if (e) e.preventDefault();
        startQuickTour();
      };

      const fullBtn = document.createElement('button');
      fullBtn.type = 'button';
      fullBtn.id = 'primoFullTourHeaderBtn';
      fullBtn.className = legacyBtn.className ? `${legacyBtn.className} primo-hdr-full` : 'primo-hdr-tour-btn primo-hdr-full';
      fullBtn.style.cssText = 'background:rgba(168,85,247,0.18);color:#d8b4fe;border:1px solid #a855f7;cursor:pointer;font-weight:700;';
      fullBtn.innerHTML = '🎓 Full Guided Tour';
      fullBtn.title = 'Start comprehensive step-by-step Full Guided Tour of all modules & controls';
      fullBtn.onclick = function (e) {
        if (e) e.preventDefault();
        startFullTour();
      };
      legacyBtn.insertAdjacentElement('afterend', fullBtn);
    }

    // 2. Always ensure the floating bottom-right Quick + Full Tour Dock is available
    if (!document.getElementById('primoUniversalTourDock')) {
      const dock = document.createElement('div');
      dock.id = 'primoUniversalTourDock';
      dock.setAttribute('aria-label', 'Universal Guided Tour Launcher');
      dock.innerHTML = `
        <button type="button" class="put-btn-quick" id="putDockQuickBtn" title="Launch 4-Step Quick Guided Tour">⚡ Quick Tour</button>
        <button type="button" class="put-btn-full" id="putDockFullBtn" title="Launch Complete Step-by-Step Full Guided Tour">🎓 Full Tour</button>
      `;
      document.body.appendChild(dock);
      document.getElementById('putDockQuickBtn').addEventListener('click', () => startQuickTour());
      document.getElementById('putDockFullBtn').addEventListener('click', () => startFullTour());
    }
  }

  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    const tag = (document.activeElement?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === 'Escape') {
      stopTour();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepTour(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepTour(-1);
    }
  });

  window.PrimoUniversalTours = {
    startQuickTour,
    startFullTour,
    stopTour,
    stepTour,
    CATALOG
  };
  window.startPrimoQuickTour = startQuickTour;
  window.startPrimoFullTour = startFullTour;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUniversalButtons);
  } else {
    injectUniversalButtons();
  }
})();
