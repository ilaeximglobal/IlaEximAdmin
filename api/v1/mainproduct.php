<?php

// Connect to database
include("../connection.php");
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method=$_SERVER["REQUEST_METHOD"];

switch($request_method){
        case 'GET':
                // Retrive Products
                if(!empty($_GET["mainproductid"]))
                {
                        $id=$_GET["mainproductid"];
                        get_products_from_id($id);
                }
                else
                {
                        get_products();
                }
                break;
        case 'POST':
        //         // Insert Product
        //         insert_quote();
        //         break;
        // case 'PUT':
        //         // Update Product
        //         $id=intval($_GET["id"]);
        //         update_employee($id);
        //         break;
        // case 'DELETE':
        //         // Delete Product
        //         $id=intval($_GET["id"]);
        //         delete_quote($id);
        //         break;
        default:
                // Invalid Request Method
                header("HTTP/1.0 405 Method Not Allowed");
                break;
}

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

function get_products(){
        $query="SELECT `id`, `string_id`, `name`, `type`, `short_description`, `description`, `image` FROM main_product WHERE showing='Y' ORDER BY 1";
        
        $main_products = get_data_from_query($query);
        $subproduct_map = get_subproducts();
        $product_image_map = get_product_images();

        foreach ($main_products as &$p) {
                $p['products'] = $subproduct_map[$p['id']];
                $p['images'] = $product_image_map[$p['id']];
                // echo json_encode($p);
        }

        header('Content-Type: application/json');
        echo json_encode($main_products);
}

function get_products_from_id($id=0){
	$query="SELECT `id`, `string_id`, `name`, `type`, `short_description`, `description`, `image` FROM main_product WHERE showing='Y'";
	if(!empty($id))
	{
		$query.=" AND string_id='".$id."' LIMIT 1";
	}
	
        $main_products = get_data_from_query($query);
        $subproduct_map = get_subproducts();
        $product_image_map = get_product_images();

        foreach ($main_products as &$p) {
                if (array_key_exists($p['id'],$subproduct_map)){
                        $p['products'] = $subproduct_map[$p['id']];
                }
                
                if (array_key_exists($p['id'],$product_image_map)){
                        $p['images'] = $product_image_map[$p['id']];
                }
                // echo json_encode($p);
        }

        header('Content-Type: application/json');
        echo json_encode($main_products);
}

function get_subproducts(){
        $query="SELECT `id`, `main_product_id`, `name`, `image`, `description`, `benefit`, `uses` FROM `product` WHERE showing='Y'";
        
        $products = get_data_from_query($query);
        $product_links_map = get_product_links();

        foreach ($products as &$p) {
                if (array_key_exists($p['id'],$product_links_map)){
                        $p['links'] = $product_links_map[$p['id']];
                }
        }

        header('Content-Type: application/json');
        return get_map_from_array($products,'main_product_id');
}

function get_product_images(){
        $query="SELECT `id`, `main_product_id`, `image`, `description` FROM `product_image` WHERE showing='Y'";
        
        header('Content-Type: application/json');
        return get_map_from_array(get_data_from_query($query),'main_product_id');
}

function get_product_links(){
        $query="SELECT `id`, `product_id`, `name`, `link` FROM `product_links` WHERE showing='Y'";
        
        header('Content-Type: application/json');
        return get_map_from_array(get_data_from_query($query),'product_id');
}

// function insert_quote(){
//         global $connection;

