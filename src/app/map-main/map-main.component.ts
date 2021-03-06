import { Component, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { WindowRefService } from '../services/window-ref.service';
import { ArService } from '../services/ar.service';
import { Router } from '@angular/router';
import { Plan } from '@app/interfaces';
import { PlanService } from '@app/services/plan.service';
import { ProjectableMarker } from '@app/classes/projectableMarker';
import { BigIslandPlan } from '../../assets/plans/bigisland/plan';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
 * And the display components of the table.
 */
export class MapMainComponent implements AfterViewInit {

  /* HTML elements that are projected onto the pucks */
  @ViewChild('trackingDotYear', { static: false }) trackingDotYear;
  @ViewChild('trackingDotLayer', { static: false }) trackingDotLayer;
  @ViewChild('trackingDotScenario', { static: false }) trackingDotScenario;
  @ViewChild('trackingDotAdd', { static: false }) trackingDotAdd;
  @ViewChild('connectingLine', { static: false }) connectingLine; // The line that connects the Layer and Add pucks.

  private plan: Plan;                   // The current Plan
  private nativeWindow: any;
  private loading: boolean;

  /* Legend Related Variables */
  private top: string;                  // Y Position of the legend
  private left: string;                 // X Position of the legend
  private width: string;                // Width of the legend
  private legendClass: string;          // Vertical or horizontal legend.

  /* Tracking Puck and other Data Related Variables */
  private trackingDots: any[] = [];     // Holds the view children
  private currentYear: number;          // Current Year
  private nextLayer: string;            // The next layer that will be added or removed.
  private addColor: string;             // What color is the next layer associated with.
  private currentScenario: string;      // Current scenario.
        
  constructor(
    private titleService: Title,
    private planService: PlanService,
    private arService: ArService,
    private router: Router,
    private windowRefService: WindowRefService){ 
      titleService.setTitle("mapmain");
     this.nativeWindow = this.windowRefService.getNativeWindow();
      this.planService.setState('run');
      this.planService.setupSelectedPlan(BigIslandPlan);
      this.plan = this.planService.getCurrentPlan();
      this.handleStartsecondscreen(this.plan);  
          // if the plan is undefined, then the application will go back to the landing page.
    try {
      this.legendClass = this.planService.getCurrentLegendLayout();
      this.currentYear = this.planService.getMinimumYear();
      this.addColor = this.planService.getSelectedLayer().legendColor;
      this.currentScenario = this.planService.getCurrentScenario().displayName;
    } catch (error) {
      this.router.navigateByUrl('landing-home');
      this.planService.setState('landing');
      console.log('No Plan Found --> Route to setup');
    } finally {
      this.top = this.plan.css.legend[this.legendClass].top;
      this.left = this.plan.css.legend[this.legendClass].left;
      this.width = this.plan.css.legend[this.legendClass].width;
    }
        
  }

  ngAfterViewInit() {

    this.trackingDots = [this.trackingDotYear, this.trackingDotLayer, this.trackingDotScenario, this.trackingDotAdd];

    /* Subscriptions */

    this.planService.legendSubject.subscribe({
      next: value => {
        this.top = this.plan.css.legend[value].top;
        this.left = this.plan.css.legend[value].left;
        this.width = this.plan.css.legend[value].width;
      }
    });

    // Push Year Data to Second Screen
    this.planService.yearSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'year',
            year: value
          }));
        this.currentYear = value;
      }
    });

    // Push Year Data to Second Screen
    this.planService.selectedLayerSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'layer',
            name: value.name,
            isActive: value.active
          }));
        this.nextLayer = value.displayName;
        this.addColor = value.legendColor;
        this.connectLayerAndAdd(this.trackingDotLayer.nativeElement, this.trackingDotAdd.nativeElement);
      }
    });

    // Push Year Data to Second Screen
    this.planService.toggleLayerSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'layer',
            name: value.name,
            isActive: value.active
          }));
        this.nextLayer = value.displayName;
        this.addColor = value.legendColor;
        this.connectLayerAndAdd(this.trackingDotLayer.nativeElement, this.trackingDotAdd.nativeElement);
      }
    });

    this.arService.trackingSubject.subscribe({
      next: value => {
        this.trackingDots.forEach(dot => dot.nativeElement.style.opacity = 0);
        value.forEach(marker => this.track(marker));
      }
    });

    this.planService.scenarioSubject.subscribe(scenario => this.currentScenario = scenario.displayName);
  }

  /** Tracks the marker on the table
   * @param marker The marker to be tracked.
   */
  private track(marker: ProjectableMarker) {

    try {

      const dataPoint = { x: null, y: null };
      dataPoint.x = marker.getMostRecentCenterX();
      dataPoint.y = marker.getMostRecentCenterY();

      let element = null;

      if (dataPoint.x !== null) {
        switch (marker.getJob()) {
          case 'year':
            element = this.trackingDotYear.nativeElement;
            break;
          case 'layer':
            element = this.trackingDotLayer.nativeElement;
            break;
          case 'scenario':
            element = this.trackingDotScenario.nativeElement;
            break;
          case 'add':
            element = this.trackingDotAdd.nativeElement;
            break;
        }
        element.style.opacity = 1;
        element.style.left = dataPoint.x + 25 + 'px';
        element.style.top = dataPoint.y + 25 + 'px';

      }

    } catch (error) {
      //undefined marker
      console.log(error);
    }
  }

  /** Draws a line between the layer puck element and the add puck element.
   * Both of the pucks have to be detected and live for the line to be drawn.
   * @param layer the native element of the layer puck
   * @param add the native element of the add puck.
   */
  private connectLayerAndAdd(layer, add) {

    const layerMarker = ProjectableMarker.getProjectableMarkerByJob('layer');
    const addMarker = ProjectableMarker.getProjectableMarkerByJob('add');

    const layerRect = layer.getBoundingClientRect();
    const xOffset = layerRect.width / 2;
    const yOffset = layerRect.height / 2;

    const layerPosition = { x: layerMarker.getMostRecentCenterX(), y: layerMarker.getMostRecentCenterY() };
    const addPosition = { x: addMarker.getMostRecentCenterX(), y: addMarker.getMostRecentCenterY() };

    if (layerPosition.x === null || addPosition.x === null) {
      this.connectingLine.nativeElement.style.opacity = 0;
    } else {
      const adjacent = this.getAdjacent(addPosition.x, layerPosition.x);
      const opposite = this.getOpposite(addPosition.y, layerPosition.y);
      const hypotenuse = this.getHypotenuse(adjacent, opposite); // This is the width of the div
      let theta = this.getTheta(opposite, adjacent);
      theta = this.convertRadsToDegrees(theta);
      const quadrant = this.getQuadrant(addPosition.x - layerPosition.x, addPosition.y - layerPosition.y);
      theta = this.adjustTheta(theta, quadrant);
      this.moveLine(this.connectingLine.nativeElement, theta, hypotenuse, layerPosition.x + xOffset + 25, layerPosition.y + 25);
    }
  }

  /** Moves the line that connects the layer select and activate pucks.
   * @param element The line element
   * @param theta The theta angle of the triangle.
   * @param width the length of the line (width of the triangle)
   * @param x starting point x position
   * @param y starting point y position
   */
  private moveLine(element, theta, width, x, y) {
    element.style.opacity = 1;
    element.style.width = `${width}px`;
    element.style.left = `${x + 15}px`;
    element.style.top = `${y}px`;
    element.style.transform = `rotate(-${theta}deg)`;
    element.style.backgroundColor = this.planService.getSelectedLayer().legendColor;
    setTimeout(() => {
      element.style.opacity = 0;
    }, 500);
  }

  /** Adjusts the angle calculation depending on quadrant
   * @theta the angle as calculated by the arc tan function
   * @quadrant the quadrant of the unit circle
   */
  private adjustTheta(theta, quadrant) {
    theta = theta;
    if (quadrant === 2) {
      theta = 180 - theta;
    } else if (quadrant === 3) {
      theta = 180 + theta;
    } else if (quadrant === 4) {
      theta = 360 - theta;
    }
    return theta;
  }

  /** Get the quadrant of the unit circle
   * @param x the distance from the origin along x axis
   * @param y the distance from the origin along the y axis
   */
  private getQuadrant(x: number, y: number) {
    let quadrant = 0;
    if (x <= 0 && y <= 0) {
      quadrant = 2;
    } else if (x > 0 && y <= 0) {
      quadrant = 1;
    } else if (x >= 0 && y > 0) {
      quadrant = 4;
    } else {
      quadrant = 3;
    }
    return quadrant;
  }
  private convertRadsToDegrees(theta): number {
    return theta * (180 / Math.PI);
  }

  private getTheta(opposite: number, adjacent: number): number {
    return Math.atan(opposite / adjacent);
  }

  private getAdjacent(a: number, b: number): number {
    return Math.abs(a - b);
  }

  private getOpposite(a: number, b: number): number {
    return Math.abs(a - b);
  }

  private getHypotenuse(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }


  /**
   * This function gets the css class name to apply to the legend based
   * on the map that is selected.
   * @return the name of the css class
   */
  private getIslandName(): string {
    return this.plan.name;
  }

  // KEYBOARD CONTROLS
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      if (event.shiftKey) {
        this.arService.incrementYOffset2();
      } else {
        this.arService.incrementYOffset();
      }
    } else if (event.key === 'ArrowDown') {
      if (event.shiftKey) {
        this.arService.decrementYOffset2();
      } else {
        this.arService.decrementYOffset();
      }
    } else if (event.key === 'ArrowLeft') {
      if (event.shiftKey) {
        this.arService.incrementXOffset2();
      }
      else {
        this.arService.incrementXOffset();
      }
    } else if (event.key === 'ArrowRight') {
      if (event.shiftKey) {
        this.arService.decrementXOffset2();
      } else {
        this.arService.decrementXOffset();
      }
    } else if (event.key === 'l') {
      this.planService.changeCurrentLegendLayout();
    } else if (event.key === 'q') {
      this.planService.incrementScenario();
    } else if (event.key === 'w') {
      this.planService.decrementScenario();
    } else if (event.key === 's') {
      this.planService.incrementCurrentYear();
    } else if (event.key === 'a') {
      this.planService.decrementCurrentYear();
    } else if (event.key === 'x') {
      this.planService.incrementNextLayer();
    } else if (event.key === 'z') {
      this.planService.decrementNextLayer();
    } else if (event.key === 'Enter') {
      this.planService.addLayer();
    } else if (event.key === 'k') {
      this.planService.removeLayer();
    } else if (event.key === '-') {
      this.planService.decrementFeature();
    } else if (event.key === '=') {
      this.planService.incrementFeature();
    } else if (event.key === 'p') {
      this.planService.resetPlan();
      this.router.navigateByUrl('landing-home');
      this.planService.setState('landing');
    }
  }


