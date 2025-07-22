package com.yourapp.notifications;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class NotificationModule extends ReactContextBaseJavaModule {
    private static final String CHANNEL_ID = "call_notifications";
    private static final String CHANNEL_NAME = "Call Notifications";
    private static final int NOTIFICATION_ID = 1001;

    public NotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        createNotificationChannel();
    }

    @Override
    public String getName() {
        return "NotificationModule";
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            );
            
            channel.setDescription("Notifications for incoming calls");
            channel.enableLights(true);
            channel.setLightColor(Color.GREEN);
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 1000, 500, 1000});
            channel.setShowBadge(true);
            
            NotificationManager notificationManager = getReactApplicationContext()
                .getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @ReactMethod
    public void showFullScreenNotification(String title, String body, String caller, String type, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            
            // Create intent for full screen activity
            Intent fullScreenIntent = new Intent(context, IncomingCallActivity.class);
            fullScreenIntent.putExtra("caller", caller);
            fullScreenIntent.putExtra("type", type);
            fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            
            PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                context, 0, fullScreenIntent, 
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Create answer action
            Intent answerIntent = new Intent(context, CallActionReceiver.class);
            answerIntent.setAction("ANSWER_CALL");
            answerIntent.putExtra("caller", caller);
            answerIntent.putExtra("type", type);
            
            PendingIntent answerPendingIntent = PendingIntent.getBroadcast(
                context, 1, answerIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Create decline action
            Intent declineIntent = new Intent(context, CallActionReceiver.class);
            declineIntent.setAction("DECLINE_CALL");
            
            PendingIntent declinePendingIntent = PendingIntent.getBroadcast(
                context, 2, declineIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Build notification
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(body)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setAutoCancel(true)
                .setOngoing(true)
                .addAction(R.drawable.ic_call_decline, "Decline", declinePendingIntent)
                .addAction(R.drawable.ic_call_answer, "Answer", answerPendingIntent);

            // For Android 10+ (API level 29+), use full screen notification
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                builder.setFullScreenIntent(fullScreenPendingIntent, true);
            }

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            notificationManager.notify(NOTIFICATION_ID, builder.build());
            
            promise.resolve("Notification shown successfully");
        } catch (Exception e) {
            promise.reject("NOTIFICATION_ERROR", "Failed to show notification", e);
        }
    }

    @ReactMethod
    public void cancelNotification(Promise promise) {
        try {
            NotificationManagerCompat notificationManager = 
                NotificationManagerCompat.from(getReactApplicationContext());
            notificationManager.cancel(NOTIFICATION_ID);
            promise.resolve("Notification cancelled");
        } catch (Exception e) {
            promise.reject("CANCEL_ERROR", "Failed to cancel notification", e);
        }
    }

    @ReactMethod
    public void checkNotificationPermission(Promise promise) {
        try {
            Context context = getReactApplicationContext();
            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            boolean enabled = notificationManager.areNotificationsEnabled();
            promise.resolve(enabled);
        } catch (Exception e) {
            promise.reject("PERMISSION_ERROR", "Failed to check permission", e);
        }
    }
}