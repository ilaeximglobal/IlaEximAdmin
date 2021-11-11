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

$image_folder = 'productitem';
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        getProductItem();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        updateProductItem($data);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createProductItem($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteProductItem($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getProductItem()
{
    global $connection;
    global $image_folder;

    $query = "SELECT `id`, `main_product_id`, `name`, `description`, `image`, `showing` FROM product_item ORDER BY 1";
    $data = get_data_from_query($connection, $query);
    foreach ($data as &$p) {
        $path = websiteUrl . 'data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
    }

    return returnSuccessJsonData($data);
}

function updateProductItem($data)
{
    global $connection;
    global $image_folder;

    // if ($data->isfilechanged_image) {
    //     $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
    //     if ($resp['success']) {
    //         delete_image($data->image, $image_folder);
    //         $data->image = $resp['filename'];
    //     } else {
    //         return array(
    //             'success' => false,
    //             'message' => $resp['message']
    //         );
    //     }
    // }

    $query = "UPDATE product_item SET `main_product_id`=?, `name`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("issi", $data->main_product_id, $data->name, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

	returnSuccessJsonMessage('Data updated.');
}

function createProductItem($data)
{
    global $connection;
    global $image_folder;

    // $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
    // if ($resp['success']) {
    //     $data->image = $resp['filename'];
    // } else {
    //     return returnErrorJsonMessage($resp['message']);
    // }

    $query = "INSERT INTO product_item(`main_product_id`, `name`, `showing`) VALUES (?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iss", $data->main_product_id, $data->name, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteProductItem($data)
{
    global $connection;
    global $image_folder;

    // delete_image($data->image, $image_folder);

    $query = "DELETE FROM product_item WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
