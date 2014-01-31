var Metric = require('./metric');

module.exports = Metrics;

function Metrics() {
  this.totalTweets = 0;
  this.tweetsPerBrand = new Metric();
  this.tweetsPerLanguage = new Metric();
};

Metrics.prototype.clean = function() {
  return {
    totalTweets: this.totalTweets,
    tweetsPerBrand: this.tweetsPerBrand._data,
    tweetsPerLanguage: this.tweetsPerLanguage._data
  }
}
