PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
  Meteor.subscribe("thePlayers");

  Template.leaderboard.helpers({
    'player': function() {
      var currentUserId = Meteor.userId();
      return PlayersList.find({ createdBy: currentUserId },
                              { sort: { score: -1, name: 1 }});
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return "selected";
      }
    },
    'selectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne({ _id: selectedPlayer });
    },
  });

  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, 5);
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, -5);
    },
    'click .delete': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selectedPlayer);
    },
    'click .clearSelection': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', null);
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var playerScoreVar = Number(event.target.playerScore.value);
      Meteor.call('createPlayer', playerNameVar, playerScoreVar);

      event.target.playerName.value = "";
      event.target.playerScore.value = "";
    }
  });
}

if(Meteor.isServer){
  Meteor.publish("thePlayers", function(){
    var curentUserID = this.userId;
    return PlayersList.find({ createdBy: curentUserID });
  });
}

Meteor.methods({
  'createPlayer': function(playerNameVar, playerScoreVar){
    check(playerNameVar, String);
    check(playerScoreVar, Number);
    var currentUserId = Meteor.userId();
    if(currentUserId) {
      PlayersList.insert({
        name: playerNameVar,
        score: playerScoreVar,
        createdBy: currentUserId
      });
    }
  },
  'removePlayer': function(selectedPlayer){
    check(selectedPlayer, String);
    var currentUserId = Meteor.userId();
    if(currentUserId){
      PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
    }
  },
  'updateScore': function(selectedPlayer, increment) {
    check(selectedPlayer, String);
    check(increment, Number);
    var currentUserId = Meteor.userId();
    if(currentUserId){
      PlayersList.update( { _id: selectedPlayer },
                          { $inc: { score: increment}});
    }
  }
});
