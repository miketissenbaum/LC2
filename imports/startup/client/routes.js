import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app

FlowRouter.route('/', {
  // triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'home',   
  action(){
    BlazeLayout.render('App_body', { main: 'App_home' });
   }
 });

FlowRouter.route('/admin', {
  // triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'admin',
  action(){
    BlazeLayout.render('App_body', { main: 'App_home' });
   }
 });

FlowRouter.route('/cities/:city', {
  // name: 'App.home',
  // triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'App_home'});
  },
});

FlowRouter.route('/games/:gameCode', {
  // name: 'App.home',
  triggersEnter: [isNotLoggedIn],
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'gameView'});
  },
});

FlowRouter.route('/games/:gameCode/score', {
  name: 'App.scoreboard',
  triggersEnter: [isNotLoggedIn],
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'scoreBoard'});
  },
});


FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

function isNotLoggedIn(context, redirect) {
  if (!Meteor.user() && !Meteor.loggingIn()) {
    redirect('/');
  }
}

Tracker.autorun(function () {
   if(!Meteor.userId()) {
     FlowRouter.go('home');
   }
 });
