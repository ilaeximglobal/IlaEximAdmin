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

$image_folder = 'certificate';
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        getCertificate();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        if (isset($_GET['bulk']) && $_GET['bulk'] == 'true') {
            updateCertificateBulk($data);
        } else {
            updateCertificateAndReturn($data);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createCertificate($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteCertificate($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getCertificate()
{
    global $connection;
    global $image_folder;

    $query = "SELECT `id`, `title`, `image`, `description`,`item_order`,`showing` FROM certificate ORDER BY 1";
    $certificates = get_data_from_query($connection, $query);
    foreach ($certificates as &$p) {
        $path = websiteUrl . 'data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
    }

    return returnSuccessJsonData($certificates);
}


function updateCertificateAndReturn($data)
{
    $s = updateCertificate($data);
    return returnJsonData($s);
}

function updateCertificate($data)
{
    global $connection;
    global $image_folder;

    if ($data->isfilechanged_image) {
        $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
        if ($resp['success']) {
            if($resp['filename'] != $data->file_image->name){
                if($resp['filename'] != $data->file_image->name){
                    delete_image($data->image, $image_folder);
                }
            }
            $data->image = $resp['filename'];
        } else {
            return returnErrorJsonMessage($resp['message']);
        }
    }

    $query = "UPDATE certificate SET `title`=?, `image`=?, `showing`=?, `item_order`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssii", $data->title, $data->image, $data->showing, $data->item_order, $data->id);
    $stmt->execute();
    $stmt->close();

    return array(
        'success' => true,
        'message' => 'Data updated.'
    );
}

function updateCertificateBulk($data)
{
    $count = 0;
    foreach ($data as &$p) {
        $s = updateCertificate($p);
        if($s['success']) {
            $count++;
        }
    }

    return returnSuccessJsonMessage($count . ' records updated.');
}

function createCertificate($data)
{
    global $connection;
    global $image_folder;

    $resp = save_image($data->file_image->name, $data->file_image->data, $image_folder);
    if ($resp['success']) {
        $data->image = $resp['filename'];
    } else {
        return returnErrorJsonMessage($resp['message']);
    }

    $query = "INSERT INTO certificate(`title`, `image`, `description`,`item_order`,`showing`) VALUES (?,?,'',?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssis",$data->title, $data->image, $data->item_order, $data->showing);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data created.');
}

function deleteCertificate($data)
{
    global $connection;
    global $image_folder;

    delete_image($data->image, $image_folder);

    $query = "DELETE FROM certificate WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data deleted.');
}
