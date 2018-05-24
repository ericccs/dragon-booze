/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
// import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import './shared-styles.js';

class BoozeCollectorView extends PolymerElement {
    static get template() {
        return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <div class="circle">1</div>
        <h1>Booze Collector</h1>
        <div>
            <paper-dropdown-menu label="Choose you booze">
                <paper-listbox slot="dropdown-content" selected="1">
                    <paper-item>Honey Lemon</paper-item>
                    <paper-item>Sparkling Honey Sour Plum</paper-item>
                </paper-listbox>
            </paper-dropdown-menu>
            
        </div>
        
      </div>
    `;
    }
}

window.customElements.define('booze-collector-view', BoozeCollectorView);
