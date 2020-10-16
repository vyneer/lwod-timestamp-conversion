function parseQuery(url) {
  var query = url.split("?")[1];
  if (query) {
    return query.split("&")
    .reduce(function(o, e) {
      var temp = e.split("=");
      var key = temp[0].trim();
      var value = temp[1].trim();
      value = isNaN(value) ? value : Number(value);
      if (o[key]) {
        o[key].push(value);
      } else {
        o[key] = [value];
      }
      return o;
    }, {});
  }
  return null;
}

function TwitchToYt(twitchurl, youtubeid, offset) {
  var queryParams = parseQuery(twitchurl);
  var timeRegex = /(\d+[Hh])?(\d+[Mm])?(\d+[Ss])?/;
  if ("t" in queryParams) {
    var match = queryParams["t"][0].match(timeRegex);
    var hours = Number(match[1].slice(0, -1));
    var minutes = Number(match[2].slice(0, -1));
    var sec = Number(match[3].slice(0, -1)) + minutes*60 + hours*60*60 + offset;
    return `https://youtu.be/${youtubeid}?t=${sec}`
  } else {
    throw new Error("No 't' parameter in the url.");
  }
}

function YtToTwitch(youtubeurl, twitchid, offset) {
  var queryParams = parseQuery(youtubeurl);
  if ("t" in queryParams) {
    var fullSec = Number(queryParams["t"][0]) + offset;
    var hoursFloat = fullSec/(60*60);
    var hoursInt = Math.floor(hoursFloat);
    var minutesFloat = (hoursFloat - hoursInt)*60;
    var minutesInt = Math.floor(minutesFloat);
    var secInt = fullSec - (minutesInt*60 + hoursInt*60*60);
    return `https://www.twitch.tv/videos/${twitchid}?t=${hoursInt}h${minutesInt}m${secInt}s`
  } else {
    throw new Error("No 't' parameter in the url.");
  }
}