import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class VibrationService {

  private vibration;

  constructor(private ngZone: NgZone) { 
    // enable vibration support
    const navigator = window.navigator;
    this.vibration =  navigator['vibrate'] && 'vibrate' 
    || navigator['webkitVibrate'] && 'webkitVibrate' 
    || navigator['mozVibrate'] && 'mozVibrate' 
    || navigator['msVibrate'] && 'msVibrate'
    || null;
  }

  public vibrate(duration:number){
    this.ngZone.runOutsideAngular(()=>{
      if(this.vibration){
        window.navigator.vibrate(duration)
      }
    });
  }

}
