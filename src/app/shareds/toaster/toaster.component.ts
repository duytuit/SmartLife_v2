import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Toast } from '../models/toast.interface';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Input() toast: Toast;
  @Input() i: number;

  @Output() remove = new EventEmitter<number>();
}
