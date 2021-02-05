
var urlParams = new URLSearchParams(window.location.search);

graphFileUrl = 'https://edwinlee44.github.io/test/'
ondemand = urlParams.get('ondemand')


otherNodesVisible = true
depMatrix = {}
nodeIdsInSubGraph = []
remoteBrowseMode= false
inputRepo = ""

deleteInstructionsExist = false
jobAuditExist = false
minUsage = 0
maxUsage = 0
remoteRepoPathExist = false
deleteInstructions = {}
repoPath = ""
graphFor = ""

currentNode = null
stepMode = false
stepModeLimit = 50

//// simulation
var gCount = 0;
var nCount = 0;
var eCount = 0;
var svg, width, height, force, drag;
var chartDiv = document.getElementById("chart");
var jsonData;
var nodesWithDepth = 0;
var nodesWithExportable = 0;
var yForces = {};
var hierarchyMode = false;
var showLabelMode = false;
var depthBasedHierarchy = false;  //useful mode to spread nodes vertically on screen based on node 'metadata.depth'. if false, this will cause nodes to spread based on their type.
var nodesInSearchResults = "";
var toast;

var divNodeTooltip, divGraphTooltip, divEdgeTooltip, divJsonTooltip, divGmlTooltip, divCmfTooltip, divWarnTooltip
var legend = {};
var depths = [];
var sortedLegend = [];

var node, link, nds, lks;
var nodes = []
var links = []


////////////// here you go! //////////////

go()

///////////////////////////////////////////
////////// Load Data from Graph  //////////
///////////////////////////////////////////
async function go(){

    if (graphFileUrl != null) {
        //get data
        const graph = await getGraphFromFile(graphFileUrl)

        // load data in graph and draw
        loadGraph(graph);

    }

    // if remote repo exists, then get files list from remote, else get files list from local
    // example of valid call: GET https://stash.murex.com/rest/api/1.0/projects/rop/repos/mxpress/browse/cva/graphs
    windowHost = window.location.host
    if (remoteRepoPathExist && windowHost.indexOf('localhost:') == -1) {
         loc = new URL(remoteRepoPath)
         filesUrl = loc
         loca = "remote"
     }
    // prompt user to enter remote repo path
    else if (remoteRepoPathExist == false && windowHost.indexOf('localhost:') == -1)
    {
         remoteBrowseMode = true
         filesUrl = await Swal.fire({
               type:  'question',
               title: 'Enter remote repo URL',
               input: 'text',
               inputAttributes: {
                 autocapitalize: 'off'
               },
               showCancelButton: true,
               confirmButtonText: 'Get available graphs',
               showLoaderOnConfirm: true,
                 preConfirm: (input) => {
                   loc = new URL(input)
                   inputRepo = input.trim()
                   filesUrl = loc
                   return fetch(filesUrl)
                     .then(response => {
                       if (!response.ok) {
                         throw new Error(response.statusText)
                       }
                       return filesUrl.trim()
                     })
                     .catch(error => {
                       Swal.showValidationMessage(
                         "Invalid url or repo doesn't contain a 'graphs' folder' "
                       )
                     })
                 },
                 allowOutsideClick: () => !Swal.isLoading()
             }).then((result) => {
               if (result.value) {
                  Swal.fire({
                   type: 'success',
                   title: 'Files loaded',
                   text: 'Now you can Select a graph file...'
                 })
                  return result.value
               }
             })
         loca = "remote"
    }
    else
    {
        filesUrl = "graphs"
        loca = "local"
    }
    //get list of graph files in graphs/ folder & update drop down
     if (loca == "local") {
        const done = await getGraphFilesList(filesUrl, loca)
        }
     else
     {
        var page = await getGraphFilesList(filesUrl, loca)
        while (page.isLastPage != true)
        {
            page = await getGraphFilesList(filesUrl+"?start="+page.nextPageStart, loca)
        }

     }
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('val', graphFileUrl);

}

function getGraphFilesList(url, location){
    return new Promise((resolve, reject) => {
    $.ajax({
        url: url,
        beforeSend: function( xhr ) {
            xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        },
        success: function(data){

            var $dropdown = $("#graphDropdown");

            if (location == "local") {
                var html = $.parseHTML(data)
                $html = $(html)
                $files = $html.find('a');
                $files.each(function() {
                  $dropdown.append($("<option />").val("graphs/"+$(this).text()).text($(this).text()));
                });

                 $(function() {

                   $('.selectpicker').on('change', function(){
                     var selected = $(this).val();

                     window.location.href = "http://localhost:8787/index.html?graphFile="+selected;

                   });

                 });
            resolve("list loaded")
            }
            else {
                allRemoteFiles = JSON.parse(data).children;
                filteredFiles = []
                for(var i = 0; i < allRemoteFiles.values.length; i++) {
                    var obj = allRemoteFiles.values[i];
                    if (obj.type == "FILE")
                    {
                        var file = obj.path;
                        if (file.extension == "json")
                            filteredFiles.push(file.name)
                    }
                }
                filteredFiles.forEach(function(filename){
                    if (remoteBrowseMode){
                        // get raw file url based on repo browse url (input from user)
                        fileUrl = /^.*repos\/[\w-]+/g.exec(inputRepo)[0] + "/raw/" + /[\w-]+$/g.exec(inputRepo)[0]+ "/graphs/" + filename;
                    }
                    else{
                        // get raw file path based of currently loaded graphFile, remove the filename, and add this new one
                        fileUrl = /^.*\//g.exec(graphFileUrl)[0] + filename;
                    }

                    $dropdown.append($("<option />").val(fileUrl).text(filename));
                });

                $(function() {

                   $('.selectpicker').on('change', function(){
                     var selected = $(this).val();

                     window.location.href = "https://stash.murex.com/pages/REP/clint/master/browse/clint/graphman/index.html?graphFile="+selected;

                   });

                 });

            pagination = {"isLastPage" : allRemoteFiles.isLastPage}

            if(allRemoteFiles.hasOwnProperty('nextPageStart')){
             pagination.nextPageStart = allRemoteFiles.nextPageStart
            }

            resolve(pagination)
            }


        },
        error: function(jqXHR, textStatus, errorThrown){

            Swal.fire({
               type: 'error',
               title: 'graphs/ folder not found',
               html: "<textarea rows='4' cols='50' disabled>Can't list all available graphs in " + url + ":<br>"+ "Error code: <b>"+jqXHR.status+"</b><br><br>"+jqXHR.responseText+"</textarea>"
             })

             reject("Can't find graphs folder")
          }
	});
})
}

function getGraphFromFile(url){
    return new Promise((resolve, reject) => {
	$.ajax({
	   type: "GET",
	   url: url,
       contentType: "application/json; charset=utf-8",
	   dataType: "json",
	   success: function(res){
                //cool, load the graph and draw it
                resolve(res)
            },
       error: function(jqXHR, textStatus, errorThrown){

            Swal.fire({
               type: 'error',
               title: 'JSON Graph file not found!',
               html: "<textarea rows='4' cols='50' disabled>The provided file " + url + " doesn't exist</textarea>"
             })

             d3.selectAll('#repoLabel').style("visibility", "hidden").html("");
             d3.selectAll('#remoteRepoLabel').style("visibility", "hidden").html("");
             d3.selectAll('#countLabel').style("visibility", "hidden").html("");

             reject("Can't find graph at the provided url")
       }
	});
})
}

