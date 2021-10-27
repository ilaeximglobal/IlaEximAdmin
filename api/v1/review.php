<?php
// generate json web token
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';
use \Firebase\JWT\JWT;

// Connect to database
include("../connection.php");
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        get_reviews();
        break;
    case 'POST':
        updateReview();
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function updateReview(){
	$input = json_decode(file_get_contents('php://input'));
    $data = $input->data;
    $token = isset($input->token) ? $input->token : "";
    if($token){
        $userdata = get_data_from_jwt_token($token);
        http_response_code(200);
        echo json_encode(array("success" => true,"message" => "Data ".json_encode($userdata->data)));
    }else{
        http_response_code(401);
        echo json_encode(array("success" => false,"message" => "Access denied."));
    }
}

function get_data_from_jwt_token($token){
	include_once '../config.php';
    $decoded = JWT::decode($token, $key, array('HS256'));
    return $decoded;
}

function get_data_from_query($query)
{
    global $connection;
    $response = array();
    $result = mysqli_query($connection, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = $row;
    }
    header('Content-Type: application/json');
    return $response;
}

function get_map_from_array($array, $key_name)
{
    $map = array();
    foreach ($array as $ele) {
        $map[$ele[$key_name]][] = $ele;
    }
    return $map;
}

function get_reviews()
{
    $query = "SELECT `id`, `title`, `review`, `reviewer_name`, `reviewer_designation`, `product_ids` FROM review WHERE showing='Y' ORDER BY 1";

    $reviews = get_data_from_query($query);
    $subproduct_map = get_subproducts();

    foreach ($reviews as &$p) {
        $pa = array();
        foreach (explode(',', $p['product_ids']) as $pi) {
            if (array_key_exists($pi, $subproduct_map)) {
                // echo '+++'.$pi;
                array_push($pa, $subproduct_map[$pi][0]);
            }
        }
        $p['products'] = $pa;
        // var_dump($pa);
    }

    header('Content-Type: application/json');
    echo json_encode($reviews);
}

function get_subproducts()
{
    $query = "SELECT `id`, `main_product_id`, `name` FROM `product` WHERE showing='Y'";

    $products = get_data_from_query($query);

    header('Content-Type: application/json');
    return get_map_from_array($products, 'id');
}
