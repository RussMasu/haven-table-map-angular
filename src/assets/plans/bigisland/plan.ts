import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';
import { ParseSourceFile } from '@angular/compiler';

export const BigIslandPlan: Plan = {
  name: 'bigisland',
  displayName: 'Big Island',
  landingImagePath: 'assets/plans/bigisland/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/backgrounds/bigIsland.jpg',
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
    capacityPath: 'assets/plans/bigisland/data/capacity.csv',
    generationPath: 'assets/plans/bigisland/data/generation.csv',
    batteryPath: 'assets/plans/bigisland/data/battery.csv',
    curtailmentPath: 'assets/plans/oahu/data/curtailment.csv',
    colors: chartColors
  },
  css: {
    map: {
      left: '30.5vw',
      top: '8vh'
    },
    legend: {
      defaultLayout: 'grid',
      grid: {
        left: '27vw',
        top: '15vh',
        width: '21vw'
      },
      vertical: {
        left: '25vw',
        top: '11vh',
        width: '10vw'
      }
    },
    title: {
      left: '64vw',
      top: '82vh'
    },
    scenario: {
      left: '27vw',
      top: '6vh'
    },
    charts: {
      pie: {
        left: '0vw',
        top: '0vh'
      },
      line: {
        left: 'calc(100vw - 325px)',
        top: '0vh'
      }

    }
  },
  map: {
    scale: 0.32,
    width: 2179,
    height: 2479,
    bounds: [[-156.0618, 20.2696], [-154.8067, 18.9105]],
    baseMapPath: 'assets/plans/bigisland/images/base-map.png',
    mapLayers: [
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        active: false,
        included: false,
        iconPath: 'assets/plans/bigisland/images/icons/transmission-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/transmission.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        borderWidth: 0.04,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/bigisland/layers/transmission.json',
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
        name: 'Elevation',  //Internal layer name
        displayName: 'Elevation Contours 500ft',  //Display name (on the table.)
        active: false,  //Default for active (visible) status
        included: true,   //Default for inclusion in the layer list
        iconPath: 'assets/plans/bigisland/images/icons/elevation-icon.png',  //Icon path for table.
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',    //Background image for second screen, image path.
        secondScreenText: 'Slide the Layer Puck to add or remove this layer',  //Instructional/information text on second screen.
        fillColor: mapLayerColors.Test2019.fill,     //See defaultColors.ts.
        borderColor: 'white', //See defaultColors.ts.
        borderWidth: 1,  //Border width, default is set here.
        legendColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
        filePath: 'assets/plans/bigisland/layers/Elevation_Ranges.json',
        parcels: [],  //Empty list of parcels, gets populated by setupFunction()
        setupFunction(planService: PlanService) {

          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
                  .style('fill','transparent')
                  .style('opacity', this.active ? 1 : 0.0)
                  .style('stroke',this.borderColor)
                  .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
                d3.select(parcel.path)
                  .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
                  .style('opacity', this.active ? 1 : 0.0)
                  .style('stroke',this.borderColor)//set to borderColors if borders wanted otherwise this.bordercolor
                  .style('stroke-width', this.borderWidth + 'px');
          });
        },
      },//end elevation layer
      {
        name: 'streams', //start stream layer
        displayName: 'Streams',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/stream-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: '#ff0066',
        borderColor: '#ffffff',
        borderWidth: 0.9,//0.5
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/bigisland/layers/streams.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            let layerattribute = parcel.properties.type;//divide based on layer attribute 

            const borderColors = {
              'NON-PERENNIAL': '#99d6ff',//look at json file for names
              'PERENNIAL': '#0099ff',
            }

            if(layerattribute == 'NON-PERENNIAL')
            {
            d3.select(parcel.path)
              .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', borderColors[parcel.properties.type])//set to borderColors if borders wanted otherwise this.bordercolor
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }
            else if(layerattribute == 'PERENNIAL')
            {
            d3.select(parcel.path)
              .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', borderColors[parcel.properties.type])//set to borderColors if borders wanted otherwise this.bordercolor
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            }

          });
        },
      },//end stream layer
      

            {//Start FIRE LAYER
              //It sounds cool.
              name: 'firerisk',
              displayName: 'Fire Risk Zones',
              active: false,
              included: true,
              iconPath: 'assets/plans/bigisland/images/icons/fire.png',
              secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
              secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
              fillColor: mapLayerColors.Dod.fill,
              borderColor: mapLayerColors.Dod.border,
              borderWidth: 1,
              legendColor: mapLayerColors.Dod.fill,
              filePath: 'assets/plans/bigisland/layers/Fire_Risk_Areas.json',
              parcels: [],
              setupFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                  d3.select(parcel.path)
                    .style('fill', 'transparent')//change from type to attribute name
                    .style('opacity', this.active ? 0.85 : 0.0)
                    .style('stroke', 'white')
                    .style('stroke-width', this.borderWidth + 'px');
                });
              },

              
              updateFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                  
                  const fireColors = {
                    "Low" : "#238d65",
                    "Medium" : "#2a9ed9",
                    "High" : "#fee71f",
                    "Very High" : "#f6a553",
                    "Extreme" : "#ef4246",
                    "Critical" : "white"
                  }
                  let risk = parcel.properties.risk_ratin;

                  if(risk == "Low")
                  {
                    d3.select(parcel.path)
                    .style('fill', fireColors["Low"])
                    .style('opacity', this.active ? 0.85 : 0.0)
                    .style('stroke', this.borderColor)
                    .style('stroke-width', this.borderWidth + 'px');
                  }
                  if(risk == "Medium")
                  {
                    d3.select(parcel.path)
                    .style('fill', fireColors["Medium"])
                    .style('opacity', this.active ? 0.85 : 0.0)
                    .style('stroke', this.borderColor)
                    .style('stroke-width', this.borderWidth + 'px');
                  }
                  if(risk == "High")
                  {
                    d3.select(parcel.path)
                    .style('fill', fireColors["High"])
                    .style('opacity', this.active ? 0.85 : 0.0)
                    .style('stroke', this.borderColor)
                    .style('stroke-width', this.borderWidth + 'px');
                  }
                });
              },
            },//end fire layer

            {//start Palila layer
              name: 'Palila Critical Habitat', //display name
              displayName: 'Palila Critical Habitat',//display name
              active: false,
              included: true,//enable-disable layer
              iconPath: 'assets/plans/bigisland/images/icons/palila-icon.png',//controls icon image for layer
              secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
              secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
              fillColor: '#ff0066',
              borderColor: '#ffffff',
              borderWidth: 0.5,
              legendColor: mapLayerColors.Solar.fill,
              filePath: 'assets/plans/bigisland/layers/palila.json',//set to shapefile link
              parcels: [],
              setupFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                    d3.select(parcel.path)
                      .style('fill', 'transparent')
                      .style('opacity', (this.active) ? 0.95 : 0.0)
                      .style('stroke', this.borderColor)
                      .style('stroke-width', this.borderWidth + 'px');
                });
              },
              updateFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                 
                  d3.select(parcel.path)
                    .style('fill', '#f0cd1f')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.85 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
                  
      
                });
              },
            },//end paalia layer

        {//Start Volcano
          //It sounds cool.
          name: 'volcanohazard',
          displayName: 'Volcano Lava Flow Hazard Zones',
          active: false,
          included: true,
          iconPath: 'assets/plans/bigisland/images/icons/fire.png',
          secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
          secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
          fillColor: mapLayerColors.Dod.fill,
          borderColor: '#FFFFFF',
          borderWidth: 2,
          legendColor: mapLayerColors.Dod.fill,
          filePath: 'assets/plans/bigisland/layers/Volcano_Lava_Flow_Hazard_Zones.json',
          parcels: [],
                setupFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                      d3.select(parcel.path)
                        .style('fill', 'transparent')
                        .style('opacity', (this.active) ? 0.20 : 0.0)
                        .style('stroke', this.borderColor)
                        .style('stroke-width', (this.borderWidth) + 'px');
                  });
                },
                updateFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                    let vhzone = parcel.properties.vhzones_id;//divide based on layer attribute 

                        if(vhzone == 1){
                          d3.select(parcel.path)
                            .style('fill', '#FFFFFF')//set to Colors if fill wanted, otherwise transparent
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 2){
                          d3.select(parcel.path)
                            .style('fill', '#B6F2B3')//set to Colors if fill wanted, otherwise transparent
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 3){
                          d3.select(parcel.path)
                            .style('fill', '#30EC26')//set to Colors if fill wanted, otherwise transparent
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 4){
                          d3.select(parcel.path)
                            .style('fill', '#FFC300')//set to Colors if fill wanted, otherwise transparent
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 5){
                          d3.select(parcel.path)
                            .style('fill', '#F7BDA9')//set to Colors if fill wanted, otherwise transparent
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 6){
                          d3.select(parcel.path)
                            .style('fill', '#F56D3E')//set to Colors if fill wanted, otherwise transparent
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 7){
                          d3.select(parcel.path)
                            .style('fill', '#F7BDA9')//light pink
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 8){
                          d3.select(parcel.path)
                            .style('fill', '#F7BDA9')//light pink
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 9){
                          d3.select(parcel.path)
                            .style('fill', '#F56D3E')//salmon
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 10){
                          d3.select(parcel.path)
                            .style('fill', '#FF0000')//red
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 11){
                          d3.select(parcel.path)
                            .style('fill', '#F5FF7F')//light yellow
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 12){
                          d3.select(parcel.path)
                            .style('fill', '#F56D3E')//salmon
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 13){
                          d3.select(parcel.path)
                            .style('fill', '#FF0000')//red
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 14){
                          d3.select(parcel.path)
                            .style('fill', '#F56D3E')//salmon
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 15){
                          d3.select(parcel.path)
                            .style('fill', '#E8FA0C')//yellow
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 16){
                          d3.select(parcel.path)
                            .style('fill', '#F7BDA9')//light pink
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 17){
                          d3.select(parcel.path)
                            .style('fill', '#F7BDA9')//light pink
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                        if(vhzone == 18){
                          d3.select(parcel.path)
                            .style('fill', '#F5FF7F')//light yellow
                            .style('opacity', this.active ? 0.30 : 0.0)
                            .style('stroke',this.borderColor )
                            .style('stroke-width', (this.borderWidth)  + 'px');
                        }
                  });
                },
        },//end volcano layer
    
        {//Start Road
          //It sounds cool.
          name: 'majorroads',
          displayName: 'Major Roads Hawaii County',
          active: false,
          included: true,
          iconPath: 'assets/plans/bigisland/images/icons/fire.png',
          secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
          secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
          fillColor: mapLayerColors.Dod.fill,
          borderColor: '#B53CFF',
          borderWidth: 1,
          legendColor: mapLayerColors.Dod.fill,
          filePath: 'assets/plans/bigisland/layers/Major_Roads__Hawaii_County.json',
          parcels: [],
                setupFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                      d3.select(parcel.path)
                        .style('fill', 'transparent')
                        .style('opacity', (this.active) ? 0.85 : 0.0)
                        .style('stroke', this.borderColor)
                        .style('stroke-width', (this.borderWidth+5) + 'px');
                  });
                },
                updateFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                    let layerattribute = parcel.properties.type;//divide based on layer attribute 

                        d3.select(parcel.path)
                          .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
                          .style('opacity', this.active ? 1 : 0.0)
                          .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                          .style('stroke-width', (this.borderWidth+5) + 'px');
                  });
                },
        },//end Road layer
          {//Start Hunting Area Layer.
          //It doesn't sound as cool.
          name: 'huntingzones',
          displayName: 'State Hunting Areas',
          active: false,
          included: true,
          iconPath: 'assets/plans/bigisland/images/icons/pig.png',
          secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
          secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
          fillColor: mapLayerColors.Dod.fill,
          borderColor: mapLayerColors.Dod.border,
          borderWidth: 1,
          legendColor: mapLayerColors.Dod.fill,
          filePath: 'assets/plans/bigisland/layers/Public_Hunting_Areas.json',
          parcels: [],
                setupFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                      d3.select(parcel.path)
                        .style('fill', 'transparent')
                        .style('opacity', (this.active) ? 0.85 : 0.0)
                        .style('stroke', this.borderColor)
                        .style('stroke-width', (this.borderWidth) + 'px');
                  }); 
                },
                updateFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {

                        d3.select(parcel.path)
                          .style('fill', '#e63900')//set to Colors if fill wanted, otherwise transparent
                          .style('opacity', this.active ? 0.85 : 0.0)
                          .style('stroke','white' )//set to borderColors if borders wanted otherwise this.bordercolor
                          .style('stroke-width', (this.borderWidth)  + 'px');
                  });
                },

        },// ending hunting 
        
          {//Start Hunting Area Layer.
          //It doesn't sound as cool.
          name: 'trails',
          displayName: 'Na Ala Hele Trails',
          active: false,
          included: true,
          iconPath: 'assets/plans/bigisland/images/icons/pig.png',
          secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
          secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
          fillColor: mapLayerColors.Dod.fill,
          borderColor: '#F79F19',
          borderWidth: 3,
          legendColor: mapLayerColors.Dod.fill,
          filePath: 'assets/plans/bigisland/layers/Na_Ala_Hele_Trails.json',

          parcels: [],
                setupFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                      d3.select(parcel.path)
                        .style('fill', 'transparent')
                        .style('opacity', (this.active) ? 0.85 : 0.0)
                        .style('stroke', this.borderColor)

                        .style('stroke-width', (this.borderWidth) + 'px');
                  });
                },
                updateFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                        d3.select(parcel.path)
                          .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
                          .style('opacity', this.active ? 1 : 0.0)
                          .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                          .style('stroke-width', this.borderWidth + 'px');
                  });
                }, 
        },
        {//Elevation
          //It sounds cool.
          name: 'elevation100ft',
          displayName: 'Elevation Contours 100ft',
          active: false,
          included: false,
          iconPath: 'assets/plans/bigisland/images/icons/elevation-icon.png',
          secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
          secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
          fillColor: mapLayerColors.Test2019.fill,     //See defaultColors.ts.
          borderColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
          borderWidth: 0.04,  //Border width, default is set here.
          legendColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
          filePath: 'assets/plans/bigisland/layers/elevation100.json',
          parcels: [],
                setupFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                      d3.select(parcel.path)
                        .style('fill', 'transparent')
                        .style('opacity', (this.active) ? 0.85 : 0.0)
                        .style('stroke', this.borderColor)
                        .style('stroke-width', (this.borderWidth+5) + 'px');
                  });
                },
                updateFunction(planService: PlanService) {
                  this.parcels.forEach(parcel => {
                        d3.select(parcel.path)
                          .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
                          .style('opacity', this.active ? 1 : 0.0)
                          .style('stroke','#FFFFFF' )//set to borderColors if borders wanted otherwise this.bordercolor
                          .style('stroke-width', this.borderWidth + 'px');
                  });
                },
        },//end 100ft elevation 
        {//Remove Layers
          //It sounds cool.
          name: 'remove layers',
          displayName: 'Remove Layers',
          active: false,
          included: true,
          iconPath: 'assets/plans/bigisland/images/icons/cross-icon.png',
          secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
          secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
          fillColor: mapLayerColors.Test2019.fill,     //See defaultColors.ts.
          borderColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
          borderWidth: 0.04,  //Border width, default is set here.
          legendColor: mapLayerColors.Test2019.border, //See defaultColors.ts.
          filePath: '',
          parcels: [],
                setupFunction(planService: PlanService) {
                },
                updateFunction(planService: PlanService) {
                  planService.removeAllLayers();
                },
        },//end removelayer

    ],
  }
}
