// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

import { Producers } from '/imports/api/links/links';

//configure a random factory

function RandomProd(chosenType = 0) {
  
  var buyCosts = {
    "m1": { "m1": 0, "f1": 2, "m2": 1, "f2": 0 },
    "m2": { "m1": 1, "f1": 0, "m2": 0, "f2": 2 },
    "f1": { "m1": 1, "f1": 0, "m2": 0, "f2": 1 },
    "f2": { "m1": 0, "f1": 1, "m2": 1, "f2": 0 },
    "p1": { "m1": 2, "f1": 0, "m2": 2, "f2": 0 },
    "p2": { "m1": 0, "f1": 2, "m2": 0, "f2": 2 },
  }
  var prodValues = {
    "m1": {"m1": 2, "poll": 2},
    "m2": {"m2": 2, "poll": 2},
    "f1": {"f1": 2, "poll": 1},
    "f2": {"f2": 2, "poll": 1},
    "p1": {"poll": -3},
    "p2": {"poll": -2},
  }
  var kinds = Object.keys(prodCosts);
  
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

function FlushProducers() {
  Producers.update({$and: [{"owned": false, "visible": true}]}, {$set: {"visible": true}});
}

function ConsumeResources() {
  // for each owned Producers, update 
  // Cities.update()


}

function NewRound() {
  ConsumeResources();
  FlushProducers();
  for (var i = 0; i < 6; i++) { RandomProd(i);}
}


function BuyProducer(player, producerID) {
  cost = Producers.findOne({"_id": producerID}).buyCost;
  if (Cities.find({"player": player})) { // ***fix syntax here to check for contents
    res =  Cities.findOne({"player": player}).resources;
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
      Producers.update({"_id": producerID}, {$set: {"owned": true, "owner": player}});
      Cities.update({"player": player}, {$set: {"resources": res}});
    }
  }
}









