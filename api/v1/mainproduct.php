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
        getProduct();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        if (isset($_GET['bulk']) && $_GET['bulk'] == 'true') {
            updateProductBulk($data);
        } else {
            updateProductAndReturn($data);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createProduct($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteProduct($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getProduct()
{
    global $connection;
    global $image_folder;

    $query = "SELECT `id`, `string_id`, `item_order`, `name`, `type`, `short_description`, `description`, `image`, `showing` FROM main_product ORDER BY 1";
    $data = get_data_from_query($connection, $query);
    foreach ($data as &$p) {
        $path = websiteUrl . 'data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
    }

    return returnSuccessJsonData($data);
}

function updateProductAndReturn($data)
{
    global $connection;
    global $image_folder;

    if ($data->isfilechanged_image) {
        $resp = save_image($data->file_image->data, $image_folder);
        if ($resp['success']) {
            delete_image($data->image, $image_folder);
            $data->image = $resp['filename'];
        } else {
            return returnErrorJsonMessage($resp['message']);
        }
    }

    $query = "UPDATE main_product SET `string_id`=?, `item_order`=?, `name`=?, `type`=?, `short_description`=?, `description`=?, `image`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sissssssi", $data->string_id, $data->item_order, $data->name, $data->type, $data->short_description, $data->description, $data->image, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data updated.');
}

function updateProduct($data)
{
    global $connection;
    global $image_folder;

    if ($data->isfilechanged_image) {
        $resp = save_image($data->file_image->data, $image_folder);
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

    $query = "UPDATE main_product SET `string_id`=?, `item_order`=?, `name`=?, `type`=?, `short_description`=?, `description`=?, `image`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sissssssi", $data->string_id, $data->item_order, $data->name, $data->type, $data->short_description, $data->description, $data->image, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    return array(
        'success' => true,
        'message' => 'Data updated.'
    );
}

function updateProductBulk($data)
{
    $count = 0;
    foreach ($data as &$p) {
        $s = updateProduct($p);
        if($s['success']) {
            $count++;
        }
    }

    return returnSuccessJsonMessage($count . ' records updated.');
}

function createProduct($data)
{
    global $connection;
    global $image_folder;

    $resp = save_image($data->file_image->data, $image_folder);
    if ($resp['success']) {
        $data->image = $resp['filename'];
    } else {
        return returnErrorJsonMessage($resp['message']);
    }

    $query = "INSERT INTO main_product(`string_id`, `item_order`, `name`, `type`, `short_description`, `description`, `image`,`showing`) VALUES (?,?,?,?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sissssss", $data->string_id, $data->item_order, $data->name, $data->type, $data->short_description, $data->description, $data->image, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteProduct($data)
{
    global $connection;
    global $image_folder;

    delete_image($data->image, $image_folder);

    $query = "DELETE FROM main_product WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
