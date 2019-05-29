import { Component, OnInit, ViewChildren } from '@angular/core';
import { chartColors, mapLayerColors } from '../../../../assets/defaultData/colors';
import { MapMainComponent } from '../../map-main.component';
import { Subject } from 'rxjs';
import { Layer } from '../../../interfaces/layer';
import { MapDataService } from '../../../services/map-data.service';
import { CardStyleDirective } from '../card-style.directive';
import { _ } from 'underscore';

@Component({
  selector: 'app-add-remove-layers',
  templateUrl: './add-remove-layers.component.html',
  styleUrls: ['./add-remove-layers.component.css']
})

export class AddRemoveLayersComponent implements OnInit {

  // Elements with cardStyle directive
  @ViewChildren(CardStyleDirective) cardStyle;

  layers: Layer[]; // Array holding all layers
  nextLayer: Layer; // The next layer to be added or removed.

  constructor(private _mapdataservice: MapDataService) {
    this.layers = this._mapdataservice.getIncludedLayers();
    this.nextLayer = this.layers[0];
  }

  ngOnInit() {
    // Subscribe to changes in the next layer
    this._mapdataservice.nextLayerSubject.subscribe({
      next: value => {
        this.nextLayer = <Layer>value;
        this.updateBackgroundColorActive(<Layer>value);
      }
    });
  }

  /** Changes the background color of a card when it is highlighted as the next
  * layer.  Checks to see if a layer is active.  If it is active, the color has
  * already been changed so no changes are done to that element.
  * @param layer => The layer that is highlighted
  */
  updateBackgroundColorActive(layer): void {
    this.cardStyle.forEach((e) => {
      const nameArray = e.element.nativeElement.id.split('-');
      const layerName = nameArray[2]; // Name of the layer associated with the element
      const color = (layerName === layer.name) ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.6)';
      const height = (layerName === layer.name) ? 100 + '%' : 80 + '%';
      e.setCardHeight(height);
      const singleLayer = _.filter(this.layers, layer => layerName === layer.name);
      if (!singleLayer[0].active) {
        e.changeBackgroundColor(color);
      }
    });
  }

}