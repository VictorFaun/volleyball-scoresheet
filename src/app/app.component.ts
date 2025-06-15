import { Component, Renderer2 } from '@angular/core';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {

  constructor(private platform: Platform, private renderer: Renderer2) {
    console.log(this.platform.platforms())
    if ((this.platform.is('mobile') || this.platform.is('android') || this.platform.is('ios')) && !this.platform.is('mobileweb')) {
      this.renderer.addClass(document.body, 'is-mobile');
    }

    if(this.platform.is('mobile') && this.platform.is('ios')){
      this.renderer.addClass(document.body, 'is-ios');
    }

    if(this.platform.is('mobile') && this.platform.is('android')){
      this.renderer.addClass(document.body, 'is-android');
    }
  }

}
