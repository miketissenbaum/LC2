import './central.html';
import { Meteor } from 'meteor/meteor';
// import { Cities } from '/imports/api/links/links.js';
import { Games } from '/imports/api/links/links.js';
// import { TradeResources } from '/imports/api/links/methods.js';
// import { ResetAll } from '/imports/api/links/methods.js';

Template.cityStates.onCreated(function helloOnCreated() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
  Meteor.subscribe('games.all');
  Meteor.subscribe('producers.all');
});

Template.cityStates.helpers({
  cities() {
    return Games.find({$and:[{"gameCode": FlowRouter.getParam('gameCode')}, {"role": "base"}]});
  }
});