package com.reatv.launcher;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.media.tv.TvContract;
import android.media.tv.TvInputInfo;
import android.media.tv.TvInputManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.GridLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextClock;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Rea TV Home — Ultra-lightweight (~12 MB RAM) Android TV Home Screen.
 * Built with pure Android framework views:
 * - Zero ads, zero recommendations, zero background telemetry
 * - Big live clock & date + live free RAM indicator
 * - Pinned streaming apps grid (Long-press OK on any app to Pin/Unpin)
 * - Direct HDMI inputs (via TvInputManager passthrough URIs) & Settings row
 */
public class MainActivity extends Activity {

    private static final String PREFS_NAME = "rea_tv_prefs";
    private static final String KEY_PINNED_PACKAGES = "pinned_packages";
    private static final String KEY_INITIALIZED = "initialized_defaults";

    // Common streaming & TV apps auto-pinned on first run if installed
    private static final List<String> DEFAULT_STREAMING_KEYWORDS = Arrays.asList(
            "youtube", "smarttube", "netflix", "plex", "jellyfin", "kodi",
            "primevideo", "amazon.avod", "disney", "hulu", "max", "hbo",
            "peacock", "paramount", "tubi", "pluto", "twitch", "vlc",
            "stremio", "tivimate", "spotify", "crunchyroll", "appletv"
    );

    private SharedPreferences prefs;
    private Set<String> pinnedPackages;
    private boolean showAllApps = false;

    private TextView ramBadgeView;
    private TextView sectionTitleView;
    private GridLayout appsGrid;
    private LinearLayout quickActionsRow;

    private static class AppEntry {
        final String label;
        final String packageName;
        final String activityName;
        final Drawable icon;
        final boolean isLeanback;

        AppEntry(String label, String packageName, String activityName, Drawable icon, boolean isLeanback) {
            this.label = label;
            this.packageName = packageName;
            this.activityName = activityName;
            this.icon = icon;
            this.isLeanback = isLeanback;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        pinnedPackages = new HashSet<>(prefs.getStringSet(KEY_PINNED_PACKAGES, new HashSet<String>()));
        buildUi();
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateRamBadge();
        refreshAppsAndInputs();
    }

    @Override
    public void onBackPressed() {
        // On a TV Home Screen, Back should never exit the launcher.
        // If viewing "All Apps", pressing Back returns to the clean Favorites view.
        if (showAllApps) {
            showAllApps = false;
            refreshAppsAndInputs();
        }
    }

    private void buildUi() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#0B0F17"));
        root.setPadding(dp(48), dp(36), dp(48), dp(32));
        root.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // 1. Top Header: Big Clock + Date on Left, RAM & Hint on Right
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams headerLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        headerLp.bottomMargin = dp(24);
        header.setLayoutParams(headerLp);

        LinearLayout clockColumn = new LinearLayout(this);
        clockColumn.setOrientation(LinearLayout.VERTICAL);
        clockColumn.setLayoutParams(new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f
        ));

        TextClock bigClock = new TextClock(this);
        bigClock.setFormat12Hour("h:mm a");
        bigClock.setFormat24Hour("HH:mm");
        bigClock.setTextColor(Color.parseColor("#F8FAFC"));
        bigClock.setTextSize(TypedValue.COMPLEX_UNIT_SP, 56);
        bigClock.setTypeface(Typeface.create("sans-serif-light", Typeface.NORMAL));
        clockColumn.addView(bigClock);

        TextClock dateClock = new TextClock(this);
        dateClock.setFormat12Hour("EEEE, MMMM d");
        dateClock.setFormat24Hour("EEEE, MMMM d");
        dateClock.setTextColor(Color.parseColor("#94A3B8"));
        dateClock.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        clockColumn.addView(dateClock);

        header.addView(clockColumn);

        // Right column: Memory stat & remote hint
        LinearLayout statusColumn = new LinearLayout(this);
        statusColumn.setOrientation(LinearLayout.VERTICAL);
        statusColumn.setGravity(Gravity.END);

