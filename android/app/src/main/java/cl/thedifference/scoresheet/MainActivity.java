package cl.thedifference.scoresheet;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // AndroidManifest.xml arranca esta Activity con
        // AppTheme.NoActionBarLaunch (fondo #191b58 fijo): así se ve algo
        // de inmediato al abrir la app, antes de que exista cualquier vista
        // o corra código nuestro. Ese tema es solo para ese instante inicial.
        //
        // Sin este cambio, nada volvía a poner el tema "real"
        // (AppTheme.NoActionBar) después: NoActionBarLaunch quedaba activo
        // para TODA la sesión de la app. Por eso, sin importar qué color se
        // pidiera para la barra de estado o qué pintara el WebView, seguía
        // apareciendo ese fondo oscuro fijo del splash en vez del fondo real
        // de la app. Tiene que ir ANTES de super.onCreate(): ahí es cuando
        // se crea la ventana según el tema activo en ese momento.
        setTheme(R.style.AppTheme_NoActionBar);
        super.onCreate(savedInstanceState);

        // OJO: acá había un WindowCompat.setDecorFitsSystemWindows(false)
        // que forzaba modo edge-to-edge a mano, en TODAS las versiones de
        // Android. Eso peleaba directo contra StatusBar.setOverlaysWebView(
        // {overlay:false}) que pide ThemeService en JS -pensado para que
        // setBackgroundColor() funcione en Android <15 (donde no hay
        // edge-to-edge forzado por el sistema, como el Mi 10T con Android
        // 12)-: con el forzado manual acá, la ventana quedaba en
        // edge-to-edge igual, y el plugin nunca podía pintar la barra de
        // verdad. En Android 15+ el sistema ya fuerza edge-to-edge solo, así
        // que este forzado manual era además redundante ahí. Se saca del
        // todo: cada versión de Android queda con su comportamiento
        // default, y el plugin de StatusBar (JS) decide el resto.
    }
}