/*
 * This section here is the second screen logic that is copied from landing home, to make sure that
 * a second screen opens from map main instead
 */
private openSecondScreen(): boolean {
          if (!(this.windowRefService.secondScreenIsSet())) {
                  this.windowRefService.setSecondSceenObject(this.nativeWindow.open('second-screen', 's    econdScreen','left= 500' + screen.width +', width = 1900, height = 1000')); 
                  this.nativeWindow.focus();
                  return true;
       } else {
                  return false;
       }
     }
  
    private handleIncludeSecondScreenCheckboxChange(island: Plan, isChecked: boolean): void {
      island.includeSecondScreen = isChecked;
    }   
  
  
  /** Start UP the Second screen */
     private startSecondScreen(plan: Plan): void {
       if (this.windowRefService.secondScreenExists()) {
         this.windowRefService.notifySecondScreen(JSON.stringify(
           { 
             type: 'setup',
             name: plan.name,
             currentYear: this.planService.getCurrentYear(),
           }));
       } else {
         setTimeout(() => {
           this.startSecondScreen(plan);
         }, 1000);
       }
     }
     handleStartsecondscreen(plan: Plan): void { 
         if (this.openSecondScreen()) {
           const planLayerData = [];
           plan.map.mapLayers.forEach(layer => planLayerData.push({
             name: layer.name,
             displayName: layer.displayName,
             iconPath: layer.iconPath
           }));
   
           this.startSecondScreen(plan);
        }
       
     }


}


