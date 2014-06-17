// function meetupEvents($scope) {
//  	$scope.name='ooooppppppaaaaa';
// }
angular.module("main", ['ngSanitize']).controller("EventCtrl", function($scope,$http) {
    $scope.test = 'Test Message';

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

    var base ='https://api.meetup.com/2/events?',
    	status= 'upcoming',
    	group_url = 'full-stack-developer-il',
    	text_format = "plain",
    	key='6b7b184b5a2b2e3fa2a3e216517e42',
    	offset=0,
    	page=20,
    	jsonp='&callback=JSON_CALLBACK',

    	url = base+"status="+status+"&group_urlname="+group_url+"&text_format="+text_format+"&page="+page+"&offset="+offset+"&key="+key+jsonp;

     	$http({
		  method: 'JSONP',
		  url: url
		}).success(function(data, status, headers, config) {
		  // data contains the response
		  // status is the HTTP status
		  // headers is the header getter function
		  // config is the object that was used to create the HTTP request
		   	$scope.events = data.results;
		}).error(function(data, status, headers, config) {
			console.log("err",status,data);
		});

	 	status = 'past';
	 	page = 3,
	 	desc=true;
	  	url = base+"status="+status+"&group_urlname="+group_url+"&desc="+desc+"&text_format="+text_format+"&page="+page+"&offset="+offset+"&key="+key+jsonp;

     	$http({
		  method: 'JSONP',
		  url: url
		}).success(function(data, status, headers, config) {
		  // data contains the response
		  // status is the HTTP status
		  // headers is the header getter function
		  // config is the object that was used to create the HTTP request
		   	$scope.past_events = data.results;
		   	console.log('past',$scope.past_events );
		}).error(function(data, status, headers, config) {
			console.log("err",status,data);
		});
       	$scope.loadMore = function() {
       		offset++
      		url = base+"status="+status+"&group_urlname="+group_url+"&desc="+desc+"&text_format="+text_format+"&page="+page+"&offset="+offset+"&key="+key+jsonp;
	     	$http({
			  method: 'JSONP',
			  url: url
			}).success(function(data, status, headers, config) {
				for (var i=0;i< data.results.length;i++){
			   		$scope.past_events.push(data.results[i]);
			    }
			   	console.log('past',$scope.past_events );
			}).error(function(data, status, headers, config) {
				console.log("err",status,data);
			});
   		}
})
