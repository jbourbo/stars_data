// set up the main template the the router will use to build pages
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
    console.log("rendering root /");
    this.render("navbar", {to:"header"});
    this.render("landingpage", {to:"main"});
});


Router.route('/poscolor', function () {
    this.render("navbar", {to:"header"});
    this.render("poscolor", {to:"main"});
});

Router.route('/distance', function () {
    this.render("navbar", {to:"header"});
    this.render("distance", {to:"main"});
});

Router.route('/color', function () {
    this.render("navbar", {to:"header"});
    this.render("color", {to:"main"});
});

// this variable will store the visualisation so we can delete it when we need to
var visjsobj;
var visjsobj2;

////////////////////////////
///// functions that set up and display the visualisation
////////////////////////////


// function that creates a new timeline visualisation
function initDistVis(){
    // clear out the old visualisation if needed
    if (visjsobj2 != undefined){
        visjsobj2.destroy();
    }
    var slider = Slider.findOne({});

    if(slider){
        var stars = Stars.find({distly:{$lte: slider.slide}});
        //console.log("slider value in template: " + slider.slide);
    }else{
        var stars = Stars.find();
        //console.log("value (no slider): 13");
    }


    //var stars = Stars.find();
    var ind = 0;
    // generate an array of items
    // from the songs collection
    // where each item describes a song plus the currently selected
    // feature
    var items = new Array();
    // iterate the songs collection, converting each song into a simple
    // object that the visualiser understands
    stars.forEach(function(star){
        if ( star.distly != undefined ){
            var label = "ind: "+ind;
            if (star.label != undefined){// we have a title
                label = star.label;
            }
            var value = star[Session.get("feature")["name"]];
            if(value == undefined || value == ""){
                value = star["x"];
            }
            var dist = star.distly;
            var items = new Array();
            // here we create the actual object for the visualiser
            // and put it into the items array
            items[ind] = {
                x: dist,
                y: value,
                // slighlty hacky label -- check out the vis-label
                // class in song_data_viz.css
                label:{content:label, className:'vis-label', xOffset:-50},
            };
            //console.log(items[ind]);
            ind ++ ;

        }
    });
    // set up the data plotter
    var options = {
        sort: false,
        sampling:false,
        style:'points',
        drawPoints: {
            enabled: true,
            size: 6,
            style: 'circle' // square, circle
        },
    };


    var dataset = new vis.DataSet(items);

    // get the div from the DOM that we are going to
    // put our graph into
    var container = document.getElementById('visjs2');
    // create the graph
    visjsobj2 = new vis.Graph2d(container, items, options);
    //console.log(visjsobj2);
    // tell the graph to set up its axes so all data points are shown
    visjsobj2.fit();
}

