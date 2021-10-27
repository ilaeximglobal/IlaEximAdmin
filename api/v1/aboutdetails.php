<?php

// Connect to database
include("../connection.php");
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method=$_SERVER["REQUEST_METHOD"];

get_about_details();

function get_data_from_query($query){
        global $connection;
        $response=array();
        $result=mysqli_query($connection, $query);
        while($row=mysqli_fetch_assoc($result))
        {
                $response[]=$row;
        }
        header('Content-Type: application/json');
        return $response;
}

function get_about_details(){
        $query="SELECT `id`, `name`, `detail` FROM about_details ORDER BY 1";
        
        $details = get_data_from_query($query);
        header('Content-Type: application/json');
        echo json_encode($details);
}
