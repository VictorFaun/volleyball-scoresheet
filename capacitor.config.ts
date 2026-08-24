import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.thedifference.scoresheet',
  appName: 'Volleyball Scoresheet',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Sin esta sección, el plugin arranca (del lado nativo, antes de que
    // corra cualquier JS nuestro) con SUS valores por defecto: overlay activo
    // y, sobre todo, backgroundColor #000000 -negro, hardcodeado en
    // StatusBarConfig.java-. En Android <15 (donde la barra sí se pinta de
    // verdad) eso pintaba la barra de negro desde el vamos; y como
    // setOverlaysWebView() internamente cachea/restaura ese color al
    // alternar overlay, ese negro podía volver a aparecer más tarde aunque
    // ThemeService pidiera otra cosa por JS. Con esto, arranca ya del color
    // correcto (el de modo claro; ThemeService lo corrige a oscuro por JS
    // si corresponde) en vez de negro por defecto.
    StatusBar: {
      overlaysWebView: false,
      style: 'DEFAULT',
      backgroundColor: '#ffffff',
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#191b58",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: false,
      splashImmersive: false,
      layoutName: "launch_screen",
      useDialog: false,
    },
  },
};

export default config;