// function that creates a new timeline visualisation
function initColorVis(filter){
    // clear out the old visualisation if needed
    if (visjsobj != undefined){
        visjsobj.destroy();
    }
    console.log("filter: "+filter);
    if(filter=="blue"){
        var stars = Stars.find({colorb_v: {$gte: -1.0, $lte: 0.0}});
    }
    else if(filter=="red"){
        var stars = Stars.find({colorb_v: {$gte: 0.0, $lte: 1.0}});
    }
    else{
        var stars = Stars.find();
    }
    var groups = new vis.DataSet();


    var groupData = {
        id: 0,
        content: "Blue Planets",
        className: 'groupBlueStyle',
        //options: {
        //    drawPoints: {
        //        style: 'square' // square, circle
        //    },
        //    shaded: {
        //        orientation: 'zero' // top, bottom
        //    }
        //}
    };
    groups.add(groupData);
    var groupData2 = {
        id: 1,
        content: "Red Planets",
        className: 'groupRedStyle',
        //options: {
        //    drawPoints: {
        //        style: 'square' // square, circle
        //    },
        //    shaded: {
        //        orientation: 'zero' // top, bottom
        //    }
        //}
    };
    groups.add(groupData2);
    //visjsobj.setGroups(groups);
    //groups.add({id: 1, content: "RedPlanets"});

    var ind = 0;
    // generate an array of items
    // from the songs collection
    // where each item describes a song plus the currently selected
    // feature
    var items = new Array();
    // iterate the songs collection, converting each song into a simple
    // object that the visualiser understands
    stars.forEach(function(star){
        if (star.label != undefined ){
            var label = star.label;
            var value = star[Session.get("feature")["name"]];
            if(value == undefined || value == ""){
                value = "x";
            }
            var value2 = star[Session.get("feature2")["name"]];
            if(value2 == undefined || value == ""){
                value2 = "y";
            }

            if(star.colorb_v <= 0.0){
                var gr = 0;
            } else {
                var gr = 1;
            }

            // here we create the actual object for the visualiser
            // and put it into the items array
            items[ind] = {
                x: value,
                y: value2,
                group: gr,
                // slighlty hacky label -- check out the vis-label
                // class in song_data_viz.css
                label:{content:label, className:'vis-label', xOffset:-5},
            };
            ind ++ ;
        }
    });
    // set up the data plotter
    var options = {
        style:'bar',
        dataAxis: {
            left:{
                title: {
                    text: Session.get("feature2")["name"]
                }
            },
            visible: true

        },
    };
    // get the div from the DOM that we are going to
    // put our graph into
    var container = document.getElementById('visjs');
    // create the graph
    //visjsobj.setGroups(groups);
    visjsobj = new vis.Graph2d(container, items, groups, options);

    // tell the graph to set up its axes so all data points are shown
    visjsobj.fit();
}





// function that creates a new timeline visualisation
function initPosSizeColorVis(){
    // clear out the old visualisation if needed
    if (visjsobj != undefined){
        //visjsobj.destroy();
    }
    var stars = Stars.find({});
    var ind = 0;
    var data = new vis.DataSet();
    var steps = stars.length;

    var axisMax = 0;

    stars.forEach(function(star) {
        var value = star[Session.get("feature")["name"]];
        if(value == undefined || value == ""){
            value = "x";
        }
        data.add({x: star.x, y: star.y, z: star.z, style: value});

    })


    // set up the data plotter
    var options = {
        style: 'dot-color',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5
    };
    // get the div from the DOM that we are going to
    // put our graph into
    var container = document.getElementById('visjs');
    // create the graph
    visjsobj = new vis.Graph3d(container, data, options);
    // tell the graph to set up its axes so all data points are shown
    visjsobj.fit();
}

Template.slider.onRendered(function() {

    Tracker.autorun(function(){
        var handler = _.throttle(function(event, ui) {
            var val = Slider.findOne({});
            Slider.update({ _id: val._id }, {$set: {slide: ui.value}});
        }, 50, { leading: false });

        if (!this.$('#slider').data('uiSlider')) {
            $("#slider").slider({
                slide: handler,
                min: 0,
                max: 13
            });
        }
    });


});

Template.slider.helpers({
    sliderVal:  function() {
        var slider = Slider.findOne(); // this guy is reactive, so when another client updates the Collection, it'll get pushed to us
        if (slider) {
            var tmpl = Template.instance();

            tmpl.$('#slider').data('uiSlider').value(slider.slide); // Template.instance() b/c `this` doesn't return a template instance in a helper

            return slider.slide; // again, here you can return nothing if you'd rather have no text
        }
        else{
            console.log("no slider value");
            return "Please use the slider";
        }
    }
});


