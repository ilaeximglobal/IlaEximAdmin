<?php

// Connect to database
include("../connection.php");
include_once 'util.php';
include_once 'datautil.php';
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method = $_SERVER["REQUEST_METHOD"];
switch ($request_method) {
    case 'GET':
        getKeyperson($connection);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        updateKeyperson($data);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        createKeyperson($data);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        deleteKeyperson($data);
        break;
    default:
        // Invalid Request Method
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getKeyperson()
{
    global $connection;

    $token = getTokenFromHeader(apache_request_headers());
    if (!checkIfLoggedin($connection, $token)) {
        returnJsonData(array());
        return;
    }

    $query = "SELECT `id`, `name`, `designation`, `expertise`, `image`, `about`, `showing` FROM key_person ORDER BY 1";
    $reviews = get_data_from_query($connection, $query);

    returnJsonData($reviews);
}

function updateKeyperson($data)
{
    global $connection;

    $token = getTokenFromHeader(apache_request_headers());
    if (!checkIfLoggedin($connection, $token)) {
        returnJsonData(array(
            'success' => false,
            'status_message' => 'Not authorised.'
        ));
        return;
    }

    $query = "UPDATE key_person SET `name`=?, `designation`=?, `expertise`=?, `image`=?, `about`=?, `showing`=? WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssssssi", $data->name, $data->designation, $data->expertise, $data->image, $data->about, $data->showing, $data->id);
    $stmt->execute();
    $result = $stmt->affected_rows;
    $stmt->close();

    returnJsonData(array(
        'success' => true,
        'status_message' => 'Data updated.'
    ));
}

function createKeyperson($data)
{
    global $connection;

    $token = getTokenFromHeader(apache_request_headers());
    if (!checkIfLoggedin($connection, $token)) {
        returnJsonData(array(
            'success' => false,
            'status_message' => 'Not authorised.'
        ));
        return;
    }

    $query = "INSERT INTO key_person( `name`, `designation`, `expertise`, `image`, `about`,`showing`) VALUES (?,?,?,?,?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssssss", $data->name, $data->designation, $data->expertise, $data->image, $data->about, $data->showing);
    $stmt->execute();
    $result = $stmt->affected_rows;
    $stmt->close();

    returnJsonData(array(
        'success' => true,
        'status_message' => 'Data created.'
    ));
}

function deleteKeyperson($data)
{
    global $connection;

    $token = getTokenFromHeader(apache_request_headers());
    if (!checkIfLoggedin($connection, $token)) {
        returnJsonData(array(
            'success' => false,
            'status_message' => 'Not authorised.'
        ));
        return;
    }

    $query = "DELETE FROM key_person WHERE `id`=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $result = $stmt->affected_rows;
    $stmt->close();

    returnJsonData(array(
        'success' => true,
        'status_message' => 'Data deleted.'
    ));
}
