var Metric = require('./metric');

module.exports = Metrics;

function Metrics(mode) {
  this.mode = mode;
  this.totalTweets = 0;
  switch(mode) {
    case 'sports':
      this.tweetsPerSport = new Metric();
      break;
    default:
      this.tweetsPerBrand = new Metric();
  }
  this.tweetsPerLanguage = new Metric();
  this.startTimestamp = Math.round(Date.now()/1000);
};

Metrics.prototype.clean = function() {
  var now = Math.round(Date.now()/1000);
  var perMinute = {
    all: this.totalTweets/(now-this.startTimestamp)/60
  };
  var data;
  switch(this.mode) {
    case 'sports':
      data = this.tweetsPerSport._data;
      break;
    default:
      data = this.tweetsPerBrand._data;
  }

  for (var key in data) {
    perMinute[key] = data[key]/(now-this.startTimestamp)/60;
  }

  var metrics = {
    totalTweets: this.totalTweets,
    tweetsPerMinute: perMinute,
    tweetsPerLanguage: this.tweetsPerLanguage._data,
    startTimestamp: this.startTimestamp
  }
  switch(this.mode) {
    case 'sports':
      metrics['tweetsPerSport'] = this.tweetsPerSport._data;
      break;
    default:
      metrics['tweetsPerBrand'] = this.tweetsPerBrand._data;
  }

  return metrics;
}
