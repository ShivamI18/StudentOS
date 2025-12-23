import { registerPlugin } from '@capacitor/core';

// The name must match @CapacitorPlugin(name = "UsageStats") in Java
const UsageStats = registerPlugin('UsageStats');

export default UsageStats;