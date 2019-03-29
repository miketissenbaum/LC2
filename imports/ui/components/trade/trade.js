import './trade.html';
import { Meteor } from 'meteor/meteor';
import { Cities } from '/imports/api/links/links.js';
import { TradeResources } from '/imports/api/links/methods.js';
import { ResetAll } from '/imports/api/links/methods.js';

Template.trade.onCreated(function helloOnCreated() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
  Meteor.subscribe('cities.all');
});

Template.trade.helpers({
  resource() {
    return [{"name": "m1"}, {"name": "m2"}, {"name": "f1"}, {"name": "f2"}];
  },
  city() {
    return Cities.find();
  },

});

Template.trade.events({
  'submit .trade'(event, instance) {
    // increment the counter when button is clicked
    // instance.counter.set(instance.counter.get() + 1);
    event.preventDefault();
    val = event.target.amount.value;
    res = event.target["resource"].value;
    from = event.target["from-city"].value;
    to = event.target["to-city"].value;
    if (val == "") {
      console.log("empty val");
    }
    else {
      TradeResources.call({"amount": parseInt(val), "resource": res, "from": from, "to": to});
    }
    // console.log(event.target["to-city"].value);
    
  },

  'click .reset' (event, instance) {
    ResetAll.call({}, (err, res) => {
      if (err) {console.log(err);}
    });
  }

  
});
