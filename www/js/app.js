// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.services', 'myFactory'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    // what the state is called
    .state('takePhoto', {
      // the url that can be accessed via href propertiess
      url: '/takePhoto',
      // the path to view the template html file
      templateUrl: 'templates/takePhoto.html',
      // the controller to be used in this view
      controller: 'PhotoCtrl'
      })



    .state('setup', {
      url: '/setup',
      templateUrl: 'templates/setup.html',
      controller: 'MainCtrl'
    })

    $urlRouterProvider.otherwise('/setup')
  })

  .controller('MainCtrl', function($scope, Camera, $localstorage) {
    console.log("MainCtrl");

    $scope.durVal = $localstorage.get('durVal',60);
    $scope.freqVal =  $localstorage.get('freqVal',10)

    $scope.setSettings = function(newDurVal, newFreqVal){
        $localstorage.set('durVal',newDurVal);
        $localstorage.set('freqVal',newFreqVal);
        $scope.durVal = $localstorage.get('durVal',60);
        $scope.freqVal =  $localstorage.get('freqVal',10)
        console.log('newDurVal ' + newDurVal);
        console.log('newFreqVal ' + newFreqVal);
        console.log('durVal ' + $localstorage.get('durVal','durVal undefined'));
        console.log('freqVal '+ $localstorage.get('freqVal','freqVal undefined'));
    };
  })

  .controller('PhotoCtrl', function(Camera, $scope, $localstorage) {
    console.log("PhotoCtrl");

    $scope.getPhoto = function() {
      Camera.getPicture().then(function(imageURI) {
        console.log(imageURI);
        $scope.lastPhoto = imageURI;
      }, function(err) {
        console.err(err);
      }, {
        quality: 75,
        targetWidth: 320,
        targetHeight: 320,
        saveToPhotoAlbum: false
      });
    };
  });
