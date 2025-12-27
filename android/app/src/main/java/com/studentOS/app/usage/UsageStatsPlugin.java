package com.studentos.app.usage;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

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

    // Opens Usage Access permission screen
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

    // Fetch today's usage stats (from midnight)
    @PluginMethod
    public void getUsageStats(PluginCall call) {
        try {
            UsageStatsManager usm =
                    (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);

            // Get today's midnight
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);

            long startTime = calendar.getTimeInMillis();
            long endTime = System.currentTimeMillis();

            List<UsageStats> stats = usm.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    startTime,
                    endTime
            );

            // Permission check
            if (stats == null || stats.isEmpty()) {
                call.reject("PERMISSION_DENIED_OR_NO_DATA");
                return;
            }

            JSArray dataArray = new JSArray();

            for (UsageStats usage : stats) {
                long timeMs = usage.getTotalTimeInForeground();

                // Ignore unused apps
                if (timeMs > 0) {
                    JSObject obj = new JSObject();
                    obj.put("packageName", usage.getPackageName());
                    obj.put("totalTimeForegroundMs", timeMs);
                    obj.put("totalTimeForeground", formatDuration(timeMs));
                    dataArray.put(obj);
                }
            }

            JSObject result = new JSObject();
            result.put("data", dataArray);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error getting usage stats", e);
            call.reject(e.getMessage());
        }
    }

    // Converts milliseconds → HH:MM:SS
    private String formatDuration(long millis) {
        long seconds = millis / 1000;
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long remainingSeconds = seconds % 60;

        return String.format("%02d:%02d:%02d", hours, minutes, remainingSeconds);
    }
}
