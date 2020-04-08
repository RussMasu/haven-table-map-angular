import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';
import { ParseSourceFile } from '@angular/compiler';

export const BigIslandPlan: Plan = {
  name: 'bigisland',
  displayName: 'Big Island',
  landingImagePath: 'assets/plans/bigisland/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/backgrounds/LandingPreview.jpg',
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
      left: '25vw',
      top: '8vh'
    },
    legend: {
      defaultLayout: 'grid',
      grid: {
        left: '24vw',
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
        left: 'calc(100vw - 350px)',
        top: '35vh'
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

       {//Remove Layers
        name: 'remove layers',
        displayName: 'Remove Layers',
        active: false,
        included: true,  
        legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
        iconPath: 'assets/plans/bigisland/images/icons/cross-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/backgrounds/LandingPreview.jpg',
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
      {  
        name: 'Elevation',  //Internal layer name
        displayName: 'Elevation Contours 500ft',  //Display name (on the table.)
        active: false,  //Default for active (visible) status
        included: true,   //Default for inclusion in the layer list
        iconPath: 'assets/plans/bigisland/images/icons/elevation-icon.png',  //Icon path for table.
        legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
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
        legendImagePath: 'assets/plans/bigisland/images/legends/StreamsLegend.png',
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
        name: 'firerisk',
        displayName: 'Fire Risk Zones',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/fire.png',
        legendImagePath: 'assets/plans/bigisland/images/legends/Fire.png',
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
		{//start Flood Hazard layer turn off bigislandborder
		name: 'Flood Hazard', //display name
		displayName: 'Flood Hazard',//display name
		active: false,
		included: true,//enable-disable layer
		iconPath: 'assets/plans/bigisland/images/icons/stream-icon.png',//controls icon image for layer
		legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
		secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
		secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
		fillColor: '#ff0066',
		borderColor: '#000000',
		borderWidth: 1,
		legendColor: mapLayerColors.Solar.fill,
		filePath: 'assets/plans/bigisland/layers/floodHazard.json',//set to shapefile link
		parcels: [],
		setupFunction(planService: PlanService) {
		  this.parcels.forEach(parcel => {
			  d3.select(parcel.path)
				.style('fill', 'transparent')
				.style('opacity', (this.active) ? 0.9 : 0.0)
				.style('stroke', this.borderColor)
				.style('stroke-width', this.borderWidth + 'px');
		  });
		},
		updateFunction(planService: PlanService) {
		  this.parcels.forEach(parcel => {
			
			let layerattribute=parcel.properties.fld_zone;

			const colors = {
			  'A': '#ff0000',
			  'AE': '#e0ff02',
			  'X': '#619555',
			  'D':'#646267',
			}

			if (layerattribute == "A"){
			d3.select(parcel.path)
			  .style('fill', colors.A)//'transparent' if no fill is needed, otherwise set to color hex code
			  .style('opacity', this.active ? 1 : 0.0)//controls opacity of layer
			  .style('stroke', colors.A)//controls bordercolor - accepts color hex code
			  .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
		  }
		  else if (layerattribute == "AE"){
			d3.select(parcel.path)
			  .style('fill', colors.AE)//'transparent' if no fill is needed, otherwise set to color hex code
			  .style('opacity', this.active ? 1 : 0.0)//controls opacity of layer
			  .style('stroke', colors.AE)//controls bordercolor - accepts color hex code
			  .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
		  }
		  else if (layerattribute == "X"){
			d3.select(parcel.path)
			  .style('fill', colors.X)//'transparent' if no fill is needed, otherwise set to color hex code
			  .style('opacity', this.active ? 0.6 : 0.0)//controls opacity of layer
			  .style('stroke', 'transparent')//controls bordercolor - accepts color hex code
			  .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
		  }
		  else if (layerattribute == "D"){
			d3.select(parcel.path)
			  .style('fill', colors.D)//'transparent' if no fill is needed, otherwise set to color hex code
			  .style('opacity', this.active ? 0.6 : 0.0)//controls opacity of layer
			  .style('stroke', '#000000')//controls bordercolor - accepts color hex code
			  .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
		  }

		  });
		},
	  },//end Flood Hazard layer

      {//start Palila layer
        name: 'Palila Critical Habitat', //display name
        displayName: 'Palila Critical Habitat',//display name
        active: false,
        included: true,//enable-disable layer
        iconPath: 'assets/plans/bigisland/images/icons/palila-icon.png',//controls icon image for layer
        legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
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
                .style('opacity', (this.active) ? 0.9 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            
            d3.select(parcel.path)
              .style('fill', '#f0cd1f')//'transparent' if no fill is needed, otherwise set to color hex code
              .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
              .style('stroke', 'white')//controls bordercolor - accepts color hex code
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
            

          });
        },
      },//end paalia layer

      {//start vegetation layer
      name: 'vegetation', //display name
      displayName: 'Vegetation',//display name
      active: false,
      included: true,//enable-disable layer
      iconPath: 'assets/plans/bigisland/images/icons/palila-icon.png',//controls icon image for layer
      legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
      secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
      secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
      fillColor: '#ff0066',
      borderColor: '#ffffff',
      borderWidth: 0.2,
      legendColor: mapLayerColors.Solar.fill,
      filePath: 'assets/plans/bigisland/layers/veg.json',//set to shapefile link
      parcels: [],
      setupFunction(planService: PlanService) {
        this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', 'transparent')
              .style('opacity', (this.active) ? 0.9 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', this.borderWidth + 'px');
        });
      },
      updateFunction(planService: PlanService) {
        this.parcels.forEach(parcel => {
          
          let layerattribute = parcel.properties.env;//divide based on layer attribute 
              const colors = {
                'Wet Habitat Species':'#367ead',
                'Mesic (Moist)Habitat Species': '#09e343',
                'Dry Habitat Species': '#ed9128',
              }

              if(layerattribute=="M"){
                  d3.select(parcel.path)
                    .style('fill', colors["Mesic (Moist)Habitat Species"])//set to Colors if fill wanted, otherwise transparent
                    .style('opacity', this.active ? 0.6 : 0.0)
                    .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                    .style('stroke-width', (this.borderWidth) + 'px');
              }
              else if(layerattribute=="W"){
                d3.select(parcel.path)
                  .style('fill', colors["Wet Habitat Species"])//set to Colors if fill wanted, otherwise transparent
                  .style('opacity', this.active ? 0.6 : 0.0)
                  .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                  .style('stroke-width', (this.borderWidth) + 'px');
            }
            else if(layerattribute=="D"){
              d3.select(parcel.path)
                .style('fill', colors["Dry Habitat Species"])//set to Colors if fill wanted, otherwise transparent
                .style('opacity', this.active ? 0.6 : 0.0)
                .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                .style('stroke-width', (this.borderWidth) + 'px');
          }
          

        });
      },
    },//end vegetation layer

    {//Start Volcano
      name: 'volcanohazard',
      displayName: 'Volcano Lava Flow Hazard Zones',
      active: false,
      included: true,
      iconPath: 'assets/plans/bigisland/images/icons/fire.png',
      legendImagePath: 'assets/plans/bigisland/images/legends/LavaFlowHazardLegend.png',
      secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
      secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
      fillColor: mapLayerColors.Dod.fill,
      borderColor: 	'#000000',
      borderWidth: 0.5,
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
              const colors = {
                'zone9': '#186a3b',
                'zone8': '#009704',
                'zone7': '#47ff3f',
                'zone6': '#DAF7A6',
                'zone5': '#ffd101',
                'zone4': '#FF5733',
                'zone3': '#e30000',
                'zone2': '#900C3F',
                'zone1': '#581845',
              }

              this.parcels.forEach(parcel => {
                let vhzone = parcel.properties.vhzones_id;//divide based on layer attribute 

                    if(vhzone == 1){
                      d3.select(parcel.path)
                        .style('fill', colors.zone9)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 2){
                      d3.select(parcel.path)
                        .style('fill', colors.zone8)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 3){
                      d3.select(parcel.path)
                        .style('fill', colors.zone7)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 4){
                      d3.select(parcel.path)
                        .style('fill', colors.zone4)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 5){
                      d3.select(parcel.path)
                        .style('fill', colors.zone3)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 6){
                      d3.select(parcel.path)
                        .style('fill', colors.zone2)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 7){
                      d3.select(parcel.path)
                        .style('fill', colors.zone3)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 8){
                      d3.select(parcel.path)
                        .style('fill', colors.zone3)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 9){
                      d3.select(parcel.path)
                        .style('fill', colors.zone2)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 10){
                      d3.select(parcel.path)
                        .style('fill', colors.zone1)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 11){
                      d3.select(parcel.path)
                        .style('fill', colors.zone6)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 12){
                      d3.select(parcel.path)
                        .style('fill', colors.zone2)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 13){
                      d3.select(parcel.path)
                        .style('fill', colors.zone1)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 14){
                      d3.select(parcel.path)
                        .style('fill', colors.zone2)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 15){
                      d3.select(parcel.path)
                        .style('fill', colors.zone5)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 16){
                      d3.select(parcel.path)
                        .style('fill', colors.zone3)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 17){
                      d3.select(parcel.path)
                        .style('fill', colors.zone3)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
                    if(vhzone == 18){
                      d3.select(parcel.path)
                        .style('fill', colors.zone6)
                        .style('opacity', this.active ? 0.40 : 0.0)
                        .style('stroke',this.borderColor )
                        .style('stroke-width', (this.borderWidth)  + 'px');
                    }
              });
            },
    },//end volcano layer
    
    {//Start Road
      name: 'majorroads',
      displayName: 'Major Roads Hawaii County',
      active: false,
      included: true,
      iconPath: 'assets/plans/bigisland/images/icons/fire.png',
      legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
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
    name: 'huntingzones',
    displayName: 'State Hunting Areas',
    active: false,
    included: true,
    iconPath: 'assets/plans/bigisland/images/icons/pig.png',
    legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
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
                  .style('opacity', (this.active) ? 0.50 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width', (this.borderWidth) + 'px');
            }); 
          },
          updateFunction(planService: PlanService) {
            this.parcels.forEach(parcel => {

                  d3.select(parcel.path)
                    .style('fill', '#e63900')//set to Colors if fill wanted, otherwise transparent
                    .style('opacity', this.active ? 0.50 : 0.0)
                    .style('stroke','white' )//set to borderColors if borders wanted otherwise this.bordercolor
                    .style('stroke-width', (this.borderWidth)  + 'px');
            });
          },

  },// ending hunting 
        
  {//Start trails Layer.
  name: 'trails',
  displayName: 'Na Ala Hele Trails',
  active: false,
  included: true,
  iconPath: 'assets/plans/bigisland/images/icons/pig.png',
  legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
  secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
  secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
  fillColor: mapLayerColors.Dod.fill,
  borderColor: '#eacaff',
  borderWidth: 3,
  legendColor: mapLayerColors.Dod.fill,
  filePath: 'assets/plans/bigisland/layers/Na_Ala_Hele_Trails.json',

  parcels: [],
        setupFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.90 : 0.0)
                .style('stroke', this.borderColor)

                .style('stroke-width', (this.borderWidth) + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
                d3.select(parcel.path)
                  .style('fill', 'transparent')//set to Colors if fill wanted, otherwise transparent
                  .style('opacity', this.active ? 0.90 : 0.0)
                  .style('stroke',this.borderColor )//set to borderColors if borders wanted otherwise this.bordercolor
                  .style('stroke-width', this.borderWidth + 'px');
          });
        }, 
},//end trails layer

        {//Start Parcels Layer.
        name: 'parcels',
        displayName: 'Hawaii Tax Parcels',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/pig.png',
        legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
        secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: 'transparent',
        borderWidth: 3,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/bigisland/layers/Parcels__Hawaii_County.json',
        parcels: [],
              setupFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                    d3.select(parcel.path)
                      .style('fill', 'transparent')
                      .style('opacity', (this.active) ? 0.40 : 0.0)
                      .style('stroke', this.borderColor)
                      .style('stroke-width', (this.borderWidth) + 'px');
                });
              },
              updateFunction(planService: PlanService) {
                this.parcels.forEach(parcel => { 
                        
        const PITTColors = {
              "Residential" : "blue",
              "Apartment" : "teal",
              "Commercial" : "orange",
              "Industrial" : "red",
              "Agricultural / Forest" : "green",
              "Hotel and Resort" : "white",
              "Homeowner" : "blue",
              "Multiple" : "grey"
            }
            let code = parcel.properties.pittcode;

            if(code == 100)
            {
              d3.select(parcel.path)
              .style('fill', PITTColors["Residential"])
              .style('opacity', this.active ? 0.4 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth -2) + 'px');
            }
            if(code == "200")
            {
              d3.select(parcel.path)
              .style('fill', PITTColors["Apartment"])
              .style('opacity', this.active ? 0.4 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth -2) + 'px');
            }
            if(code == "300")
            {
              d3.select(parcel.path)
              .style('fill', PITTColors["Commercial"])
              .style('opacity', this.active ? 0.4 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth-2) + 'px');
            }
                if(code == "400")
                {
                  d3.select(parcel.path)
                  .style('fill', PITTColors["Commercial"])
                  .style('opacity', this.active ? 0.4 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width', (this.borderWidth-2) + 'px');
                }
                if(code == "500")
                {
                  d3.select(parcel.path)
                  .style('fill', PITTColors["Industrial"])
                  .style('opacity', this.active ? 0.4 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width', (this.borderWidth -2) + 'px');
                }
                if(code == "600")
                {
                  d3.select(parcel.path)
                  .style('fill', PITTColors["Agricultural / Forest"])
                  .style('opacity', this.active ? 0.4 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width', (this.borderWidth -2) + 'px');
                }
                if(code == "700")
                {
                  d3.select(parcel.path)
                  .style('fill', PITTColors["Hotel and Resort"])
                  .style('opacity', this.active ? 0.4 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width', (this.borderWidth -2) + 'px');
                }
                if(code == "900")
                {
                  d3.select(parcel.path)
                  .style('fill', PITTColors["Homeowner"])
                  .style('opacity', this.active ? 0.4 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width',  (this.borderWidth -2 ) + 'px');
                }
                if(code == "999"){
                    d3.select(parcel.path)
                      .style('fill', PITTColors["Multiple"])
                      .style('opacity', (this.active) ? 0.40 : 0.0)
                      .style('stroke', this.borderColor)
                      .style('stroke-width',(this.borderWidth -2 ) + 'px');
                }
            if(code == "0"){
                d3.select(parcel.path)
                  .style('fill', 'transparent')
                  .style('opacity', (this.active) ? 0.40 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width', (this.borderWidth -2 ) + 'px');
            }
          });
              }, 
      },//end parcels layer
    
        {//start Ahupuaa layer
          name: 'Ahupuaa', //display name
          displayName: 'Ahupua`as',//display name
          active: false,
          included: true,//enable-disable layer
          iconPath: 'assets/plans/bigisland/images/icons/elevation-icon.png',//controls icon image for layer
          legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
          secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
          secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
          fillColor: '#ff0066',
          borderColor: 'turquoise',
          borderWidth: 3,
          legendColor: mapLayerColors.Solar.fill,
          filePath: 'assets/plans/bigisland/layers/Ahupuaa.json',//set to shapefile link
          parcels: [],
          setupFunction(planService: PlanService) {
            this.parcels.forEach(parcel => {
                d3.select(parcel.path)
                  .style('fill', 'transparent')
                  .style('opacity', (this.active) ? 0.9 : 0.0)
                  .style('stroke', this.borderColor)
                  .style('stroke-width', this.borderWidth + 'px');
            });
          },
          updateFunction(planService: PlanService) {
            this.parcels.forEach(parcel => { 
              d3.select(parcel.path)
                .style('fill', 'transparent')//'transparent' if no fill is needed, otherwise set to color hex code
                .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                .style('stroke', this.borderColor)//controls bordercolor - accepts color hex code
                .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
              

            });
          },
        },//end ahupuaa layer
            {//start critical habitat layer
              name: 'critcalplant', //display name
              displayName: 'Plants Critical Habitat',//display name
              active: false,
              included: true,//enable-disable layer
              iconPath: 'assets/plans/bigisland/images/icons/palila-icon.png',//controls icon image for layer
              legendImagePath: 'assets/plans/bigisland/images/icons/null.png',
              secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
              secondScreenText: 'Slide the Layer Puck to add or remove this layer.',
              fillColor: '#ff0066',
              borderColor: '#ffffff',
              borderWidth: 0.5,
              legendColor: mapLayerColors.Solar.fill,
              filePath: 'assets/plans/bigisland/layers/Big_Island_Critical_Habitat__Plant.json',//set to shapefile link
              parcels: [],
              setupFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                    d3.select(parcel.path)
                      .style('fill', 'transparent')
                      .style('opacity', (this.active) ? 0.9 : 0.0)
                      .style('stroke', this.borderColor)
                      .style('stroke-width', this.borderWidth + 'px');
                });
              },
              updateFunction(planService: PlanService) {
                this.parcels.forEach(parcel => {
                 
                  let species = parcel.properties.species;

                  if (species == "Argyroxiphium kauense"){
                    d3.select(parcel.path)
                    .style('fill', 'red')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Bonamia menziesii"){
                    d3.select(parcel.path)
                    .style('fill', 'pink')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Clermontia lindseyana"){
                    d3.select(parcel.path)
                    .style('fill', 'magenta')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Clermontia peleana"){
                    d3.select(parcel.path)
                    .style('fill', 'green')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Clermontia pyrularia"){
                    d3.select(parcel.path)
                    .style('fill', 'blue')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Colubrina oppositifolia"){
                    d3.select(parcel.path)
                    .style('fill', '#purple')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Cyanea hamatiflora ssp. carlsonii"){
                    d3.select(parcel.path)
                    .style('fill', 'light blue')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Cyanea platyphylla"){
                    d3.select(parcel.path)
                    .style('fill', 'light purple')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Cyanea shipmanii"){
                    d3.select(parcel.path)
                    .style('fill', 'light green')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Cyanea stictophylla"){
                    d3.select(parcel.path)
                    .style('fill', 'blueviolet')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Cyrtandra giffardii"){
                    d3.select(parcel.path)
                    .style('fill', 'bisque')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Cyrtandra tintinnabula"){
                    d3.select(parcel.path)
                    .style('fill', 'Chartreuse')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Delissea undulata"){
                    d3.select(parcel.path)
                    .style('fill', 'cadetblue')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Hibiscadelphus giffardianus"){
                    d3.select(parcel.path)
                    .style('fill', 'crimson')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Hibiscus brackenridgei"){
                    d3.select(parcel.path)
                    .style('fill', 'DarkOliveGreen')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Neraudia ovata"){
                    d3.select(parcel.path)
                    .style('fill', 'Gainsboro')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Nothocestrum breviflorum"){
                    d3.select(parcel.path)
                    .style('fill', 'LemonChiffon')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Phyllostegia racemosa"){
                    d3.select(parcel.path)
                    .style('fill', 'MediumAquaMarine')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Phyllostegia velutina"){
                    d3.select(parcel.path)
                    .style('fill', 'Moccasin')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Plantago hawaiiensis"){
                    d3.select(parcel.path)
                    .style('fill', 'MistyRose')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Pleomele hawaiiensis"){
                    d3.select(parcel.path)
                    .style('fill', 'papayawhip')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Sicyos alba"){
                    d3.select(parcel.path)
                    .style('fill', 'RosyBrown')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Silene hawaiiensis"){
                    d3.select(parcel.path)
                    .style('fill', 'Teal')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Solanum incompletum"){
                    d3.select(parcel.path)
                    .style('fill', 'Turquoise')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else if (species == "Zanthoxylum dipetalum ssp. tomentosum"){
                    d3.select(parcel.path)
                    .style('fill', 'SeaGreen')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px'); 
                  }else{
                  d3.select(parcel.path)
                    .style('fill', 'IndianRed')//'transparent' if no fill is needed, otherwise set to color hex code
                    .style('opacity', this.active ? 0.9 : 0.0)//controls opacity of layer
                    .style('stroke', 'white')//controls bordercolor - accepts color hex code
                    .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
                  }
                });
              },
            },//end critical plant habitat layer
          ],
        }
      }
