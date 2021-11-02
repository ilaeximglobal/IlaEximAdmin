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
        getReview();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        updateReview($data);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createReview($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteReview($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getReview()
{
    global $connection;

    $query = "SELECT `id`, `title`, `review`, `reviewer_name`, `reviewer_designation`, `product_ids` ,`showing` FROM review ORDER BY 1";
    $blogs = get_data_from_query($connection, $query);

    $subproduct_map = get_subproducts($connection);
    foreach ($blogs as &$p) {
        $pa = array();
        foreach (explode(',', $p['product_ids']) as $pi) {
            if (array_key_exists($pi, $subproduct_map)) {
                array_push($pa, $subproduct_map[$pi][0]);
            }
        }
        $p['products'] = $pa;
    }

    return returnSuccessJsonData($blogs);
}

function updateReview($data)
{
    global $connection;

    $query = "UPDATE review SET  `title`=?, `review`=?, `reviewer_name`=?, `reviewer_designation`=?, `product_ids`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssssssi", $data->title, $data->review, $data->reviewer_name, $data->reviewer_designation, $data->product_ids, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data updated.');
}

function createReview($data)
{
    global $connection;

    $query = "INSERT INTO review(`title`, `review`, `reviewer_name`, `reviewer_designation`, `product_ids`,`showing`) VALUES (?,?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssssss", $data->title, $data->review, $data->reviewer_name, $data->reviewer_designation, $data->product_ids, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteReview($data)
{
    global $connection;

    $query = "DELETE FROM review WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}

function get_subproducts($connection)
{
    $query = "SELECT `id`, `main_product_id`, `name` FROM `product` WHERE showing='Y'";

    $products = get_data_from_query($connection, $query);

    return $products;

    // header('Content-Type: application/json');
    // return get_map_from_array($products, 'id');
}

