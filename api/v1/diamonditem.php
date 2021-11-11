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

$image_folder = 'diamonditem';
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        getProductItem();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        if (isset($_GET['bulk']) && $_GET['bulk'] == 'true') {
            updateProductItemBulk($data);
        } else {
            updateProductItemAndReturn($data);
        }
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

    $query = "SELECT `id`, `subproduct_id`, `item_order`, `name`, `description`, `images` as image, `showing` FROM diamond_item ORDER BY 1";
    $data = get_data_from_query($connection, $query);
    foreach ($data as &$p) {
        $path = websiteUrl . 'data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
    }

    return returnSuccessJsonData($data);
}


function updateProductItemAndReturn($data)
{
    $s = updateProductItem($data);
    return returnJsonData($s);
}

function updateProductItem($data)
{
    global $connection;
    global $image_folder;

    if ($data->isfilechanged_image) {
        $resp = save_image_or_video($data->file_image->name, $data->file_image->data, $image_folder);
        if ($resp['success']) {
            delete_image($data->image, $image_folder);
            $data->image = $resp['filename'];
        } else {
            return array(
                'success' => false,
                'message' => $resp['message']
            );
        }
    }

    $query = "UPDATE diamond_item SET `subproduct_id`=?, `item_order`=?, `name`=?, `description`=?, `images`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iissssi", $data->subproduct_id, $data->item_order, $data->name, $data->description, $data->image, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    return array(
        'success' => true,
        'message' => 'Data updated.'
    );
}

function updateProductItemBulk($data)
{
    $count = 0;
    foreach ($data as &$p) {
        $s = updateProductItem($p);
        if($s['success']) {
            $count++;
        }
    }

    return returnSuccessJsonMessage($count . ' records updated.');
}

function createProductItem($data)
{
    global $connection;
    global $image_folder;

    $resp = save_image_or_video($data->file_image->name, $data->file_image->data, $image_folder);
    if ($resp['success']) {
        $data->image = $resp['filename'];
    } else {
        return returnErrorJsonMessage($resp['message']);
    }

    $query = "INSERT INTO diamond_item(`subproduct_id`, `item_order`, `name`, `description`, `images`, `showing`) VALUES (?,?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("iissss", $data->subproduct_id, $data->item_order, $data->name, $data->description, $data->image, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteProductItem($data)
{
    global $connection;
    global $image_folder;

    delete_image($data->image, $image_folder);

    $query = "DELETE FROM diamond_item WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
