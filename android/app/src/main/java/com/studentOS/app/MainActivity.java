package com.studentos.app;

import android.os.Bundle; // Add this line
import com.getcapacitor.BridgeActivity;
import com.studentos.app.usage.UsageStatsPlugin; // Ensure this is imported too

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UsageStatsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}