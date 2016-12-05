PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
  Template.leaderboard.helpers({
    'player': function() {
      return "Some other text";
    },
    'score': function() {
      return "Return score here";
    }
  });
}

if(Meteor.isServer){
  console.log("Server only");
}
