<?php

function returnJsonData($data){
	header('Content-Type: application/json');
	echo json_encode($data);
}

function get_data_from_query($connection,$query){
	$response = array();
	$result = mysqli_query($connection, $query);
	while ($row = mysqli_fetch_assoc($result)) {
			$response[] = $row;
	}
	header('Content-Type: application/json');
	return $response;
}

function getTokenFromHeader($headers){
	foreach ($headers as $header => $value) {
			if ($header == "Authorization" && preg_match('/Bearer\s(\S+)/', $value, $matches)) {
					return $matches[1];
			}
	}
	return "";
}
