var Metric = require('./metric');

module.exports = Metrics;

function Metrics() {
  this.totalTweets = 0;
  this.tweetsPerBrand = new Metric();
  this.tweetsPerLanguage = new Metric();
  this.startTimestamp = Math.round(Date.now()/1000);
};

Metrics.prototype.clean = function() {
  var now = Math.round(Date.now()/1000);
  var perMinute = {
    all: this.totalTweets/(now-this.startTimestamp)/60
  };
  for (var brand in this.tweetsPerBrand._data) {
    perMinute[brand] = this.tweetsPerBrand._data[brand]/(now-this.startTimestamp)/60;
  }

  return {
    totalTweets: this.totalTweets,
    tweetsPerMinute: perMinute,
    tweetsPerBrand: this.tweetsPerBrand._data,
    tweetsPerLanguage: this.tweetsPerLanguage._data,
    startTimestamp: this.startTimestamp
  }
}
