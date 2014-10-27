(function(){

	'use strict';

	var Sn = {};
	var module = angular.module('meetups-module',['ui.calendar', 'ui.bootstrap']);

	Sn.MeetupsApiParams = {
		baseApiUrl: 'https://api.meetup.com',
		callback: 'JSON_CALLBACK',
		group_urlname: 'full-stack-developer-il',
		text_format: 'plain',
		key: '6b7b184b5a2b2e3fa2a3e216517e42',
		sign: true
	};

	Sn.SiteParams = {
		baseUrl: ''
	};

	module.constant('MeetupsApiParams', Sn.MeetupsApiParams);
	module.constant('SiteParams', Sn.SiteParams);

	module.service('MeetupsService', ['$http', 'MeetupsApiParams', '$q', function($http, MeetupsApiParams, $q){

		function getJSONPParams(status, offset, page, desc){
			var params = {
				status: status,
				offset: offset,
				page: page,
				desc:desc
			};

			if(angular.isDefined(desc)){
				params.desc = desc;
			}

			params = angular.extend(params, MeetupsApiParams);
			delete params.baseApiUrl;

			return params;
		}

		return {

			getMeetups: function(status, offset, page, desc){
				var defer = $q.defer(),
					params = getJSONPParams(status, offset, page, desc);


				function onSuccess(data){
                    defer.resolve(data.results);
				}

                function onError(data, status, headers, config){
                    
                    defer.reject('Faild to load meetups'+status.data);
                }

				$http.jsonp(
					MeetupsApiParams.baseApiUrl+'/2/events',
					{params: params}
				).
				success(onSuccess).
				error(onError);

				return defer.promise;
			},
      getMeetupRsvps: function(meetupId){
          var defer = $q.defer(),
              apiUrl = [
                  MeetupsApiParams.baseApiUrl,
                  '2',
                  'rsvps'

              ].join('/'),
              params = {
                  callback: MeetupsApiParams.callback,
                  key: MeetupsApiParams.key,
                  event_id: meetupId
              };


          function onSuccess(data){
              defer.resolve(data.results);
          }

          function onError(data, status, headers, config){
              defer.reject('Faild to load meetups');
          }

          $http.jsonp(
              apiUrl,
              {params: params}
          ).
              success(onSuccess).
              error(onError);

          return defer.promise;
      },
			getMeetupAttendance: function(meetupId){
				var defer = $q.defer(),
					apiUrl = [
						MeetupsApiParams.baseApiUrl,
						MeetupsApiParams.group_urlname,
						'events',
						meetupId,
						'attendance'
					].join('/'),
					params = {
						callback: MeetupsApiParams.callback,
						key: MeetupsApiParams.key,
						sign: MeetupsApiParams.sign
					};


				function onSuccess(data){
                                   
					defer.resolve(data.results);
				}

				function onError(data, status, headers, config){
                    defer.reject('Faild to load meetups');
				}

				$http.jsonp(
					apiUrl,
					{params: params}
				).
				success(onSuccess).
				error(onError);

				return defer.promise;
			}
		};
	}]);


	module.controller('Sn.MainCtrl', ['$scope', function($scope){
debugger;
		var _self = this;
                this.allmeetups={dummy:123};//for calendar!!!
                $scope.globalMeetups=null;//for calendar!!!
		this.displayUpComing = function displayUpComing(){
			this.isUpComing = true;
			this.isPast = false;
		};

		this.displayPast = function displayPast(){
			this.isPast = true;
			this.isUpComing = false;
		};

		(function init(){
			_self.displayUpComing();
		})();

	}]);

	module.controller('Sn.MeetupsCtrl', ['$scope', 'MeetupsService', function($scope, MeetupsService){

		var _self = this,
			lastOffset = 0;
                        //$scope.globalUpMeetups=null;
		function onUpComingSuccess(meetups){
			_self.meetupsByStatus.upcoming = meetups;
			var i = 0,
				len = meetups? meetups.length : 0;

			for(; i < len; ++i){
				MeetupsService.getMeetupRsvps(meetups[i].id).then(function(data){
            if(data.length>0){
                _self.meetupsRsvps[data[0].event.id] = data;
            }
        });
			}
                   //$scope.globalUpMeetups=meetups;     
		}
                
                function onAllMetupsSuccess(meetups){
                    debugger;
                    $scope.$parent.mainCtrl.allmeetups=meetups;
                    $scope.$parent.globalMeetups=meetups;
                    $scope.globalMeetups=meetups;
                    //call this method excplicitly since watch not works into CalendarCtrl!
                    $scope.$parent.mainCtrl.onMeetupsUpdateCalendarCtrl();
			var i = 0,
				len = meetups? meetups.length : 0;

			for(; i < len; ++i){
                            _self.meetupsByStatus.allMeetups.push(meetups[i]);
				MeetupsService.getMeetupRsvps(meetups[i].id).then(function(data){
            if(data.length>0){
                _self.meetupsRsvps[data[0].event.id] = data;
            }
        });
			}
		}
                
		function onPastSuccess(meetups){
                    var i =0,
				len = meetups? meetups.length : 0;


			for(; i < len; ++i){
				_self.meetupsByStatus.past.push(meetups[i]);
				MeetupsService.getMeetupRsvps(meetups[i].id).then(function(data){
            if(data.length>0){
                _self.meetupsRsvps[data[0].event.id] = data;
            }
        });
			}

		}

		function onError(data){
			//debugger;
		}

		function loadPastEvents(offset){
			MeetupsService
				.getMeetups('past', offset, 3, 'true')
				.then(
					onPastSuccess,
					onError
				);
		}

		_self.loadMore = function loadMore(){
			loadPastEvents(++lastOffset);
		};

		(function init(){

			_self.meetupsByStatus = {
				upcoming: [],
				past: [],
                                allMeetups:[]
			};
			_self.meetupsRsvps = {};

			MeetupsService
				.getMeetups('upcoming', 0, 20)
				.then(
					onUpComingSuccess,
					onError
				);
                        MeetupsService
				.getMeetups('upcoming,past', 0, 20)
				.then(
					onAllMetupsSuccess,
					onError
				);
			loadPastEvents(lastOffset);


		})();
	}]);


	module.directive('meetupEvent', ['$location', function($location){

		return {
			restrict: 'E',
			templateUrl:'/events/meetup-event.html',
			replace: true,
			scope: {
				meetups: '=',
				title: '@',
				isUpcomingEvent: '@',
        rsvps: '='
			},
			link: function(scope, element){
			}
		};
	}]);

module.directive('meetupListEvent', ['$location', function($location){

	return {
		restrict: 'E',
		templateUrl:'/block-meetup-event.html',
		replace: true,
		scope: {
			meetups: '=',
			title: '@',
			isUpcomingEvent: '@',
      rsvps: '='
		},
		link: function(scope, element){
		}
	};
        
        
//}]);



}]);
module.controller('CalendarCtrl', ['$scope', 
function ($scope)  {
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
   
   /* $scope.changeTo = 'Hebrew';*/

    /* event source that contains custom events on the scope */
    $scope.events = [
      {id: 993,title: 'INNA Day Event ZZZZZZZZZ',start: new Date(y, m, 1), tip: 'My Event!!!!'},
      {id: 994,title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 995,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 996,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {id: 997,title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {id: 999,title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    var onMeetupsUpdate=function(events)
    {debugger;
       //alert( $scope.$parent.mainCtrl.allmeetups);
       if($scope.$parent.mainCtrl.allmeetups.dummy)
           return;
       $scope.events=[];
       var newMeetsList=[];
       
       for(var i = 0; i < $scope.$parent.mainCtrl.allmeetups.length; i++)
           {
            var meet=$scope.$parent.mainCtrl.allmeetups[i];
            newMeetsList[i]={id: meet.id, title: meet.name,  start: new Date(meet.time), tip: meet.description};
            }
        //enforce refresh
        $scope.events = newMeetsList;
        events = newMeetsList;
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.$root.$eval();
        return events;
        //$scope.addRemoveEventSource($scope.eventSource,$scope.events);
    };
    
    $scope.$watch('$scope.$parent.mainCtrl.allmeetups',onMeetupsUpdate($scope.events),true);
    //we will call this method from callback since watch is not works!!!
    $scope.$parent.mainCtrl.onMeetupsUpdateCalendarCtrl=onMeetupsUpdate;
    //debugger;
    //$scope.events =$scope._self.meetupsByStatus.allMeetups;
     debugger;
    $scope.eventSource = []; // this is an array.
    
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };


    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [ 
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        $scope.alertMessage = (event.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function( event, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped on ' + event.start.format());
    };
    /* alert on Resize */
    $scope.alertOnResize = function( event, jsEvent, ui, view){
       $scope.alertMessage = ('Event end date was moved to ' + event.end.format());
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      calendar.fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(calendar){
        calendar.fullCalendar('render');
      }
    };
    /* config object */
    
    $scope.uiConfig = {
      calendar:{
          
        height: 200,//'auto',//315,//450,
        //width: 315,
        contentHeight: 'auto',
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender:         function(event, element) 
        {
            element.attr('title', event.tip);
            
        }
/*        
eventMouseover: function(calEvent, jsEvent) {
                //debugger;
                xOffset = 0;
                yOffset = 0;
                $("body").append(calEvent.tip);
                $("#tooltip")
                .css('z-index', 91000)
                .css('position','absolute')
                .css("top",(jsEvent.clientY - xOffset) + "px")
                .css("left",(jsEvent.clientX + yOffset) + "px")
					.fadeIn("fast");
            },
		eventMouseout: function(calEvent,jsEvent) {
			$("#tooltip").remove();	
		}*/

        
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Hebrew'){
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hebrew';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
}]);
})();
