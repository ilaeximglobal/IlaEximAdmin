<?php

// required headers
header("Access-Control-Allow-Origin: http://localhost/rest-api-authentication-example/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Connect to database
include("../connection.php");
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
	case 'POST':
		// Insert Product
		checkLogin();
		break;
	default:
		// Invalid Request Method
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}

function checkLogin()
{
	include_once '../config.php';
	global $connection;

	$data = json_decode(file_get_contents('php://input'));

	// $stmt = $connection->prepare("SELECT * FROM `users` WHERE `email`=? AND `password`=? AND role is like '%admin%' AND status in ('A')");

	$stmt = $connection->prepare("SELECT * FROM `users` WHERE `email`=? AND `password`=? AND role like '%admin%' AND status in ('A')");
	// $stmt->bind_param("s", $data->email);
	$stmt->bind_param("ss", $data->email, $data->password);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = mysqli_fetch_assoc($result)) {
		$token = array(
			"iat" => $issued_at,
			"exp" => $expiration_time,
			"iss" => $issuer,
			"data" => array(
				"id" => $row['id'],
				"firstname" => $row['name'],
				"lastname" => $row['surname'],
				"email" => $row['email']
			)
		);
		session_start();
		$token = session_id();
		$_SESSION['user_id'] = $row['id'];
		$_SESSION['token'] = $token;
		$_SESSION['firstname'] = $row['name'];
		$_SESSION['lastname'] = $row['surname'];
		$_SESSION['email'] = $row['email'];
		$_SESSION['role'] = $row['role'];

		$success = setLogin($row['id'], $token);
		if ($success) {
			$response = array(
				'success' => true,
				'user_id' => $row['id'],
				'token' => $token,
				'firstname' => $row['name'],
				'lastname' => $row['surname'],
				'email' => $row['email'],
				'role' => $row['role'],
				'status_message' => 'login Successful.'
			);
		} else {
			$response = array(
				'success' => false,
				'status_message' => 'login Failed.'
			);
			session_destroy();
		}
	} else {
		$response = array(
			'success' => false,
			'status_message' => 'login Failed.'
		);
	}
	header('Content-Type: application/json');
	echo json_encode($response);
}

function setLogin($user_id, $token)
{
	$count = insertLatestLogin($user_id, $token);
	if ($count != 1) {
		return false;
	}
	deleteOlderLogin($user_id, $token);
	return true;
}

function insertLatestLogin($user_id, $token)
{
	include_once '../config.php';
	global $connection;

	$stmt = $connection->prepare("INSERT INTO `user_login`(`user_id`, `token`, `expire_on`) 
		VALUES (?,?,DATE_ADD(NOW(), INTERVAL 30 MINUTE))");
	// $stmt->bind_param("s", $data->email);
	$stmt->bind_param("is", $user_id, $token);
	$stmt->execute();
	$result = $stmt->affected_rows;
	$stmt->close();
	return $result;
}

function deleteOlderLogin($user_id, $token)
{
	include_once '../config.php';
	global $connection;

	$stmt = $connection->prepare("DELETE FROM `user_login` WHERE `user_id`=? AND `token`!=?");
	// $stmt->bind_param("s", $data->email);
	$stmt->bind_param("is", $user_id, $token);
	$stmt->execute();
	$result = $stmt->affected_rows;
	$stmt->close();
	return $result;
}