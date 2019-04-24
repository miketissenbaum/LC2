// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Assets } from './links.js';

import { Links } from './links.js';
import { Games } from './links.js';

import { Producers } from './links.js';
import { Cities } from './links.js';
import { Bids } from './links.js';
import { History } from './links.js';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { baseUsers } from '../../startup/both/index.js';

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

var resources = ["m1", "m2", "f1", "f2"];
var factoryKinds = ["m1", "m2", "f1", "f2", "p1", "p2"];

export const RandomProducer = new ValidatedMethod({
  name: 'producers.makeRandom',
  validate ({}) {},
  run({chosenType, gameCode, bidKind}) {
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
        var bidKinds = {
          "m1": "f1",
          "m2": "f2",
          "f1": "m2",
          "f2": "m1",
          "p1": "m1",
          "p2": "f1"

        }
        var prodValues = {
          "m1": {"m1": 3, "pollution": 2},
          "m2": {"m2": 3, "pollution": 2},
          "f1": {"f1": 3, "pollution": 1},
          "f2": {"f2": 3, "pollution": 1},
          "p1": {"pollution": -3},
          "p2": {"pollution": -2},
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
          "bidKind": bidKind,
          "prodValues": prodValues[kindChosen],
          "prodCosts": prodCosts[kindChosen],
          "gameCode": gameCode,
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
      newpoll = parseInt(city.pollution) * 1.0;
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
            if (r != "pollution"){
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

      Cities.update({"_id": city._id}, {$set: {"res": res, "pollution": newpoll, "happiness": newhapp, "population": newpop}});
      History.insert({"time": new Date().getTime(), "city": city.name, "cityid": city._id, "res": res, "pollution": newpoll, "happiness": newhapp, "population": newpop});
    });
  }
});

export const NewRound = new ValidatedMethod({
  name: 'newRound',
  validate ({}) {},
  run({gameCode, producerCount = 6}) {
    ConsumeResources.call({}, (err, res) => {
      if (err) {console.log(err);}
    });

    // FlushProducers.call({"gameCode": gameCode}, (err, res) => {
    //   if (err) {console.log(err);}
    // });
    diffResources = shuffle(resources);
    for (var i = 0; i < producerCount; i++) { 
      //for each kind of resource 
        //if there are not 4 factories available with that bidkind, add a factory
      res = diffResources[(i % resources.length)];
        if (Producers.find({$and: [{"bidKind": res}, {"gameCode": gameCode}, {"owned": false}, {"visible": true}]}).fetch().length < 4) {
          RandomProducer.call({"chosenType": i, "gameCode": gameCode, "bidKind": res}, (err, res) => {
            if (err) {console.log(err);}
          });
        // }
      }
    }
    console.log("new round called");
  }
});

