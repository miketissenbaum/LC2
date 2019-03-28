// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Links } from '../links.js';
import { Producers } from '../links.js';
import { Cities } from '../links.js';

Meteor.publish('links.all', function () {
  return Links.find();
});

Meteor.publish('producers.public', function () {
  return Producers.find({"owned": false});
});

Meteor.publish('producers.owned', function () {
  // return Producers.find({"owner": Meteor.userId});
  //figure this shit out
});

Meteor.publish('producers.all', function () {
  return Producers.find();
});

Meteor.publish('cities.all', function () {
	return Cities.find();
});