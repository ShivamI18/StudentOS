package com.studentos.app.usage;

import android.app.usage.UsageEvents;
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

import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@CapacitorPlugin(name = "UsageStats")
public class UsageStatsPlugin extends Plugin {

    private static final String TAG = "UsageStatsPlugin";

    private static final Set<String> UNPRODUCTIVE_PACKAGES = new HashSet<>(Arrays.asList(
        "in.mohalla.sharechat", "in.mohalla.video", "com.next.innovation.takatak",
        "com.eterno.shortvideos", "com.instagram.android", "com.facebook.katana",
        "com.snapchat.android", "com.whatsapp", "com.twitter.android",
        "com.netflix.mediaclient", "com.jio.media.ondemand", "in.startv.hotstar"
    ));

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
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            long startTime = calendar.getTimeInMillis();
            long endTime = System.currentTimeMillis();

            UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
            UsageEvents events = usm.queryEvents(startTime, endTime);
            
            Map<String, Long> appUsageMap = new HashMap<>();
            Map<String, Long> openTimeMap = new HashMap<>();

            UsageEvents.Event event = new UsageEvents.Event();
            while (events.hasNextEvent()) {
                events.getNextEvent(event);
                String pkg = event.getPackageName();

                if (event.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                    openTimeMap.put(pkg, event.getTimeStamp());
                } else if (event.getEventType() == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                    if (openTimeMap.containsKey(pkg)) {
                        long duration = event.getTimeStamp() - openTimeMap.get(pkg);
                        appUsageMap.put(pkg, appUsageMap.getOrDefault(pkg, 0L) + duration);
                        openTimeMap.remove(pkg);
                    }
                }
            }

            // Capture time for the app currently being used right now
            for (String pkg : openTimeMap.keySet()) {
                long duration = endTime - openTimeMap.get(pkg);
                appUsageMap.put(pkg, appUsageMap.getOrDefault(pkg, 0L) + duration);
            }

            JSArray dataArray = new JSArray();
            PackageManager pm = getContext().getPackageManager();

            for (Map.Entry<String, Long> entry : appUsageMap.entrySet()) {
                long totalTimeMs = entry.getValue();
                if (totalTimeMs < 60_000) continue; // Skip < 1 min

                String packageName = entry.getKey();
                String appName = packageName; // Default to package name
                int category = ApplicationInfo.CATEGORY_UNDEFINED;

                try {
                    ApplicationInfo ai = pm.getApplicationInfo(packageName, 0);
                    // 1. Get real App Label (e.g., "WhatsApp")
                    appName = pm.getApplicationLabel(ai).toString();
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        category = ai.category;
                    }
                } catch (PackageManager.NameNotFoundException ignored) {}

                // ✅ RESTORED: App Name Logic (Splitting if label fails)
                if (appName.equals(packageName)) {
                    String[] parts = packageName.split("\\.");
                    if (parts.length > 0) {
                        appName = parts[parts.length - 1];
                    }
                }

                // Classification
                boolean isUnproductive = UNPRODUCTIVE_PACKAGES.contains(packageName) || isNonProductiveCategory(category);

                long hours = totalTimeMs / 3600000;
                long minutes = (totalTimeMs % 3600000) / 60000;

                JSObject obj = new JSObject();
                obj.put("packageName", packageName);
                obj.put("appName", appName);
                obj.put("isProductive", !isUnproductive);
                obj.put("totalTimeForeground", String.format("%02d:%02d", hours, minutes));
                obj.put("totalTimeForegroundMs", totalTimeMs);
                dataArray.put(obj);
            }

            JSObject result = new JSObject();
            result.put("data", dataArray);
            call.resolve(result);

        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    private boolean isNonProductiveCategory(int category) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return category == ApplicationInfo.CATEGORY_SOCIAL
                || category == ApplicationInfo.CATEGORY_GAME;
        }
        return false;
    }
}