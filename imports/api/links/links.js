// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const Links = new Mongo.Collection('links');

export const Producers = new Mongo.Collection('producers');
// export const Producers = new Mongo.Collection('producers');

export const Cities = new Mongo.Collection('cities');