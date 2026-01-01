package com.studentos.app.usage;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.provider.Settings;
import android.util.Log;
import android.os.Build;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Calendar;
import java.util.List;

@CapacitorPlugin(name = "UsageStats")
public class UsageStatsPlugin extends Plugin {

    private static final String TAG = "UsageStatsPlugin";

    @PluginMethod
    public void openUsageAccessSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open settings: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getUsageStats(PluginCall call) {
        try {
            // Start of today (midnight)
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);

            long startTime = calendar.getTimeInMillis();
            long endTime = System.currentTimeMillis();

            UsageStatsManager usm =
                    (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);

            List<UsageStats> stats = usm.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    startTime,
                    endTime
            );

            if (stats == null || stats.isEmpty()) {
                call.reject("PERMISSION_DENIED_OR_NO_DATA");
                return;
            }

            JSArray dataArray = new JSArray();
            PackageManager pm = getContext().getPackageManager();

            for (UsageStats usage : stats) {
                long totalTimeMs = usage.getTotalTimeInForeground();

                // ✅ Skip apps with less than 1 minute usage
                if (totalTimeMs < 60_000) continue;

                String packageName = usage.getPackageName();
                String appName = packageName;

                int category = ApplicationInfo.CATEGORY_UNDEFINED;
                boolean isProductive = true; // default = productive

                try {
                    ApplicationInfo ai = pm.getApplicationInfo(packageName, 0);

                    // Resolve app label
                    appName = pm.getApplicationLabel(ai).toString();

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        category = ai.category;
                        isProductive = !isNonProductiveCategory(category);
                    }

                } catch (PackageManager.NameNotFoundException ignored) {
                }

                // Fallback if appName == packageName
                if (appName.equals(packageName)) {
                    String[] parts = packageName.split("\\.");
                    if (parts.length > 0) {
                        appName = parts[parts.length - 1];
                    }
                }

                // Format time HH:mm
                long hours = totalTimeMs / (1000 * 60 * 60);
                long minutes = (totalTimeMs % (1000 * 60 * 60)) / (1000 * 60);
                String timeFormatted = String.format("%02d:%02d", hours, minutes);

                JSObject obj = new JSObject();
                obj.put("packageName", packageName);
                obj.put("appName", appName);
                obj.put("category", category);
                obj.put("isProductive", isProductive);
                obj.put("totalTimeForeground", timeFormatted);
                obj.put("totalTimeForegroundMs", totalTimeMs);

                dataArray.put(obj);
            }

            JSObject result = new JSObject();
            result.put("data", dataArray);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error getting usage stats", e);
            call.reject(e.getMessage());
        }
    }

    // ❌ Define non-productive categories (Social & Games)
    private boolean isNonProductiveCategory(int category) {
        return category == ApplicationInfo.CATEGORY_SOCIAL
            || category == ApplicationInfo.CATEGORY_GAME;
    }
}
