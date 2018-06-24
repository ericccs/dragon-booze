import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
// import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import './shared-styles.js';

class BoozeCollector extends PolymerElement {
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
            <paper-dropdown-menu label="Choose your booze">
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

window.customElements.define("booze-collector", BoozeCollector);
