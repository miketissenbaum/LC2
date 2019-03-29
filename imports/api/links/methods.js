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

//configure a random factory
/*
export const makePrivate = new ValidatedMethod({
  name: 'Lists.methods.makePrivate',

  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  validate: new SimpleSchema({
    listId: { type: String }
  }).validator(),

  // This is optional, but you can use this to pass options into Meteor.apply every
  // time this method is called.  This can be used, for instance, to ask meteor not
  // to retry this method if it fails.
  applyOptions: {
    noRetry: true,
  },

  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ listId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      // Throw errors with a specific error code
      throw new Meteor.Error('Lists.methods.makePrivate.notLoggedIn',
        'Must be logged in to make private lists.');
    }

    const list = Lists.findOne(listId);

    if (list.isLastPublicList()) {
      throw new Meteor.Error('Lists.methods.makePrivate.lastPublicList',
        'Cannot make the last public list private.');
    }

    Lists.update(listId, {
      $set: { userId: this.userId }
    });

    Lists.userIdDenormalizer.set(listId, this.userId);
  }
});
*/

export const RandomProducer = new ValidatedMethod({
  name: 'producers.makeRandom',
  run({chosenType = 0}) {
    const todo = Todos.findOne(todoId);

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
    return true;
  }
});


export const BuyProducer = new ValidatedMethod({
  name: 'producers.buy',
  // validate ({}) {

  // },
  run({player, producer}) {
    if (!this.isSimulation) {
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
    return true;
  }
});

export const NewRound = new ValidatedMethod({
  name: 'newRound',
  run({}) {
    // ConsumeResources.call({}, (err, res) => {
    //   if (err) {console.log(err);}
    // });

    FlushProducers.call({}, (err, res) => {
      if (err) {console.log(err);}
    });

    for (var i = 0; i < 6; i++) { 
      RandomProd.call({i}, (err, res) => {
        if (err) {console.log(err);}
      });
    }
  }
});

export const FlushProducers = new ValidatedMethod({
  name: 'producers.flush',
  run ({}){
    Producers.update({$and: [{"owned": false, "visible": true}]}, {$set: {"visible": false}});
  }
});

/*
function ConsumeResources() {
  // for each owned Producers, update 
  // Cities.update()

}

function NewRound() {
  ConsumeResources();
  FlushProducers();
  for (var i = 0; i < 6; i++) { RandomProd(i);}
}
*/