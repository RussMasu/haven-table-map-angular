import { Injectable } from '@angular/core';
import { Marker } from '../interfaces/marker';
import { ProjectableMarker } from '../classes/projectableMarker';
import { PlanService } from './plan.service';
import { SoundsService } from './sounds.service';
import { markers } from '../../assets/defaultData/markers';
import { _ } from 'underscore';
import AR from 'js-aruco';
import { MapService } from './map.service';
import { Subject } from 'rxjs';
import { TrackingPoint } from '../classes/trackingPoint';

@Injectable({
  providedIn: 'root'
})

/* This servce contains all the functions and data that controls
* the ar interaction with the pucks and markers */
export class ArService {

  detector: any; // Aruco JS detector object
  tickFunction = null;
  width: number;
  height: number;
  running: boolean;
  calibrating: boolean;
  public markerSubject = new Subject<ProjectableMarker[]>();
  public calibrationSubject = new Subject<any>();
  private trackingPoints: TrackingPoint[] = [];

  /* If an active marker has not been detected for this many milliseconds,
  * it is officially inactive. */
  MAX_ACTIVE_TIMER = 200;

  /* Only check rotation of a marker if this much time has expired since the
  * last time it was checked */
  MAX_ROTATION_TIME = 100;

  /* The array holding the video feeds is created by the video feed components.
  * The tick cannot be started until there is at least one video element */
  videoFeedArray: any[] = [];

  constructor(private planService: PlanService,
    private soundsservice: SoundsService,
    private mapService: MapService) {
    /* Aruco Js library requires AR.AR. for access */
    this.detector = new AR.AR.Detector();
    this.tickFunction = this.tick.bind(this);
    markers.forEach(marker => new ProjectableMarker(
      marker.markerId,
      marker.job,
      marker.icon,
      marker.rotationMax,
      this.planService,
      this.soundsservice,
      this.mapService));
    this.running = false;
  }

  /* Detects the Markers and makes the changes in the program */
  private tick(): void {
    if (this.running) {
      setTimeout(() => requestAnimationFrame(this.tickFunction), 100);
    }

    this.videoFeedArray.forEach(videoFeed => {
      if (videoFeed.video.readyState === videoFeed.video.HAVE_ENOUGH_DATA) {

        // Collect the Image data for the detector
        const imageData = this.snapshot(videoFeed);

        // Returns an array of active arucojs markers.
        const arucoMarkers = this.detector.detect(imageData);
        // Run detect marker for each one

        arucoMarkers.forEach(marker => {
          const pm = ProjectableMarker.getProjectableMarkerById(marker.id);
          if (pm) {
            pm.detectMarker(marker.corners, videoFeed.id);
          }
        });

        ProjectableMarker.getLiveProjectableMarkers().forEach(marker =>
          marker.analyzeMarkerData() // Run normal operations on each live marker
        );

        this.markerSubject.next(ProjectableMarker.getLiveProjectableMarkers());
        if (this.calibrating) {
          this.calibrationSubject.next(ProjectableMarker.getLiveProjectableMarkers());
        }
      }
    });
  }

  /**
  * Creates an image from the video feed so that the app can look for markers.
  * @param videoElement Object containing the video and the canvas for each video input.
  * @return Returns the image data to be analyzed by the AR library
  */
  private snapshot(videoElement): any {
    videoElement.canvas.ctx.drawImage(videoElement.video, 0, 0, videoElement.canvas.width, videoElement.canvas.height);
    return videoElement.canvas.ctx.getImageData(0, 0, videoElement.canvas.width, videoElement.canvas.height);
  }

  /**
  * Starts the recursive animation loop that feeds the arucojs Detector
  * with images from the cameras.  Only starts if at least one videoFeed
  * component has been created.
  * @param videoFeeds => An array holding all instantiated video feeds.  They
  *                      contain a video element and a canavas element.
  */
  public runApplication(videoFeeds: any): any {
    this.videoFeedArray = videoFeeds;
    if (this.videoFeedArray.length === 0) {
      console.log("Video Elements Not Instantiated");
      this.running = false;
    } else {
      requestAnimationFrame(this.tickFunction);
      this.running = true;
    }
  }

  /** Kills the tick recursion.  This is called when we move from the landing
  * screen to the main application to prevent the function from running twice.
  */
  public killTick(): void {
    this.running = false;
  }

  public createPoint(): void {
    console.log('configure');
  }

  public startCalibration(): void {
    this.calibrating = true;
  }

  public createTrackingPoint(camX: number, camY: number, mapX: number, mapY: number) {
    this.trackingPoints.push(new TrackingPoint(camX, camY, mapX, mapY));
    console.log(this.trackingPoints);
  }

  public track(x: number, y: number): {x: number, y: number} {
   let minPointX = null;
   let minPointY = null;
   let maxPointX = null;
   let maxPointY = null;

   this.trackingPoints.forEach(point => {
      if (x > point.getCamX()) {
        minPointX = point;
      } 

     if (maxPointX === null) {
      if (x < point.getCamX()) {
        maxPointX = point;
      } 
     }

      if (y > point.getCamY()) {
        minPointY = point;
      } 
  

     if (maxPointY === null) {
      if (y < point.getCamY()) {
        maxPointY = point;
      } 
     }
   });


   //console.log(minPointX);
   //console.log(maxPointX);

   const camDistanceX = maxPointX.getCamX() - minPointX.getCamX();
   const camPercentageX = camDistanceX / (x - minPointX.getCamX());

   const actualX = camPercentageX * (maxPointX.getMapX());

   const camDistanceY = maxPointY.getCamY() - minPointY.getCamY();
   const camPercentageY = camDistanceY / (y - minPointY.getCamY());

   const actualY = (camPercentageY * (maxPointY.getMapY() - minPointY.getMapY())) + minPointY.getMapY();
   
   console.log(x + 'x' + y + 'y' + minPointX.getCamX() + ' ' + minPointY.getMapY() + ' ' + maxPointX.getCamX() + ' ' + maxPointY.getMapY());
  // console.log(`x: ${actualX}, y: ${actualY}`);
   return {x: actualX, y: actualY};
  }

}
