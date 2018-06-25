import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class DonutChart extends PolymerElement {

    constructor() {
        super();
        this.svgWidth = "960";
        this.svgHeight = "500";
    }

    static get template() {
        return html`
          <style include="shared-styles">
            :host {
              display: block;
              padding: 10px;
            }
            
            .arc text {
              font: 10px sans-serif;
              text-anchor: middle;
            }
            
            .arc path {
              stroke: #fff;
            }
        
        
          </style>
    
          <div class="card">
            <svg id="piesvg" width="[[svgWidth]]px" height="[[svgHeight]]"></svg>
          </div>
    `;
    }

    static get properties() { return {
        svgWidth : { type: Number },
        svgHeight : { type: Number }
    }}

    ready() {
        super.ready();
        this.data=[
            {"age" : "<5", "population": "2704659"},
            {"age" : "5-13", "population": "4499890"},
            {"age" : "14-17", "population": "2159981"},
            {"age" : "18-24", "population": "3853788"},
            {"age" : "25-44", "population": "14106543"},
            {"age" : "45-64", "population": "8819342"},
            {"age" : "≥65", "population": "612463"}
        ];

        const svg = d3.select(this.$.piesvg)
            .append("g")
            .attr("transform", `translate(${this.svgWidth/2}, ${this.svgHeight/2})`);

    }



}

window.customElements.define('donut-chart', DonutChart);