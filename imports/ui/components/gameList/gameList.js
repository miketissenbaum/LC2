import './gameList.html';
import { Producers } from '/imports/api/links/links.js';
// import { Assets } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
// import { NewRound } from '/imports/api/links/methods.js';
// import { StartGame } from '/imports/api/links/methods.js';
import { Games } from '/imports/api/links/links.js';

Template.gameList.onCreated(function helloOnCreated() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
  Meteor.subscribe('games.running');
});

Template.gameList.helpers({
  userGames() {
    console.log(Meteor.userId());
    console.log(Games.find({"playerId": Meteor.userId()}).fetch());
    console.log(Games.find().fetch());
    return Games.find({});
  },

  gameSize() {
    // console.log(Meteor.userId());
    // console.log(Games.find({"playerId": Meteor.userId()}).fetch());
    sizeText = ""
    if (this.groupList != undefined) {
      sizeText = ": " + this.groupList.length + " cities";
    }
    return sizeText;

    // return Games.find({});
  }
});
