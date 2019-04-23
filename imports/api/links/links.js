// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const Links = new Mongo.Collection('links');

export const Producers = new Mongo.Collection('producers');
// export const Producers = new Mongo.Collection('producers');

export const Cities = new Mongo.Collection('cities');

export const History = new Mongo.Collection('history');

export const Games = new Mongo.Collection('games');


// db.cities.insert({"name": "city1", "res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, "poll": 0, "pop": 5})
// db.cities.insert({"name": "city2", "res": {"m1": 2, "m2": 2, "f1": 2, "f2": 2}, "poll": 0, "pop": 5})