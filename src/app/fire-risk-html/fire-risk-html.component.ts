import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fire-risk-html',
  templateUrl: './fire-risk-html.component.html',
  styleUrls: ['./fire-risk-html.component.css']
})
export class FireRiskHtmlComponent implements OnInit {

  private text: string;

  constructor() { }

  ngOnInit() {
    this.text="Fire Risk Area Test.";
  }

}