function loadGraph(response){
        //before pushing to simulation, make copy of the JSON Graph so it can be shown to user
        //as json without the D3 simulation params added later on.
        jsonData = JSON.parse(JSON.stringify(response));
        nds = JSON.parse(JSON.stringify(response.graphs[0].nodes))
        lks = JSON.parse(JSON.stringify(response.graphs[0].edges))
        nCount = response.graphs[0].nodes.length;
        eCount = response.graphs[0].edges.length;
        gCount = response.graphs.length;
        if (response.graphs[0]['metadata'])
        {
            //mandatory
            if(response.graphs[0]['metadata'].hasOwnProperty('repoPath')){
                repoPath = response.graphs[0]['metadata']['repoPath']
            }

            //optional
            if(response.graphs[0]['metadata'].hasOwnProperty('remoteRepoPath'))
            {
                remoteRepoPathExist = true
                remoteRepoPath = response.graphs[0]['metadata']['remoteRepoPath']
            }

            //mandatory
            if(response.graphs[0]['metadata'].hasOwnProperty('graphFor')){
                graphFor = response.graphs[0]['metadata']['graphFor']
                generatedOn = response.graphs[0]['metadata']['generated']
            }

            //mandatory
            if(response.graphs[0]['metadata'].hasOwnProperty('objectPaths'))
            {
                repoPathsExist = true
                repoPaths = response.graphs[0]['metadata']['objectPaths']
            }

            //optional
            if(response.graphs[0]['metadata'].hasOwnProperty('deleteInstructions'))
            {
                deleteInstructionsExist = true
                deleteInstructionsFor = response.graphs[0]['metadata']['deleteInstructions']['for']
                deleteInstructions = response.graphs[0]['metadata']['deleteInstructions']['instructions']
            }

            //optional
            if(response.graphs[0]['metadata'].hasOwnProperty('objectUsageAudit'))
            {
                jobAuditExist = true
                minUsage =  response.graphs[0]['metadata']['objectUsageAudit']['minUsage']
                maxUsage =  response.graphs[0]['metadata']['objectUsageAudit']['maxUsage']
            }

        }


        if(nCount == 0 || eCount ==0 || gCount == 0)
        {
            Swal.fire({
               type: 'error',
               title: 'Partial response!',
               html: "The graph response doesn't contain enough data<br><br>Graphs: <b>"+gCount+"</b>, Nodes: <b>"+nCount+"</b>, Edges: <b>"+eCount+"</b><br><br><textarea rows='5' cols='50' disabled>"+JSON.stringify(response, null, 1)+"</textarea>"
             })
        }
        else
        {

            // initialize canvas, simulation and model
            buildDepMatrix(response.graphs[0].edges)

            // normal or step-mode
            if (nCount > stepModeLimit) {

                Swal.fire({
                  title: "Graph is too big!",
                  type: "info",
                  html: "This graph has too many nodes to be displayed at once in a usable and efficient way (" + nCount + " nodes exceed '" + stepModeLimit + "' node limit).<br><br>You can '<b>Load all</b>' nodes anyway or instead, load them '<b>On-demand</>'</b>? <br><br> In the latter mode, first use the 'search' functionality to find & load the nodes of interest, then select & traverse each node dependencies using keyboard arrow keys: <br><br> <div><table width='100%'>  <tr>    <th style='text-align:right;width:40%'><img src='resources/left.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>incoming nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/right.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>outgoing nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/up.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>upstream nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/down.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>downstream nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/delete.png' width='32' height='32'</th>    <th style='text-align:left;font-weight: normal;width:60%'>delete node</th>  </tr></table></div> <br><br> Use 'Shift' key in conjunction with arrow keys to perform recursive traversals (i.e neighbours of neighbours)<br><br> Shift+D delete non-connected nodes, except current node ",
                  showCancelButton: true,
                  confirmButtonText: "Load On-demand",
                  confirmButtonColor: "#0ad13c",
                  cancelButtonText: "Load all",
                  cancelButtonColor: "#DD6B55",
                  allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        stepMode = true
                        setupCanvas()
                        update();
                        toast.fire({
                            type: 'info',
                            title: "Graph is loaded in 'On-demand' mode"
                          })

                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        stepMode = false
                        nodes = response.graphs[0].nodes
                        links = response.graphs[0].edges
                        setupCanvas()
                        update();
                        toast.fire({
                            type: 'info',
                            title: "All nodes have been loaded"
                          })
                    }
                  });

            }
            else if (ondemand != null && ondemand == "true"){

                    Swal.fire({
                      title: "Load in 'On-demand' mode?",
                      type: "info",
                      html: "In this mode, first use the 'search' functionality to find & load the nodes of interest, then select & traverse each node dependencies using keyboard arrow keys: <br><br><div><table width='100%'>  <tr>    <th style='text-align:right;width:40%'><img src='resources/left.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>incoming nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/right.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>outgoing nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/up.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>upstream nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/down.png' width='32' height='32'></th>    <th style='text-align:left;font-weight: normal;width:60%'>downstream nodes</th>  </tr>  <tr>    <th style='text-align:right;width:40%'><img src='resources/delete.png' width='32' height='32'</th>    <th style='text-align:left;font-weight: normal;width:60%'>delete node</th>  </tr></table></div><br><br> Use 'Shift' key in conjunction with arrow keys to perform recursive traversals (i.e neighbours of neighbours)",
                      showCancelButton: true,
                      confirmButtonText: "Load On-demand",
                      confirmButtonColor: "#0ad13c",
                      cancelButtonText: "Load all",
                      cancelButtonColor: "#DD6B55",
                      allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            stepMode = true
                            setupCanvas()
                            update();
                            toast.fire({
                                type: 'info',
                                title: "Graph is loaded in 'On-demand' mode"
                              })

                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            stepMode = false
                            nodes = response.graphs[0].nodes
                            links = response.graphs[0].edges
                            setupCanvas()
                            update();
                            toast.fire({
                                type: 'info',
                                title: "All nodes have been loaded"
                              })
                        }
                      });

            }
            else {
                stepMode = false
                nodes = response.graphs[0].nodes
                links = response.graphs[0].edges
                setupCanvas()
                update();
            }
        }

}


////////////////////////////////
///////// Setup & Draw  ////////
////////////////////////////////

