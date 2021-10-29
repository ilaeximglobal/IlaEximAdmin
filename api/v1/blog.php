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
        getBlog($connection);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        updateBlog($data);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createBlog($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteBlog($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getBlog()
{
    global $connection;

    $query = "SELECT `id`, `string_id`, `title`, `description`, `image`, `author`, `product_ids`,`showing` FROM blog ORDER BY 1";
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

    returnSuccessJsonData($blogs);
}

function updateBlog($data)
{
    global $connection;

    $query = "UPDATE blog SET `string_id`=?, `title`=?, `description`=?, `image`=?, `author`=?, `product_ids`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssssssi", $data->string_id, $data->title, $data->description, $data->image, $data->author, $data->product_ids, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    returnSuccessJsonMessage('Data updated.');
}

function createBlog($data)
{
    global $connection;

    $query = "INSERT INTO blog(`string_id`, `title`, `description`, `image`, `author`, `product_ids`,`showing`) VALUES (?,?,?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssssss", $data->string_id, $data->title, $data->description, $data->image, $data->author, $data->product_ids, $data->showing);
    $stmt->execute();
    $stmt->close();

    returnSuccessJsonMessage('Data created.');
}

function deleteBlog($data)
{
    global $connection;

    $query = "DELETE FROM blog WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    returnSuccessJsonMessage('Data deleted.');
}

function get_subproducts($connection)
{
    $query = "SELECT `id`, `main_product_id`, `name` FROM `product` WHERE showing='Y'";

    $products = get_data_from_query($connection,$query);

    header('Content-Type: application/json');
    return get_map_from_array($products, 'id');
}
