import { Marker } from '@app/interfaces';
import { PlanService } from '../../app/services/plan.service'

export const markers: Marker[] = [{
  markerId: 1,
  //markerId: 1,
  secondId: 3,
  job: 'scenario',
  delay: 30, 
  minRotation: 15,
  rotateLeft(planService: PlanService) {
   planService.decrementCurrentYear();
  },
  rotateRight(planService: PlanService) {
    planService.incrementCurrentYear();
  }
}, {
  markerId: 11,
  secondId: 6,
  job: 'layer',
  delay: 400, 
  minRotation: 15,
  rotateLeft(planService: PlanService) {
    planService.decrementNextLayer();
   },
   rotateRight(planService: PlanService) {
    planService.incrementNextLayer();
   }
}, {
  markerId: 5,
  secondId: 9,
  job: 'year',
  delay: 400, 
  minRotation: 15,
  rotateLeft(planService: PlanService) {
    this.planService.decrementFeature();
   },
   rotateRight(planService: PlanService) {
    this.planService.incrementFeature();
   }
}, {
  markerId: 7,
  secondId: 7,
  job: 'add',
  delay: 600, 
  minRotation: 15,
  rotateLeft(planService: PlanService) {
    planService.toggleLayer();
   },
   rotateRight(planService: PlanService) {
    planService.toggleLayer();
   }
}];
