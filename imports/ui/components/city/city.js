import './city.html';
import { Cities } from '/imports/api/links/links.js';
import { Producers } from '/imports/api/links/links.js';
import { Games } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import '/imports/ui/stylesheets/style.css';

// import { NewRound } from '/imports/api/links/methods.js';

Template.cities.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);

  Meteor.subscribe('cities.all');
  Meteor.subscribe('producers.public');
  Meteor.subscribe('producers.owned');
  Meteor.subscribe('games.running');
  
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
    // console.log(Cities.find({"name": cname}).fetch());
    if (Cities.find({"name": cname}).fetch().length > 0) {
      return false;
    }
    else {
      return true;
    }
  },

  citySet() {
    thisgame = [Games.findOne({$and: [{"playerId": Meteor.userId()}, {"gameCode": FlowRouter.getParam("gameCode")}, {"status": "running"}, {"role": "base"}]})];
    // return Games.find({"name": cname});
    return thisgame;
  }
});

Template.city.helpers({
  cityFactories() {
    // console.log(Producers.find({$and: [{"owned": true}, {"owner": this.name}]}).fetch());
    return Producers.find({$and: [{"gameCode": FlowRouter.getParam("gameCode")}, {"owned": true}, {"ownerId": Meteor.userId()}]});
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
    // console.log(this);
    return producerColors[this.kind];
    // return this;
  },

  pollArr() {
    return new Array(this.poll).fill(0);
  },

  popArr() {
    return new Array(this.population).fill(0);
    // console.log("population " + new Array(this.pop).fill(0));
  },

  happyArr() {
    return new Array(this.happiness).fill(0);
    // console.log("happiness " + new Array(this.happiness).fill(0));
  },

  m1Arr() {
    // console.log("m1 " + new Array(this.res.m1).fill(0));
    return new Array(this.res.m1).fill(0);
  },

  m2Arr() {
    // console.log("metal " + new Array(this.res.m2).fill(0));
    return new Array(this.res.m2).fill(0);
  },

  f1Arr() {
    // console.log("food1 " + new Array(this.res.f1).fill(0));
    return new Array(this.res.f1).fill(0);
  },

  f2Arr() {
    // console.log("food2 " + new Array(this.res.f2).fill(0));
    return new Array(this.res.f2).fill(0);
  }
});

Template.cityFactory.helpers({
  productionRes() {
   retres = [];

   // console.log(this.prodValues);
   for (r in this.prodValues) {
     if (r != "poll" && this.prodValues[r] != 0) {
       // prodText += this.prodValues[r] + " " + r + "   ";
       retres.push({"resName": r, "resVal": this.prodValues[r], "resValArr": new Array(this.prodValues[r]).fill(0)});
     }
   }
   // prodText += " Pollution: " + this.prodValues["poll"];
   // console.log(prodText);
   // console.log(retres);

   return retres;

   // return Producers.find({$and: [{"owned": true}, {"owner": this.name}]});
 },

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
    // console.log(this.prodCosts);
    for (r in this.prodCosts) {
      if (this.prodCosts[r] != 0) {
        costText += this.prodCosts[r] + " " + r + "   ";
      }
    }
    // prodText += " Pollution: " + this.prodValues["poll"];
    // console.log(costText);

    return costText;
  }
});

