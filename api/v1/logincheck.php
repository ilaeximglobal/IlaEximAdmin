<?php

// Connect to database
include("../connection.php");
include_once 'util.php';
include_once 'datautil.php';

$db = new dbObj();
$connection =  $db->getConnstring();

$request_method = $_SERVER["REQUEST_METHOD"];
// echo print_r(session_save_path());
switch ($request_method) {
	case 'POST':
		checkLogin();
		break;
	default:
		// Invalid Request Method
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}

function checkLogin()
{
	global $connection;

	$token = getTokenFromSession();
	if (checkIfLoggedin($connection, $token)) {
		returnJsonData(array(
			'success' => true,
		));
	} else {
		returnJsonData(array(
			'success' => false,
		));
	}
}
