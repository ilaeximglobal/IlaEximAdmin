<?php

function returnJsonData($data)
{
	header('Content-Type: application/json');
	echo json_encode($data);
}

function returnLoggedoutJsonData()
{
	returnJsonData(array(
		'success' => false,
		'authorised' => false,
		'status_message' => 'Not authorised.',
		'data' => array(),
	));
}

function returnSuccessJsonData($data)
{
	returnJsonData(array(
		'success' => true,
		'data' => $data
	));
}

function returnSuccessJsonMessage($message)
{
	returnJsonData(array(
		'success' => true,
		'status_message' => $message
	));
}

function getTokenFromSession()
{
	// foreach ($headers as $header => $value) {
	// 		if ($header == "Authorization" && preg_match('/Bearer\s(\S+)/', $value, $matches)) {
	// 				return $matches[1];
	// 		}
	// }

	// session_start();
	if (!isset($_SESSION)) session_start();
	// echo $_SESSION["user_id"];
	$token = "";
	if (isset($_SESSION["user_id"])) {
		$token = $_SESSION["token"];
	}
	return $token;
}
