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

$image_folder = 'blog';
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        getBlog();
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
    global $image_folder;

    $query = "SELECT `id`, `string_id`, `title`, `description`, `image`, `author`, `product_ids`,`showing` FROM blog ORDER BY 1";
    $blogs = get_data_from_query($connection, $query);

    $subproduct_map = get_subproducts($connection);
    foreach ($blogs as &$p) {
        $path = websiteUrl . 'data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
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

function updateBlog($data)
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

    $query = "UPDATE blog SET `string_id`=?, `title`=?, `description`=?, `image`=?, `author`=?, `product_ids`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssssssi", $data->string_id, $data->title, $data->description, $data->image, $data->author, $data->product_ids, $data->showing, $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data updated.');
}

function createBlog($data)
{
    global $connection;
    global $image_folder;

    $resp = save_image($data->file_image->data, $image_folder);
    if ($resp['success']) {
        $data->image = $resp['filename'];
    } else {
        return returnErrorJsonMessage($resp['message']);
    }

    $query = "INSERT INTO blog(`string_id`, `title`, `description`, `image`, `author`, `product_ids`,`showing`) VALUES (?,?,?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssssss", $data->string_id, $data->title, $data->description, $data->image, $data->author, $data->product_ids, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteBlog($data)
{
    global $connection;
    global $image_folder;

    delete_image($data->image, $image_folder);

    $query = "DELETE FROM blog WHERE `id`=?";
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
