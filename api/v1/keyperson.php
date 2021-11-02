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

$image_folder = 'keyperson';
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
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}

function getKeyperson()
{
	global $connection;
    global $image_folder;

	$query = "SELECT `id`, `name`, `designation`, `expertise`, `image`, `about`, `showing` FROM key_person ORDER BY 1";
	$reviews = get_data_from_query($connection, $query);

    foreach ($reviews as &$p) {
        $path = 'http://ilaexim.com/data/images/' . $image_folder . '/' . $p['image'];
        $p['path_image'] = $path;
    }

	returnSuccessJsonData($reviews);
}

function updateKeyperson($data)
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

	$query = "UPDATE key_person SET `name`=?, `designation`=?, `expertise`=?, `image`=?, `about`=?, `showing`=? WHERE `id`=?";
	$stmt = $connection->prepare($query);
    $stmt->bind_param("ssssssi", $data->name, $data->designation, $data->expertise, $data->image, $data->about, $data->showing, $data->id);
    $stmt->execute();
	$stmt->close();

	returnSuccessJsonMessage('Data updated.');
}

function createKeyperson($data)
{
	global $connection;
    global $image_folder;

    $resp = save_image($data->file_image->data, $image_folder);
    if ($resp['success']) {
        $data->image = $resp['filename'];
    } else {
        return returnErrorJsonMessage("Error uploading image");
    }

	$query = "INSERT INTO key_person( `name`, `designation`, `expertise`, `image`, `about`,`showing`) VALUES (?,?,?,?,?,?)";
	$stmt = $connection->prepare($query);
    $stmt->bind_param("ssssss", $data->name, $data->designation, $data->expertise, $data->image, $data->about, $data->showing);
    $stmt->execute();
	$stmt->close();

	returnSuccessJsonMessage('Data created.');
}

function deleteKeyperson($data)
{
	global $connection;
    global $image_folder;

    delete_image($data->image, $image_folder);

	$query = "DELETE FROM key_person WHERE `id`=?";
	$stmt = $connection->prepare($query);
	$stmt->bind_param("i", $data->id);
	$stmt->execute();
	$stmt->close();

	returnSuccessJsonMessage('Data deleted.');
}
