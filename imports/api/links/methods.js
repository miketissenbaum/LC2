// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Links } from './links.js';
import { Producers } from './links.js';
import { Cities } from './links.js';
import { History } from './links.js';
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
          "m1": {"m1": 3, "poll": 2},
          "m2": {"m2": 3, "poll": 2},
          "f1": {"f1": 3, "poll": 1},
          "f2": {"f2": 3, "poll": 1},
          "p1": {"poll": -3},
          "p2": {"poll": -2},
        };
        var prodCosts = {
          "m1": { "m1": 0, "f1": 1, "m2": 0, "f2": 0 },
          "m2": { "m1": 0, "f1": 0, "m2": 0, "f2": 1 },
          "f1": { "m1": 1, "f1": 0, "m2": 0, "f2": 0 },
          "f2": { "m1": 0, "f1": 0, "m2": 1, "f2": 0 },
          "p1": { "m1": 0, "f1": 0, "m2": 0, "f2": 0 },
          "p2": { "m1": 0, "f1": 0, "m2": 0, "f2": 0 },
        };
        var kinds = Object.keys(buyCosts);
        
        //make this kindChosen number random, or incrementing
        var kindChosen = kinds[chosenType];

        var currentProd = {
          "kind": kindChosen,
          "buyCost": buyCosts[kindChosen],
          "prodValues": prodValues[kindChosen],
          "prodCosts": prodCosts[kindChosen],
          "owned": false,
          "visible": true,
          "owner": 0,
          "durability": 0
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
      prod = Producers.findOne({"_id": producer})
      cost = prod.buyCost;
      if (Cities.find({"name": player})) { // ***fix syntax here to check for contents
        thisCity = Cities.findOne({"name": player});
        res =  thisCity.res;
        factCount = thisCity.factoryCount;
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
          factCount[prod.kind] += 1;
          Producers.update({"_id": producer}, {$set: {"owned": true, "owner": player}});
          Cities.update({"name": player}, {$set: {"res": res, "factoryCount": factCount}});

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
    // city = Cities.findOne({"name": prod["owner"]});
    Cities.find({}).forEach(function (city) {
      res = city.res;
      newpoll = parseInt(city.poll) * 1.0;
      newpop = parseInt(city.population);
      newhapp = parseInt(city.happiness);
      freshFactCount = {"m1": 0, "m2": 0, "f1": 0, "f2": 0, "p1": 0, "p2": 0};
      factCount = city.factoryCount;
      parks = 0;
      Producers.find({$and: [{"owned": true}, {"owner": city.name}]}).forEach(function (prod) {
        efficiency = 1;
        dur = prod.durability;
        if (factCount[prod.kind] > 1) {
          efficiency = 1.3;
        }
        affordable = true;
        for (r in prod.prodCosts) {
          if ((res[r] -  prod.prodCosts[r]) < 0) {
            affordable = false;
          }
        }
        if (affordable == true){
          for (r in prod.prodCosts) {
            res[r] -= prod.prodCosts[r];
          }
          for (r in prod.prodValues) {
            if (r != "poll"){
              res[r] += Math.round(prod.prodValues[r] * efficiency);
            }
            else {
                newpoll = newpoll + prod.prodValues[r];
            }
          }
        }
        else {
          dur += 1;
          Producers.update({_id: prod._id}, {$set: {"durability": dur}})
        }
        freshFactCount[prod.kind] += 1;
        
        if (prod.kind == "p1" || prod.kind == "p1") {
          parks += 1;
          // console.log(parks + " number of parks");
        }
        
        console.log(newpoll);

      });

      if ((res.f1 + res.f2) / newpoll > 2) {
        newpop = newpop + 1;
      }

      else if ((res.f1 + res.f2) / newpoll < 0.8) {
        newpop = newpop - 1;
      }

      if ((freshFactCount["p1"] + freshFactCount["p2"]*1.0) / newpop  <= 0.2) {
        newhapp -= 1;
        // console.log("parks to population increase");
      }

      if (newhapp < 0) {
        newpop = newpop - 1;
      }

      Cities.update({"_id": city._id}, {$set: {"res": res, "poll": newpoll, "happiness": newhapp, "population": newpop}});
      History.insert({"time": new Date().getTime(), "city": city.name, "cityid": city._id, "res": res, "poll": newpoll, "happiness": newhapp, "population": newpop});
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
    // console.log(Cities.findOne({"name": from}));
    // console.log(from);
    fromres = Cities.findOne({"name": from}).res;
    tores = Cities.findOne({"name": to}).res;
    if(parseInt(fromres[resource]) >= amount){
      fromres[resource] = parseInt(fromres[resource]) - parseInt(amount);
      tores[resource] = parseInt(tores[resource]) +  parseInt(amount);
      Cities.update({"name": from}, {$set: {"res": fromres}});
      Cities.update({"name": to}, {$set: {"res": tores}});
    }
    else {console.log("under resourced");}
  }
});

export const ResetAll = new ValidatedMethod({
  name: 'setup.all',
  validate({}) {},
  run({}) {
    factCount = {"m1": 0, "m2": 0, "f1": 0, "f2": 0, "p1": 0, "p2": 0};
    Cities.update({"name": "city1"}, {$set: {"name": "city1", "factoryCount": factCount, "res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, "poll": 0, "population": 5, "happiness": 5}}, {upsert: true})
    Cities.update({"name": "city2"}, {$set: {"name": "city2", "factoryCount": factCount, "res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, "poll": 0, "population": 5, "happiness": 5}}, {upsert: true})
    Producers.remove({});
  }
});

/*
function ConsumeResources() {
  // for each owned Producers, update 
  // Cities.update()

}
*/