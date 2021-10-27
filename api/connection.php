<?php
include_once("variables.php");

Class dbObj{
        
	var $conn;
        
	function getConnstring() {
		$con = new mysqli(servername, username, password, dbname);

		/* check connection */
		if (mysqli_connect_errno()) {
			printf("Connect failed: %s\n", mysqli_connect_error());
			exit();
		} else {
			$this->conn = $con;
		}
		return $this->conn;
	}
}