function setupCanvas(){

d3.selectAll('#countLabel').style("visibility", "visible").text("Nodes:" + nCount + ", Edges: "+eCount);
let myRe = /[A-Za-z0-9_\-\s]+.json/;
var myArray = myRe.exec(graphFileUrl);
d3.selectAll('#repoLabel').style("visibility", "visible").html("Local Repo: <b>" + repoPath + "<b>");
if (remoteRepoPathExist)
    d3.selectAll('#remoteRepoLabel').style("visibility", "visible").html("Remote Repo: <b>" + remoteRepoPath + "<b>");


//add listener for search bar
$("#inpt_search").on('focus', function () {
    $(this).parent('label').addClass('active');
});

$("#inpt_search").on('blur', function () {
    if($(this).val().length == 0)
     {
        $(this).parent('label').removeClass('active');
        searchGraph("");
        d3.selectAll("#inpt_search").style("color","#333333");
        d3.selectAll("#cntCircle").style("visibility","hidden")
                                    .text("");
     }
});

$("#inpt_search").on('keyup', function (e) {
         if (e.keyCode == 13) {
             searchGraph($(this).val());
         }

         if (e.keyCode == 27) {
             $(this).val('');
             searchGraph($(this).val());
         }

});

d3.select("#inpt_search")
    .on("click", function(){
       if (d3.event.ctrlKey)
        {

             var hiddenElement = document.createElement('a');
             hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(nodesInSearchResults);
             hiddenElement.target = '_blank';
             hiddenElement.download = 'nodesInSearchResults.txt';
             hiddenElement.click();
        }
        if($(this).val() == "Search...")
        {
            $(this).select();
        }
        });

    //cleanup pop-divs when a request is sent
    d3.selectAll(".jsonDiv,.gmlDiv,.cmfDiv,.tooltip,.warningDiv").html("").style("opacity", 0);
    $('#hierarchyBox').prop('checked', false);
    $('#showLabelBox').prop('checked', false);
    $('#collapsible').prop('checked', false);

    d3.selectAll("#hSlider").style("visibility","visible");
    d3.selectAll("#selectGraph").style("visibility","hidden");


    ////////// svg  //////////
    svg = d3.select(chartDiv).append("svg")

    width = chartDiv.clientWidth;
    height = chartDiv.clientHeight;

    svg
      .attr("width", width)
      .attr("height", height);

    ////////// tooltips  //////////

    // Define the div for the tooltip
    divNodeTooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    divGraphTooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Define the div for the tooltip
    divEdgeTooltip= d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // Define the div for the json
    divJsonTooltip= d3.select("body").append("div")
    .attr("class", "jsonDiv")
    .style("opacity", 0);


    // Define the div for the GML
    divGmlTooltip= d3.select("body").append("div")
    .attr("class", "gmlDiv")
    .style("opacity", 0);

    // Define the div for the CMF list of objects
    divCmfTooltip= d3.select("body").append("div")
    .attr("class", "cmfDiv")
    .style("opacity", 0);

    // Define the div for the warnings list of
    divWarnTooltip= d3.select("body").append("div")
    .attr("class", "warningDiv")
    .style("opacity", 0);



    for(var i in nds)
    {
        if(legend.hasOwnProperty(nds[i].type)) {
            legend[nds[i].type].nodeCount += 1;
        }
        else
         {
          legend[nds[i].type] = {};
          legend[nds[i].type].nodeCount = 1;

         }

         //check if node has metadata.depth property (used later to show(or not) the checkbox 'Force data-stream hierarchy''
         if(checkNested(nds[i],"metadata","depth")){

             if(depths.indexOf(parseInt(nds[i].metadata.depth)) === -1)
               {
                 depths.push(parseInt(nds[i].metadata.depth));
               }
             nodesWithDepth++;
         }

          //check if node has metadata.exportable property (used later to show(or not) the button 'CMF''
          if(checkNested(nds[i],"metadata","exportable")){

              nodesWithExportable++;
          }

    }


    var nbOfTypes = ObjectLength(legend);

    var legendColor = d3.scale.linear().domain([1,nbOfTypes+1]) //add 1 more color to avoid black if only 2 types exists
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);


    //create and fill an array that will be used in custom legend order below
    fillSortedLegend();

     var k = 0;
     for (const key of Object.keys(legend)) {
        legend[key].color = legendColor(k);
        legend[key].dimmed = false;
        //legend[key].Y = height*((k+1)/nbOfTypes);                  //use random order to position legends vertically
        legend[key].Y = height*((getLegendIndex(key))/nbOfTypes);  //use custom order to position legends vertically (check function fillSortedLegend()

        k++;
     }




    ///////// Controls /////////////

    //show buttons (that doesn't depend on the availability of specific json attributes)
    d3.select("#jsonButton").style("visibility","visible");
    //d3.select("#gmlButton").style("visibility","visible");  //hide this feature
    d3.select("#searchBar").style("visibility","visible");
    d3.select("#hcheckbox").style("visibility","visible");
    d3.select("#slcheckbox").style("visibility","visible");

    d3.select("#countLabel")
        .on("mouseover", function(){
            str = "This Graph, <br>"
            str += "<br>- Generated on: " + generatedOn + "<br>"
            str += "<br>- For objects:<br><br>"
            for( var key in graphFor ) {
                str += "  - " + graphFor[key] + ": " + key + "<br>"
            }

            if (deleteInstructionsExist){
                str += "<br>- Showing Delete instructions for: <br><br>"
                for( var key in deleteInstructionsFor ) {
                str += "  - " + deleteInstructionsFor[key] + ": " + key + "<br>"
                }
            }

            divGraphTooltip.transition().delay(500).duration(200).style("opacity", .9);
                    divGraphTooltip.html("<pre>" + str + "</pre>")
                        .style("right", "20px").style("top", (d3.event.pageY + 5 ) + "px");
         })
        .on("mouseout", function(d) {
          divGraphTooltip.transition().duration(200).style("opacity", 0);
         })

    //add listeners to buttons
    d3.select("#jsonButton")
    .on("click", function(){

        divGmlTooltip.html("").style("opacity", 0);
        divCmfTooltip.html("").style("opacity", 0);
        divWarnTooltip.html("").style("opacity", 0);

        if (stepMode){

            // build json graph from visible nodes/links
            var gf = {
                "graphs" : [
                    {
                        "type" : "Partial graph containing all traversals done in 'on-demand' mode",
                        "nodes": [],
                        "edges": [],
                        "metadata" : {}
                    }
                ]
            }

            for (var nid in nodes){
                gf.graphs[0].nodes.push(getNode(nodes[nid].id))
            }

            for (var l in links){
                gf.graphs[0].edges.push(getLink(links[l].source.id, links[l].target.id, links[l].relation))
            }

            gf.graphs[0].metadata = getGraphMetaData()

            if (d3.event.ctrlKey){

                var textToSave = JSON.stringify(gf, null, 1);

                var hiddenElement = document.createElement('a');

                hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(textToSave);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'visible_graph.json';
                hiddenElement.click();

                toast.fire({
                    type: 'info',
                    title: "Downloaded graph contains only current/visible traversals nodes and edges"
                  })


                }
                else{

                    if(divJsonTooltip.style("opacity") == 0) {
                        divJsonTooltip.html("<pre>" + JSON.stringify(gf, null, 1) + "</pre>")
                                        .style("right", "29px").style("top", 225 + "px").style("opacity", 1)
                                        .style("height", height-200-100 +"px")
                                        .style("position", "fixed");
                    }
                    else
                        divJsonTooltip.html("").style("opacity", 0);

                }

        }
        else{

            if (d3.event.ctrlKey){

                 var textToSave = JSON.stringify(jsonData, null, 1);

                 var hiddenElement = document.createElement('a');

                 hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(textToSave);
                 hiddenElement.target = '_blank';
                 hiddenElement.download = 'graph.json';
                 hiddenElement.click();

            }
            else{

                if(divJsonTooltip.style("opacity") == 0){
                    divJsonTooltip.html("<pre>" + JSON.stringify(jsonData, null, 1) + "</pre>")
                                    .style("right", "29px").style("top", 225 + "px").style("opacity", 1)
                                    .style("height", height-200-100 +"px")
                                    .style("position", "fixed");
                }
                else
                    divJsonTooltip.html("").style("opacity", 0);
            }
       }
    })
    //.on("dblclick",function(){});


    if(getDuplicates(nds).length > 0 || getDuplicates(lks).length > 0)
    {
    d3.select("#warningIcon").style("visibility","visible");
    d3.select("#warningIcon")
        .on("click", function(){
             divGmlTooltip.html("").style("opacity", 0);
             divCmfTooltip.html("").style("opacity", 0);
             divJsonTooltip.html("").style("opacity", 0);
             var warnText = "";
             //checks
              if(getDuplicates(nds).length > 0){
                  warnText += "\n<b>Found duplicate nodes:</b>\n\n";
                  getDuplicates(nds).forEach(function(d){
                      warnText+='- ' + d +'\n';
                  });
              }

              //checks
              if(getDuplicates(lks).length > 0){
                  warnText += "\n<b>Found duplicate links:</b>\n\n";
                  getDuplicates(lks).forEach(function(d){
                      warnText+='- ' + d+'\n';
                  });
              }

             if(divWarnTooltip.style("opacity") == 0)
             {

                 //push all check results to div
                 divWarnTooltip.html("<pre>" + warnText + "</pre>")
                                 .style("right", "98px").style("top", 210 + "px").style("opacity", 1);
             }
             else
             {
                divWarnTooltip.html("").style("opacity", 0);
             }

             if (d3.event.ctrlKey){

                 var hiddenElement = document.createElement('a');

                 hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(warnText);
                 hiddenElement.target = '_blank';
                 hiddenElement.download = 'warnings.txt';
                 hiddenElement.click();
             }

        })
        //.on("dblclick",function(){});
    }
    else
    {
    d3.select("#warningIcon").style("visibility","hidden");
    }

    d3.select("#gmlButton")
    .on("click", function(){
        divCmfTooltip.html("").style("opacity", 0);
        divJsonTooltip.html("").style("opacity", 0);
        divWarnTooltip.html("").style("opacity", 0);

        if (d3.event.ctrlKey){
                var textToSave = convertToGML(jsonData);

                var hiddenElement = document.createElement('a');

                hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(textToSave);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'graph.gml';
                hiddenElement.click();
             }
             else
             {
                if(divGmlTooltip.style("opacity") == 0)
                        {
                            divGmlTooltip.html("<pre>" + convertToGML(jsonData) + "</pre>")
                                            .style("right", "25px").style("top", 196 + "px").style("opacity", 1);
                        }
                        else
                            divGmlTooltip.html("").style("opacity", 0);
             }

    })
    //.on("dblclick",function(){});

    //If all nodes has metadata.exportable then show the button and attach the listener

    var cmfText = "";
    if(nodesWithExportable == nds.length)
        {
        d3.select("#cmfButton").style("visibility","visible");
        d3.select("#cmfButton")
            .on("click", function(){
                divGmlTooltip.html("").style("opacity", 0);
                divJsonTooltip.html("").style("opacity", 0);
                divWarnTooltip.html("").style("opacity", 0);
                //get data
                cmfText = "Objects exportable by CMF:\n\nlabel\ttype\n----------------------------\n";
                    nds.forEach(function(d){

                    if(d.metadata.exportable === "true")
                       cmfText+=d.label + '\t' + d.type+'\n';
                    });
                //if ctrl click, then download
                if (d3.event.ctrlKey){
                    var hiddenElement = document.createElement('a');

                    hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(cmfText);
                    hiddenElement.target = '_blank';
                    hiddenElement.download = 'cmfExportableObjects.txt';
                    hiddenElement.click();
                }
                else
                { //if just simple click, then show as tooltip
                    if(divCmfTooltip.style("opacity") == 0)
                    {

                        divCmfTooltip.html("<pre>" + cmfText + "</pre>")
                                        .style("right", "25px").style("top", 270 + "px").style("opacity", 1);
                    }
                    else
                        {
                            divCmfTooltip.html("").style("opacity", 0);

                        }
                    }
            })
            //.on("dblclick",function(){});
        }


    //checkboxs
    d3.select("#hierarchyBox")
        .on("change", function(){

            //unpinn all nodes
            d3.selectAll(".fixed").selectAll("circle").attr("stroke","none").attr("stroke-width",0);
            d3.selectAll(".fixed").classed("fixed",false);
            nodes.forEach(function(n){
                                      if(n.fixed)
                                        n.fixed = false;
                                 });

            //layout the nodes based on user selection
            if(this.checked)
            {
                hierarchyMode = true;
                //d3.select("#verticalLine").style("visibility","visible");

            }
            else
            {
                hierarchyMode = false;
                //d3.select("#verticalLine").style("visibility","hidden");
             }
            force.start();  //to restart simulation, thus allowing nodes to reposition
        });

    d3.select("#showLabelBox")
            .on("change", function(){
                if(this.checked)
                {
                    d3.selectAll(".node .nodelabel").style("visibility","visible"); //show nodes' labels
                    d3.selectAll(".edgelabel textPath").style("opacity",1); //show edges' labels
                    showLabelMode = true;
                }
                else
                {

                    d3.selectAll(".node .nodelabel").style("visibility","hidden");
                    d3.selectAll(".edgelabel textPath").style("opacity",0);
                    showLabelMode = false;
                 }

            });

    //Slider to modify force parameters
     d3.select("input[id=horizontalSlider]").on("input", function()
             {

             force.gravity(this.value/10);

             //re-energize the force layout to reposition the nodes correctly
             force.start();
       });


   ////////// arrow markers  //////////
   svg.append('defs')
        .append('marker')
            .attr("id","arrowhead")
            .attr("viewBox","-0 -5 10 10")
            .attr("refX","13")
            .attr("refY","0")
            .attr("orient","auto")
            .attr("markerWidth","13")
            .attr("markerHeight","13")
            .attr("xoverflow","visible")
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#d8d8d8')
        .style('stroke','none');

   svg.append('defs')
        .append('marker')
            .attr("id","arrow")
            .attr("viewBox","-0 -5 10 10")
            .attr("refX","0")
            .attr("refY","0")
            .attr("orient","auto")
            .attr("markerWidth","13")
            .attr("markerHeight","13")
            .attr("xoverflow","visible")
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');

    ////////// Simulation //////////
    force = d3.layout.force()
        .size([width, height])
        .charge(-400) //-700
        //.chargeDistance(600)
        .linkDistance(100)
        .linkStrength(0.5) //1
        //.gravity(0.1)
        //.friction(.8)
        .on("tick", tick);


     drag = force.drag()
        .on("dragstart", dragstart)
        .on("dragend", dragend);



    //check if all nodes have 'depth' property, if yes then show button and calculate yForces object
    if(nodesWithDepth == nds.length)
    {
        depthBasedHierarchy = true;

        //sort depths array in DESC order (as we will use top (positive depth) and bottom (negative depth) when
        //assigning y value for custom simulation forces top to bottom
        depths.sort(function(a, b){return b - a });

        var nbOfDepths = depths.length;
        var margin = 100;

        for(i = 0; i < nbOfDepths; i++)
        {
            yForces[depths[i].toString()] = Math.ceil((i+1) * (1/nbOfDepths) * (height-margin));
        }
    }


     //////////////////////////////
     /////////// Legend ///////////
     //////////////////////////////

     //legend for node types
     var factor = 0.4;
     var cntLegend = Object.keys(legend).length;
     //Add nodes and events on them
     legendNodes = svg.selectAll(".legend")
         .data(d3.keys(legend))
         .enter()
         .append("g")
         .attr("class", "legend")
         .on("click",function(d){
             if (d3.event.ctrlKey)
             {
                 var listText = "";
                 nds.forEach(function(n){
                       if(d.indexOf(n.type) !== -1 )
                         listText+=n.label + '\r\n';
                  });
                  var hiddenElement = document.createElement('a');
                  //listText = listText.replace(/#/g, '%#');
                  hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(listText);
                  hiddenElement.target = '_blank';
                  hiddenElement.download = "All_"+ d + 's.txt';
                  hiddenElement.click();

             }
             else
             {
                 toggleNodeVisibility(d);
             }
         })
         .on("dblclick",function(d){
              if (legend[d].dimmed)
              {
                 hideOtherNodes(d);
              }
              else {
                 if (otherNodesVisible) {
                     hideOtherNodes(d);
                 }
                 else
                     makeAllNodesVisible()
              }


         }).on('mouseover',function(d){
               flashNodes(d)
               if(legend[d].dimmed){
                   d3.select("rect[id='legend-rect-"+d+"']").transition().duration(200).style("opacity",1);
                   d3.select("text[id='legend-text-"+d+"']").transition().duration(200).style("opacity",1);
               }
           }).on('mouseout',function(d){
                 if(legend[d].dimmed){
                     d3.select("rect[id='legend-rect-"+d+"']").transition().duration(200).style("opacity",0.2);
                     d3.select("text[id='legend-text-"+d+"']").transition().duration(200).style("opacity",0.2);
                 }
            });

     legendNodes.append("rect")
         .classed("alegend",true)
         .attr("id",function(d){ return 'legend-rect-' + d; })
         .attr("x",20)
         //.attr("y", function(d) { return height/1.5 - (factor*legend[d].Y+70); })
         .attr("y", function(d) { return 80 +(((cntLegend-getLegendIndex(d)+1))*36); })
         .attr("rx", "8")
         .attr("ry", "8")
         .attr("height", 30)
         .attr("width", 210)
         .attr("fill",function(d) { return legend[d].color;})

    legendNodes.append("text")
        .classed("noselect",true)
        .classed("alegend",true)
        .attr("id",function(d){ return 'legend-text-' +d; })
        .attr("x",25)
        //.attr("y", function(d) { return height/1.5 - ((factor*legend[d].Y)+50); })
        .attr("y", function(d) { return 80 +(((cntLegend-getLegendIndex(d)+1))*36) +18; })
        .style("fill", "white")
        .attr("font-family", "calibri")
        .text(function(d) { return d + ' ('+legend[d].nodeCount+')';})

        // text to show count of visible node (relevant in stepMode only)
        legendNodes.append("text")
            .classed("noselect",true)
            .classed("alegendvis",true)
            .attr("id",function(d){ return 'legend-vis-text-' +d; })
            .attr("x",235)
            //.attr("y", function(d) { return height/1.5 - ((factor*legend[d].Y)+50); })
            .attr("y", function(d) { return 80 +(((cntLegend-getLegendIndex(d)+1))*36) +18; })
            .style("fill", "grey")
            .style("visibility", "hidden")
            .attr("font-family", "calibri")
            .text(function(d) { return '(0)';})
            .on("click",function(d){
                if (d3.event.ctrlKey)
                     {
                         d3.event.stopPropagation();
                         var listText = "";
                         nodes.forEach(function(n){
                               if(d.indexOf(n.type) !== -1 )
                                 listText+=n.label + '\r\n';
                          });
                          var hiddenElement = document.createElement('a');
                          //listText = listText.replace(/#/g, '%#');
                          hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(listText);
                          hiddenElement.target = '_blank';
                          hiddenElement.download = "Visible_"+ d + 's.txt';
                          hiddenElement.click();

                     }
                     else
                     {
                         toggleNodeVisibility(d);
                     }
            })

    //legend for delete instructions (if any)
        delLegend = svg.selectAll(".delLegend")
            .data([0])
            .enter()
            .append("g")
            .attr("class", "delLegend noselect")
            .attr("transform","translate("+ 30 +","+ (height -95) +")")

    if (deleteInstructionsExist){
        delLegend.append("circle")
            .attr("r", 10)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("fill","white")
            .attr("stroke-width",8)
            .attr("stroke-dasharray",1)
            .attr("stroke","#ff5757")

        delLegend.append('text')
            .attr("dx", 20)
            .attr("dy", 5)
            .attr("font-family", "calibri")
            .text("Must be kept")

        delLegend.append("circle")
                .attr("r", 10)
                .attr("cx", 0)
                .attr("cy", 35)
                .attr("fill","white")
                .attr("stroke-width",8)
                .attr("stroke-dasharray",1)
                .attr("stroke","#3de06b")

        delLegend.append('text')
            .attr("dx", 20)
            .attr("dy", 40)
            .attr("font-family", "calibri")
            .text("Can be deleted")
     }

     delLegend.append("circle")
         .attr("r", 12)
         .attr("cx", 0)
         .attr("cy", 68)
         .attr("fill","white")
         .attr("stroke-width",1)
         .attr("stroke","grey")
      delLegend.append("circle")
            .attr("r", 4)
            .attr("cx", 0)
            .attr("cy", 68)
            .attr("fill","white")
            .attr("stroke-width",2)
            .attr("stroke","grey")

     delLegend.append('text')
         .attr("dx", 20)
         .attr("dy", 73)
         .attr("font-family", "calibri")
         .text("Entry node")

    toast = swal.mixin({
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 2000
      });



        if (stepMode) {

            // enable hierarchy/dataflow layout any time 'up' or 'down' traversals are being used
            $('#hierarchyBox').prop('checked', true);
            hierarchyMode = true
            //unpinn all nodes
            d3.selectAll(".fixed").selectAll("circle").attr("stroke","none").attr("stroke-width",0);
            d3.selectAll(".fixed").classed("fixed",false);
            nodes.forEach(function(n){
                      if(n.fixed)
                        n.fixed = false;
                 });

            // force showlabel mode
            $('#showLabelBox').prop('checked', true);
                d3.selectAll(".node .nodelabel").style("visibility","visible"); //show nodes' labels
                d3.selectAll(".edgelabel textPath").style("opacity",1); //show edges' labels
                showLabelMode = true;
        }
}