// function that creates a new blobby visualisation
function initBlobVis(){
    // clear out the old visualisation if needed
    if (visjsobj != undefined){
        visjsobj.destroy();
    }
    // find all songs from the Songs collection
    var stars = Stars.find({});
    var nodes = new Array();
    var ind = 0;

    var groups = new vis.DataSet();
    groups.add({
        id: 1,
        content: 'Blue Planets',
        // Optional: a field 'visible'
        // Optional: a field 'className'
        // Optional: options
    })
    groups.add({
        // more groups...
    });

    // iterate the songs, converting each song into
    // a node object that the visualiser can understand
    stars.forEach(function(star){
        // set up a label with the song title and artist
        var label = "ind: "+ind;
        if (star.label != undefined){// we have a title
            label = star.label;
        }
        // figure out the value of this feature for this song
        var value = star[Session.get("feature")["name"]];
        if(value == undefined || value == ""){
            value = "x";
        }
        // create the node and store it to the nodes array
        nodes[ind] = {
            id:ind,
            label:label,
            value:value,
        }
        ind ++;
    })
    // edges are used to connect nodes together.
    // we don't need these for now...
    edges =[
    ];
    // this data will be used to create the visualisation
    var data = {
        nodes: nodes,
        edges: edges
    };
    // options for the visualisation
    var options = {
        nodes: {
            shape: 'dot',
        }
    };
    // get the div from the dom that we'll put the visualisation into
    container = document.getElementById('visjs');
    // create the visualisation
    visjsobj = new vis.Network(container, data, options);
}



////////////////////////////
///// helper functions for the vis control form
////////////////////////////

Template.song_viz_controls.helpers({
    // returns an array of the names of all features of the requested type
    get_feature_names : function(){

        // pull an example song from the database
        // - we'll use this to find the names of all the single features
        star = Stars.findOne();
        if (star != undefined){// looks good!
            // get an array of all the song feature names
            // (an array of strings)
            features = Object.keys(star);
            //console.log(features);
            features_a = new Array();
            // create a new array containing
            // objects that we can send to the template
            // since we can't send an array of strings to the template
            for (var i=2;i<features.length;i++){
                features_a[i] = {name:features[i]};
            }
            return features_a;
        }
        else {// no song available, return an empty array for politeness
            return [];
        }
    },
});

Template.song_viz_controls_distance.helpers({
    // returns an array of the names of all features of the requested type
    get_feature_names : function(){

        // pull an example song from the database
        // - we'll use this to find the names of all the single features
        star = Stars.findOne();
        if (star != undefined){// looks good!
            // get an array of all the song feature names
            // (an array of strings)
            features = Object.keys(star);
            //console.log(features);
            features_a = new Array();
            // create a new array containing
            // objects that we can send to the template
            // since we can't send an array of strings to the template
            for (var i=2;i<features.length;i++){
                features_a[i] = {name:features[i]};
            }
            return features_a;
        }
        else {// no song available, return an empty array for politeness
            return [];
        }
    },
});


Template.song_viz_controls_color.helpers({
    // returns an array of the names of all features of the requested type
    get_feature_names : function(){

        // pull an example song from the database
        // - we'll use this to find the names of all the single features
        star = Stars.findOne();
        if (star != undefined){// looks good!
            // get an array of all the song feature names
            // (an array of strings)
            features = Object.keys(star);
            //console.log(features);
            features_a = new Array();
            // create a new array containing
            // objects that we can send to the template
            // since we can't send an array of strings to the template
            for (var i=2;i<features.length;i++){
                features_a[i] = {name:features[i]};
            }
            return features_a;
        }
        else {// no song available, return an empty array for politeness
            return [];
        }
    },
});

Template.song_viz_controls_poscolor.helpers({
    // returns an array of the names of all features of the requested type
    get_feature_names : function(){

        // pull an example song from the database
        // - we'll use this to find the names of all the single features
        star = Stars.findOne();
        if (star != undefined){// looks good!
            // get an array of all the song feature names
            // (an array of strings)
            features = Object.keys(star);
            //console.log(features);
            features_a = new Array();
            // create a new array containing
            // objects that we can send to the template
            // since we can't send an array of strings to the template
            for (var i=2;i<features.length;i++){
                features_a[i] = {name:features[i]};
            }
            return features_a;
        }
        else {// no song available, return an empty array for politeness
            return [];
        }
    },
});


