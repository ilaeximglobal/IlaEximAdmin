<?php

// required headers
header("Access-Control-Allow-Origin: http://localhost/rest-api-authentication-example/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Connect to database
include("../connection.php");
include_once 'util.php';
include_once 'datautil.php';
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
	case 'POST':
		// Insert Product
		logout();
		break;
	default:
		// Invalid Request Method
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}

function logout(){
	$data = json_decode(file_get_contents('php://input'));

	$token = getTokenFromSession();
	$isLoggedin = checkIfUserLoggedin($data->user_id,$token);
	if($isLoggedin){
		deleteLogin($data->user_id);
		session_destroy();
	}
	
	$response = array(
		'success' => true,
		'status_message' => 'logout successful.'
	);
	header('Content-Type: application/json');
	echo json_encode($response);
}

function checkIfUserLoggedin($user_id,$token){
	include_once '../config.php';
	global $connection;

	$stmt = $connection->prepare("SELECT * FROM `user_login` WHERE `user_id`=? AND `token`=?");
	$stmt->bind_param("is", $user_id, $token);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = mysqli_fetch_assoc($result)) {
		return true;
	}
	return false;
}

function deleteLogin($user_id){
	include_once '../config.php';
	global $connection;

	$stmt = $connection->prepare("DELETE FROM `user_login` WHERE `user_id`=?");
	// $stmt->bind_param("s", $data->email);
	$stmt->bind_param("i", $user_id);
	$stmt->execute();
	$result = $stmt->affected_rows;
	$stmt->close();
	return $result;
}
