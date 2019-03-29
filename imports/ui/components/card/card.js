import './card.html';
import { Producers } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import { NewRound } from '/imports/api/links/methods.js';

Template.card.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);

  Meteor.subscribe('producers.all');

  
  //kind
  //m1 cost, m2 cost, f1 cost, f2 cost, people cost
  //production kind: m1, m2, f1, f2
  //production amount
  //polluion produced


  // this.kind1 = new ReactiveVar(0);

});

Template.card.helpers({
  // counter() {
  //   return Template.instance().counter.get();
  // },
  PublicFactories() {
    return Producers.find({});
  }
});

Template.card.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    // instance.counter.set(instance.counter.get() + 1);
  },
});
