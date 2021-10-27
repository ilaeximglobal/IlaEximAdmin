<?php

// Connect to database
include("../connection.php");
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method=$_SERVER["REQUEST_METHOD"];

get_blogs();

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

function get_map_from_array($array,$key_name){
        $map = array();
        foreach ($array as $ele) {
                $map[$ele[$key_name]][] = $ele;
        }
        return $map;
}

function get_blogs(){
        $query="SELECT `id`, `string_id`, `title`, `description`, `image`, `author`, `product_ids` FROM blog WHERE showing='Y' ORDER BY 1";
                
        $blogs = get_data_from_query($query);
        $subproduct_map = get_subproducts();

        foreach ($blogs as &$p) {
                $pa = array();
                foreach(explode(',', $p['product_ids']) as $pi){
                        if (array_key_exists($pi,$subproduct_map)){
                                // echo '+++'.$pi;
                                array_push($pa,$subproduct_map[$pi][0]);
                        }
                }
                $p['products'] = $pa;
                // var_dump($pa);
        }

        header('Content-Type: application/json');
        echo json_encode($blogs);
}

function get_subproducts(){
        $query="SELECT `id`, `main_product_id`, `name` FROM `product` WHERE showing='Y'";
        
        $products = get_data_from_query($query);

        header('Content-Type: application/json');
        return get_map_from_array($products,'id');
}