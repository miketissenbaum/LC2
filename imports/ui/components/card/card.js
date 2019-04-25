import './card.html';
import { Producers } from '/imports/api/links/links.js';
import { Bids } from '/imports/api/links/links.js';
// import { Assets } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';
import { NewRound } from '/imports/api/links/methods.js';
import { BuyProducer } from '/imports/api/links/methods.js';
import { MakeBid } from '/imports/api/links/methods.js';
import { Games } from '/imports/api/links/links.js';

Template.factoryList.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.city = new ReactiveVar("city1");

  Meteor.subscribe('producers.public');
  Meteor.subscribe('games.running');
  // Meteor.subscribe('bids.local');
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
  bidKinds() {
    return ["f1", "f2", "m1", "m2"];
  },

  PublicFactories(bidKind) {
    // console.log((Producers.find({})).toArray());
    // console.log(bidKind);
    return Producers.find({$and: [{"gameCode": FlowRouter.getParam("gameCode")}, {"owned": false}, {"visible": true}, {"bidKind": bidKind}]});
  },

  ResourceIcon(res) {
    factoryOutputType = {
      "m1": "../img/icons/gold_sml.png",
      "f1": "../img/icons/food_sml.png",
      "m2": "../img/icons/steel_sml.png",
      "f2": "../img/icons/cotton_sml.png"
    };
    // console.log(res);
    return factoryOutputType[res];
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
      "f2": "../img/icons/farm_med.png"
    }
    // console.log(this);
    // console.log(factoryIconSource[this.kind]);
    return factoryIconSource[this.kind];
  }

});

Template.factoryList.events({
  'click .toggleCity' (event, instance) {
    if (instance.city.get() == "city1") {
      instance.city.set("city2");
    }
    else {
      instance.city.set("city1");
    }
  }

});

Template.factoryList.onCreated(function helloOnCreated() {
  Meteor.subscribe('bids.local');
  Meteor.subscribe('games.running');
});

Template.factory.helpers({
  OutputIcon() {
    factoryOutputType = {
      "m1": "../img/icons/gold_sml.png",
      "f1": "../img/icons/food_sml.png",
      "m2": "../img/icons/steel_sml.png",
      "f2": "../img/icons/cotton_sml.png"
    };
    // console.log(this);
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
      "pollution": "../img/icons/pollution_sml.png"
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

  FactoryBid() {
   // console.log(Bids.findOne({}));
   // console.log(this._id);
   bid = Bids.findOne({"producer": this._id});
   // console.log(Bids.findOne());

   thisGame = Games.findOne({$and: [{"gameCode": FlowRouter.getParam("gameCode")}, {"playerId": Meteor.userId()}]});

   valtext = ""
   if (bid != undefined){
     valtext = bid.bidVal;
     if (thisGame.res[this.bidKind] < bid.bidVal) {
       valtext += " - Can't Afford!";
     }
     // console.log(bid.bidVal);
   }
   return valtext;
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
    console.log(prodText);
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
  },

  'click .bid' (event, instance) {
    event.preventDefault();
    // console.log(event.target.text);
    console.log(event.target.name);
    val = parseInt(event.target.name);
    thisGroup = Games.findOne({"gameCode": FlowRouter.getParam("gameCode")});
    if (thisGroup.role != "base") {
      FlowRouter.go('home');
    }
    else{
      MakeBid.call({"baseId": Meteor.userId(), "producer": this._id, "group": thisGroup.group, "gameCode": FlowRouter.getParam("gameCode"), "change": val});
    }
  }
});
