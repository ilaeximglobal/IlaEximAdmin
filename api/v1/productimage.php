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

$image_folder = 'productimage';
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        getProductImage();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        if (isset($_GET['bulk']) && $_GET['bulk'] == 'true') {
            updateProductImageBulk($data);
        } else {
            updateProductImageAndReturn($data);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createProductImage($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteProductImage($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getProductImage()
{
    global $connection;
    global $image_folder;

    $query = "SELECT `id`, `product_id`, `item_order`, `image`, `description`, `showing` FROM product_image ORDER BY 1";
    $data = get_data_from_query($connection, $query);
    foreach ($data as &$p) {
        $path = websiteUrl . 'data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
    }

    return returnSuccessJsonData($data);
}

function updateProductImageAndReturn($data)
{
    $s = updateProductImage($data);
    return returnJsonData($s);
}

function updateProductImage($data)
{
    global $connection;
    global $image_folder;

    if ($data->isfilechanged_image) {
        $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
        if ($resp['success']) {
            if($resp['filename'] != $data->file_image->name){
                delete_image($data->image, $image_folder);
            }
            $data->image = $resp['filename'];
        } else {
            return array(
                'success' => false,
                'message' => $resp['message']
            );
        }
    }

    $query = "UPDATE product_image SET `product_id`=?, `item_order`=?, `image`=?, `description`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iisssi", $data->product_id, $data->item_order, $data->image, $data->description, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    return array(
        'success' => true,
        'message' => 'Data updated.'
    );
}

function updateProductImageBulk($data)
{
    $count = 0;
    foreach ($data as &$p) {
        $s = updateProductImage($p);
        if($s['success']) {
            $count++;
        }
    }

    return returnSuccessJsonMessage($count . ' records updated.');
}

function createProductImage($data)
{
    global $connection;
    global $image_folder;

    $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
    if ($resp['success']) {
        $data->image = $resp['filename'];
    } else {
        return returnErrorJsonMessage($resp['message']);
    }

    $query = "INSERT INTO product_image(`product_id`, `item_order`, `image`, `description`, `showing`) VALUES (?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iisss", $data->product_id, $data->item_order, $data->image, $data->description, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteProductImage($data)
{
    global $connection;
    global $image_folder;

    delete_image($data->image, $image_folder);

    $query = "DELETE FROM product_image WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
