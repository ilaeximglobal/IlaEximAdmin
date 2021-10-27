<?php

function checkIfLoggedin($connection,$token){
	$stmt = $connection->prepare("SELECT * FROM `user_login` WHERE `token`=? AND `expire_on` >= NOW()");
	$stmt->bind_param("s", $token);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = mysqli_fetch_assoc($result)) {
		return true;
	}
	return false;
}