//         $data = json_decode(file_get_contents('php://input'), true);
//         $query="INSERT INTO `quote`(`admin_id`, `box_name`, `customer_name`, `b_l`, `b_w`, `b_h`, `s_w`, `s_l`, `s_n`, 
//                 `s_gsm`, `s_rate`, `s_cost`, `total_s_cost`, `wastage_f`, `wastage_cost`, `transport_cost`, 
//                 `printing_cost`, `lamination_cost`, `profit`, `price`, `gst_f`, `gst_cost`, `final_price`) 
//                 VALUES ('".$data["admin_id"]."','".$data["box_name"]."','".
//                 $data["customer_name"]."','".$data["b_l"]."','".$data["b_w"]."','".$data["b_h"]."','".
//                 $data["s_w"]."','".$data["s_l"]."','".$data["s_n"]."','".$data["s_gsm"]."','".$data["s_rate"]."','".
//                 $data["s_cost"]."','".$data["total_s_cost"]."','".$data["wastage_f"]."','".$data["wastage_cost"]."','".
//                 $data["transport_cost"]."','".$data["printing_cost"]."','".
//                 $data["lamination_cost"]."','".
//                 $data["profit"]."','".$data["price"]."','".$data["gst_f"]."','".$data["gst_cost"]."','".$data["final_price"]."')";
//         if(mysqli_query($connection, $query))
//         {
//                 $response=array(
//                         'status' => 1,
//                         'status_message' =>'Quote created Successfully.'
//                 );
//         }
//         else
//         {
//                 $response=array(
//                         'status' => 0,
//                         'status_message' =>'Quote creation Failed.'
//                 );
//         }
//         header('Content-Type: application/json');
//         echo json_encode($response);
// }

// function update_quote($id){
//         global $connection;
//         $data = json_decode(file_get_contents("php://input"),true);
        
        
//         $query="UPDATE quote SET ".
//                 "`box_name` = '".$data["box_name"].
//                 "',`customer_name` = '".$data["customer_name"].
//                 "',`b_l` = '".$data["b_l"].
//                 "',`b_w` = '".$data["b_w"].
//                 "',`b_h` = '".$data["b_h"].
//                 "',`s_w` = '".$data["s_w"].
//                 "',`s_l` = '".$data["s_l"].
//                 "',`s_n` = '".$data["s_n"].
//                 "',`s_gsm` = '".$data["s_gsm"].
//                 "',`s_rate` = '".$data["s_rate"].
//                 "',`s_cost` = '".$data["s_cost"].
//                 "',`total_s_cost` = '".$data["total_s_cost"].
//                 "',`wastage_f` = '".$data["wastage_f"].
//                 "',`wastage_cost` = '".$data["wastage_cost"].
//                 "',`transport_f` = '".$data["transport_f"].
//                 "',`transport_cost` = '".$data["transport_cost"].
//                 "',`printing_f` = '".$data["printing_f"].
//                 "',`printing_cost` = '".$data["printing_cost"].
//                 "',`lamination_f` = '".$data["lamination_f"].
//                 "',`lamination_cost` = '".$data["lamination_cost"].
//                 "',`profit` = '".$data["profit"].
//                 "',`price` = '".$data["price"].
//                 "',`gst_f` = '".$data["gst_f"].
//                 "',`gst_cost` = '".$data["gst_cost"].
//                 "',`final_price` = '".$data["final_price"]."' WHERE id=".$id;
//         if(mysqli_query($connection, $query))
//         {
//                 $response=array(
//                         'status' => 1,
//                         'status_message' =>'Quote Updated Successfully.'
//                 );
//         }
//         else
//         {
//                 $response=array(
//                         'status' => 0,
//                         'status_message' =>'Quote Updation Failed.'
//                 );
//         }
//         header('Content-Type: application/json');
//         echo json_encode($response);
// }

// function delete_quote($id){
// 	global $connection;
// 	$query="DELETE FROM quote WHERE id=".$id;
// 	if(mysqli_query($connection, $query))
// 	{
// 		$response=array(
// 			'status' => 1,
// 			'status_message' =>'Quote Deleted Successfully.'
// 		);
// 	}
// 	else
// 	{
// 		$response=array(
// 			'status' => 0,
// 			'status_message' =>'Quote Deletion Failed.'
// 		);
// 	}
// 	header('Content-Type: application/json');
// 	echo json_encode($response);
// }
