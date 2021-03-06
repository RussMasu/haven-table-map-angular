import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';

export const MaunaKeaPlan: Plan = {
  name: 'maunakea',
  displayName: 'Mauna Kea',
  landingImagePath: 'assets/plans/maunakea/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/backgrounds/maunakea.jpg',
  includeSecondScreen: false,
  selectedPlan: false,
  minYear: 2016,
  maxYear: 2045,
  scenarios: [
    {
      name: 'postapril',
      displayName: 'Post April',
    },
    {
      name: 'e3',
      displayName: 'E3'
    }
  ],
  data: {
    capacityPath: 'assets/plans/maunakea/data/capacity.csv',
    generationPath: 'assets/plans/maunakea/data/generation.csv',
    batteryPath: 'assets/plans/maunakea/data/battery.csv',
    curtailmentPath: 'assets/plans/oahu/data/curtailment.csv',
    colors: chartColors
  },
  css: {
    map: {
      left: '24.5vw',  //Default is 24.5
      top: '4vh'
    },
    legend: {
      defaultLayout: 'grid',
      grid: {
        left: '75vw',
        top: '65vh',
        width: '23vw'
      },
      vertical: {
        left: '26vw',
        top: '3vh',
        width: '10vw'
      }
    },
    title: {
      left: '50vw',
      top: '85vh'
    },
    scenario: {
      left: '29vw',
      top: '2vh'
    },
    charts: {
      pie: {
        left: '30vw',
        top: '65vh'
      },
      line: {
        left: 'calc(100vw - 400px)',
        top: '0vh'
      }
    }
  },
  map: {
    scale: 0.258, 
    width: 3500,
    height: 2600,
    bounds: [[-155.733, 19.929], [-154.998, 20.069]],
    baseMapPath: 'assets/plans/maunakea/images/base-map-test.png',

    mapLayers: [
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        active: false,
        included: true,
        iconPath: 'assets/plans/maunakea/images/icons/transmission-icon.png',
        legendImagePath: 'assets/plans/bigisland/images/icons/transmission-icon.png',   
        secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/layer-images/transmission.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        totalFeatures: 0,
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        borderWidth: 0.04,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/maunakea/layers/transmission.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', this.fillColor)
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      },
      {
        name: 'dod',
        displayName: 'Government Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/maunakea/images/icons/dod-icon.png',
        legendImagePath: 'assets/plans/bigisland/images/icons/transmission-icon.png',   
        secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/layer-images/dod.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        totalFeatures: 0,
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Dod.fill,
        parcels: [],
        filePath: 'assets/plans/maunakea/layers/dod.json',
        setupFunction(planService: PlanService) {
          const colors = {
            'Public-Federal': '#e60000',
            'Public-State': '#ff7f7f',
            'Public-State DHHL': '#895a44',
            'Public-County': '#00c5ff',
          }
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.type])
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', this.borderWidth + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      },
      {
        name: 'parks',
        displayName: 'Park Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/maunakea/images/icons/parks-icon.png',
        legendImagePath: 'assets/plans/bigisland/images/icons/transmission-icon.png',   
        secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/layer-images/parks.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        totalFeatures: 0,
        fillColor: mapLayerColors.Parks.fill,
        borderColor: mapLayerColors.Parks.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Parks.fill,
        parcels: [],
        filePath: 'assets/plans/maunakea/layers/parks.json',
        setupFunction: null,
        updateFunction: null,
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        included: true,
        iconPath: 'assets/plans/maunakea/images/icons/wind-icon.png',
        legendImagePath: 'assets/plans/bigisland/images/icons/transmission-icon.png',   
        secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/layer-images/wind.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        totalFeatures: 0,
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        borderWidth: 0.15,
        legendColor: mapLayerColors.Wind.fill,
        filePath: 'assets/plans/maunakea/layers/wind.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          let windTotal = planService.getCapacityTotalForCurrentYear(['Wind']) / 3 - 72;
          const dictSort = {
            '8.5+': 0,
            '7.5-8.5': 1,
            '6.5-7.5': 2
          }
          this.parcels.sort((a, b) => parseFloat(dictSort[a.properties.SPD_CLS]) - parseFloat(dictSort[b.properties.SPD_CLS]));
          this.parcels.forEach(parcel => {
            if (windTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
              windTotal -= (parcel.properties.MWac);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
            }
          });
        },
        updateFunction(planService: PlanService) {
          let windTotal = planService.getCapacityTotalForCurrentYear(['Wind']) / 3 - 72;
          this.parcels.forEach(parcel => {
            if (windTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0);
              windTotal -= (parcel.properties.MWac);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0);
            }
          });
        },
      },
      {
        name: 'solar',
        displayName: 'Solar',
        active: false,
        included: true,
        iconPath: 'assets/plans/maunakea/images/icons/solar-icon.png',
        legendImagePath: 'assets/plans/bigisland/images/icons/transmission-icon.png',   
        secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        totalFeatures: 0,
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        borderWidth: 0.3,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/maunakea/layers/solar.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          let solarTotal = planService.getGenerationTotalForCurrentYear(['PV']);
          this.parcels.sort((a, b) => parseFloat(b.properties.cf_1) - parseFloat(a.properties.cf_1));
          this.parcels.forEach(parcel => {
            if (solarTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
              solarTotal -= (parcel.properties.cf_1 * parcel.properties.capacity * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
            }
          });
        },
        updateFunction(planService: PlanService) {
          let solarTotal = planService.getGenerationTotalForCurrentYear(['PV']);
          console.log(solarTotal);
          this.parcels.forEach(parcel => {
            if (solarTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0);
              solarTotal -= (parcel.properties.cf_1 * parcel.properties.capacity * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0);
            }
          });
        },
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,  
        included: true,
        iconPath: 'assets/plans/maunakea/images/icons/agriculture-icon.png',
        legendImagePath: 'assets/plans/bigisland/images/icons/transmission-icon.png',   
        secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/layer-images/agriculture.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        totalFeatures: 0,
        fillColor: chartColors.Battery,
        borderColor: mapLayerColors.Agriculture.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/maunakea/layers/agriculture.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          const colors = {
            A: '#267300' + 'aa',
            B: '#4ce600' + 'aa',
            C: '#ffaa00' + 'aa',
            D: '#a87000' + 'aa',
            E: '#895a44' + 'aa',
          }
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.type])
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', this.borderWidth  + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      },
            {//start placeholder layer
              name: 'Moisture Zones',
              displayName: 'Moisture Zones',
              active: false,
              included: true,
              iconPath: 'assets/plans/maunakea/images/icons/dod-icon.png',
              legendImagePath: 'assets/plans/bigisland/images/icons/transmission-icon.png',   
              secondScreenImagePath: 'assets/plans/maunakea/images/second-screen-images/layer-images/dod.jpg',
              secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
              totalFeatures: 0,
              fillColor: mapLayerColors.Dod.fill,
              borderColor: mapLayerColors.Dod.border,
              borderWidth: 1,
              legendColor: mapLayerColors.Dod.fill,
              filePath: 'assets/plans/maunakea/layers/moisture.json',
              parcels: [],
              setupFunction(planService: PlanService) {
                const colors = {
                  '1': '#e60000',
                  '2': '#ff7f7f',
                  '3': '#895a44',
                  '4': '#00c5ff',
                  '5': '#037ffc',
                  '6': '#031cfc',
                  '7': '#1302d1',
                }
                this.parcels.forEach(parcel => {
                  d3.select(parcel.path)
                    .style('fill', colors[parcel.properties.zone])//change from type to attribute name
                    .style('opacity', this.active ? 0.85 : 0.0)
                    .style('stroke', this.borderColor)
                    .style('stroke-width', this.borderWidth + 'px');
                });
              },
              updateFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                  d3.select(parcel.path)
                    .style('opacity', this.active ? 0.85 : 0.0);
                });
              },
            },//end placeholder layer
    ],
  },
};
