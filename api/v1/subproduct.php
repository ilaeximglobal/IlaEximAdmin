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

$image_folder = 'product';
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
    global $image_folder;

    $query = "SELECT `id`, `main_product_id`, `item_order`, `name`, `image`, `description`, `benefit`, `uses`, `showing` FROM product ORDER BY 1";
    $data = get_data_from_query($connection, $query);
    foreach ($data as &$p) {
        $path = websiteUrl . 'data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
    }

    return returnSuccessJsonData($data);
}

function getSubProductBriefList()
{
    global $connection;

    $query = "SELECT `id`, `main_product_id`, `name` FROM product ORDER BY 1";
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
    global $image_folder;

    if ($data->isfilechanged_image) {
        $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
        // var_dump($resp);
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

    $query = "UPDATE product SET `main_product_id`=?, `item_order`=?, `name`=?, `image`=?, `description`=?, `benefit`=?, `uses`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iissssssi", $data->main_product_id, $data->item_order, $data->name, $data->image, $data->description, $data->benefit, $data->uses, $data->showing, $data->id);
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
        if($s['success']) {
            $count++;
        }
    }

    return returnSuccessJsonMessage($count . ' records updated.');
}

function createSubProduct($data)
{
    global $connection;
    global $image_folder;

    $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
    if ($resp['success']) {
        $data->image = $resp['filename'];
    } else {
        return returnErrorJsonMessage($resp['message']);
    }

    $query = "INSERT INTO product(`main_product_id`, `item_order`, `name`, `image`, `description`, `benefit`, `uses`,`showing`) VALUES (?,?,?,?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iissssss", $data->main_product_id, $data->item_order, $data->name, $data->image, $data->description, $data->benefit, $data->uses, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteSubProduct($data)
{
    global $connection;
    global $image_folder;

    delete_image($data->image, $image_folder);

    $query = "DELETE FROM product WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
