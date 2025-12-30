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
            // Get the current date and calculate the start of today (midnight)
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            long startTime = calendar.getTimeInMillis(); // Midnight of today
            long endTime = System.currentTimeMillis();  // Current time

            // Get the UsageStatsManager service
            UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);

            // Query usage stats for today (from midnight to current time)
            List<UsageStats> stats = usm.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    startTime,
                    endTime
            );

            // If no usage stats or permission denied, return error
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

                    // Convert total time in foreground (milliseconds) to hours and minutes
                    long totalTime = usage.getTotalTimeInForeground();
                    long hours = totalTime / (1000 * 60 * 60); // Convert to hours
                    long minutes = (totalTime % (1000 * 60 * 60)) / (1000 * 60); // Convert to minutes

                    String timeFormatted = String.format("%02d:%02d", hours, minutes);
                    obj.put("totalTimeForeground", timeFormatted);

                    dataArray.put(obj);
                }
            }

            // Return the usage stats data
            JSObject result = new JSObject();
            result.put("data", dataArray);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error", e);
            call.reject(e.getMessage());
        }
    }
}
