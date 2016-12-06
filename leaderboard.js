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
      PlayersList.update({ _id: selectedPlayer }, { $inc: { score: 5 }});
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update({ _id: selectedPlayer }, { $inc: { score: -5}});
    },
    'click .delete': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.remove({ _id: selectedPlayer });
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
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: playerScoreVar,
        createdBy: currentUserId
      });
      event.target.playerName.value = "";
      event.target.playerScore.value = "";
    }
  });
}

if(Meteor.isServer){
  // var list = PlayersList.find().fetch()
  // display = function(arr){
  //   arr.forEach(function(item){
  //     console.log( "Name: "+ item.name +" | Score: "+ item.score + " | CreatedBy: "+  item.createdBy)
  //   });
  // };
  // display(list);
  Meteor.publish("thePlayers", function(){
    var curentUserID = this.userId;
    return PlayersList.find({ createdBy: curentUserID });
  });
}
