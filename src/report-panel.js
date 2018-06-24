import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import { Dashboard } from "./report-dashboard";

class ReportPanel extends PolymerElement {

    static get template() {
        return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
      </style>

      <div class="card">
        <div id="dashboard"></div>
      </div>
    `;
    }

    ready() {
        super.ready();
        const freqData=[
            {State:'AL',freq:{low:4786, mid:1319, high:249}}
            ,{State:'AZ',freq:{low:1101, mid:412, high:674}}
            ,{State:'CT',freq:{low:932, mid:2149, high:418}}
            ,{State:'DE',freq:{low:832, mid:1152, high:1862}}
            ,{State:'FL',freq:{low:4481, mid:3304, high:948}}
            ,{State:'GA',freq:{low:1619, mid:167, high:1063}}
            ,{State:'IA',freq:{low:1819, mid:247, high:1203}}
            ,{State:'IL',freq:{low:4498, mid:3852, high:942}}
            ,{State:'IN',freq:{low:797, mid:1849, high:1534}}
            ,{State:'KS',freq:{low:162, mid:379, high:471}}
        ];
        let dashboardDiv = this.$.dashboard;
        const dashboard = new Dashboard(dashboardDiv,freqData);
    }



}

window.customElements.define('report-panel', ReportPanel);