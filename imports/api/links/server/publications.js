// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Links } from '../links.js';
import { Producers } from '../links.js'

Meteor.publish('links.all', function () {
  return Links.find();
});

Meteor.publish('producers.all', function () {
  return Links.find();
});
