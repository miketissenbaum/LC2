// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Links } from './links.js';
import { Producers } from './links.js';
import { Cities } from './links.js';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

Meteor.methods({
  'links.insert'(title, url) {
    check(url, String);
    check(title, String);

    return Links.insert({
      url,
      title,
      createdAt: new Date(),
    });
  },
});


export const RandomProducer = new ValidatedMethod({
  name: 'producers.makeRandom',
  validate ({}) {},
  run({chosenType}) {
    // const todo = Todos.findOne(todoId);
    chosenType = Math.floor(Math.random()*6);
    if (!this.isSimulation) {
        var buyCosts = {
          "m1": { "m1": 0, "f1": 2, "m2": 1, "f2": 0 },
          "m2": { "m1": 1, "f1": 0, "m2": 0, "f2": 2 },
          "f1": { "m1": 1, "f1": 0, "m2": 0, "f2": 1 },
          "f2": { "m1": 0, "f1": 1, "m2": 1, "f2": 0 },
          "p1": { "m1": 2, "f1": 0, "m2": 2, "f2": 0 },
          "p2": { "m1": 0, "f1": 2, "m2": 0, "f2": 2 },
        };
        var prodValues = {
          "m1": {"m1": 2, "poll": 2},
          "m2": {"m2": 2, "poll": 2},
          "f1": {"f1": 2, "poll": 1},
          "f2": {"f2": 2, "poll": 1},
          "p1": {"poll": -3},
          "p2": {"poll": -2},
        };
        var kinds = Object.keys(buyCosts);
        
        //make this kindChosen number random, or incrementing
        var kindChosen = kinds[chosenType];

        var currentProd = {
          "kind": kindChosen,
          "buyCost": buyCosts[kindChosen],
          "prodValues": prodValues[kindChosen],
          "owned": false,
          "visible": true,
          "owner": 0
        };

        //pick a random kind
        //populate producers with a producer with a prod cost, prodvalues, ""
        Producers.insert(currentProd);
    }
    return true;
  }
});


export const BuyProducer = new ValidatedMethod({
  name: 'producers.buy',
  validate ({}) {},
  // validate ({}) {

  // },
  run({player, producer}) {
    console.log(player + " " + producer);

    if (!this.isSimulation) {
      cost = Producers.findOne({"_id": producer}).buyCost;
      if (Cities.find({"name": player})) { // ***fix syntax here to check for contents
        res =  Cities.findOne({"name": player}).res;
        canbuy = true;
        newres = res;
        for (r in cost) {
          if (cost[r] > res[r]) {
            canbuy = false;
          }
          else {
            newres[r] = res[r] - cost[r];
          }
        }
        if (canbuy == true){
          Producers.update({"_id": producer}, {$set: {"owned": true, "owner": player}});
          Cities.update({"name": player}, {$set: {"res": res}});
        }
      }
    }
    return true;
  }
});

export const ConsumeResources = new ValidatedMethod({
  name: 'producers.consume',
  validate ({}) {},
  run ({}) {
    Producers.find({$and: [{"owned": true}]}).forEach(function (prod) {
      city = Cities.findOne({"name": prod["owner"]});
      res = city.res;
      for (r in prod.prodValues) {
        if (r != "poll"){
          res[r] += prod.prodValues[r];
        }
      }
      Cities.update({"_id": city._id}, {$set: {"res": res, "poll": city.poll + prod.prodValues["poll"]}});
    });
  }
});

export const NewRound = new ValidatedMethod({
  name: 'newRound',
  validate ({}) {},
  run({}) {
    ConsumeResources.call({}, (err, res) => {
      if (err) {console.log(err);}
    });

    FlushProducers.call({}, (err, res) => {
      if (err) {console.log(err);}
    });

    for (var i = 0; i < 6; i++) { 
      RandomProducer.call({"chosenType": i}, (err, res) => {
        if (err) {console.log(err);}
      });
    }
    console.log("new round called");
  }
});

export const FlushProducers = new ValidatedMethod({
  name: 'producers.flush',
  validate ({}) {},
  run ({}){
    Producers.update({$and: [{"owned": false, "visible": true}]}, {$set: {"visible": false}}, {multi: true});
    console.log("producers flushed");
  }
});

export const TradeResources = new ValidatedMethod({
  name: 'resources.trade',
  validate ({amount, resource, from, to}) {
    const errors = [];
    if (amount < 0) {
      errors.push("negative number");
    }
    if (errors.length) {
      throw new ValidationError(errors);
    }
  },
  run ({amount, resource, from, to}){
    // Producers.update({$and: [{"owned": false, "visible": true}]}, {$set: {"visible": false}}, {multi: true});
    // console.log("producers flushed");
    resres = "res." + resource;
    // Cities.findOne({"_id": from})
    console.log(Cities.findOne({"name": from}));
    console.log(from);

    if(Cities.findOne({"name": from}).res[resource] >= amount){
      Cities.update({"name": from}, {$inc: {resres: (-1*amount)}});
      Cities.update({"name": to}, {$inc: {resres: (1*amount)}});
    }
    else {console.log("under resourced");}
  }
});

/*
function ConsumeResources() {
  // for each owned Producers, update 
  // Cities.update()

}
*/