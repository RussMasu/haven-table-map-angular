import { Component, HostListener, AfterViewInit, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-year-puck',
  templateUrl: './year-puck.component.html',
  styleUrls: ['./year-puck.component.css']
})
export class YearPuckComponent implements OnInit {

  @ViewChildren('yearBoxWrapper') yearBoxes;
  @ViewChild('yearBoxWrapper', {static: false}) yearBoxWrapper;

  private numberOfYears: number;
  private years: {year: number, filled: boolean}[] = [];
  private currentYear: number;
  private angle: number;
  private yearBoxElements: any[];
  private currentPosition: number;
  private YEAR_PUCK_COLOR: string = 'rgba(147, 93, 201)';

  private numberofFeatures: number;
  private Features: any[] = [];
  private currentFeature: number;
  private puckdisplay: any;


 
  constructor(private planService: PlanService) {}
  ngOnInit() {
    this.currentPosition = 0;
    /*
	this.currentYear = this.planService.getMinimumYear();
    this.numberOfYears = this.planService.getMaximumYear() - this.planService.getMinimumear() + 1;
    for (let i = 0; i < this.numberOfYears; i++) {
      this.years.push({year: i + this.planService.getMinimumYear(), filled: false});
    }
    */
    this.currentFeature = this.planService.getCurrentFeature();
    this.numberofFeatures = this.planService.getLayerFeatures(); // ended here  finish this at home  
    this.Features.push("All");
    for(let i = 0; i < this.numberofFeatures;i++){
            this.Features.push(i+1);
    }
	this.puckdisplay = this.Features[this.currentFeature];
	console.log("finished setup for puck");
   

  /*
    this.yearBoxElements = this.yearBoxes.first.nativeElement.children;
    this.positionElements(this.yearBoxElements);
    this.colorNodes();
3
    this.planService.yearSubject.subscribe(year => {
      this.currentYear = year;
      this.colorNodes();
    });*/


    // hijacking for features instead of years
    this.planService.featureSubject.subscribe(layerFeatures => {
		console.log("new lyer");
        this.currentFeature = this.planService.getCurrentFeature();
        this.numberofFeatures = layerFeatures;
        this.Features = [];
        this.Features.push("All");
        for(let i = 0; i < this.numberofFeatures;i++){
                this.Features.push(i+1);
        }
		//this.yearBoxElements = this.yearBoxes.first.nativeElement.children;
		//this.positionElements(this.yearBoxElements);
		this.puckdisplay = this.Features[this.currentFeature];
        //this.colornewNodes();
       });

    this.planService.updateLayerSubject.subscribe(layer => {
		console.log("new feature");
            this.currentFeature = this.planService.getCurrentFeature();
            this.puckdisplay = this.Features[this.currentFeature];
			//this.colornewNodes();
       });
  }
  
  
        // hijacking for features instead of years
        private colornewNodes() {
          for (let index = 0; index < this.numberofFeatures+1; index++) {
            if (index == this.currentFeature) {
              this.yearBoxElements[index].style.backgroundColor = this.YEAR_PUCK_COLOR;
            } else {
              this.yearBoxElements[index].style.backgroundColor = 'transparent';
            }
          }
        }

  /** Colors each of the year nodes.
   * 
   */
  private colorNodes() {
    for (let index = 0; index < this.numberOfYears; index++) {
      if (index <= this.currentYear - this.planService.getMinimumYear()) {
        this.yearBoxElements[index].style.backgroundColor = this.YEAR_PUCK_COLOR;
      } else {
        this.yearBoxElements[index].style.backgroundColor = 'transparent';
      }
    }
  }

  /** Positions the nodes around the puck
   * @param elements the HTML elements to position.
   */
  private positionElements(elements) {
	  
	console.log(elements);
	console.log(elements.length);
    this.angle = 360 / elements.length;
    this.currentPosition = 0;

    for (const e of elements) {
      e.style.transform = `rotate(${this.currentPosition}deg) translate(55px)`;
      this.currentPosition += this.angle;
    }

    this.yearBoxWrapper.nativeElement.style.transform = 'rotate(-90deg)';
  }
}
