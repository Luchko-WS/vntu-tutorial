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

$app->get('/posts', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode([
        'data' => [
            [
                'id' => 1,
                'name' => 'foo'
            ],
            [
                'id' => 2,
                'name' => 'bar'
            ]
        ]
    ]));
    return $response;
});

$app->get('/posts/{id}', function (Request $request, Response $response) {
//    $name = $request->getAttribute('name');
    $response->getBody()->write("{}");

    return $response;
});

$app->get('/test', function (Request $request, Response $response) {
    $rows = DB::fetchAll('SELECT * FROM `weather`');
    $response->getBody()->write('{"data":'.json_encode($rows).'}');
    return $response;
});

$app->run();