function update(){

//////////////////////////////
/////////// Links ////////////
//////////////////////////////

    //in order to be able to draw arcs between nodes that have multiple links,
    //we need to find those nodes and put a variables about the number of links
    //so we can vary the arc curvature, the variable will be called linknum
    //linknum:0 yields a strieght line, higher values will increase the arc curvature.

    /*
    //sort links by source, then target
      links.sort(function(a, b) {

      if (typeof a.source === 'object' && a.source !== null)
        a.source = a.source.id

      if (typeof a.target === 'object' && a.target !== null)
        a.target = a.target.id

      if (typeof b.source === 'object' && b.source !== null)
         b.source = b.source.id

      if (typeof b.target === 'object' && b.target !== null)
         b.target = b.target.id

        if (a.source > b.source) {
          return 1;
        }
        else if (a.source < b.source) {
          return -1;
        }
        else {
          if (a.target > b.target) {
            return 1;
          }
          if (a.target < b.target) {
            return -1;
          }
          else {
            return 0;
          }
        }
      });
    */

    //any links with duplicate source and target get an incremented 'linknum'
    for (var i = 0; i < links.length; i++) {
        if (i != 0 &&
          links[i].source == links[i - 1].source &&
          links[i].target == links[i - 1].target) {
          links[i].linknum = links[i - 1].linknum + 1;
        }
        else {
          links[i].linknum = 0;
        };
    };

    //allow links to reference nodes by name instead of by id
    //this by changing the link source and target attribute to point to the actual node object

    var obj = {}
    nodes.forEach(function(d,i){
      obj[d.id] = i;             // create an object to look up a node's index by id
    })

    links.forEach(function(d) {
        if (typeof d.source === 'string' && typeof d.target === 'string'){
          d.source = obj[d.source];  // look up the index of source
          d.target = obj[d.target];  // look up the index of target
        }
    })

     /////////////push nodes and links and start Simulation ////////////

     force.nodes(nodes);
     force.links(links);

     nCount = nodes.length

     //Scale attraction force based on the number of nodes, the higher the node count, the higher will be the initial attraction force (to make all nodes visible as possible)
         if(nCount <= 100)
             {
                 $("#horizontalSlider").val(1);
                 force.gravity(0.1);
             }
         else if (nCount > 100 && nCount <= 200)
             {
                 $("#horizontalSlider").val(5);
                 force.gravity(0.5);
             }
         else
             {
                 $("#horizontalSlider").val(10);
                 force.gravity(1);
             }

     force.start();

     //////////////////////////////
     /////////// Legend ///////////
     //////////////////////////////

    if (stepMode) {
        //shows count of visible nodes
        svg.selectAll(".alegendvis")
        .style("visibility", "visible")
        .text(function(d){return '(' + countNodesByType(d) + ')' })
    }
    //////////////////////////////
    /////////// Links ////////////
    //////////////////////////////

    //start adding the directed arrows
    existingLinkPaths = svg.selectAll(".edgepath")
        .data(links)
        //.attr("title", "existingpath");

    newLinkPath = existingLinkPaths.enter()
        .append("svg:path")
            .attr("stroke", function(d){
                if (deleteInstructionsExist){
                      if (deleteInstructions.hasOwnProperty(d.source) && deleteInstructions.hasOwnProperty(d.target)) {
                            if (deleteInstructions[d.source]['action'] == "keep" && deleteInstructions[d.target]['action'] == "keep")
                                return "#ff5757" //red
                            else
                                return "#3de06b" //green

                      }
                      else
                        return "#999"

                }
                else
                    return "#999"

            })
            .attr("class","edgepath")
            .attr("fill-opacity","0")
            .attr("stroke-opacity","0")
            .attr("id",function (d, i) {return 'edgepath' + i})
            //.attr("title", "newpath")
        .style("pointer-events", "none")
        .attr('marker-end','url(#arrowhead)');

    //remove links
    existingLinkPaths.exit()
        //.attr("title", "removelinkpath")
        .transition()
        .duration(300)
        .style("opacity", 0)
        .remove();

    //add labels and events to arrows
    existingEdgelabels = svg.selectAll(".edgelabel")
        .data(links)
        //.attr("title","existinglabel")

    newEdgeLabels = existingEdgelabels.enter()
        .append('text')
        //.style("pointer-events", "none")
            .attr("class","edgelabel")
            .attr("id",function (d, i) {return 'edgelabel' + i})
            .attr("font-size","15")
            .attr("font-family", "calibri")
            .attr("fill","#aaa")
            //.attr("title", "newlabel")
            .append('textPath')
                .attr('xlink:href', function (d, i) {return '#edgepath' + i})
                .style("text-anchor", "middle")
                .style("opacity", 0)
                //.style("pointer-events", "none")
                .attr("startOffset", "50%")
                .classed("noselect",true)
                .text(function (d) {return d.relation})
                .attr('pointer-events', 'visibleStroke')
                .on("mouseover", function(d) {
                        //highlight link in red
                        d3.select(this).style("fill", "red").attr('fill-opacity', 1);

                        //create an object representing the node and exclude all d3 added properties to enhance visibility
                        var temp = {
                            "source": d.source.id,
                            "relation": d.relation,
                            "target": d.target.id
                        }
                        if(d.hasOwnProperty("metadata")){
                            temp.metadata = d.metadata;
                        }
                 //show tooltip
                 divEdgeTooltip.transition().delay(1000).duration(200).style("opacity", .9);
                            divEdgeTooltip.html("<pre>" + JSON.stringify(temp, null, 1) + "</pre>")
                                .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY + 18) + "px");

                 if(!showLabelMode)
                    d3.select(this).transition().duration(50).style("opacity", 1);
                 })
                .on("mouseout", function(d) {
                        d3.select(this).style("fill", "#999").attr('fill-opacity', 0.6);
                        divEdgeTooltip.transition()
                        .duration(200)
                        .style("opacity", 0);

                 if(!showLabelMode)
                    d3.select(this).transition().duration(50).style("opacity", 0);
                });



    //remove edge labels
    existingEdgelabels.exit()
        //.attr("title", "removeedgelabel")
        .transition()
        .duration(300)
        .style("opacity", 0)
        .remove();

