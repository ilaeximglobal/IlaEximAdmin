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
        getAboutDetails($connection);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        updateAboutDetails($data);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getAboutDetails()
{
    global $connection;

    $query = "SELECT `id`, `name`, `detail` FROM about_details ORDER BY 1";
    $about = get_data_from_query($connection, $query);

    return returnSuccessJsonData($about);
}

function updateAboutDetails($data)
{
    global $connection;

    $query = "UPDATE about_details SET `name`=?, `detail`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssi", $data->name, $data->detail, $data->id);
    $stmt->execute();
    $stmt->close();

    return returnSuccessJsonMessage('Data updated.');
}
