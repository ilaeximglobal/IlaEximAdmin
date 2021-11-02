<?php
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

function save_image($image,$folder)
{
    try {
        $path = $_SERVER['DOCUMENT_ROOT'] . '/IlaEximAdmin' . '/data/images/' . $folder . '/';

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
        $file_name = uniqid() . '.'.$image_type;
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
        $path = $_SERVER['DOCUMENT_ROOT'] . '/IlaEximAdmin' . '/data/images/' . $folder . '/';
        $file = $path . $imagename;
        unlink($file);
        return true;
    } catch (Exception $e) {
        return false;
    }
}