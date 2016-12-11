var mainApp = angular.module('MainApp', ['ngRoute', 'ngResource']);

var Parameters = {
    cityName: 'ALL',
    minDate : '01.01.2016',
    maxDate : '01.01.2017'
};

var DataFromDB = {};
var DataFromAPI = 'undefined';

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


//FACTORY

mainApp.factory('PostModel', ['$resource', function ($resource) {
 return $resource('http://localhost:8088/api/rest.php/params/:id', {'id':'@id'}, {
         'update': {method: 'PUT'}
     });
 }]);

mainApp.factory('RequestModel', ['$resource', function ($resource) {
    return $resource('http://localhost:8088/api/rest.php/sendRequest/:city', {'city':'@city'}, {});
}]);


//CONTROLLERS
var CityInputName;
mainApp.controller('RequestCtrl', ['$scope', 'RequestModel', function ($scope, RequestModel) {

    $scope.cityName;

    $scope.getData = function () {
        DataFromAPI = 'undefined';
        CityInputName = $scope.cityName;
        RequestModel.get({'city':CityInputName}, function (res) {
            DataFromAPI = res.data;
            });
    };

    $scope.drawChart = function(){
        if(DataFromAPI != 'undefined') {
            var chart = c3.generate({
                data: {
                    x: 'x',
                    columns: [
                        ['x', dateToFormatString(DataFromAPI.list[0].dt * 1000, 'yyyy-mm-dd'),
                            dateToFormatString(DataFromAPI.list[1].dt * 1000, 'yyyy-mm-dd'),
                            dateToFormatString(DataFromAPI.list[2].dt * 1000, 'yyyy-mm-dd'),
                            dateToFormatString(DataFromAPI.list[3].dt * 1000, 'yyyy-mm-dd'),
                            dateToFormatString(DataFromAPI.list[4].dt * 1000, 'yyyy-mm-dd'),
                            dateToFormatString(DataFromAPI.list[5].dt * 1000, 'yyyy-mm-dd'),
                            dateToFormatString(DataFromAPI.list[6].dt * 1000, 'yyyy-mm-dd')],
                        ['Температура', DataFromAPI.list[0].temp.day, DataFromAPI.list[1].temp.day,
                            DataFromAPI.list[2].temp.day, DataFromAPI.list[3].temp.day,
                            DataFromAPI.list[4].temp.day, DataFromAPI.list[5].temp.day,
                            DataFromAPI.list[6].temp.day],
                    ],
                    types: {
                        'Температура': 'area'
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
        }
    };

    $scope.returnInputCityName = function(){
        return CityInputName;
    };

    $scope.returnData = function() {
        return DataFromAPI;
    };
}]);


mainApp.controller('DataBaseCtrl', ['$scope', '$http', 'PostModel', function ($scope, $http, PostModel) {

    $scope.buttonName = 'Показати інструменти';

    $scope.changeButtonName = function () {
        if($scope.buttonName == 'Показати інструменти')
            $scope.buttonName = 'Приховати інструменти';
        else
            $scope.buttonName = 'Показати інструменти';
    };

    $scope.date1;
    $scope.date2;

    $scope.setParameters = function (cityName) {

        if(cityName === undefined || cityName === '')
            cityName = 'ALL';

        if($scope.date1 === undefined || $scope.date1 == '')
            $scope.date1 = '01.01.2016';

        if($scope.date2 === undefined || $scope.date2 == '') {
            var theDate = new Date();
            theDate.setMonth(theDate.getMonth()+1);
            $scope.date2 = dateToFormatString(theDate, 'dd.mm.yyyy');
        }

        Parameters.cityName = cityName;
        Parameters.minDate = dateToFormatString($scope.date1, 'yyyy-mm-dd', 'dd.mm.yyyy');
        Parameters.maxDate = dateToFormatString($scope.date2, 'yyyy-mm-dd', 'dd.mm.yyyy');

        //розглянь випадок, коли дата вводиться в текстове поле.
        //або всі записи робити в стандартному форматі. а потім той текст конвертувати і потрібний формат
    };

    $(function () {
        //Инициализация datetimepickerMin и datetimepickerMax
        $("#dateTimePickerMin").datetimepicker(
            {pickTime: false, language: 'ru'}
        );
        $("#dateTimePickerMax").datetimepicker(
            {pickTime: false, language: 'ru'}
        );
        //При изменении даты в min datetimepicker, она устанавливается как минимальная для max datetimepicker
        $("#dateTimePickerMin").on("dp.change",function (e) {
            $scope.date1 = e.date;
            $scope.date1 = dateToFormatString($scope.date1, 'dd.mm.yyyy');
            $("#dateTimePickerMax").data('DateTimePicker').setMinDate(e.date);
        });
        //При изменении даты в max datetimepicker, она устанавливается как максимальная для min datetimepicker
        $("#dateTimePickerMax").on("dp.change",function (e) {
            $scope.date2 = e.date;
            $scope.date2 = dateToFormatString($scope.date2, 'dd.mm.yyyy');
            $("#dateTimePickerMin").data("DateTimePicker").setMaxDate(e.date);
        });
    });

    $scope.getData = function () {
        PostModel.get({'id':JSON.stringify(Parameters)}, function (res) {
            DataFromDB = res.data;
        });
    };

    $scope.saveData = function (value) {

        var obj = value;
        obj.inputCityName = CityInputName;
        obj.convertDate = [0,0,0,0,0,0,0];
        obj.convertDay = [0,0,0,0,0,0,0];
        for(var i=0; i<7; i++){
            obj.convertDay[i] = getDayOfWeek(value.list[i].dt);
            obj.convertDate[i] = dateToFormatString(value.list[i].dt*1000, 'yyyy-mm-dd');
        }

        console.log(obj);

        PostModel.save(value, function(res){
            console.log(res);
        });
    };

    $scope.deleteData = function(value){

        value = {
            "one":1,
            "two":2
        };

        var answer = confirm("Ви дійсно бажаєте видалити усі дані? ");
        if (answer === true) {
            PostModel.delete(value, function (res) {
                console.log(res);
            });
            alert('Дані видалено!');
        }
    };

    $scope.returnData = function() {
        return DataFromDB;
    };

}]);

//ADDITIONAL FUNCTIONS
function dateToFormatString(value, targetFormat, oldFormat) {

    var dd, mm, yyyy;

    if(oldFormat === undefined) {
        var theDate = new Date(value);
        dd = theDate.getDate(), mm = theDate.getMonth() + 1, yyyy = theDate.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
    }
    else {
        var array;
        switch (oldFormat){
            case 'yyyy-mm-dd':
                array = value.split('-');
                dd = array[2], mm = array[1], yyyy = array[0];
                console.log("OLD: " + array);
                break;
            case 'dd.mm.yyyy':
                array = value.split('.');
                dd = array[0], mm = array[1], yyyy = array[2];
                console.log("OLD: " + array);
                break;
            default:
                return value;
        }
    }

    switch (targetFormat) {
        case 'yyyy-mm-dd':
            return yyyy + '-' + mm + '-' + dd;
        case 'dd.mm.yyyy':
        default:
            return dd + '.' + mm + '.' + yyyy;

    }
};

function getDayOfWeek(value) {
    var theDate = new Date(value*1000);

    switch (theDate.getDay()) {
        case 1:
            return 'Пн';
        case 2:
            return 'Вт';
        case 3:
            return 'Ср';
        case 4:
            return 'Чт';
        case 5:
            return 'Пт';
        case 6:
            return 'Сб';
        case 0:
            return 'Нд';
    }
};

//FILTER for HTML

mainApp.filter('formatLargeIconFilter', function(){
    return function(value) {
        switch (value) {
            case 'Clear':
                return 'assets/img/sun.jpg';
            case 'Sun':
                return 'assets/img/sun.jpg';
            case 'Rain':
                return 'assets/img/rain.jpg';
            case 'Snow':
                return 'assets/img/snow.jpg';
            case 'Extreme':
                return 'assets/img/extreme.jpg';
            case 'Clouds':
                return 'assets/img/cloudy.jpg';
            default:
                //icon-small
                //icon-sun
                //icon-cloudy
                return 'icon-small';
        }
    }
});

mainApp.filter('formatIconFilter', function(){
    return function(value) {
        switch (value) {
            case 'Sun':
                return 'icon-clear';
            case 'Rain':
                return 'icon-rain';
            case  'Snow':
                return 'icon-snowflake';
            case 'Extreme':
                return 'icon-cloud';
            default:
                //icon-small
                //icon-sun
                //icon-cloudy
                return 'icon-small';
        }
    }
});

mainApp.filter('formaShortDateFilter', function(){
    return function(value) {
        var theDate = new Date(value * 1000);
        return theDate.getDate() + '.' + (theDate.getMonth() + 1);
    }
});

mainApp.filter('formatDayOfWeekFilter', function(){
    return function(value) {
        var theDate = new Date(value*1000);

        switch (theDate.getDay()) {
            case 1:
                return 'Пн';
            case 2:
                return 'Вт';
            case 3:
                return 'Ср';
            case 4:
                return 'Чт';
            case 5:
                return 'Пт';
            case 6:
                return 'Сб';
            case 0:
                return 'Нд';
        }
    }
});

mainApp.filter('formatTempFilter', function(){
    return function(value) {
        return value + '°C';
    }
});