        ramBadgeView = new TextView(this);
        ramBadgeView.setTextColor(Color.parseColor("#38BDF8"));
        ramBadgeView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        ramBadgeView.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
        GradientDrawable badgeBg = new GradientDrawable();
        badgeBg.setColor(Color.parseColor("#111827"));
        badgeBg.setCornerRadius(dp(8));
        badgeBg.setStroke(dp(1), Color.parseColor("#1E293B"));
        ramBadgeView.setBackground(badgeBg);
        ramBadgeView.setPadding(dp(14), dp(8), dp(14), dp(8));
        statusColumn.addView(ramBadgeView);

        TextView hintView = new TextView(this);
        hintView.setText("Hold OK on any app to Pin / Unpin");
        hintView.setTextColor(Color.parseColor("#64748B"));
        hintView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        LinearLayout.LayoutParams hintLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        hintLp.topMargin = dp(6);
        hintView.setLayoutParams(hintLp);
        statusColumn.addView(hintView);

        header.addView(statusColumn);
        root.addView(header);

        // 2. Section Title ("Apps" or "All Installed Apps")
        sectionTitleView = new TextView(this);
        sectionTitleView.setTextColor(Color.parseColor("#CBD5E1"));
        sectionTitleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        sectionTitleView.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
        LinearLayout.LayoutParams sectionLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        sectionLp.bottomMargin = dp(12);
        sectionTitleView.setLayoutParams(sectionLp);
        root.addView(sectionTitleView);

