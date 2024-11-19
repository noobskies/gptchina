package twa.novlisky.io;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.revenuecat.purchases.capacitor.PurchasesPlugin;
import io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register plugins
        this.registerPlugin(PurchasesPlugin.class);
        this.registerPlugin(FirebaseAuthenticationPlugin.class);
    }
}