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
            .call(tip)
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
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)


    });

    //tootip

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var properties = d.properties;
      return "<span>" + properties.mass + "</span>";
    })


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
