<?php

function checkIfLoggedin($connection,$token){
	$stmt = $connection->prepare("SELECT * FROM `user_login` WHERE `token`=? AND `expire_on` >= NOW()");
	$stmt->bind_param("s", $token);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = mysqli_fetch_assoc($result)) {
		extendLogin($connection,$row['user_id'],$token);
		return true;
	}else{
		session_destroy();
		return false;
	}
}

function extendLogin($connection,$user_id,$token){
	$query = "UPDATE `user_login` SET `expire_on`= DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE `user_id`=? AND `token`=?";
	$stmt = $connection->prepare($query);
	$stmt->bind_param("is",$user_id,$token);
	$stmt->execute();
	$result = $stmt->affected_rows;
	$stmt->close();
	return $result;
}

function get_data_from_query($connection, $query)
{
	$response = array();
	$result = mysqli_query($connection, $query);
	while ($row = mysqli_fetch_assoc($result)) {
		$response[] = $row;
	}
	header('Content-Type: application/json');
	return $response;
}

function get_map_from_array($array,$key_name){
        $map = array();
        foreach ($array as $ele) {
                $map[$ele[$key_name]][] = $ele;
        }
        return $map;
}
