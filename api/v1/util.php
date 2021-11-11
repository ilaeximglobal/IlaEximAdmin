<?php
include_once("../variables.php");
error_reporting(E_ALL ^ E_WARNING); 

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
		'message' => 'Not authorised.',
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
		'message' => $message
	));
}

function returnErrorJsonMessage($message)
{
	returnJsonData(array(
		'success' => false,
		'message' => $message
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

function save_image($name,$image,$folder)
{
    try {
		// echo $name . PHP_EOL;
		// echo $folder . PHP_EOL;
        $base = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos( $_SERVER['DOCUMENT_ROOT'], '/'));
        $path = $base . dataPath . '/data/images/' . $folder . '/';

		$f_ext = pathinfo($name, PATHINFO_EXTENSION);
		$f_name = pathinfo($name, PATHINFO_FILENAME);

        $image_parts = explode(";base64,", $image);
		if(count($image_parts) < 2){
			return array(
				'success' => false,
				'message' => 'Not a valid image',
			);
		}

        $image_type_aux = explode("image/", $image_parts[0]);
		if(count($image_type_aux) < 2){
			return array(
				'success' => false,
				'message' => 'Not a valid image',
			);
		}

        $image_type = $image_type_aux[1];
		if(!in_array($image_type, array('jpeg','png'))){
			return array(
				'success' => false,
				'message' => 'Not a valid image',
			);
		}

        $image_base64 = base64_decode($image_parts[1]);
        $file_name = get_availble_filename($f_name,$f_ext,$folder) . '.'.$f_ext;
		// $file_name = uniqid() . '.'.$f_ext;
        $file = $path . $file_name;
		// echo $file . PHP_EOL;

		if (!is_dir($path) or !is_writable($path)) {
			return array(
				'success' => false,
				'message' => 'Error occured',
			);
		}
		if (is_file($file) and !is_writable($file)) {
			return array(
				'success' => false,
				'message' => 'File exists',
			);
		}

        file_put_contents($file, $image_base64);
		return array(
			'success' => true,
			'message' => 'Success',
			'filename' => $file_name,
		);
    } catch (Exception $e) {
		return array(
			'success' => false,
			'message' => 'Error occured',
		);
    }
}

function save_image_or_video($name,$image,$folder)
{
    try {
        $base = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos( $_SERVER['DOCUMENT_ROOT'], '/'));
        $path = $base . dataPath . '/data/images/' . $folder . '/';

		$f_ext = pathinfo($name, PATHINFO_EXTENSION);
		$f_name = pathinfo($name, PATHINFO_FILENAME);

        $image_parts = explode(";base64,", $image);
		if(count($image_parts) < 2){
			return array(
				'success' => false,
				'message' => 'Not a valid image/video',
			);
		}

		if(strpos($image_parts[0], 'image/')){
			$image_type_aux = explode("image/", $image_parts[0]);
		}else if(strpos($image_parts[0], 'video/')){
			$image_type_aux = explode("video/", $image_parts[0]);
		}else{
			return array(
				'success' => false,
				'message' => 'Not a valid image/video',
			);
		}
		if(count($image_type_aux) < 2){
			return array(
				'success' => false,
				'message' => 'Not a valid image/video',
			);
		}

        $image_type = $image_type_aux[1];
		if(!in_array($image_type, array('jpeg','png','mp4'))){
			return array(
				'success' => false,
				'message' => 'Not a valid image/video',
			);
		}

        $image_base64 = base64_decode($image_parts[1]);
        $file_name = get_availble_filename($f_name,$f_ext,$folder) . '.'.$f_ext;
        $file = $path . $file_name;

		if (!is_dir($path) or !is_writable($path)) {
			return array(
				'success' => false,
				'message' => 'Error occured',
			);
		}
		if (is_file($file) and !is_writable($file)) {
			return array(
				'success' => false,
				'message' => 'File exists',
			);
		}

        file_put_contents($file, $image_base64);
		return array(
			'success' => true,
			'message' => 'Success',
			'filename' => $file_name,
		);
    } catch (Exception $e) {
		return array(
			'success' => false,
			'message' => 'Error occured',
		);
    }
}

function delete_image($imagename,$folder)
{
    try {
        $base = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos( $_SERVER['DOCUMENT_ROOT'], '/'));
        $path = $base . dataPath . '/data/images/' . $folder . '/';
        $file = $path . $imagename;
        unlink($file);
        return true;
    } catch (Exception $e) {
        return false;
    }
}

//check if filename exists, if yes, add a number to the end of the filename
function get_availble_filename($older_name,$ext,$folder){
	$base = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos( $_SERVER['DOCUMENT_ROOT'], '/'));
    $path = $base . dataPath . '/data/images/' . $folder . '/';
	$i = 1;
	$temp_name = $older_name;
	while (file_exists($path.$temp_name.'.'.$ext)) {
		// echo 'exists'.PHP_EOL;
		$temp_name = $older_name . '_' . $i;
		$i++;
	}
	return $temp_name;
}



// function check_filename_availability($older_name,$folder){

// 	$base = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos( $_SERVER['DOCUMENT_ROOT'], '/'));
// 	$path = $base . dataPath . '/data/images/'. $folder . '/';
// 	$file = $path . $older_name;
// 	if(is_file($file)){
// 		$new = $older_name;
// 		$i = 1;
// 		while(is_file($file)){
// 			$new = $older_name . '_' . $i;
// 			$file = $path . $new;
// 			$i++;
// 		}
// 		return $new;
// 	}
// 	return $older_name;
// }
