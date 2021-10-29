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
		getFaq($connection);
		break;
	case 'POST':
		$data = json_decode(file_get_contents('php://input'));
		updateFaq($data);
		break;
	case 'PUT':
		$data = json_decode(file_get_contents('php://input'));
		createFaq($data);
		break;
	case 'DELETE':
		$data = json_decode(file_get_contents('php://input'));
		deleteFaq($data);
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}

function getFaq()
{
	global $connection;

	$query = "SELECT `id`, `question`, `answer`,`showing` FROM diamond_faq ORDER BY 1";
	$reviews = get_data_from_query($connection, $query);

	returnSuccessJsonData($reviews);
}

function updateFaq($data)
{
	global $connection;

	$query = "UPDATE diamond_faq SET `question`=?, `answer`=?, `showing`=? WHERE `id`=?";
	$stmt = $connection->prepare($query);
	$stmt->bind_param("sssi", $data->question, $data->answer, $data->showing, $data->id);
	$stmt->execute();
	$stmt->close();

	returnSuccessJsonMessage('Data updated.');
}

function createFaq($data)
{
	global $connection;

	$query = "INSERT INTO diamond_faq(`question`, `answer`,`showing`) VALUES (?,?,?)";
	$stmt = $connection->prepare($query);
	$stmt->bind_param("sss", $data->question, $data->answer, $data->showing);
	$stmt->execute();
	$stmt->close();

	returnSuccessJsonMessage('Data created.');
}

function deleteFaq($data)
{
	global $connection;

	$query = "DELETE FROM diamond_faq WHERE `id`=?";
	$stmt = $connection->prepare($query);
	$stmt->bind_param("i", $data->id);
	$stmt->execute();
	$stmt->close();

	returnSuccessJsonMessage('Data deleted.');
}
