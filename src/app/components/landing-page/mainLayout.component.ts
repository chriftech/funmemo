import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-car-selection',
  standalone: false,
  template: `
  <div class="mx-auto w-full max-w-5xl flex justify-center items-center font-bold text-4xl p-4">
    Main Container
  </div>
  `,
  styles: [],
})

export class MainLayoutComponent implements OnInit {
  ngOnInit(): void {
    console.log("component initialized successfully!!!")
  }
}
