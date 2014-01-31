module.exports = Metric;

function Metric() {
  this._data = {};
};

Metric.prototype.add = function(key) {
  if (!(key in this._data)) {
    this._data[key] = 0;
  }
  this._data[key] += 1;
}
