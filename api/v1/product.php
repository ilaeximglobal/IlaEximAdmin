<?php

// Connect to database
include("../connection.php");
include_once 'util.php';
include_once 'datautil.php';

$db = new dbObj();
$connection =  $db->getConnstring();

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if (isset($_GET['type']) && $_GET['type'] == 'brief') {
            get_products_brief_list();
        } else {
            get_products();
        }
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function get_products()
{
    global $connection;
    $query = "SELECT `id`, `main_product_id`, `name`, `image`, `description`, `benefit`, `uses` FROM `product` WHERE showing='Y'";

    header('Content-Type: application/json');
    $products = get_data_from_query($connection,$query);
    return returnSuccessJsonData($products);
}

function get_products_brief_list()
{
    global $connection;
    $query = "SELECT `id`, `main_product_id`, `name` FROM `product` WHERE showing='Y'";

    header('Content-Type: application/json');
    $products = get_data_from_query($connection,$query);
    return returnSuccessJsonData($products);
}