        // 3. Scrollable Apps Grid
        ScrollView gridScroll = new ScrollView(this);
        gridScroll.setFillViewport(true);
        gridScroll.setVerticalScrollBarEnabled(false);
        LinearLayout.LayoutParams scrollLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1f
        );
        gridScroll.setLayoutParams(scrollLp);

        appsGrid = new GridLayout(this);
        appsGrid.setColumnCount(5);
        appsGrid.setUseDefaultMargins(false);
        gridScroll.addView(appsGrid);
        root.addView(gridScroll);

        // 4. Bottom Row: HDMI Inputs, Settings & All Apps Switcher
        TextView inputsLabel = new TextView(this);
        inputsLabel.setText("INPUTS & SYSTEM");
        inputsLabel.setTextColor(Color.parseColor("#64748B"));
        inputsLabel.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        inputsLabel.setTypeface(Typeface.create("sans-serif-medium", Typeface.BOLD));
        LinearLayout.LayoutParams inputsLabelLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        inputsLabelLp.topMargin = dp(16);
        inputsLabelLp.bottomMargin = dp(8);
        inputsLabel.setLayoutParams(inputsLabelLp);
        root.addView(inputsLabel);

        HorizontalScrollView bottomScroll = new HorizontalScrollView(this);
        bottomScroll.setHorizontalScrollBarEnabled(false);
        quickActionsRow = new LinearLayout(this);
        quickActionsRow.setOrientation(LinearLayout.HORIZONTAL);
        bottomScroll.addView(quickActionsRow);
        root.addView(bottomScroll);

        setContentView(root);
    }

    private void updateRamBadge() {
        try {
            ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
            if (am != null) {
                ActivityManager.MemoryInfo mi = new ActivityManager.MemoryInfo();
                am.getMemoryInfo(mi);
                long availMb = mi.availMem / (1024 * 1024);
                long totalMb = mi.totalMem / (1024 * 1024);
                int pctFree = totalMb > 0 ? (int) ((availMb * 100) / totalMb) : 0;
                ramBadgeView.setText(String.format(Locale.US,
                        "Free RAM: %d MB / %d MB (%d%%)", availMb, totalMb, pctFree));
            }
        } catch (Exception ignored) {
            ramBadgeView.setText("Rea TV Ready");
        }
    }

    private void refreshAppsAndInputs() {
        List<AppEntry> allInstalled = queryLaunchableApps();

        // Initialize default pinned apps on first launch
        if (!prefs.getBoolean(KEY_INITIALIZED, false) && pinnedPackages.isEmpty()) {
            for (AppEntry app : allInstalled) {
                String pkgLower = app.packageName.toLowerCase(Locale.US);
                String labelLower = app.label.toLowerCase(Locale.US);
                for (String kw : DEFAULT_STREAMING_KEYWORDS) {
                    if (pkgLower.contains(kw) || labelLower.contains(kw)) {
                        pinnedPackages.add(app.packageName);
                        break;
                    }
                }
            }
            // If no known streaming apps matched, pin up to the first 8 apps
            if (pinnedPackages.isEmpty()) {
                for (int i = 0; i < Math.min(8, allInstalled.size()); i++) {
                    pinnedPackages.add(allInstalled.get(i).packageName);
                }
            }
            savePinnedPackages();
            prefs.edit().putBoolean(KEY_INITIALIZED, true).apply();
        }

        List<AppEntry> displayedApps = new ArrayList<>();
        if (showAllApps) {
            displayedApps.addAll(allInstalled);
            sectionTitleView.setText("ALL APPS (" + displayedApps.size() + ")  •  Press BACK for Home");
        } else {
            for (AppEntry app : allInstalled) {
                if (pinnedPackages.contains(app.packageName)) {
                    displayedApps.add(app);
                }
            }
            if (displayedApps.isEmpty()) {
                displayedApps.addAll(allInstalled);
            }
            sectionTitleView.setText("FAVORITE APPS");
        }

        appsGrid.removeAllViews();
        int screenWidth = getResources().getDisplayMetrics().widthPixels;
        int availableWidth = Math.max(screenWidth - dp(96), dp(600));
        int columns = 5;
        int cardMargin = dp(10);
        int cardWidth = (availableWidth / columns) - (cardMargin * 2);
        int cardHeight = dp(118);

        for (final AppEntry app : displayedApps) {
            View card = createAppCard(app, cardWidth, cardHeight, cardMargin);
            appsGrid.addView(card);
        }

        populateQuickActions(allInstalled.size());
    }

    private View createAppCard(final AppEntry app, int width, int height, int margin) {
        final LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setGravity(Gravity.CENTER);
        card.setFocusable(true);
        card.setFocusableInTouchMode(false);
        card.setPadding(dp(12), dp(12), dp(12), dp(10));

        GridLayout.LayoutParams lp = new GridLayout.LayoutParams();
        lp.width = width;
        lp.height = height;
        lp.setMargins(margin, margin, margin, margin);
        card.setLayoutParams(lp);

        final boolean isPinned = pinnedPackages.contains(app.packageName);
        applyCardStyle(card, false, isPinned && showAllApps);

        ImageView iconView = new ImageView(this);
        LinearLayout.LayoutParams iconLp = new LinearLayout.LayoutParams(dp(48), dp(48));
        iconLp.bottomMargin = dp(8);
        iconView.setLayoutParams(iconLp);
        iconView.setScaleType(ImageView.ScaleType.FIT_CENTER);
        if (app.icon != null) {
            iconView.setImageDrawable(app.icon);
        }
        card.addView(iconView);

        TextView titleView = new TextView(this);
        String labelText = (showAllApps && isPinned) ? ("★ " + app.label) : app.label;
        titleView.setText(labelText);
        titleView.setTextColor(Color.parseColor("#F1F5F9"));
        titleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        titleView.setSingleLine(true);
        titleView.setEllipsize(TextUtils.TruncateAt.END);
        titleView.setGravity(Gravity.CENTER);
        card.addView(titleView);

        card.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                applyCardStyle(card, hasFocus, isPinned && showAllApps);
            }
        });

        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                launchApp(app);
            }
        });

        card.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                togglePin(app);
                return true;
            }
        });

        return card;
    }

    private void populateQuickActions(int totalAppsCount) {
        quickActionsRow.removeAllViews();

        // 1. Discover hardware HDMI / TV Inputs via TvInputManager
        boolean addedHdmiInputs = false;
        try {
            TvInputManager tim = (TvInputManager) getSystemService(Context.TV_INPUT_SERVICE);
            if (tim != null) {
                List<TvInputInfo> inputs = tim.getTvInputList();
                if (inputs != null) {
                    for (final TvInputInfo input : inputs) {
                        if (input.isPassthroughInput()) {
                            CharSequence customLabel = input.loadCustomLabel(this);
                            CharSequence baseLabel = input.loadLabel(this);
                            final String label = !TextUtils.isEmpty(customLabel)
                                    ? customLabel.toString()
                                    : (!TextUtils.isEmpty(baseLabel) ? baseLabel.toString() : "HDMI Input");
                            addedHdmiInputs = true;
                            quickActionsRow.addView(createActionPill("📺 " + label, new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    openTvInput(input.getId());
                                }
                            }));
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        }

        // Always provide a general TV / HDMI Input switcher button
        if (!addedHdmiInputs) {
            quickActionsRow.addView(createActionPill("📺 HDMI / TV Inputs", new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    openGeneralTvInputs();
                }
            }));
        } else {
            quickActionsRow.addView(createActionPill("🔌 All Inputs", new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    openGeneralTvInputs();
                }
            }));
        }

        // 2. Toggle Favorites vs All Apps
        String toggleTitle = showAllApps
                ? "★ Show Favorites Only"
                : ("⊞ All Apps (" + totalAppsCount + ")");
        quickActionsRow.addView(createActionPill(toggleTitle, new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAllApps = !showAllApps;
                refreshAppsAndInputs();
            }
        }));

        // 3. Wi-Fi & Network Settings
        quickActionsRow.addView(createActionPill("📶 Wi-Fi & Network", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openIntentSafely(new Intent(Settings.ACTION_WIFI_SETTINGS),
                        new Intent(Settings.ACTION_WIRELESS_SETTINGS));
            }
        }));

        // 4. System Settings
        quickActionsRow.addView(createActionPill("⚙ Settings", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openIntentSafely(new Intent(Settings.ACTION_SETTINGS), null);
            }
        }));

        // 5. Manage Apps
        quickActionsRow.addView(createActionPill("📦 Manage Apps", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openIntentSafely(new Intent(Settings.ACTION_MANAGE_APPLICATIONS_SETTINGS),
                        new Intent(Settings.ACTION_SETTINGS));
            }
        }));
    }

    private View createActionPill(String text, View.OnClickListener onClick) {
        final TextView pill = new TextView(this);
        pill.setText(text);
        pill.setTextColor(Color.parseColor("#E2E8F0"));
        pill.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        pill.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
        pill.setGravity(Gravity.CENTER);
        pill.setFocusable(true);
        pill.setFocusableInTouchMode(false);
        pill.setPadding(dp(20), dp(12), dp(20), dp(12));

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        lp.rightMargin = dp(12);
        pill.setLayoutParams(lp);

        applyCardStyle(pill, false, false);
        pill.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                applyCardStyle(pill, hasFocus, false);
            }
        });
        pill.setOnClickListener(onClick);
        return pill;
    }

    private void applyCardStyle(View view, boolean focused, boolean pinnedHighlight) {
        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(dp(12));
        if (focused) {
            bg.setColor(Color.parseColor("#1E293B"));
            bg.setStroke(dp(3), Color.parseColor("#38BDF8"));
        } else if (pinnedHighlight) {
            bg.setColor(Color.parseColor("#131C2E"));
            bg.setStroke(dp(1), Color.parseColor("#0284C7"));
        } else {
            bg.setColor(Color.parseColor("#111827"));
            bg.setStroke(dp(1), Color.parseColor("#1E293B"));
        }
        view.setBackground(bg);
    }

    private List<AppEntry> queryLaunchableApps() {
        PackageManager pm = getPackageManager();
        Map<String, AppEntry> map = new LinkedHashMap<>();
        String myPkg = getPackageName();

        // 1. Query Leanback (Android TV native) launchers first
        Intent leanbackIntent = new Intent(Intent.ACTION_MAIN);
        leanbackIntent.addCategory(Intent.CATEGORY_LEANBACK_LAUNCHER);
        List<ResolveInfo> leanbackList = pm.queryIntentActivities(leanbackIntent, 0);
        if (leanbackList != null) {
            for (ResolveInfo ri : leanbackList) {
                if (ri.activityInfo == null) continue;
                String pkg = ri.activityInfo.packageName;
                if (myPkg.equals(pkg)) continue;
                String label = ri.loadLabel(pm) != null ? ri.loadLabel(pm).toString() : pkg;
                Drawable icon = ri.activityInfo.loadIcon(pm);
                map.put(pkg, new AppEntry(label, pkg, ri.activityInfo.name, icon, true));
            }
        }

        // 2. Query standard launchers (for sideloaded or standard Android apps)
        Intent mainIntent = new Intent(Intent.ACTION_MAIN);
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> standardList = pm.queryIntentActivities(mainIntent, 0);
        if (standardList != null) {
            for (ResolveInfo ri : standardList) {
                if (ri.activityInfo == null) continue;
                String pkg = ri.activityInfo.packageName;
                if (myPkg.equals(pkg) || map.containsKey(pkg)) continue;
                String label = ri.loadLabel(pm) != null ? ri.loadLabel(pm).toString() : pkg;
                Drawable icon = ri.activityInfo.loadIcon(pm);
                map.put(pkg, new AppEntry(label, pkg, ri.activityInfo.name, icon, false));
            }
        }

        List<AppEntry> result = new ArrayList<>(map.values());
        Collections.sort(result, new Comparator<AppEntry>() {
            @Override
            public int compare(AppEntry a, AppEntry b) {
                return a.label.compareToIgnoreCase(b.label);
            }
        });
        return result;
    }

    private void launchApp(AppEntry app) {
        try {
            PackageManager pm = getPackageManager();
            Intent launch = pm.getLeanbackLaunchIntentForPackage(app.packageName);
            if (launch == null) {
                launch = pm.getLaunchIntentForPackage(app.packageName);
            }
            if (launch == null) {
                launch = new Intent(Intent.ACTION_MAIN);
                launch.setComponent(new ComponentName(app.packageName, app.activityName));
            }
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(launch);
        } catch (Exception e) {
            Toast.makeText(this, "Could not open " + app.label, Toast.LENGTH_SHORT).show();
        }
    }

    private void togglePin(AppEntry app) {
        if (pinnedPackages.contains(app.packageName)) {
            pinnedPackages.remove(app.packageName);
            Toast.makeText(this, "Unpinned " + app.label + " from Home", Toast.LENGTH_SHORT).show();
        } else {
            pinnedPackages.add(app.packageName);
            Toast.makeText(this, "Pinned " + app.label + " to Home", Toast.LENGTH_SHORT).show();
        }
        savePinnedPackages();
        refreshAppsAndInputs();
    }

    private void savePinnedPackages() {
        prefs.edit().putStringSet(KEY_PINNED_PACKAGES, new HashSet<>(pinnedPackages)).apply();
    }

    private void openTvInput(String inputId) {
        try {
            Uri uri = TvContract.buildChannelUriForPassthroughInput(inputId);
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (Exception e) {
            openGeneralTvInputs();
        }
    }

    private void openGeneralTvInputs() {
        // Try standard Android TV input / Live TV intents
        String[] actions = new String[]{
                "com.android.tv.action.VIEW_INPUTS",
                "android.media.tv.action.SETUP_INPUTS",
                Intent.ACTION_MAIN
        };
        String[] tvPackages = new String[]{
                "com.android.tv",
                "com.google.android.tv",
                "com.sony.dtv.tvx",
                "com.tcl.tv",
                "com.hisense.tv"
        };

        PackageManager pm = getPackageManager();
        for (String pkg : tvPackages) {
            Intent launch = pm.getLeanbackLaunchIntentForPackage(pkg);
            if (launch == null) launch = pm.getLaunchIntentForPackage(pkg);
            if (launch != null) {
                try {
                    launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(launch);
                    return;
                } catch (Exception ignored) {
                }
            }
        }

        try {
            Intent tvIntent = new Intent(Intent.ACTION_VIEW, TvContract.Channels.CONTENT_URI);
            tvIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(tvIntent);
        } catch (Exception e) {
            Toast.makeText(this, "Use the Input/Source button on your TV remote", Toast.LENGTH_LONG).show();
        }
    }

    private void openIntentSafely(Intent primary, Intent fallback) {
        try {
            primary.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(primary);
        } catch (Exception e) {
            if (fallback != null) {
                try {
                    fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(fallback);
                    return;
                } catch (Exception ignored) {
                }
            }
            Toast.makeText(this, "Unable to open Settings", Toast.LENGTH_SHORT).show();
        }
    }

    private int dp(int value) {
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                value,
                getResources().getDisplayMetrics()
        );
    }
}
