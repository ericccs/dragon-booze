import * as d3 from "d3";


export class Dashboard {

    constructor(elementId, fData) {
        this.elementId = elementId;
        this.fData = fData;

        this.barColor = 'steelblue';

        // compute total for each state.
        this.fData.forEach((d) => {
            d.total = d.freq.low + d.freq.mid + d.freq.high;
        });

        // calculate total frequency by segment for all state.
        this.tF = ['low','mid','high'].map(d => {
            return {type:d, freq: d3.sum(fData.map(t => t.freq[d]))};
        });

        // calculate total frequency by state for all segment.
        const sF = this.fData.map(d => [d.State,d.total]);

        this.hG = this.histoGram(sF); // create the histogram.
        this.pC = this.pieChart(this.tF); // create the pie-chart.
        this.leg = this.legend(this.tF);  // create the legend.
    }

    segColor(c) {
        return {low: "#807dba", mid: "#e08214", high: "#41ab5d"}[c];
    }

    // function to handle histogram.
    histoGram(fD) {
        let hG = {}, hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 500 - hGDim.l - hGDim.r,
            hGDim.h = 300 - hGDim.t - hGDim.b;

        //create svg for histogram.
        let hGsvg = d3.select(this.elementId).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        let x = d3.scaleBand().rangeRound([0, hGDim.w], 0.1)
            .domain(fD.map(d => d[0]));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.axisBottom(x));

        // Create function for y-axis map.
        let y = d3.scaleLinear().range([hGDim.h, 0])
            .domain([0, d3.max(fD, d => d[1])]);

        // Create bars for histogram to contain rectangles and freq labels.
        let bars = hGsvg.selectAll(".bar").data(fD).enter()
            .append("g").attr("class", "bar");


        const mouseover = (d) => {  // utility function to be called on mouseover.
            // filter for selected state.
            let st = this.fData.filter(s => s.State == d[0])[0],
                nD = d3.keys(st.freq).map(function (s) {
                    return {type: s, freq: st.freq[s]};
                });

            // call update functions of pie-chart and legend.
            this.pC.update(nD);
            this.leg.update(nD);
        }

        const mouseout = (d) => {    // utility function to be called on mouseout.
            // reset the pie-chart and legend.
            this.pC.update(this.tF);
            this.leg.update(this.tF);
        }

        //create the rectangles.
        bars.append("rect")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d[1]))
            .attr("width", x.bandwidth())
            .attr("height", d => hGDim.h - y(d[1]))
            .attr('fill', this.barColor)
            .on("mouseover", mouseover)// mouseover is defined below.
            .on("mouseout", mouseout);// mouseout is defined below.

        //Create the frequency labels above the rectangles.
        bars.append("text").text(d => d3.format(",")(d[1]))
            .attr("x", d => x(d[0]) + x.bandwidth() / 2)
            .attr("y", d => y(d[1]) - 5)
            .attr("text-anchor", "middle");

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function (nD, color) {
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, d => d[1])]);

            // Attach the new data to the bars.
            let bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", d => y(d[1]))
                .attr("height", d => hGDim.h - y(d[1]))
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(d => d3.format(",")(d[1]))
                .attr("y", d => y(d[1]) - 5);
        };
        return hG;
    }

    // function to handle pieChart.
    pieChart(pD) {
        const pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(this.elementId).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.pie().sort(null).value(d => d.freq);

        // Utility function to be called on mouseover a pie slice.
        const mouseover = (d) => {
            // call the update function of histogram with new data.
            this.hG.update(this.fData.map(v => [v.State,v.freq[d.data.type]]), this.segColor(d.data.type));
        };
        //Utility function to be called on mouseout a pie slice.
        const mouseout = (d) => {
            // call the update function of histogram with all data.
            this.hG.update(this.fData.map(v => [v.State,v.total]), this.barColor);
        };

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(d => this._current = d)
            .style("fill", d => this.segColor(d.data.type))
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = nD => {
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        };


        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        const arcTween = (a) => {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return t => arc(i(t));
        };
        return pC;
    }

    // function to handle legend.
    legend(lD) {
        let leg = {};

        // create table for legend.
        let legend = d3.select(this.elementId).append("table").attr('class','legend');

        // create one row per segment.
        let tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
            .attr("fill", d => this.segColor(d.type));

        // create the second column for each segment.
        tr.append("td").text(d => d.type);

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(d => d3.format(",")(d.freq));


        const getLegend = (d,aD) => d3.format("%")(d.freq/d3.sum(aD.map(v => v.freq))); // Utility function to compute percentage.

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(d => getLegend(d,lD));

        // Utility function to be used to update the legend.
        leg.update = (nD) => {
            // update the data attached to the row elements.
            let l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(d => d3.format(",")(d.freq));

            // update the percentage column.
            l.select(".legendPerc").text(d => getLegend(d,nD));
        };

        return leg;
    }
}
