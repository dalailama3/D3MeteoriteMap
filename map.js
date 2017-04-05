$("document").ready(function () {
  $.ajax({
    url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",
    dataType: "json"
  }).done(function (result) {
    console.log(result)


    var width = 900,
        height = 600;

        var projection = d3.geo.mercator()
          .center([0, 5 ])
          .scale(150)
          .rotate([-180,0]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);


    var path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");

    var radiusScaling = d3.scale.linear()
      .domain([0, 1000000])
      .range([2,6])

    // load and display the World
    d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, topology) {
        g.selectAll("path")
          .data(topojson.object(topology, topology.objects.countries)
              .geometries)
        .enter()
          .append("path")
          .attr("d", path)


          //add meteorite dots to map

          g.selectAll(".dot")
            .data(result.features)
            .enter().append("circle")
            // .call(tip)
            .attr("class", "dot")
            .attr("cx", function (d) {

              if (d.geometry) {
                var lat = d.geometry.coordinates[0],
                    lon = d.geometry.coordinates[1];
                return projection([lat, lon])[0] }

            })
            .attr("cy", function (d) {
              if (d.geometry) {
                var lat = d.geometry.coordinates[0],
                    lon = d.geometry.coordinates[1];
                return projection([lat, lon])[1] }

            })
            .attr("r", function (d) {
              if (d.properties.mass) {
                var mass = parseInt(d.properties.mass);

                return radiusScaling(mass)
              }
            })
            .attr("fill", "red")


          // svg.selectAll(".dot")
          //   .data(result.features)
            .on("mouseover", function(d) {   //Add tooltip on mouseover for each circle

         //Get this county's x/y values, then augment for the tooltip
               var xPosition = d3.select(this).attr("x");
               var yPosition = d3.select(this).attr("y");

         //Update the tooltip position and value
              d3.select(".tooltip")
           //Show the tooltip above where the mouse triggers the event
              .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY - 70) + "px")
           //CSV data has been bound to JSON at this point - so values must be referenced from JSON properties
                    .html("<strong>" + d.properties.mass + "</strong>" + "<br/>" + "Fall: " + d.properties.fall)

         //Show the tooltip
            d3.select(".tooltip").classed("hidden", false);

        })
        .on("mouseout", function() {

         //Hide the tooltip
         d3.select(".tooltip").classed("hidden", true);

        })
            // .on("mouseover", tip.show)
            // .on("mouseout", tip.hide)
            // .on("mousemove", function (d, i) {
            //   // console.log(d.properties)
            //   var mouse = d3.mouse(svg.node()).map( function (d) { return parseInt(d); })
            //   var props = d.properties;
            //   tooltip
            //     .classed("hidden", false)
            //     .attr("style", "left:" + (mouse[0] + 25) + "px;top:" + mouse[1] + "px")
            //     .html("<span>" + "Fall: " + props.fall + "</span>")
            // })
            // .on("mouseout", function (d, i) {
            //   tooltip.classed("hidden", true)
            // })
          // $("g .dot").on("mouseover", function () {
          //   console.log(this)
          // })

    });

    //tootip

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var properties = d.properties;
      return "<span>" + properties.mass + "</span>";
    })
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")


    // zoom and pan
    var zoom = d3.behavior.zoom()
        .on("zoom",function() {
            g.attr("transform","translate("+
                d3.event.translate.join(",")+")scale("+d3.event.scale+")");
            g.selectAll("path")
                .attr("d", path.projection(projection));
      });

    svg.call(zoom)



  })
})
