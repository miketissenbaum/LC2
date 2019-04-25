import './admin.html';
import '../gameList/gameList.js';
import { Producers } from '/imports/api/links/links.js';
// import { Assets } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import { NewRound } from '/imports/api/links/methods.js';
import { StartGame } from '/imports/api/links/methods.js';
import { Games } from '/imports/api/links/links.js';

Template.adminView.onCreated(function helloOnCreated() {

});

Template.adminView.helpers({

});

Template.adminView.events({
  'submit .hostGame': function(event) {
    event.preventDefault();
    size = event.target.groups.value;
    if (size == ""){
      size = 4;
    }
    // console.log(size);
    // cityCount, adminId, adminUsername
    StartGame.call({"adminId": Meteor.userId(), "adminUsername": Meteor.user().profile.name, "cityCount": size}, (err, res) => {
      if(err) {console.log(err);}
    });
  }
});

Template.adminGame.onCreated(function helloOnCreated() {
  Meteor.subscribe('games.running');
});

Template.adminGame.helpers({
  allPlayers() {
    disgame = Games.findOne({"gameCode": FlowRouter.getParam("gameCode")})
    // console.log( disgame.groupList);
    return disgame.groupList;
  }
});

Template.adminGame.events({
  'click .reset' (event, instance) {
    ResetAll.call({"gameCode": FlowRouter.getParam("gameCode")}, (err, res) => {
      if (err) {console.log(err);}
    });
  },

  'click .newRound'(event, instance) {
    // increment the counter when button is clicked
    // instance.counter.set(instance.counter.get() + 1);
    NewRound.call({"gameCode": FlowRouter.getParam("gameCode")}, (err, res) => {
      if (err) {console.log(err);}
    })
  },

  'click .seeScore' (event, instance) {
    FlowRouter.go('App.scoreboard', {gameCode: FlowRouter.getParam("gameCode")});
  }
});