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
        if (isset($_GET['type']) && $_GET['type'] == 'brief') {
            getSubProductBriefList();
        } else {
            getSubProduct();
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        if (isset($_GET['bulk']) && $_GET['bulk'] == 'true') {
            updateSubProductBulk($data);
        } else {
            updateSubProductAndReturn($data);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createSubProduct($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteSubProduct($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getSubProduct()
{
    global $connection;

    $query = "SELECT `id`, `product_id`, `item_order`, `name`, `showing` FROM diamond_subproduct ORDER BY 1";
    $data = get_data_from_query($connection, $query);

    return returnSuccessJsonData($data);
}

function getSubProductBriefList()
{
    global $connection;

    $query = "SELECT `id`, `product_id`, `name` FROM diamond_subproduct ORDER BY 1";
    $data = get_data_from_query($connection, $query);
    return returnSuccessJsonData($data);
}

function updateSubProductAndReturn($data)
{
    $s = updateSubProduct($data);
    return returnJsonData($s);
}

function updateSubProduct($data)
{
    global $connection;

    $query = "UPDATE diamond_subproduct SET `product_id`=?, `item_order`=?, `name`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iissi", $data->product_id, $data->item_order, $data->name, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    return array(
        'success' => true,
        'message' => 'Data updated.'
    );
}

function updateSubProductBulk($data)
{
    $count = 0;
    foreach ($data as &$p) {
        $s = updateSubProduct($p);
        if ($s['success']) {
            $count++;
        }
    }

    return returnSuccessJsonMessage($count . ' records updated.');
}

function createSubProduct($data)
{
    global $connection;

    $query = "INSERT INTO diamond_subproduct(`product_id`, `item_order`, `name`, `showing`) VALUES (?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iiss", $data->product_id, $data->item_order, $data->name, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteSubProduct($data)
{
    global $connection;

    $query = "DELETE FROM diamond_subproduct WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
