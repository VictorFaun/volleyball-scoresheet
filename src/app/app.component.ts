import { Component, Renderer2 } from '@angular/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {

  constructor(private platform : Platform) {
    this.init()
  }
  

  async init(){
    await this.showSplashScreen();
    await this.enableKeepAwake();
  }

  async enableKeepAwake() {
    if(this.platform.is("capacitor"))
    await KeepAwake.keepAwake();
  }

  async showSplashScreen() {
    if(this.platform.is("capacitor"))
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true,
    });
  }

}
