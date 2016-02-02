var Twitchy = require("twitchy-nonblocking");
var commandLineArgs = require('command-line-args');
var fs = require('fs');
var async = require('async');
var execSync = require('child_process').execSync;

function fileExists(path) {
  try  {
    return fs.statSync(path).isFile();
  }
  catch (e) {

    if (e.code == 'ENOENT') {
      return false;
    }

    console.log("Exception fs.statSync (" + path + "): " + e);
    throw e;
  }
}

var livestreamer = "C:\\Program Files (x86)\\Livestreamer\\livestreamer.exe";
var livestreamer32 = "C:\\Program Files\\Livestreamer\\livestreamer.exe";

if(!fileExists(livestreamer))  {
	if(!fileExists(livestreamer)){
		console.log("You haven't installed Livestreamer.");
		return;
	}
	livestreamer = livestreamer32;
}

var cli = commandLineArgs([
  { name: 'channel', type: String, defaultOption: true }
])
var options = cli.parse();

client = new Twitchy({});

client._get("channels/" + options.channel + "/videos?limit=100&broadcasts=true", function(err, result){
	var text = result.text;
	var parsed = JSON.parse(text);
	var videos = parsed.videos.reverse();

	async.forEach(videos, function (video, callback) {
		var title = video["title"];
		var id = video["broadcast_id"];
		var url = video["url"];
		title = title.replace("|", "-");
		title = title.replace("/", " of ");
		var file = id + " - " + title + ".mp4";

		if(!fileExists(file)) {
			console.log("Downloading ", file);
			execSync('"' + livestreamer + '" -o ' + '"' + file + '" ' + url + ' best', function (error, stdout, stderr) {
			  console.log('stdout: ' + stdout);
			  console.log('stderr: ' + stderr);
			  if (error !== null) {
			    console.log('exec error: ' + error);
			  }
			});
		}
	});
});

client._close();