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

  // controller for the settings page
  .controller('MainCtrl', function($scope, Camera, $localstorage) {
    console.log("using the 'MainCtrl' controller");

    // basically initializing them to 60 and 10, if the user has old settings
    // it will remember them
    $scope.durVal = $localstorage.get('durVal',60);
    $scope.freqVal =  $localstorage.get('freqVal',10);

    $scope.setSettings = function(newDurVal, newFreqVal){

        // This sets durVal and freqVal equal to the newDurVal and newFreqVal that we passed in
        $localstorage.set('durVal',newDurVal);
        $localstorage.set('freqVal',newFreqVal);

        // This does two things, it defines our scope's durVal & freqVal based on what's in the local storage
        // and if it doesn't find anything, it reverts to those default values
        $scope.durVal = $localstorage.get('durVal',60);
        $scope.freqVal =  $localstorage.get('freqVal',10)
        
        // log the inputs that are passed in
        console.log('passed in DurVal ' + newDurVal);
        console.log('passed in FreqVal ' + newFreqVal);

        // log what we can read from the local storage
        console.log('durVal ' + $localstorage.get('durVal','durVal undefined'));
        console.log('freqVal '+ $localstorage.get('freqVal','freqVal undefined'));
    };
  })

  //this is the controller for taking photos
  .controller('PhotoCtrl', function(Camera, $scope, $localstorage, $timeout, $interval) {
    console.log("using the 'PhotoCtrl' controller");

    $scope.durVal = $localstorage.get('durVal',60);
    $scope.freqVal =  $localstorage.get('freqVal',10);
    var photosCount = parseInt($scope.durVal / $scope.freqVal);
    $scope.photosTaken = 0;

    // print them out for sanity
    console.log('duration:            ' + $scope.durVal);
    console.log('frequency:           ' + $scope.freqVal);
    console.log('total no. of photos: ' + photosCount);
    
    // this function doesn't do anything except for console.log
    $scope.callAtInterval = function() {
      if( $scope.photosTaken < photosCount) 
      { 
        // console message to let me know that an interval occurred
        console.log("$scope.callAtInterval - Interval occurred");
        // a photo has been taken!
        $scope.photosTaken = $scope.photosTaken + 1;

        //declare a variable, whose name is photoN where N = the photo number
        //define this variable as equal to the number of photos taken (for now)
        $localstorage.set('photo' + $scope.photosTaken, $scope.photosTaken);

        // log to see if the variable here is in fact what we expect it to be
        console.log("variable photo" + $scope.photosTaken + " is equal to " + $localstorage.get('photo' + $scope.photosTaken, 'undefined') );

        // confirm that the variable has actually been changed
        console.log("I think you've taken " + $scope.photosTaken + " photos" );
      }
    }

    // as long as the number of photos taken is less than the number of photos we are trying to take
    if( $scope.photosTaken < photosCount) 
      // ask user to take a photo every frequency * 60 seconds/ minute * 1000 millis/second
      $interval( function(){ $scope.callAtInterval(); }, $scope.freqVal*60000);

    // this function doesn't do anything except for console.log
    $scope.callAtTimeout = function() {
        console.log("$scope.callAtInterval - Timeout occurred");
    }

    // every three seconds, call function
    $timeout( function(){ $scope.callAtTimeout(); }, 10000);

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
      $scope.photosTaken++;
    };
  });