//////////////////////////////
/////////// Nodes ////////////
//////////////////////////////


    //Add nodes and events on them
    node = svg.selectAll(".node")
        .data(nodes, function(d){ return d.id})
        .enter()
        .append("g")
        .attr("class", "node")
        .on("dblclick", dblclick)

     node.append("text")
        .attr("dx", 15)
        .attr("dy", 0)
        .attr("font-family", "calibri")
        .classed("noselect nodelabel",true)
        .text(function (d) {return d.label;})
        .style("visibility","hidden");

     node.append("circle")
            .attr("r", function(d){
            if (jobAuditExist){
                if ("metadata" in d)
                    if ("usage" in d['metadata'])
                        return scale(d['metadata']["usage"]["direct"]["runCount"], minUsage, maxUsage, 10, 18)
                    else
                        return 10
                else
                    return 10
            }
            else
                return 10
            })
            .attr("id",function(d){return "nodecircle_" + d.id})
            .style("cursor","pointer")
            .classed("nodecircle",true)
            .attr("fill", function(d) {
                //if node has metadata.status = invalid, change its color to gray, else return legend color
                if(checkNested(d,"metadata","status")){
                    if(d.metadata.status.indexOf('invalid node') !== -1){
                        return "#e3e3e3"
                    }
                }else
                {
                    return legend[d.type].color;
                }

             })
            .attr("stroke-width", function(d){
                if (deleteInstructionsExist){
                    if (deleteInstructions.hasOwnProperty(d.id))
                        return 8
                }
                else
                    return 2
            })
            .attr("stroke-dasharray", function(d){
                if (deleteInstructionsExist){
                    if (deleteInstructions.hasOwnProperty(d.id))
                        return 1
                }
                else
                    return 0
                        })
            .attr("stroke", function(d){
                 if (deleteInstructionsExist){
                    if (deleteInstructions.hasOwnProperty(d.id))
                        if (deleteInstructions[d.id]['action'] == 'delete')
                            return "#3de06b"  //green
                        else
                            return "#ff5757"  //red
                    }
                    else {

                            return "none"
                    }

            })

            // for entry node or delete node, add a  dot in the middle of the circle to differenciate it
              d3.selectAll('.node').filter(function(d){
                   for( var key in graphFor ) {
                       if (d.label == key && d.type == graphFor[key]) {
                              return true
                          }
                    }

                    if (deleteInstructionsExist){
                       for( var key in deleteInstructionsFor ) {
                           if (d.label == key && d.type == deleteInstructionsFor[key]) {
                                  return true
                              }
                        }
                    }

              }).append('circle')
                    .attr("r", 4)
                     .style("cursor","pointer")
                     .attr("fill", "white")

            //node events
            node.selectAll("circle")
            .on("mouseover", function(d) {

                //create an object representing the node and exclude all d3 added properties to enhance visibility
                var temp = {
                    "id": d.id,
                    "type": d.type,
                    "label": d.label,
                    "cmId" : d.cmId,
                    "cmName" : d.cmName
                };
                if(d.hasOwnProperty("metadata")){
                            temp.metadata = d.metadata;
                }

                //show tooltip
                divNodeTooltip.transition().delay(1000).duration(200).style("opacity", .9);
                            divNodeTooltip.html("<pre>" + JSON.stringify(temp, null, 1) + "</pre>")
                                .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
                if(!showLabelMode) d3.select(this.parentNode).select('text').transition().duration(50).style("visibility", "visible");
            })
            .on("mouseout", function(d) {
                divNodeTooltip.transition().duration(200).style("opacity", 0);
                if(!showLabelMode) d3.select(this.parentNode).select('text').transition().duration(50).style("visibility", "hidden");
            })
            .on("mousedown", function(d){
            //highlight node and store as current node
                if (stepMode){
                    currentNode = d;
                    d3.select(this.parentNode).selectAll("circle").filter(".nodecircle").attr("stroke","#4f4f4f").attr("stroke-width",3);
                    d3.selectAll('.node').filter(function(dd){
                                       if (dd.id != d.id) return true
                                  }).selectAll("circle").filter(".nodecircle").attr("stroke","none")
                }
            })
            .on("click",function(d) {

                // when node is clicked, copy node (json) to clipboard
                if (d3.event.ctrlKey)
                    {
                      var temp = {
                          "id": d.id,
                          "type": d.type,
                          "label": d.label,
                          "cmId" : d.cmId,
                          "cmName" : d.cmName
                      };
                      if(d.hasOwnProperty("metadata")){
                                  temp.metadata = d.metadata;
                      }
                      // data = "label:'" + d.label + "', type: '" + d.type +"'"
                      data = JSON.stringify(temp, null, 2);
                      copyToClipboard(data)

                      toast.fire({
                        type: 'info',
                        title: 'Copied to clipboard'
                      })
                     }

                     if (d3.event.shiftKey){

                       objectPath = getObjectRepoPath(d.type,d.cmName)

                       if (objectPath == "not found"){
                           Swal.fire({
                              type: 'error',
                              title: 'Not supported',
                              html: "Open object not supported (yet) for type: "+ d.type + "<br>"
                            })
                       }
                       else
                       {
                            objectUrl = ""
                            objectLabel = d.label
                            if (d.label.indexOf(",") != -1)
                            {
                                objectLabel = d.label.split(",")[0]
                            }

                            if (d.type == "Datamart table"){
                                if (d.metadata.isMurex == "0")
                                {
                                    objectPath = objectPath.replace("/Murex", "/Client")
                                }
                                else
                                {
                                    objectPath = objectPath.replace("/Client","/Murex")
                                }
                                objectLabel = objectLabel.replace("_REP",".REP")
                            }

                            if (d.type == "Datamart view" || d.type == "Datamart layout" || d.type == "Datamart item formula"){

                                objectLabel = "[" + objectLabel + "][Datamart Extraction][]";
                            }


                            if (remoteRepoPathExist && windowHost.indexOf('localhost:') == -1) {
                                parts = repoPath.split('\\')
                                module = parts[parts.length-1]
                                objectUrl = remoteRepoPath + "/" + module + "/" + objectPath + "/" + encodeURIComponent(objectLabel) + ".xml"
                            }
                            else {
                                objectUrl = "file:///" + repoPath + "/" + objectPath + "/"+ encodeURIComponent(objectLabel) + ".xml"
                            }

                            window.open(objectUrl, '_blank');
                       }
                     }
              })
              .call(drag)


    if (deleteInstructionsExist) {
            node.append("text")
                .attr("dx", function(d){return -30})
                .attr("dy", function(d){return 4})
                .attr("font-family", "calibri")
                .attr("font-size","12")
                .classed("noselect idlabel",true)
                .text(function(d){return d.id})
                .style("opacity",0.3)

            }

    //remove nodes
    svg.selectAll(".node").data(nodes,function(d){ return d.id})
        .exit()
            .transition()
            .duration(300)
            .style("opacity", 0)
            .remove();


    //listen to keyboard
    if (stepMode) {
        d3.select("body").on("keydown", function() {
            if (currentNode!==null) {
                 //console.log("keyCode: " + d3.event.keyCode + " applied to node id: " + currentNode.id)

                 // keyboard key: <== (incoming)
                 if (d3.event.keyCode === 37) {
                    //console.log(getNeighboursIds(currentNode.id,"in"))
                    if(d3.event.shiftKey){
                        // recursive traversal of all neighbours
                        recursiveNeighbours(currentNode.id, "in")
                    }
                    else{
                        nbNodesIds = getNeighboursIds(currentNode.id,"in")
                        for (i = 0; i < nbNodesIds.length; i++){
                            addNode(getNode(nbNodesIds[i]))
                            addLinks(nbNodesIds[i],currentNode.id)
                        }
                        if (nbNodesIds.length == 0) {
                            toast.fire({
                                type: 'info',
                                title: "No incoming nodes for " + currentNode.label + "/" + currentNode.type
                              })
                        }
                    }
                    update();
                 }

                 // keyboard key: ==> (outgoing)
                 else if (d3.event.keyCode === 39) {
                    //console.log(getNeighboursIds(currentNode.id,"out"))
                    if(d3.event.shiftKey){
                        // recursive traversal of all neighbours
                        recursiveNeighbours(currentNode.id, "out")
                    }
                    else{
                        // one node at a time
                        nbNodesIds = getNeighboursIds(currentNode.id,"out")
                        for (i = 0; i < nbNodesIds.length; i++){
                            addNode(getNode(nbNodesIds[i]))
                            addLinks(currentNode.id, nbNodesIds[i])
                        }
                        if (nbNodesIds.length == 0) {
                            toast.fire({
                                type: 'info',
                                title: "No outgoing nodes for " + currentNode.label + "/" + currentNode.type
                              })
                        }

                    }
                    update();
                 }

                  // keyboard key: ^ (upstream)
                  else if (d3.event.keyCode === 38) {
                     //console.log(getNeighboursIds(currentNode.id,"up"))
                     if(d3.event.shiftKey){
                         // recursive traversal of all neighbours
                         recursiveNeighbours(currentNode.id, "up")
                     }
                     else{
                         nbNodesIds = getNeighboursIds(currentNode.id,"up")
                         for (i = 0; i < nbNodesIds.length; i++){
                             addNode(getNode(nbNodesIds[i]))
                             addLinks(nbNodesIds[i],currentNode.id)
                             addLinks(currentNode.id, nbNodesIds[i])
                         }
                         if (nbNodesIds.length == 0) {
                             toast.fire({
                                 type: 'info',
                                 title: "No upstream nodes for " + currentNode.label + "/" + currentNode.type
                               })
                         }
                     }
                     update();
                  }

                  // keyboard key: v (downstream)
                  else if (d3.event.keyCode === 40) {
                       //console.log(getNeighboursIds(currentNode.id,"down"))
                       if(d3.event.shiftKey){
                           // recursive traversal of all neighbours
                           recursiveNeighbours(currentNode.id, "down")
                       }
                       else{
                           nbNodesIds = getNeighboursIds(currentNode.id,"down")
                           for (i = 0; i < nbNodesIds.length; i++){
                               addNode(getNode(nbNodesIds[i]))
                               addLinks(nbNodesIds[i],currentNode.id)
                               addLinks(currentNode.id, nbNodesIds[i])
                           }
                           if (nbNodesIds.length == 0) {
                               toast.fire({
                                   type: 'info',
                                   title: "No downstream nodes for " + currentNode.label + "/" + currentNode.type
                                 })
                           }
                       }
                       update();
                  }
                  // keyboard letter: d (delete)
                  else if (d3.event.keyCode === 68) {
                    if(d3.event.shiftKey){
                    //console.log("deleting orphaned nodes relative to node id: " + currentNode.id)
                        cntToDelete = removeOrphanedNodes(currentNode.id)
                        if (cntToDelete == 0) {
                               toast.fire({
                                   type: 'info',
                                   title: "No 'other' non-connected nodes to delete"
                                 })
                           }
                    }
                    else{
                    //console.log("deleting node id: " + currentNode.id)
                    removeNodeById(currentNode.id);
                    removeAnyLinkWith(currentNode.id);
                    currentNode = null
                    }
                    update();

                  }

            }
        divNodeTooltip.transition().duration(100).style("opacity", 0);
        divEdgeTooltip.transition().duration(100).style("opacity", 0);

        });

        // if clicking on canvas (white area) deselect all nodes
        window.onclick = function(event){
                  if(event.target.className.baseVal==""){
                      currentNode = null
                      if (deleteInstructionsExist){
                                nodes.forEach(function(d){
                                if (deleteInstructions.hasOwnProperty(d.id))
                                      if (deleteInstructions[d.id]['action'] == 'delete')
                                          d3.select("#nodecircle_"+d.id).attr("stroke","#3de06b").attr("stroke-width",8).attr("stroke-dasharray",1);
                                      else
                                          d3.select("#nodecircle_"+d.id).attr("stroke","#ff5757").attr("stroke-width",8).attr("stroke-dasharray",1);
                                })
                      }
                      else
                        d3.selectAll('.node').selectAll("circle").filter(".nodecircle").attr("stroke","none")
            }}

     }

     if (showLabelMode == true){
        d3.selectAll(".node .nodelabel").style("visibility","visible"); //show nodes' labels
        d3.selectAll(".edgelabel textPath").style("opacity",1); //show edges' labels
     }


}

