import './navbar.html';
// import { Producers } from '/imports/api/links/links.js';
// import { Assets } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import { Games } from '/imports/api/links/links.js';
// import { NewRound } from '/imports/api/links/methods.js';
// import { BuyProducer } from '/imports/api/links/methods.js';

Template.navBar.onCreated(function helloOnCreated() {
  Meteor.subscribe('games.running');

});

Template.navBar.helpers({
   // logOut
   groupInfo () {
     gameCode = FlowRouter.getParam("gameCode");
     // console.log(gameCode);
     group = "";
     if (gameCode != undefined){
       game = Games.findOne({$and: [{"playerId": Meteor.userId()}, {"gameCode": gameCode}]});
       if (game != undefined) {
         group = game.group
       }
     }
     if (group != ""){
       group = group;
     }
     return group;
   },

   gameCode () {
     // console.log(FlowRouter.getParam("gameCode"));
     return FlowRouter.getParam("gameCode");
   }
});

Template.navBar.events({
  'click .logOut': function () {
    // console.log("logging out?");
    AccountsTemplates.logout();
    // Router.go('/');
  }
});