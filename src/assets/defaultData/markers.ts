import { Marker } from '@app/interfaces';

export const markers: Marker[] = [{
  markerId: 3,
  job: 'year',
  icon: 'hourglass-01.png',
  live: false,
  startTime: null,
  rotationStartTime: null,
  corners: null,
  prevCorners: null,
  rotation: 0,
  rotationSum: 0,
  rotationMax: 14,
  slideEvents: false
}, {
  markerId: 6,
  job: 'scenario',
  icon: 'scenario-01.png',
  live: false,
  startTime: null,
  rotationStartTime: null,
  corners: null,
  prevCorners: null,
  rotation: 0,
  rotationSum: 0,
  rotationMax: 20,
  slideEvents: false
}, {
  markerId: 11,
  job: 'chart',
  icon: 'pie-01.png',
  live: false,
  startTime: null,
  rotationStartTime: null,
  corners: null,
  prevCorners: null,
  rotation: 0,
  rotationSum: 0,
  rotationMax: 20,
  slideEvents: false
}, {
  markerId: 5,
  job: 'layer',
  icon: 'layers-01.png',
  live: false,
  startTime: null,
  rotationStartTime: null,
  corners: null,
  prevCorners: null,
  rotation: 0,
  rotationSum: 0,
  rotationMax: 22,
  slideEvents: true
}];
