<?php

// Connect to database
include("../connection.php");
include_once 'util.php';
include_once 'datautil.php';

$db = new dbObj();
$connection =  $db->getConnstring();

$token = getTokenFromSession();
if (!checkIfLoggedin($connection, $token)) {
    return returnLoggedoutJsonData();
}

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        getProductLink();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        updateProductLink($data);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createProductLink($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteProductLink($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getProductLink()
{
    global $connection;

    $query = "SELECT `id`, `product_id`, `name`, `link`, `showing` FROM product_links ORDER BY 1";
    $data = get_data_from_query($connection, $query);

    return returnSuccessJsonData($data);
}

function updateProductLink($data)
{
    global $connection;

    $query = "UPDATE product_links SET `product_id`=?, `name`=?, `link`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("isssi", $data->product_id, $data->name, $data->link, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

	returnSuccessJsonMessage('Data updated.');
}

function createProductLink($data)
{
    global $connection;

    $query = "INSERT INTO product_links(`product_id`, `name`, `link`, `showing`) VALUES (?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("isss", $data->product_id, $data->name, $data->link, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteProductLink($data)
{
    global $connection;

    $query = "DELETE FROM product_links WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
