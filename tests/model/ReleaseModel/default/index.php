<?php

function listing($items)
{
    header("HTTP/1.1 200 OK");
    echo json_encode($items);
}

function detail($id, $items)
{
    header("HTTP/1.1 200 OK");
    echo json_encode($items[0]);
}

function create()
{
    $item = json_decode(file_get_contents("php://input"), true);
    $item['id'] = 3;
    header("HTTP/1.1 200 OK");
    json_encode($item);
}

function update($id)
{
    header("HTTP/1.1 200 OK");
    echo file_get_contents("php://input");
}

function remove($id)
{
    header("HTTP/1.1 204 No Content");
}

function badRequest()
{
    header("HTTP/1.1 400 Bad Request");
}

function run()
{
    $method = strtolower($_SERVER["REQUEST_METHOD"]);
    $id = ltrim($_SERVER["REQUEST_URI"], dirname($_SERVER["SCRIPT_NAME"]));
    $id = ($id !== '') ? $id : null;

    $items = array(
        array(
            'id' => 0,
            'title' => 'Title 1',
            'format' => 1,
            'releaseDate' => '2012-12-21',
            'price' => '100',
            'publish' => false,
            'info' => ''
        ),
        array(
            'id' => 1,
            'title' => 'Title 2',
            'format' => 1,
            'releaseDate' => '2013-12-21',
            'price' => '50',
            'publish' => false,
            'info' => ''
        ),
        array(
            'id' => 2,
            'title' => 'Title 3',
            'format' => 1,
            'releaseDate' => '2014-12-21',
            'price' => '1000',
            'publish' => false,
            'info' => ''
        )
    );

    switch($method) {
        case 'get': {
            return ($id === null) ? listing($items) : detail($id, $items);
        }
        case 'post': {
            return ($id === null) ? create() : badRequest();
        }
        case 'put': {
            return ($id !== null) ? update($id) : badRequest();
        }
        case 'delete': {
            return ($id !== null) ? remove($id) : badRequest();
        }
    }

    return badRequest();
}

run();