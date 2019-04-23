// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.

// AccountsTemplates.configure({
//   defaultTemplate: 'App_login',
//   defaultLayout: 'App_body',
//   defaultContentRegion: 'main',
//   defaultLayoutRegions: {}
// });

AccountsTemplates.configure({
  confirmPassword: false,
  overrideLoginErrors: false,
  lowercaseUsername: true,
  showForgotPasswordLink: true,
  homeRoutePath: '/'
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Username/Full name",
    // func: function(value){return value !== 'Full Name';},
    // errStr: 'Only "Full Name" allowed!',
});

export const baseUsers = ["red-city", "green-city", "pink-city", "blue-city", "yellow-city", "orange-city", "turquoise-city", "fuschia-city"];

// AccountsTemplates.addField({
//     _id: 'username',
//     type: 'text',
//     required: true,
//     func: function(value){
//         if (Meteor.isClient) {
//             console.log("Validating username...");
//             var self = this;
//             Meteor.call("userExists", value, function(err, userExists){
//                 if (!userExists)
//                     self.setSuccess();
//                 else
//                     self.setError(userExists);
//                 self.setValidating(false);
//             });
//             return;
//         }
//         // Server
//         return Meteor.call("userExists", value);
//     },
// });