function tick(e) {

    //update nodes position with each simulation tick

    //check if user wants to position nodes based on hierarchy (i.e node.metadata.depth)
        if(hierarchyMode)
        {
            //custom forces scalar
            var k = 0.6 * e.alpha;

            force.nodes().forEach(function(o) {

                //apply custom force: this vertically based on the "type" of node or "depth" (if supported in JSON response)
                if(depthBasedHierarchy)
                {
                    o.y += (yForces[o.metadata.depth] - o.y) * k;
                }
                else
                {
                    o.y += (height-(legend[o.type].Y) - o.y) * k;
                }

                //apply custom force: this horizontally only for nodes that have delete instructions (i.e subgraph) will be pushed to the left

                /*if (deleteInstructionsExist){
                     if (deleteInstructions.hasOwnProperty(o.id))
                     {
                        // for deletegraph nodes place them on the left area of the graph,
                        // place central nodes (having 3 or more links) on 2 'middle' vertical accesses (one for odd, other for even ids) to increase separation
                        // place leaf nodes (having less than 3 links) on 2 extreme vertical access (one for odd, other for even ids) to increase separation
                        if ( o.weight >= 3 )
                            if ( o.id % 2 == 0)
                                o.x += (width/2 - 500 - o.x) * k;
                            else
                                o.x += (width/2 - 400 - o.x) * k;
                        else
                            if ( o.id % 2 == 0)
                                o.x += (width/2 - 600 - o.x) * k;
                            else
                                o.x += (width/2 - 300 - o.x) * k;

                     }
                }*/
            });
        }


    ////////// Nodes re-positioning ///////////


        svg.selectAll(".node").selectAll('circle').attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});
        svg.selectAll(".node").selectAll('text').attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

    ////////// Links re-positioning ///////////


        // new edgepaths (i.e link)

        //use linknum to set the arc strength (0  = strieght line, while higher values gives an arc) this to allow
        //for 2 nodes to have multi-links and still be able to see links and lables of links
        var linkAngle = 3;   // 2 default, higher values makes the arc steep, lower makes it wide.


        svg.selectAll(".edgepath")
            .attr("d", function(d) {
            var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y;
            var qx = dy /  linkAngle * d.linknum, //linknum is defined above
            qy = -dx / linkAngle * d.linknum;
            var qx1 = (d.source.x + (dx / 2)) + qx,
            qy1 = (d.source.y + (dy / 2)) + qy;
            return "M"+d.source.x+" "+d.source.y+" C" + d.source.x + " " + d.source.y + " " + qx1 + " " + qy1 + " " + d.target.x + " " + d.target.y;
        });

        svg.selectAll(".edgepath")
            .attr("x1", function(d) { return d.source.x + 5; })
            .attr("y1", function(d) { return d.source.y + 5; })
            .attr("x2", function(d) { return d.target.x + 5; })
            .attr("y2", function(d) { return d.target.y + 5; });



        //correct/rotate direction of text as a function of nodes' position

        svg.selectAll(".edgelabel")
        .attr('transform', function (d) {
                    if (d.target.x < d.source.x) {
                        var bbox = this.getBBox();

                        var rx = bbox.x + bbox.width / 2;
                        var ry = bbox.y + bbox.height / 2;
                        if (d.linknum > 0)
                            return 'rotate(180 ' + rx + ' ' + ry + ')';
                        else
                            return 'rotate(180 ' + rx + ' ' + ry + ')';
                    }
                    else {
                        return 'rotate(0)';
                    }
                });

}

/////////////////////////////////
////////// Utility fns //////////
/////////////////////////////////

function getGraphMetaData(){

    if ("metadata" in jsonData.graphs[0])
        return jsonData.graphs[0].metadata
    else
        return {}
}

function getNode(nid){
    // returns a node from array nds[], by id
    for (var j = 0; j < nds.length; j++) {
        if (nid === nds[j].id) {
            return JSON.parse(JSON.stringify(nds[j]))
        }
    }
}

function addNode(n){
    // adds node only if doesn't exist in array nodes[]
    found = false
    for (var j = 0; j < nodes.length; j++) {
        if (n.id === nodes[j].id) {
            found = true;
            break;
        }

    }
    if (found == false){
        nodes.push(n)
    }
}

function removeNodeById(nid){
    // removes node from array nodes[]

    for (var j = 0; j < nodes.length; j++) {
        if (nid === nodes[j].id) {
            nodes.splice(j, 1);
            break;
        }
    }
}


function removeOrphanedNodes(nid){
    // removes node from array nodes[] that is not nid, and have no links
    orphans = [];

    for (var i = 0; i < nodes.length; i++) {
            // keep current node (i.e nid)
            if (nid === nodes[i].id) {
                continue
            }
            else if (nodes[i].weight == 0){
                orphans.push(i)
            }
     }

    for (var i = orphans.length -1; i >= 0; i--){
        nodes.splice(orphans[i],1)
    }

    return orphans.length
}

function getLinks(fromId, toId){
    // returns an array of matching links, from array lks[]
    temp = []
    for (var j = 0; j < lks.length; j++) {
        if (fromId === lks[j].source && toId === lks[j].target) {
            temp.push(JSON.parse(JSON.stringify(lks[j])))
        }
    }
    return temp
}

function getLink(fromId, toId, relation){
    // returns matching link, from array lks[]
    for (var j = 0; j < lks.length; j++) {
        if (fromId === lks[j].source && toId === lks[j].target && relation === lks[j].relation) {
            return JSON.parse(JSON.stringify(lks[j]))
        }
    }
}

function addLinks(fromId, toId){
    // adds link only if doesn't exist in array links[]
    temp = []
    found = false
    for (var j = 0; j < links.length; j++) {
        if (fromId === links[j].source.id && toId === links[j].target.id) {
            found = true;
            temp.push(links[j])
        }

    }

    if (found == false){
        tempLinks = getLinks(fromId, toId)
        for (var i = 0; i < tempLinks.length; i++){
            links.push(tempLinks[i])
        }
    }
    else {
        for (var i = 0; i < temp.length; i++) {
            exists = false
            for (var j = 0; j < links.length; j++) {
             if (temp[i].source.id === links[j].source.id && temp[i].target.id === links[j].target.id && temp[i].relation === links[j].relation){
                exists = true
                break;
             }
           }
           if (exists == false){
            links.push(temp[i])
           }
        }
    }
}

function removeLinks(fromId, toId){
     temp = []
    // collected edge(s) indexes inside array links[], using source & target ids
    for (var j = 0; j < links.length; j++) {
        if (fromId === links[j].source.id && toId === links[j].target.id) {
            temp.push(j)
        }
    }

    // delete links by index
    for (var i = temp.length -1; i >= 0; i--){
        links.splice(temp[i], 1);
    }
}

function removeAnyLinkWith(nid){
    temp = []
    // collected edge(s) indexes inside array links[], whether nid found in source or target
    for (var j = 0; j < links.length; j++) {
        if (nid === links[j].source.id || nid === links[j].target.id) {
            temp.push(j)
        }
    }

    // delete links by index (in reverse order)
    for (var i = temp.length -1; i >= 0; i--){
        links.splice(temp[i], 1);
    }
}

function dblclick(d) {

        force.alpha(0.05);
        d3.select(this.parentNode).classed("fixed", d.fixed = false);
        //d3.select(this).select(".nodecircle").attr("stroke","none").attr("stroke-width",0);

        if (deleteInstructionsExist){
            if (deleteInstructions.hasOwnProperty(d.id))
                if (deleteInstructions[d.id]['action'] == 'delete')
                    d3.select(this).select(".nodecircle").attr("stroke","#3de06b").attr("stroke-width",8).attr("stroke-dasharray",1);
                else
                    d3.select(this).select(".nodecircle").attr("stroke","#ff5757").attr("stroke-width",8).attr("stroke-dasharray",1);
            }
}

function dragstart(d) {
        force.charge(-20);
        force.alpha(0.005);
        d3.select(this.parentNode).classed("fixed", d.fixed = true);
         if (deleteInstructionsExist){
            nodes.forEach(function(d){
            if (deleteInstructions.hasOwnProperty(d.id))
                  if (deleteInstructions[d.id]['action'] == 'delete')
                      d3.select("#nodecircle_"+d.id).attr("stroke","#3de06b").attr("stroke-width",8).attr("stroke-dasharray",1);
                  else
                      d3.select("#nodecircle_"+d.id).attr("stroke","#ff5757").attr("stroke-width",8).attr("stroke-dasharray",1);
            })
          }

}

