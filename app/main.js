var mainApp = angular.module('MainApp', ['ngRoute', 'ngResource']);

///ROUTES

mainApp.config(['$routeProvider', function ($routeProvider){
    $routeProvider
        .when('/demo', {
            templateUrl: 'index2.html'
            //controller: 'MainController'
        })
        .when('/showFromDB', {
            templateUrl: 'showFromDB.html',
            controller: ''
        })
        .when('/forecast', {
            templateUrl: 'forecast.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


mainApp.factory('PostModel', ['$resource', function ($resource) {
    return $resource('http://localhost:8088/api/rest.php/get/:city',
        {'city': '@city'});
}]);


mainApp.controller('MainController', ['$scope', 'PostModel', function ($scope, PostModel) {
    $scope.getPosts = function (value) {
        PostModel.get(function(res) {
            $scope.posts = res.data;
        });
    };
}]);

mainApp.controller('dBCtrl', function ($scope, $http) {

    $scope.buttonName = "Показати інструменти";

    $scope.changeButtonName = function () {
        if($scope.buttonName == "Показати інструменти")
            $scope.buttonName = "Приховати інструменти";
        else
            $scope.buttonName = "Показати інструменти";
        };
});

mainApp.controller('weatherCurrentItemCtrl', function ($scope, $http) {
    $http.get('app/now.json').success(function(doc, status, headers, config) {
        $scope.data = doc;
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


//for chart
function convertDateForChart(value) {

        var theDate = new Date(value * 1000);
        dateString = theDate.toGMTString();

        str = dateString.substr(12, 4) + "-";

        switch (dateString.substr(8, 3)) {
            case "Jan":
                str = str + "01-";
                break;
            case "Feb":
                str = str + "02-";
                break;
            case "Mar":
                str = str + "03-";
                break;
            case "Apr":
                str = str + "04-";
                break;
            case "May":
                str = str + "05-";
                break;
            case "Jun":
                str = str + "06-";
                break;
            case "Jul":
                str = str + "07-";
                break;
            case "Aug":
                str = str + "08-";
                break;
            case "Sep":
                str = str + "09-";
                break;
            case "Oct":
                str = str + "10-";
                break;
            case "Nov":
                str = str + "11-";
                break;
            case "Dec":
                str = str + "12-";
                break;
        }

        str = str + dateString.substr(5, 2);
        console.log(str);

        return str;
};

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


//CONTROLLER
mainApp.controller('weatherListCtrl', function ($scope, $http) {
    $http.get('app/daily.json').success(function(doc, status, headers, config) {

        $scope.data = doc;
        console.log("DATA IS: ", $scope.data);
        console.log(convertDateForChart($scope.data.list[0].dt));

        //CHART
        var chart = c3.generate({
            data: {
                x: 'x',
                columns: [
                    ['x', convertDateForChart($scope.data.list[0].dt),
                        convertDateForChart($scope.data.list[1].dt),
                        convertDateForChart($scope.data.list[2].dt),
                        convertDateForChart($scope.data.list[3].dt),
                        convertDateForChart($scope.data.list[4].dt),
                        convertDateForChart($scope.data.list[5].dt),
                        convertDateForChart($scope.data.list[6].dt)],
                    ['Температура', $scope.data.list[0].temp.day, $scope.data.list[1].temp.day,
                        $scope.data.list[2].temp.day, $scope.data.list[3].temp.day,
                        $scope.data.list[4].temp.day, $scope.data.list[5].temp.day,
                        $scope.data.list[6].temp.day],
                ],
                types: {
                    "Температура": 'area'
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%d.%m'
                        //'%d.%m.%Y'
                    }
                }
            }
        });

    });

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