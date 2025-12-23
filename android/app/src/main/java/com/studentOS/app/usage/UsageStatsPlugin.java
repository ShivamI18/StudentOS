package com.studentos.app.usage;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

import com.getcapacitor.JSArray; // Use JSArray for Capacitor
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod; // Required in v8
import com.getcapacitor.annotation.CapacitorPlugin;

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
            UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);

            long endTime = System.currentTimeMillis();
            long startTime = endTime - (1000L * 60 * 60 * 24); // 24 hours

            List<UsageStats> stats = usm.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    startTime,
                    endTime
            );

            // If the user hasn't granted permission, queryUsageStats returns an empty list (usually)
            if (stats == null || stats.isEmpty()) {
                call.reject("PERMISSION_DENIED_OR_NO_DATA");
                return;
            }

            JSArray dataArray = new JSArray();

            for (UsageStats usage : stats) {
                // Filter out apps with 0 foreground time to keep the payload small
                if (usage.getTotalTimeInForeground() > 0) {
                    JSObject obj = new JSObject();
                    obj.put("packageName", usage.getPackageName());
                    obj.put("totalTimeForeground", usage.getTotalTimeInForeground()); // In milliseconds
                    obj.put("lastTimeUsed", usage.getLastTimeUsed());
                    dataArray.put(obj);
                }
            }

            JSObject result = new JSObject();
            result.put("data", dataArray);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error", e);
            call.reject(e.getMessage());
        }
    }
}