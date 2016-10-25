var mainApp = angular.module('MainApp', ['ngResource']);

mainApp.factory('PostModel', ['$resource', function ($resource) {
    return $resource('http://localhost:8000/api/rest.php/posts/:id', {'id': '@id'}, {});
}]);


mainApp.controller('MainController', ['$scope', 'PostModel', function ($scope, PostModel) {
    $scope.answer = ' - ';

    $scope.setAnswer = function (answer) {
        $scope.answer = answer;
    };

    $scope.getPosts = function (answer) {
        PostModel.get(function(res) {
            console.log('res', res.data);
            $scope.posts = res.data;
        });
    };
}]);

mainApp.controller('weatherCurrentItemCtrl', function ($scope, $http) {
    $http.get('app/now.json').success(function(doc, status, headers, config) {
        $scope.data = doc;
        console.log("DATA IS: ", $scope.data);
    });
});

//FILTER for HTML
mainApp.filter('formatLargeIconFilter', function(){
    return function(value) {
        switch (value) {
            case "Sun":
                return "assets/img/sun.jpg";
            case "Rain":
                return "assets/img/rain.jpg";
            case  "Snow":
                return "assets/img/snow.jpg";
            case "Extreme":
                return "assets/img/extreme.jpg";
            case "Clouds":
                return "assets/img/cloudy.jpg";
            default:
                //icon-small
                //icon-sun
                //icon-cloudy
                return "icon-small";
        }
    }
});


//CONTROLLER
mainApp.controller('weatherListCtrl', function ($scope, $http) {
    $http.get('app/daily.json').success(function(doc, status, headers, config) {
        $scope.data = doc;
        console.log("DATA IS: ", $scope.data);
    });

});

//FILTER for HTML
mainApp.filter('formatIconFilter', function(){
    return function(value) {
        switch (value) {
            case "Sun":
                return "icon-clear";
            case "Rain":
                return "icon-rain";
            case  "Snow":
                return "icon-snowflake";
            case "Extreme":
                return "icon-cloud";
            default:
                //icon-small
                //icon-sun
                //icon-cloudy
                return "icon-small";
        }
    }
});

mainApp.filter('formaShortDateFilter', function(){
    return function(value) {
        var theDate = new Date(value * 1000);
        dateString = theDate.toGMTString();

        str = dateString.substr(8, 3);
        dateString = dateString.substr(5, 2) + ".";

        switch (str) {
            case "Jan":
                return dateString + "01";
            case "Feb":
                return dateString + "02";
            case "Mar":
                return dateString + "03";
            case "Apr":
                return dateString + "04";
            case "May":
                return dateString + "05";
            case "Jun":
                return dateString + "06";
            case "Jul":
                return dateString + "07";
            case "Aug":
                return dateString + "08";
            case "Sep":
                return dateString + "09";
            case "Oct":
                return dateString + "10";
            case "Nov":
                return dateString + "11";
            case "Dec":
                return dateString + "12";
        }
    }
});

mainApp.filter('formatDayOfWeekFilter', function(){
    return function(value) {
        var theDate = new Date(value*1000);
        dateString = theDate.toGMTString();

        dateString = dateString.substr(0,3);

        switch (dateString) {
            case "Mon":
                return "Пн";
            case "Tue":
                return "Вт";
            case "Wed":
                return "Ср";
            case "Thu":
                return "Чт";
            case "Fri":
                return "Пт";
            case "Sat":
                return "Сб";
            case "Sun":
                return "Нд";
        }
    }
});

mainApp.filter('formatTempFilter', function(){
    return function(value) {
        return value + "°C";
    }
});

//CHART
/*
var chart = c3.generate({
    data: {
        x: 'x',
//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
//            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 340, 200, 500, 250, 350]
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%d.%m.%Y'
            }
        }
    }
});*/