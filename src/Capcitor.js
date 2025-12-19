import { Capacitor } from "@capacitor/core";

const { UsageTracker } = Capacitor.Plugins;

// Check permission
const perm = await UsageTracker.hasPermission();

if (!perm.granted) {
  await UsageTracker.openSettings();
}

// Get usage
const data = await UsageTracker.getUsageStats();
console.log(data.apps);
