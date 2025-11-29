import { Directive, EventEmitter, HostListener, Output, Input } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {


  @Output() longPress = new EventEmitter();
  @Input() longPressDuration = 600; // Default duration in milliseconds

  private timeout: any;
  private pressing: boolean = false;

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onPress(event: Event) {
    this.pressing = true;
    this.timeout = setTimeout(() => {
      if (this.pressing) {
        this.longPress.emit(event);
      }
    }, this.longPressDuration);
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  @HostListener('mouseleave') // For mouse events, to handle release outside the element
  onRelease() {
    clearTimeout(this.timeout);
    this.pressing = false;
  }

}
