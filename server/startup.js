
// define a startup script that 
// reads the JSON data files from the filesystem 
// and inserts them into the database if needed

Meteor.startup(function(){

	Slider.remove({});


	if (Slider.find().count() == 0) {
		Slider.insert({
			slide: 13
		});
	}

	var slider = Slider.findOne();
	//console.log(slider.slide);

	Stars.remove({});

	if (!Stars.findOne()){
		//console.log("no stars yet... creating from filesystem");
		// pull in the NPM package 'fs' which provides
		// file system functions

		var inserted_stars = 0;


		var stars = Assets.getText("stars13.json");

		stars = stars.replace(/\\n/g, "\\n")
				.replace(/\\'/g, "\\'")
				.replace(/\\"/g, '\\"')
				.replace(/\\&/g, "\\&")
				.replace(/\\r/g, "\\r")
				.replace(/\\t/g, "\\t")
				.replace(/\\b/g, "\\b")
				.replace(/\\f/g, "\\f");
// remove non-printable and other non-valid JSON chars
		stars = stars.replace(/[\u0000-\u0019]+/g,"");


		//console.log(stars);

		var jsonData = JSON.parse(stars);

		//console.log(jsonData[0].label);


		var i;

		for (i = 0; i < jsonData.length; i++) {
			Stars.insert(
					{
						//starID: 	jsonData[i].id,
						label: 		jsonData[i].label,
						x: 			jsonData[i].x,
						y: 			jsonData[i].y,
						z:			jsonData[i].z,
						lum: 		jsonData[i].lum,
						colorb_v: 	jsonData[i].colorb_v,
						absmag: 	jsonData[i].absmag,
						appmag: 	jsonData[i].appmag,
						texnum: 	jsonData[i].texnum,
						distly: 	jsonData[i].distly,
						dcalc:  	jsonData[i].dcalc,
						plx:	 	jsonData[i].plx,
						plxerr:		jsonData[i].plxerr,
						vx:			jsonData[i].vx,
						vy:			jsonData[i].vy,
						vz:			jsonData[i].vz,
						speed:		jsonData[i].speed,
						hipnum:		jsonData[i].hipnum
					});
		}
/*

		var fs = Npm.require("fs");
		var Fiber = Npm.require("fibers");

		fs.readFile('stars13.json', 'utf8', function (err, data) {
			// handle error if there is some

			data = data.replace(/\\n/g, "\\n")
					.replace(/\\'/g, "\\'")
					.replace(/\\"/g, '\\"')
					.replace(/\\&/g, "\\&")
					.replace(/\\r/g, "\\r")
					.replace(/\\t/g, "\\t")
					.replace(/\\b/g, "\\b")
					.replace(/\\f/g, "\\f");
// remove non-printable and other non-valid JSON chars
			data = data.replace(/[\u0000-\u0019]+/g,"");

			var o = JSON.parse(data);


			Fiber(function () {

				_.each(o, function (document) {
					Stars.insert(document);
				});

			}).run();
		});

*/

	}
})

