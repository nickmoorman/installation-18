var limdu = require('limdu');

module.exports = Learner;

function Learner() {
  var MyWinnow = limdu.classifiers.Winnow.bind(0, {
    retrain_count: 10
  });

  this.classifier = new limdu.classifiers.multilabel.BinaryRelevance({
    binaryClassifierType: MyWinnow
  });
}

Learner.prototype.translateString = function(str) {
  var words = str.split(' ');
  var input = {};
  words.forEach(function(w) {
    input[w] = 1;
  });

  return input;
}

Learner.prototype.train = function() {
  var self = this;

  var phrases = {
    football: [
      "The SuperBowl is this weekend!",
      "Can't wait to go to the superbowl",
      "I love football",
      "Rooting for the Seahawks this weekend",
      "Praying for the Broncos",
      "Come on Hawks!",
      "If football players can change teams, so can fans."
    ],
    basketball: [
      "Shout out to the basketball team for helping me",
      "Off to play basketball with my cousin.",
      "I know everyone's about basketball this week",
      "Dinner, hot cocoa, a house tour, & men's basketball",
      "High school basketball coach arrested"
    ]
  };

  var trainingBatch = [];

  for (sport in phrases) {
    var statements = phrases[sport];
    statements.forEach(function(str) {
      trainingBatch.push({
        input: self.translateString(str),
        output: sport
      });
    });
  }

  this.classifier.trainBatch(trainingBatch);
}

Learner.prototype.classify = function(tweet) {
  return this.classifier.classify(this.translateString(tweet));
}
