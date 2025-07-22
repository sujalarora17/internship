package com.yourapp.notifications;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationManagerCompat;

public class CallActionReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        
        // Cancel the notification
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
        notificationManager.cancel(1001);

        if ("ANSWER_CALL".equals(action)) {
            // Launch main app with answer action
            Intent mainIntent = new Intent(context, MainActivity.class);
            mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            mainIntent.putExtra("action", "answer_call");
            mainIntent.putExtra("caller", intent.getStringExtra("caller"));
            mainIntent.putExtra("type", intent.getStringExtra("type"));
            context.startActivity(mainIntent);
            
        } else if ("DECLINE_CALL".equals(action)) {
            // Just dismiss - no action needed
            // Optionally send decline event to React Native
        }
    }
}