<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';
require 'db.php';

DB::init('mysql:dbname=test;host=127.0.0.1;port=3306', 'root', 'WhiteShark28021995');

$app = new \Slim\App;

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

/****DON'T WORK****/
$app->get('/posts/{city},{minDate},{maxDate}', function (Request $request, Response $response, $args) {
    $INPcity = $args['city'];
    $INPmDate = $args['minDate'];
    $INPMDate = $args['maxDate'];

    file_put_contents('log.txt', 'Отримав параметр: '.$INPcity.' '.$INPmDate.' '.$INPMDate);
    $rows = DB::fetchAll("SELECT c.id, c.city, w.date, w.dayOfWeek, w.weather, w.temp FROM cities AS c RIGHT JOIN weather AS w ON (c.id=w.id) WHERE city = '".$args['city']."' AND date > '".$args['minDate']."' AND date <= '".$args['maxDate']."';");
    $response->getBody()->write('{"data":'.json_encode($rows).'}');
    file_put_contents('out.txt', $response);
    return $response;
});

$app->get('/sendRequest/{city}', function (Request $request, Response $response, $args) {
    header('Content-Type: text/html;charset=UTF-8');

    $city = $args['city']; // город. Можно и по-русски написать, например: Брянск
    // формируем урл для запроса
    $url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=".$args['city']."&units=metric&cnt=7&APPID=531d4a54f4acb25f72b62eab815bc362";
    // делаем запрос к апи
    $data = @file_get_contents($url);
    // получили данные
    file_put_contents('forecast.json', $data);
});

/*
$app->get('/posts/{city}', function (Request $request, Response $response, $args) {
    $input = $args['city'];
    file_put_contents('log.txt', 'Отримав параметр: '.$input);
    $rows = DB::fetchAll("SELECT c.id, c.city, w.date, w.dayOfWeek, w.weather, w.temp FROM cities AS c RIGHT JOIN weather AS w ON (c.id=w.id) WHERE city = '".$input."';");
    $response->getBody()->write('{"data":'.json_encode($rows).'}');
    file_put_contents('out.txt', $response);
    return $response;
});
*/
$app->run();