////////////////////////////
///// helper functions for the feature list display template
////// (provide the data for that list of songs)
////////////////////////////

// helper that provides an array of feature_values
// for all songs of the currently selected type
// this is used to feed the template that displays the big list of
// numbers
Template.song_feature_list.helpers({
    "get_all_feature_values":function(){
        if (Session.get("feature") != undefined){
            var stars = Stars.find({});
            var features = new Array();
            var ind = 0;
            // build an array of data on the fly for the
            // template consisting of 'feature' objects
            // describing the song and the value it has for this particular feature
            stars.forEach(function(star){
                //console.log(song);
                features[ind] = {
                    label:star.label,
                    title:star.label,
                    value:star[[Session.get("feature")["name"]]]
                };
                ind ++;
            })
            return features;
        }
        else {
            return [];
        }
    }
})

////////////////////////////
///// event handlers for the viz control form
////////////////////////////

Template.song_viz_controls.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature":function(event){
        event.preventDefault();
        var feature = $(event.target).val();
        Session.set("feature", {name:feature});
    },
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature2":function(event){
        event.preventDefault();
        var feature = $(event.target).val();
        Session.set("feature2", {name:feature});
    },
    // event handler for when the user clicks on the
    // blobs button
    "click .js-show-blobs":function(event){
        event.preventDefault();
        initBlobVis();
    },
    // event handler for when the user clicks on the
    // timeline button

    "click .js-show-distance":function(event){
        event.preventDefault();
        initDateVis();
    },
    // event handler for when the user clicks on the
    // distance button
    "click .js-show-poscolor":function(event){
        event.preventDefault();
        initPosSizeColorVis();
    },
});

Template.song_viz_controls_distance.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature":function(event){
        event.preventDefault();
        var feature = $(event.target).val();
        Session.set("feature", {name:feature});
    },

    // event handler for when the user clicks on the
    // timeline button
    "click .js-show-distance":function(event){
        event.preventDefault();
        initDistVis();
    },

});

Template.song_viz_controls_color.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature":function(event){
        event.preventDefault();
        var feature = $(event.target).val();
        Session.set("feature", {name:feature});
    },
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature2":function(event){
        event.preventDefault();
        var feature = $(event.target).val();
        Session.set("feature2", {name:feature});
    },
    // event handler for when the user clicks on the
    // blobs button
    "click .js-show-blobs":function(event){
        event.preventDefault();
        initBlobVis();
    },
    // event handler for when the user clicks on the
    // timeline button

    "click .js-show-distance":function(event){
        event.preventDefault();
        initDistVis();
    },
    // event handler for when the user clicks on the
    // distance button
    "click .js-show-poscolor":function(event){
        event.preventDefault()
        initPosSizeColorVis();
    },
    // event handler for when the user clicks on the
    // distance button
    "click .js-show-color":function(event){
        event.preventDefault();
        initColorVis("both");
    },
});

Template.song_viz_controls_poscolor.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature":function(event){
        event.preventDefault();
        var feature = $(event.target).val();
        Session.set("feature", {name:feature});
    },

    // event handler for when the user clicks on the
    // distance button
    "click .js-show-poscolor":function(event){
        event.preventDefault()
        initPosSizeColorVis();
    },

});

Template.color.events({

    // event handler for when the user clicks on the
    // blobs button
    "click .js-show-blueplanets":function(event){
        event.preventDefault();
        initColorVis("blue");
    },
    // event handler for when the user clicks on the
    // timeline button

    "click .js-show-redplanets":function(event){
        event.preventDefault();
        initColorVis("red");
    },
    // event handler for when the user clicks on the
    // distance button
    "click .js-show-allplanets":function(event){
        event.preventDefault()
        initColorVis("both");
    },
});