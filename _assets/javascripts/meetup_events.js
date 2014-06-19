(function(){

	'use strict';

	var Sn = {};
	var module = angular.module('meetups-module', []);

	Sn.MeetupsApiParams = {
		baseApiUrl: 'https://api.meetup.com',
		callback: 'JSON_CALLBACK',
		group_urlname: 'full-stack-developer-il',
		text_format: 'plain',
		key: '6b7b184b5a2b2e3fa2a3e216517e42',
		sign: true
	};

	module.constant('MeetupsApiParams', Sn.MeetupsApiParams);

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

				function onError(data, status){
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

				function onError(data, status){
					defer.reject('Faild to load meetups'+status.data);
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
		
		var _self = this;

		$scope.showUpcoming = true;
	    $scope.showPast = !$scope.showUpcoming;

	    $scope.changeState = function (showState) {
	        $('.button-upcoming').removeClass('active');
	        $('.button-past').removeClass('active');

	        if (showState === 'upcoming') {
	            $scope.showUpcoming = true;
	            $('.button-upcoming').addClass('active');
	        } else {
	            $scope.showUpcoming = false;
	            $('.button-past').addClass('active');
	        }

	        $scope.showPast = !$scope.showUpcoming;
	    };

   	    $scope.changeState('upcoming');


		(function init(){
			_self.appTitle = 'Meetups Events';
		})();
		
	}]);

	module.controller('Sn.MeetupsCtrl', ['$scope', 'MeetupsService', function($scope, MeetupsService){
		
		var _self = this,
			lastOffset = 0;

		function onUpComingSuccess(meetups){
			_self.meetupsByStatus.upcoming = meetups;
			var i = 0,
				len = meetups.length;

			for(; i < len; ++i){
				MeetupsService.getMeetupAttendance(meetups[i].id);
			}
		}

		function onPastSuccess(meetups){
			var i =0,
				len = meetups.length;

			for(; i < len; ++i){
				_self.meetupsByStatus.past.push(meetups[i]);
			}

		}

		function onError(data){
			debugger;
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
				past: []
			};

			MeetupsService
				.getMeetups('upcoming', 0, 20)
				.then(
					onUpComingSuccess,
					onError
				);

			loadPastEvents(lastOffset);

		})();
	}]);


	module.directive('meetupEvent', function(){
		return {
			restrict: 'E',
			replace: true,
			scope: {
				meetups: '=',
				title: '@',
				isUpcomingEvent: '@'
			},
			templateUrl: 'meetup-event.html',
			link: function(scope, element){
			}
		};
	});
})();