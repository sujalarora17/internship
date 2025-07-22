package com.yourapp.notifications;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

public class IncomingCallActivity extends Activity {
    private String caller;
    private String type;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Show over lock screen
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            );
        }

        setContentView(R.layout.activity_incoming_call);

        // Get caller info from intent
        Intent intent = getIntent();
        caller = intent.getStringExtra("caller");
        type = intent.getStringExtra("type");

        // Set up UI
        TextView callerNameText = findViewById(R.id.caller_name);
        TextView callTypeText = findViewById(R.id.call_type);
        Button answerButton = findViewById(R.id.answer_button);
        Button declineButton = findViewById(R.id.decline_button);

        callerNameText.setText(caller != null ? caller : "Unknown");
        callTypeText.setText("Incoming " + (type != null ? type : "voice") + " call");

        answerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                answerCall();
            }
        });

        declineButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                declineCall();
            }
        });
    }

    private void answerCall() {
        // Launch main app with call accepted
        Intent mainIntent = new Intent(this, MainActivity.class);
        mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        mainIntent.putExtra("action", "answer_call");
        mainIntent.putExtra("caller", caller);
        mainIntent.putExtra("type", type);
        startActivity(mainIntent);
        finish();
    }

    private void declineCall() {
        // Just close the activity
        finish();
    }

    @Override
    public void onBackPressed() {
        // Prevent going back
        // User must answer or decline
    }
}