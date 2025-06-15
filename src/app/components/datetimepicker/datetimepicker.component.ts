import { Component, ViewChild, Input, forwardRef } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimepickerComponent),
      multi: true
    }
  ],
  standalone: false,
})
export class DatetimepickerComponent implements ControlValueAccessor {

  innerValue: string = "";
  valueText: string= "";
  date: string="";
  onChangeCallback: any = () => {};

  @Input() monthNames: any;
  @Input() presentation: any;
  @Input() doneText: any;
  @Input() cancelText: any;
  @Input() mode: any;
  @Input() preferWheel: any=true;
  @Input() trigger: any;
  @Input() format: any;
  @Input() formatCSS: any="color:var(--color-50)";
  @Input() min: any;
  @Input() max: any;
  @Input() display: any=true;
  @Input() disabled: any=false;
  @Input() placeholder: any;
  @Input() ionChange: any;
  @Input() outputFormat: any;

  idioma = "es"

  @ViewChild('datetime', { read: IonDatetime }) datetime: IonDatetime | undefined;


  constructor() {
  }

  get value(): string {
    return this.innerValue;
  }

  writeValue(obj: any): void {
    // if(obj==null){
    // this.innerValue = (new Date()).toISOString()
    //   return
    // }
    if (obj !== this.innerValue) {
      this.innerValue = obj;
      this.valueText = this.formatStringDate(obj)
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  change(e:any){
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}

  close() {
    if (this.datetime) {
      this.datetime.cancel(true)
    }
  }

  select() {
    if (this.datetime) {
      if (!this.innerValue) {
        let fechaActual = moment();
        this.innerValue = fechaActual.format("YYYY-MM-DDTHH:mm:ss");
      }
      this.onChangeCallback(this.changeOutputFormat(this.innerValue));
      this.valueText = this.formatStringDate(this.innerValue);
      this.datetime.confirm(true);
      console.log(this.valueText)
    }
  }

  changeOutputFormat(datetime:any){

    if(!datetime){
      return ""
    }

    if(!this.outputFormat){
      return datetime
    }

    let date = moment(datetime);

    if (!date.isValid()) {
      return datetime;
    }

    return date.format(this.outputFormat);
  
  }

  formatStringDate(date: any): string {
    if (!date) {
      return "";
    }

    let datetime = moment(date);
    if (!datetime.isValid()) {
      return date;
    }

    if(!this.format){
      return date;
    }

    if(this.format=="MMMM YYYY"){
      if (this.monthNames) {
        let monthIndex = datetime.month();
        let year = datetime.year();
        return `${this.monthNames[monthIndex]} ${year}`;
      } 
    }
  
    return datetime.format(this.format);;
  }

}
