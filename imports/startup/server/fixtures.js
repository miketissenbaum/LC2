// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Links } from '../../api/links/links.js';
import { Producers } from '../../api/links/links.js';
import { baseUsers } from '../both/index.js';

basePass = "battery-honey-possible";
export const cityStart = {"res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, "pollution": 0, "population": 5, "happiness": 5};

Meteor.startup(() => {
  // if the Links collection is empty
  if (Links.find().count() === 0) {
    const data = [
      {
        title: 'Do the Tutorial',
        url: 'https://www.meteor.com/try',
        createdAt: new Date(),
      },
      {
        title: 'Follow the Guide',
        url: 'http://guide.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Read the Docs',
        url: 'https://docs.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Discussions',
        url: 'https://forums.meteor.com',
        createdAt: new Date(),
      },
    ];

    data.forEach(link => Links.insert(link));
  }

  //setup base station users
  // setupBaseUsers: function () {
  if (Meteor.users.findOne({"username": baseUsers[0]}) == undefined) {
    for (uname in baseUsers){
      Accounts.createUser({
        username: baseUsers[uname],
        email : "base-" + baseUsers[uname] + "@bases.com",
        password : basePass,
        profile  : {
            //publicly visible fields like firstname goes here
            "name": baseUsers[uname],
            "lastname": uname
        }
      });
    }
    Accounts.createUser({
      username: "boss",
      email : "boss@boss.com",
      password : "abcdefgh",
      profile  : {
          //publicly visible fields like firstname goes here
          "name": "boss",
          "lastname": "man"
      }
    });

  }
  // }
  // add running field to producer
  Producers.update({"running": {$exists: false}}, {$set: {"running": true}}, {multi: true});

});
