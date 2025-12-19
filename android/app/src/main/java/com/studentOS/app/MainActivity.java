package com.studentOS.app;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.CapacitorPlugin;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.util.List;

public class MainActivity extends BridgeActivity {}

@CapacitorPlugin(name = "UsageTracker")
class UsageTrackerPlugin extends Plugin {

    // 1️⃣ Check permission
    @PluginMethod
    public void hasPermission(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("granted", hasUsagePermission());
        call.resolve(ret);
    }

    // 2️⃣ Open settings
    @PluginMethod
    public void openSettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
        getContext().startActivity(intent);
        call.resolve();
    }

    // 3️⃣ Get usage stats
    @PluginMethod
    public void getUsageStats(PluginCall call) {
        if (!hasUsagePermission()) {
            call.reject("Usage permission not granted");
            return;
        }

        UsageStatsManager usm =
                (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);

        long endTime = System.currentTimeMillis();
        long startTime = endTime - (24 * 60 * 60 * 1000);

        List<UsageStats> stats =
                usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);

        JSArray apps = new JSArray();

        for (UsageStats usage : stats) {
            if (usage.getTotalTimeInForeground() > 0) {
                JSObject obj = new JSObject();
                obj.put("package", usage.getPackageName());
                obj.put("time", usage.getTotalTimeInForeground());
                apps.put(obj);
            }
        }

        JSObject ret = new JSObject();
        ret.put("apps", apps);
        call.resolve(ret);
    }

    // 🔒 Internal permission check
    private boolean hasUsagePermission() {
        AppOpsManager appOps =
                (AppOpsManager) getContext().getSystemService(Context.APP_OPS_SERVICE);

        int mode = appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                getContext().getPackageName()
        );

        return mode == AppOpsManager.MODE_ALLOWED;
    }
}
