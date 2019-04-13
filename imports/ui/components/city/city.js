import './city.html';
import { Cities } from '/imports/api/links/links.js';
import { Producers } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

// import { NewRound } from '/imports/api/links/methods.js';

Template.cities.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);

  Meteor.subscribe('cities.all');
  Meteor.subscribe('producers.all');

  
  //kind
  //m1 cost, m2 cost, f1 cost, f2 cost, people cost
  //production kind: m1, m2, f1, f2
  //production amount
  //polluion produced


  // this.kind1 = new ReactiveVar(0);

});

Template.cities.helpers({
  // counter() {
  //   return Template.instance().counter.get();
  // },
  allCities() {
    // console.log((Producers.find({})).toArray());
    // console.log(FlowRouter.current().params.city)
    return Cities.find();
  },

  notCityView() {
    cname = FlowRouter.current().params.city;
    console.log(Cities.find({"name": cname}).fetch());
    if (Cities.find({"name": cname}).fetch().length > 0) {
      return false;
    }
    else {
      return true;
    }
  },

  citySet() {
    return Cities.find({"name": cname});
  }
});

Template.city.helpers({
  cityFactories() {
    // console.log(Producers.find({$and: [{"owned": true}, {"owner": this.name}]}).fetch());
    return Producers.find({$and: [{"owned": true}, {"owner": this.name}]});
  },

  producerColor() {
    producerColors = {
      "p1": "#BBFF99",
      "p2": "#BBFF99",
      "m1": "#C6C6DB",
      "m2": "#C6C6DB",
      "f1": "#FFFF80",
      "f2": "#FFFF80"
    }
    console.log(this);
    return producerColors[this.kind];
    // return this;
  }
});

Template.cityFactory.helpers({
  productionValues() {
    prodText = "";

    // console.log(this.prodValues);
    for (r in this.prodValues) {
      if (r != "poll" && this.prodValues[r] != 0) {
        prodText += this.prodValues[r] + " " + r + "   ";
      }
    }
    prodText += " Pollution: " + this.prodValues["poll"];
    // console.log(prodText);

    return prodText;

    // return Producers.find({$and: [{"owned": true}, {"owner": this.name}]});
  },
  
  productionCosts() {
    costText = "";
    console.log(this.prodCosts);
    for (r in this.prodCosts) {
      if (this.prodCosts[r] != 0) {
        costText += this.prodCosts[r] + " " + r + "   ";
      }
    }
    // prodText += " Pollution: " + this.prodValues["poll"];
    console.log(costText);

    return costText;
  }
});
