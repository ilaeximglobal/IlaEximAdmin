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
        getFaq($connection);
		break;
	case 'POST':
        $data = json_decode(file_get_contents('php://input'));    
        updateFaq($data);
		break;
	default:
		// Invalid Request Method
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}

function getFaq(){
    global $connection;

	$token = getTokenFromHeader(apache_request_headers());
	if (!checkIfLoggedin($connection, $token)) {
			returnJsonData(array());
			return;
	}

	$query = "SELECT `id`, `question`, `answer`,`showing` FROM faq ORDER BY 1";
	$reviews = get_data_from_query($connection, $query);

	returnJsonData($reviews);
}

function updateFaq($data){
    global $connection;

	$token = getTokenFromHeader(apache_request_headers());
	if (!checkIfLoggedin($connection, $token)) {
			returnJsonData(array(
				'success' => false,
				'status_message' => 'Not authorised.'
			));
			return;
	}

	$query = "UPDATE faq SET `question`=?, `answer`=?, `showing`=? WHERE `id`=?";
	$stmt = $connection->prepare($query);
	$stmt->bind_param("sssi", $data->question, $data->answer, $data->showing, $data->id);
	$stmt->execute();
	$result = $stmt->affected_rows;
	$stmt->close();

	returnJsonData(array(
		'success' => true,
		'status_message' => 'Data updated.'
	));
}
