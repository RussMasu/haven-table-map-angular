import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiWindowService, Message} from 'ngx-multi-window';
import { BigIslandPlan } from '../../assets/plans/bigisland/plan';
import { Plan } from '@app/interfaces';

declare function clearDiv(): any;  //From secondScreen.js.

@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.component.html',
  styleUrls: ['./second-screen.component.css']
})

/** This component controls the second monitor.  It is a second DOM so all of the data has to be
 * on this page because the main application cannot communicate with it in the same way that it
 * communicates with other components.
 */

export class SecondScreenComponent implements OnInit {
  private secondScreenImagePath: string;   
  private plan: Plan;
  private htmlFilePath: string;  

  /**
   * Takes in a multiWindowService object, sets its name param to 'secondScreen.'
   * @param multiWindowService 
   */
  constructor(private multiWindowService: MultiWindowService) {
    multiWindowService.name = 'secondScreen';
  }

/** Runs when the component is initialized.  Catches a Message and calls an 
 * appropiate function depending on which Message is caught.
 * For initialization, 'setup' should be caught.  
 * Updates can have other values for Message.
 */
  ngOnInit() {
    this.multiWindowService.onMessage().subscribe((value: Message) => {
      const data = JSON.parse(value.data);
      if (data.type === 'setup') {
        this.setupSecondScreen(data);
      } 
        //TODO: Figure out how to set data.type for other messages and functions.
    });
  }

  /**
   * Hard-coded specifically for second-screen.component.html.
   * Clears the second-screen-container div of the 
   * second-screen.component.html file.
   * Ideally, this will be called before trying to populate the 
   * screen with data.
   */
  private clearScreen()
  {
    clearDiv();
  }

  /**
   * Clears the second monitor
   * and loads appropiate HTML data using the 
   * most recently activated layer's internal name as an ID.
   * 
   * For the record, the variable we're taking from the mapLayer
   * plan.ts is the mapyLayer's (name) variable.  
  * @param layerName
  */
  public secondScreenUpdate(layerName:string){
    //TODO: Flesh out idea.

    //The idea is to run this check every time a layer's active variable changes from 
    //false to true. 

    //Grab the name of the recently activated layer, load appropiate data onto second monitor.
    //Clear the screen.
    clearDiv();

    //Updates htmlFilePath variable and takes care of loading data onto the second monitor.
    switch(layerName)
    {
      case 'elevation':
        this.htmlFilePath="Placeholder.html";  
        console.log("Loading elevation data for second monitor...");
        break;
    }

    // //Test forEach loop. Testing syntax, mainly.  
    // this.plan.map.mapLayers.forEach(planLayer=> {
    //   console.log(planLayer.active);
    // });



  }

/**
 * Destructor.  
 */
  ngOnDestroy(): void {
    this.multiWindowService.name = 'dead';
  }

  /** Initializes the second screen when it is opened.  Since data cannot be passed, the possible maps have to be
   * hard coded into the logic.
   * @param data => The setup object
   */
  private setupSecondScreen(data: any): void {
    switch (data.name) {
      case 'bigisland':
        this.plan = BigIslandPlan;
        break;
      default:
        this.plan = BigIslandPlan;
        break;
    }};
  }