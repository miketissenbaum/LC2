import './trade.html';
import { Meteor } from 'meteor/meteor';
// import { Cities } from '/imports/api/links/links.js';
import { Games } from '/imports/api/links/links.js';
import { TradeResources } from '/imports/api/links/methods.js';
import { ResetAll } from '/imports/api/links/methods.js';

Template.trade.onCreated(function helloOnCreated() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
  Meteor.subscribe('games.running');
});

Template.trade.helpers({
  resource() {
    return [
      {"name": "m1", "displayName": "Gold"}, 
      {"name": "m2", "displayName": "Steel"}, 
      {"name": "f1", "displayName": "Food"}, 
      {"name": "f2", "displayName": "Cotton"}];
  },
  otherPlayers() {
    gCode = FlowRouter.getParam("gameCode");
    thisGame = Games.findOne({$and: [{"playerId": Meteor.userId()}, {"gameCode": gCode}]});
    thisGroup = thisGame.group;
    // console.log(thisGame);
    return Games.find({$and: [{"gameCode": gCode}, {"role": "player"}, {"group": {$ne: thisGroup}}]});
  },

});

Template.trade.events({
  'submit .trade' (event, instance) {
    gCode = FlowRouter.getParam("gameCode");
    event.preventDefault();
    val = event.target.amount.value;
    res = event.target["resource"].value;
    // from = event.target["from-city"].value;
    // fromPlayer = Meteor.userId();
    // fromGroup =  Games.findOne({$and: [{"playerId": Meteor.userId()}, {"gameCode": gCode}]}).group;
    from =  Games.findOne({$and: [{"playerId": Meteor.userId()}, {"gameCode": gCode}]});
    to = Games.findOne({"_id": event.target["to-city"].value});
    if (val == "" || event.target["to-city"].value == "") {
      console.log("empty val");
    }
    else {
      TradeResources.call({"amount": parseInt(val), "resource": res, "from": from, "to": to}, (err, res) => {
        if (err) {
          alert(err.error);
          console.log(err);
        } else {
          alert("Sent!");
        }
      });
    }
    // console.log(event.target["to-city"].value);
    
  }
  
});