export const FlushProducers = new ValidatedMethod({
  name: 'producers.flush',
  validate ({}) {},
  run ({gameCode}){
    Producers.update({$and: [{"owned": false, "visible": true, "gameCode": gameCode}]}, {$set: {"visible": false}}, {multi: true});
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
  run({gameCode}) {
    factCount = {"m1": 0, "m2": 0, "f1": 0, "f2": 0, "p1": 0, "p2": 0};

    Games.update({$and: [{"gameCode": gameCode}, {"role": "base"}]}, {$set: {"factoryCount": factCount, "res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, "pollution": 0, "population": 5, "happiness": 5}}, {multi: true, upsert: true});
    // Cities.update({"name": "city2"}, {$set: {"name": "city2", "factoryCount": factCount, "res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, "poll": 0, "population": 5, "happiness": 5}}, {upsert: true})
    Producers.remove({});
    
    // Assets.update({$and: [{"name": "m1"}, {"kind": "producer"}]}, {$set: {"name": "m1", "regName": "Steel Factory", "img": "img/buildings/factory1.png", "kind": "producer"}}, {upsert: true});
    // Assets.update({$and: [{"name": "m2"}, {"kind": "producer"}]}, {$set: {"name": "m2", "regName": "Gold Factory", "img": "img/buildings/factory2.png", "kind": "producer"}}, {upsert: true});
    // Assets.update({$and: [{"name": "f1"}, {"kind": "producer"}]}, {$set: {"name": "f1", "regName": "Food Crop", "img": "img/buildings/farm1.png", "kind": "producer"}}, {upsert: true});
    // Assets.update({$and: [{"name": "f2"}, {"kind": "producer"}]}, {$set: {"name": "f2", "regName": "Cotton Farm", "img": "img/buildings/farm2.png", "kind": "producer"}}, {upsert: true});
    // Assets.update({$and: [{"name": "p1"}, {"kind": "producer"}]}, {$set: {"name": "p1", "regName": "Park", "img": "img/buildings/park1.png", "kind": "producer"}}, {upsert: true});
    // Assets.update({$and: [{"name": "p2"}, {"kind": "producer"}]}, {$set: {"name": "p2", "regName": "Fountain", "img": "img/buildings/park2.png", "kind": "producer"}}, {upsert: true});

    // Assets.update({$and: [{"name": "m1"}, {"kind": "resource"}]}, {$set: {"name": "m1", "regName": "Steel", "img": "img/icons/steel_med.png", "kind": "resource"}}, {upsert: true});
    // Assets.update({$and: [{"name": "m2"}, {"kind": "resource"}]}, {$set: {"name": "m2", "regName": "Gold", "img": "img/icons/gold_med.png", "kind": "resource"}}, {upsert: true});
    // Assets.update({$and: [{"name": "f1"}, {"kind": "resource"}]}, {$set: {"name": "f1", "regName": "Food", "img": "img/icons/food_med.png", "kind": "resource"}}, {upsert: true});
    // Assets.update({$and: [{"name": "f2"}, {"kind": "resource"}]}, {$set: {"name": "f2", "regName": "Cotton", "img": "img/icons/cotton_med.png", "kind": "resource"}}, {upsert: true});
  }
});

export const StartGame = new ValidatedMethod({
  name: 'game.start',
  validate({}) {},
  run({cityCount, adminId, adminUsername}) {
    if (!this.isSimulation) {
      baseList = shuffle(baseUsers);
      allGames = Games.find({}, {"gameCode": 1}).fetch();
      
      gameCodes = [];
      allGames.forEach(function (game) {gameCodes.push(game.gameCode);});
      // console.log(baseList);
      console.log(gameCodes);
      newgc = generate_random_string(4);
      while (newgc in gameCodes) {
        newgc = generate_random_string(4);
      }

      Games.insert({
        "gameCode": newgc, 
        "playerName": adminUsername, 
        "playerId": adminId,
        "role": "admin",
        "status": "running",
        "group": "none",
        "groupList":  baseList.slice(0,cityCount)
      });
      for (var i = 0; i < cityCount; i++) {
        // console.log(baseList[i]);
        console.log(Meteor.users.find({}).fetch());
        JoinGame.call({"playerName": baseList[i], "playerId": Meteor.users.findOne({"profile.name": baseList[i]})._id, "gameCode": newgc, "role": "base"}, (err, res) => {
          if (err) {
            console.log(err);
            return err;
          }
          else {
            return res;
          }
        });
      }
    }
  }
});

shuffle = function(v){
  for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
  return v;
};

generate_random_string = function(string_length){
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii);
    }
    return random_string;
}

// console.log(generate_random_string(5))


export const JoinGame = new ValidatedMethod({
  name: 'game.join',
  validate({}) {},
  run({playerName, playerId, gameCode, role}) {
    if (!this.isSimulation) {
      gameAdmin = Games.findOne({$and: [{"gameCode": gameCode}, {"role": "admin"}]});
      console.log(gameAdmin);

      if (gameAdmin != undefined) {

        var group = playerName;
        if (role == "player"){
          //see which city has fewer players, and add to one of those cities.
          //re assign group in here.
          
          groupSizes = gameAdmin.groupList.map(function(gi) {  //gi = group index
            return {"groupIndex": gi, "groupSize": Games.find({$and: [{"gameCode": gameCode}, {"group": gi}]}).fetch().length};
          });
          sortedGroups = groupSizes.sort(function (a, b) {
            return (a.groupSize - b.groupSize);
          });
          grp = sortedGroups[0].groupIndex;
          console.log("group is " + grp);
          group = grp;  
        }
        Games.update({
          "gameCode": gameCode, 
          "playerId": playerId
        },{$set:{
          "gameCode": gameCode, 
          "playerName": playerName, 
          "playerId": playerId,
          "role": role,
          "status": "running",
          "group": group,
          // "factoryCount": factCount, 
          "res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, 
          "pollution": 0, 
          "population": 5, 
          "happiness": 5
        }}, {upsert: true});

      }
      else {
        throw new Error("game code doesn't exist");
      } 
      // if()
    }
  }
});
/*
function ConsumeResources() {
  // for each owned Producers, update 
  // Cities.update()

}
*/