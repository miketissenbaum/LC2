import './card.html';
import { Producers } from '/imports/api/links/links.js';
// import { Assets } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import { NewRound } from '/imports/api/links/methods.js';
import { BuyProducer } from '/imports/api/links/methods.js';

Template.factoryList.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.city = new ReactiveVar("city1");

  Meteor.subscribe('producers.all');
  // Meteor.subscribe('assets.all');

  
  //kind
  //m1 cost, m2 cost, f1 cost, f2 cost, people cost
  //production kind: m1, m2, f1, f2
  //production amount
  //polluion produced


  // this.kind1 = new ReactiveVar(0);

});

Template.factoryList.helpers({
  // counter() {
  //   return Template.instance().counter.get();
  // },
  PublicFactories() {
    // console.log((Producers.find({})).toArray());
    return Producers.find({$and: [{"owned": false}, {"visible": true}]});
  },

  CurrentCity() {
    return Template.instance().city.get();
  },

  factoryColor() {
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

  factoryIcon() {
    factoryIconSource = {
      "p1": "../img/icons/park_med.png",
      "p2": "../img/icons/park_med.png",
      "m1": "../img/icons/factory_med.png",
      "m2": "../img/icons/factory_med.png",
      "f1": "../img/icons/farm_med.png",
      "f1": "../img/icons/farm_med.png"
    }
    // console.log(this);
    return factoryIconSource[this.kind];
  }

});

Template.factoryList.events({
  'click .newRound'(event, instance) {
    // increment the counter when button is clicked
    // instance.counter.set(instance.counter.get() + 1);
    NewRound.call({}, (err, res) => {
      if (err) {console.log(err);}
    })
  },

  'click .toggleCity' (event, instance) {
    if (instance.city.get() == "city1") {
      instance.city.set("city2");
    }
    else {
      instance.city.set("city1");
    }
  }

});


Template.factory.helpers({
  OutputIcon() {
    factoryOutputType = {
      "m1": "../img/icons/gold_sml.png",
      "f1": "../img/icons/food_sml.png",
      "m2": "../img/icons/steel_sml.png",
      "f2": "../img/icons/cotton_sml.png"
    };
    console.log(this);
    return factoryOutputType[this.kind];
  },

  CostInfo(costList, startText) {
  // CostInfo() {
   costText = "";
   factoryOutputType = {
      "m1": "../img/icons/gold_sml.png",
      "f1": "../img/icons/food_sml.png",
      "m2": "../img/icons/steel_sml.png",
      "f2": "../img/icons/cotton_sml.png",
      "poll": "../img/icons/pollution_sml.png"
    };
   for (r in costList) {
     // console.log(r + " " + factoryOutputType[r]);
     if (costList[r] != 0 && costList[r] != undefined) {
       // costText += costList[r] + " " + r + ", ";

       costText += costList[r];
       costText += '<img class="resourceIcon" src="' + factoryOutputType[r] + '" />';
     }
   }
   // console.log(this);

   // if (costList.poll != 0 || costList.poll != undefined) {
   //   costText += ' and ' + costList.poll + '<img class="resourceIcon" src="../img/icons/pollution_sml.png" />';
   //   // console.log(costText);
   // }
   // console.log(costText);
   if (costText != "") {
     costText = startText + "<br />" + costText;
   }
   else {
     costText = '<br/> <img class="resourceIcon" src="../img/icons/blank.png" </br>';
   }
   return costText;
 },

 // ProdInfo() {
 //   costText = "";
 //   factoryOutputType = {
 //      "m1": "../img/icons/gold_sml.png",
 //      "f1": "../img/icons/food_sml.png",
 //      "m2": "../img/icons/steel_sml.png",
 //      "f2": "../img/icons/cotton_sml.png"
 //    };
 //   for (r in this.prodCosts) {
 //     if (this.prodCosts[r] != 0) {
 //       costText += this.prodCosts[r] + " " + r + ", ";
 //       costText += '<img class="resourceIcon" src="' + factoryOutputType[r] + '" />';
 //     }
 //   }
 //   console.log(this);

 //   if (this.prodCosts.poll != 0) {
 //     costText += ' and ' + this.prodValues.poll + '<img class="resourceIcon" src="../img/icons/pollution_sml.png" />';
 //     // console.log(costText);
 //   }
 //   // console.log(costText);
 //   return costText;
 // },

  // CostInfo() {
  //   costText = "";
  //   costIcon = "";
  //   for (r in this.buyCost) {
  //     if (this.buyCost[r] != 0) {
  //       costText += this.buyCost[r] + " " + r + ", ";
  //     }
  //   }
  //   return costText;
  // },

  ProductionText () {
    prodText = "";
    for (r in this.prodValues) {
      if (r != "poll" && this.prodValues[r] != 0) {
        prodText = this.prodValues[r] + " " + r + "   ";
      }
    }
    // console.log(prodText);
    return prodText;
  }
});

Template.factory.events({
  'click .buy1'(event, instance) {

    BuyProducer.call({"player": "city1", "producer": this._id}, (err, res) => {
      if(err) {console.log(err);}
    });
    console.log(this._id);
  },

  'click .buy2'(event, instance) {

    BuyProducer.call({"player": "city2", "producer": this._id}, (err, res) => {
      if(err) {console.log(err);}
    });
    console.log(this._id);
  }
});