function dragend(d) {
        force.charge(-1000);
        if (deleteInstructionsExist){
            if (deleteInstructions.hasOwnProperty(d.id))
                if (deleteInstructions[d.id]['action'] == 'delete')
                    d3.select(this.parentNode).select(".nodecircle").attr("stroke","#3de06b").attr("stroke-width",8).attr("stroke-dasharray",1);
                else
                    d3.select(this.parentNode).select(".nodecircle").attr("stroke","#ff5757").attr("stroke-width",8).attr("stroke-dasharray",1);
            }
        if (stepMode)
            d3.select(this.parentNode).selectAll("circle").filter(".nodecircle").attr("stroke","#4f4f4f").attr("stroke-width",3);
}

function checkNested(obj) {
         // to check if a json contains a given path property
         //usage: checkNested(jsonObje, "level1","level2","levelN") return true if found
          var args = Array.prototype.slice.call(arguments, 1);

          for (var i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
              return false;
            }
            obj = obj[args[i]];
          }
          return true;
}

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

function makeAllNodesVisible(){
    d3.selectAll(".alegend").transition().duration(500).style("opacity",1);
    d3.selectAll(".node").transition().duration(500).style("opacity",1);
    for (const key of Object.keys(legend)) {
        legend[key].dimmed = false
    }
    otherNodesVisible = true
}

function toggleNodeVisibility(nodeType){

        var foundNodes = d3.selectAll(".node").filter(function(d){return d.type === nodeType ;});

        if(legend[nodeType].dimmed) {

            d3.select("rect[id='legend-rect-"+nodeType+"']").transition().duration(500).style("opacity",1);
            d3.select("text[id='legend-text-"+nodeType+"']").transition().duration(500).style("opacity",1);
            foundNodes.transition().duration(500).style("opacity",1);
            legend[nodeType].dimmed = false;
        }
        else{
            d3.select("rect[id='legend-rect-"+nodeType+"']").transition().duration(500).style("opacity",0.2);
            d3.select("text[id='legend-text-"+nodeType+"']").transition().duration(500).style("opacity",0.2);
            foundNodes.transition().duration(500).style("opacity",0.2);
            legend[nodeType].dimmed = true;
        }

}

function flashNodes(nodeType){

        var foundNodes = d3.selectAll(".node").filter(function(d){return d.type === nodeType ;});

        if(legend[nodeType].dimmed) {
            foundNodes.transition().delay(100).duration(120).style("opacity",1).transition().style("opacity",0.2).transition().style("opacity",1).transition().style("opacity",0.2);
        }
        else{
            foundNodes.transition().delay(100).duration(120).style("opacity",0.2).transition().style("opacity",1).transition().style("opacity",0.2).transition().style("opacity",1);
        }

}

function hideOtherNodes(nodeType){

        var foundNodes = d3.selectAll(".node").filter(function(d){return d.type === nodeType ;});
        var otherNodes = d3.selectAll(".node").filter(function(d){return d.type != nodeType ;});

        //make dbl clicked legend visible
        d3.select("rect[id='legend-rect-"+nodeType+"']").transition().duration(500).style("opacity",1);
        d3.select("text[id='legend-text-"+nodeType+"']").transition().duration(500).style("opacity",1);
        legend[nodeType].dimmed = false;

        //make nodes of selected type visible
        foundNodes.transition().duration(500).style("opacity",1);

        //dim all other legends
        for (const key of Object.keys(legend)) {
            if(key != nodeType) {
                d3.select("rect[id='legend-rect-"+key+"']").transition().duration(500).style("opacity",0.2);
                d3.select("text[id='legend-text-"+key+"']").transition().duration(500).style("opacity",0.2);
                legend[key].dimmed = true;
             }
        }

        //dim all other nodes
        otherNodes.transition().duration(500).style("opacity",0.21);


        otherNodesVisible = false

}

function searchGraph(searchPattern){

nodesInSearchResults = "";

if (stepMode)
{
    if (searchPattern != "") {
        var cntFoundNodes = 0;
        for (i in nds)
        {
            if (searchPattern.indexOf(",") != -1){
            parts = searchPattern.split(",");
            if(nds[i].label.toLowerCase().indexOf(parts[0].toLowerCase().trim().replace(/^\(+|\)+$/g, '')) != -1 && nds[i].type.toLowerCase().indexOf(parts[1].toLowerCase().trim()) != -1)
                {
                    //console.log('label: ' + nds[i].label + ' type: ' + nds[i].type)
                    addNode(JSON.parse(JSON.stringify(nds[i])))
                    nodesInSearchResults+= nds[i].label + '\n';
                    cntFoundNodes++;
                }

            }
            else if(nds[i].label.toLowerCase().indexOf(searchPattern.toLowerCase().trim().replace(/^\(+|\)+$/g, '')) != -1)
            {
                //console.log('label: ' + nds[i].label + ' type: ' + nds[i].type)
                addNode(JSON.parse(JSON.stringify(nds[i])))
                nodesInSearchResults+= nds[i].label + '\n';
                cntFoundNodes++;
            }

        }

        update();

        //show count of matching nodes/edges
        d3.selectAll("#cntCircle").style("visibility","visible")
                                    .text(cntFoundNodes);

    }
    else
    {
            //rest search styles when user hit enter to search but didn't insert a search term
            d3.selectAll("#inpt_search").style("color","#333333");
            d3.selectAll(".cntCircle").style("visibility","hidden");
    }
}
else
    {
        //make all nodes,edges & legend are visible (i.e rest search in case there was a previous search active)
        node.style("stroke","none")
            .style("stroke-width","0")
            .style("opacity","1")

        newLinkPath.style("stroke","#999")
            .style("stroke-width","1")
            .style("stroke-opacity","0.6")

        for (const key of Object.keys(legend)) {

                        d3.select("rect[id='legend-rect-"+key+"']").transition().duration(500).style("opacity",1);
                        d3.select("text[id='legend-text-"+key+"']").transition().duration(500).style("opacity",1);
                        legend[key].dimmed = false;

                }

        var cntFoundNodes = 0;
        var cntFoundLinks = 0;

        var searchOnlyNodes = false;
        var searchOnlyEdges = false;

        //perform a search only if a search pattern is provided
        if(searchPattern != ""){
            //detect if user want to search only nodes ( )
            if(searchPattern.trim().startsWith("(") && searchPattern.trim().endsWith(")"))
            {
                searchOnlyNodes = true;
                newLinkPath.transition()
                    .duration(200)
                    .style("stroke-opacity","0.01");
            }
            //detect if user want to search only edges - -
            if(searchPattern.trim().startsWith("-") && searchPattern.trim().endsWith("-"))
            {
                searchOnlyEdges = true;
                node.transition()
                   .duration(200)
                   .style("opacity","0.1");
            }


                if(searchOnlyNodes === true || (searchOnlyNodes === false && searchOnlyEdges === false)){

                    //highlight nodes
                    var foundNodes = d3.selectAll(".node").filter(function(d){
                                                                var string = JSON.stringify(d);
                                                                if(string.toLowerCase().indexOf(searchPattern.toLowerCase().trim().replace(/^\(+|\)+$/g, '')) != -1) {
                                                                    cntFoundNodes++ ;
                                                                    nodesInSearchResults+= d.label + '\n';
                                                                    return true;
                                                                    }
                                                            });
                    foundNodes.transition()
                                    .duration(200)
                                    .style("stroke","black")
                                    .style("stroke-width","1");

                    //dim all other nodes
                    var otherNodes = d3.selectAll(".node").filter(function(d){
                                                                var string = JSON.stringify(d);
                                                                if(string.toLowerCase().indexOf(searchPattern.toLowerCase().trim().replace(/^\(+|\)+$/g, '')) == -1) return true;
                                                            });
                    otherNodes.transition()
                                   .duration(200)
                                   .style("opacity","0.1");


                    }

            if(searchOnlyEdges === true || (searchOnlyNodes === false && searchOnlyEdges === false)){
                    //highlight links
                    var foundLinks = d3.selectAll(".edgepath").filter(function(d){
                                                                var string = JSON.stringify(d);
                                                                if(string.toLowerCase().indexOf(searchPattern.toLowerCase().trim().replace(/^\-+|\-+$/g, '')) != -1) {
                                                                    cntFoundLinks++ ;
                                                                    return true;
                                                                    }
                                                            });
                    foundLinks.transition()
                                    .duration(200)
                                    .style("stroke","red")
                                    .style("stroke-width","1.5");

                    //dim all other edges
                    var otherLinks = d3.selectAll(".edgepath").filter(function(d){
                                                                    var string = JSON.stringify(d);
                                                                    if(string.toLowerCase().indexOf(searchPattern.toLowerCase().trim().replace(/^\-+|\-+$/g, '')) == -1) return true;
                                                                });
                    otherLinks.transition()
                                    .duration(200)
                                    .style("stroke-opacity","0.01");
            }


                if((cntFoundNodes+cntFoundLinks) == 0)
                    {
                        d3.selectAll("#inpt_search").style("color","red");
                    }
                    else
                   {
                        d3.selectAll("#inpt_search").style("color","#333333");
                   }

        //show count of matching nodes/edges
        d3.selectAll("#cntCircle").style("visibility","visible")
                                    .text(cntFoundNodes+cntFoundLinks);

        }
        else
        {
                //rest search styles when user hit enter to search but didn't insert a search term
                d3.selectAll("#inpt_search").style("color","#333333");
                d3.selectAll(".cntCircle").style("visibility","hidden");
        }

    }
}

