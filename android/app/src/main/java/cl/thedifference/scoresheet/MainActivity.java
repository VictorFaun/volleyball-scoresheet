package cl.thedifference.scoresheet;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Sin esto, en algunos casos la ventana sigue reservando su propio
        // espacio para la barra de estado (fitsSystemWindows=true por
        // defecto) aunque el tema/plugin pidan overlay transparente, y el
        // WebView nunca llega a dibujar detrás de ella -por eso se seguía
        // viendo un color aparte en vez del fondo real de la app-.
        // Hacerlo acá, al crear la Activity, evita que dependa de que el
        // plugin de StatusBar llegue a correr a tiempo desde JS.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