function convertToGML(jsonData){
//converts JSON graph to GML up to a depth of 2 nested objects for example node.metadata{}.output{}
var gml = 'graph [\n';


    jsonData.graphs[0].nodes.forEach(function(d){
    gml += ' node [\n';
    var k = 0;
         for (const key of Object.keys(d)) {
            if(typeof(d[key]) === 'object')
            {    var nested1 = d[key];
                 gml +='  '+ key + ' [\n';
                 for (const metaKey of Object.keys(nested1)) {
                    if(typeof(nested1[metaKey]) === 'object'){
                        gml +='   ' + metaKey + ' [\n';
                        var nested2 = nested1[metaKey];
                        for (const metaKey2 of Object.keys(nested2)) {
                            gml +='     ' + metaKey2 + ' "' + nested2[metaKey2] + '"\n';
                        }
                        gml += '    ]\n';
                    }
                    else {
                        gml += '   ' + metaKey + ' "' + nested1[metaKey] + '"\n';
                    }
                 }
                 gml += '  ]\n';

            }
            else
            {
                gml +='  ' + key + ' "' + d[key] + '"\n';
            }
         }
    gml += ' ]\n'; //end nodes
    });


    jsonData.graphs[0].edges.forEach(function(d){
    gml += ' edge [\n';
    var k = 0;
         for (const key of Object.keys(d)) {
            if(typeof(d[key]) === 'object')
            {    var nested1 = d[key];
                 gml +='  '+ key + ' [\n';
                 for (const metaKey of Object.keys(nested1)) {
                    if(typeof(nested1[metaKey]) === 'object'){
                        gml +='   ' + metaKey + ' [\n';
                        var nested2 = nested1[metaKey];
                        for (const metaKey2 of Object.keys(nested2)) {
                            gml +='     ' + metaKey2 + ' "' + nested2[metaKey2] + '"\n';
                        }
                        gml += '    ]\n';
                    }
                    else {
                        gml += '   ' + metaKey + ' "' + nested1[metaKey] + '"\n';
                    }
                 }
                 gml += '  ]\n';

            }
            else
            {
                gml +='  ' + key + ' "' + d[key] + '"\n';
            }
         }
    gml += ' ]\n'; //end nodes
    });


gml += ']\n'; //end graph
//console.log(gml);
return gml

}

function copyToClipboard(value) {
  var $temp = $("<textarea>");
  $("body").append($temp);
  $temp.val(value).select();
  document.execCommand("copy"); //use cut to replace copy, this to avoid recursive call to .execCommand (which is prohibited in browsers to avoid attacks)
  $temp.remove();
}

function getDuplicates(arr) {
// this functions understands JSONGraph format and will return duplicate nodes (key: label,type) or duplicate links (key: source,relation,target)
// takes either an array of nodes or edges

    var uniq = arr
      .map((item) => {
        return {
          count: 1,
          name: getKey(item)
        }
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {})

   var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
   return duplicates

}

function getKey(item) {

   var key = "";
   if(checkNested(item,"type")) {
        //this is a node
        key = [item.label.trim(),item.type.trim()].join(",");
   }
   else{
        //this is an edge
        if(checkNested(item.source,"label")) {
            key = [item.source.label,item.relation.trim(),item.target.label].join(",");
        }
        else
        {
            key = [item.source,item.relation.trim(),item.target].join(",");
        }
   }

   return key;
}

function fillSortedLegend(){
    var index = 1;

    //the below array defines a custom sort on how legend (and thus the horizontal forces) should be layed down on screen
    var orderedTypes = [
        "Processing script",
        "File",
        "Batch of extractions",
        "Batch of stored procedures",
        "Batch of feeders",
        "Label of data",
        "Global filter",
        "Scanner template",
        "Extraction",
        "Datamart layout",
        "Datamart view",
        "Datamart item formula",
        "Stored procedure",
        "Feeder",
        "Datamart table",
        "Non-managed table",
        "Dynamic table",
        "MEF ADT view",
        "Risk monitor view",
        "Forwards viewer",
        "CVA",
        "Market data service",
        "PLVAR scenario",
        "Simulation layout",
        "Simulation view",
        "Simulation item formula",
        "Portfolio tree",
        "LRB request",
        "Datamodel query",
        "Inventory snapshot template"
    ]



    var cntOrderedTypes = orderedTypes.length;
    var cntLegend = Object.keys(legend).length;

    for (const key of Object.keys(legend)) {
         for (var i = 0; i < cntOrderedTypes; i++ ) {
             if(orderedTypes[i].toLowerCase().trim() == key.toLowerCase().trim() )
             {
                index = ((i+1)*cntLegend)/cntOrderedTypes;
                var tmp = {}
                tmp.name = key;
                tmp.index = index;
                sortedLegend.push(tmp);
                break;
             }
         }
    }

    sortedLegend.sort(function(a, b){ return a.index - b.index; });


}

function getLegendIndex(nodeType){
    var index = 1;
    for (var i = 0; i < sortedLegend.length; i++ ) {

        if(sortedLegend[i].name.toLowerCase().trim() == nodeType.toLowerCase().trim())
        {
            index = i+1;
            break;
        }

    }
return index;
}

function getDeleteObjectEndpoint(object){
//takes a graph object, and uses its 'type' and returns the corresponding DELETE endpoint name (as per YAML specs)
//only supported objects are listed
    var typeInEndpoint ="not supported";
    switch(object.type){
        case "Batch of Extractions": typeInEndpoint = "batches-of-extractions"; break;
        case "Batch of stored procedures": typeInEndpoint = "batches-of-stored-procedures"; break;
        case "Batch of Feeders": typeInEndpoint = "batches-of-feeders"; break;
        case "Global filter": typeInEndpoint = "global-filters"; break;
        case "Scanner template": typeInEndpoint = "scanner-templates"; break;
        case "Extraction": typeInEndpoint = "extractions"; break;
        case "Stored procedure": typeInEndpoint = "stored-procedures"; break;
        case "Feeder": typeInEndpoint = "feeders"; break;
        case "Datamart table": typeInEndpoint = "datamart-tables"; break;
        case "Dynamic table": {
            if(object.name.endsWith("/Murex")) typeInEndpoint = "dynamic-tables/murex";
            else if(object.name.endsWith("/User")) typeInEndpoint = "dynamic-tables/user";
            else if(object.name.endsWith("/Murex additional")) typeInEndpoint = "dynamic-tables/murex-additional";
            else if(object.name.endsWith("/User additional")) typeInEndpoint = "dynamic-tables/user-additional";
            else typeInEndpoint = "not supported";
            break;
        }
        default: typeInEndpoint: "not supported";
    }

return typeInEndpoint;
}

function getObjectRepoPath(type, cmName){
     rPath = "not found"
     for (const key of Object.keys(repoPaths)) {
        if (repoPaths[key].type == type && repoPaths[key].cmName == cmName) {
            rPath = key;
            break;
            }
     }

     return rPath

}

function buildDepMatrix(links){
    // builds an object listing for each node, the node ids at both 'in' , 'out', 'up' & 'down' edges

    // get in / out
    for(var i in links){

    if (!(links[i].source in depMatrix)) {
        depMatrix[links[i].source] = { "in" : [], "out" : [], "up" : [], "down" : [] }
    }

    if (!(links[i].target in depMatrix)) {
            depMatrix[links[i].target] = { "in" : [], "out" : [], "up" : [], "down" : [] }
    }

    depMatrix[links[i].source]["out"].push(links[i].target)
    depMatrix[links[i].target]["in"].push(links[i].source)

    }

    // get up/down
    for (nid in depMatrix){

        nd = getNode(nid)
        allNeighbours = getNeighboursIds(nid, "inout")

        for(var i = 0; i < allNeighbours.length; i++){

            nbr = getNode(allNeighbours[i])
            if (nbr.depLevel >= nd.depLevel){
                depMatrix[nid]['up'].push(nbr.id)
            }
            else{
                depMatrix[nid]['down'].push(nbr.id)
            }
        }
    }
}

function getNeighboursIds(nid, direction){
    // get unique neigbouring cells
    if (nid in depMatrix){
        if (direction == "inout") {
            return Array.from(new Set(depMatrix[nid]['in'].concat(depMatrix[nid]['out'])));

        }
        else if (direction == "in")
        {
            return Array.from(new Set(depMatrix[nid]['in']));

        }
        else if (direction == "out")
        {
            return Array.from(new Set(depMatrix[nid]['out']));

        }
        else if (direction == "updown")
        {
           return Array.from(new Set(depMatrix[nid]['up'].concat(depMatrix[nid]['down'])));

        }
        else if (direction == "up")
        {
            return Array.from(new Set(depMatrix[nid]['up']));

        }
       else if (direction == "down")
       {
           return Array.from(new Set(depMatrix[nid]['down']));

       }


    }
    else {
     return []
    }
}

function recursiveNeighbours(nid, direction){
    // will traverse neighbouring nodes, and their neighbours in the provided 'direction'.
    // this is done recursively until stop condition is met (i.e farNbNodesIds.length == 0)
    var nbNodesIds = getNeighboursIds(nid, direction)

    for (var i = 0; i < nbNodesIds.length; i++){

        addNode(getNode(nbNodesIds[i]))

        if (direction == "out") {
            addLinks(nid, nbNodesIds[i])
        }
        else if (direction == "in"){
            addLinks(nbNodesIds[i], nid)
        }
        else if (direction == "up"){
            addLinks(nbNodesIds[i], nid)
            addLinks(nid, nbNodesIds[i])
        }
        else if (direction == "down"){
            addLinks(nbNodesIds[i], nid)
            addLinks(nid, nbNodesIds[i])
        }

        var farNbNodesIds = getNeighboursIds(nbNodesIds[i], direction)

        if (farNbNodesIds.length != 0){
            recursiveNeighbours(nbNodesIds[i], direction)
        }
    }

}

function countNodesByType(type){
    var cnt = 0
    for(var i in nodes){
        if (nodes[i].type == type){
            cnt += 1
        }
    }
    return cnt
}

function checkZoomLevel(){

    var legendWidth = 210
    var viewPortWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    var currentZoomLevel = (window.devicePixelRatio * 100).toFixed(0);

    var relativeLegendWidth = Math.round(legendWidth / viewPortWidth * 100)
    var newZoomLevel = Math.round(currentZoomLevel * 13 / relativeLegendWidth)
    if (relativeLegendWidth > 20){
    Swal.fire({
        title: 'Adjust zoom',
        position: "center",
        html: 'The screen/zoom is relatively small for the graph to be displayed properly<br><br>Try zooming out using ctrl+mouse wheel, then <b>reload</b> the page to apply the changes'
      })
    }

    //document.body.style.zoom = newZoomLevel + "%";  //this can set zoom level, but it is not working very well
    //console.log("zoom level adjusted from '" + currentZoomLevel + "' to '" + newZoomLevel + "' ")

}

function scale(num, in_min, in_max, out_min, out_max){
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}