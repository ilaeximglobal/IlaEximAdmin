<?php

if (!$_POST) exit;

// Email address verification, do not edit.
function isEmail($email)
{
	return (preg_match("/^[-_.[:alnum:]]+@((([[:alnum:]]|[[:alnum:]][[:alnum:]-]*[[:alnum:]])\.)+(ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$|(([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\.){3}([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5]))$/i", $email));
}

if (!defined("PHP_EOL")) define("PHP_EOL", "\r\n");

$first_name = $_POST['firstName'];
$last_name = $_POST['lastName'];
$email = $_POST['email'];
$country = $_POST['country'];
$phone = $_POST['phone'];

$product = '';
if (isset($_POST['product'])) {
	$product = $_POST['product'];
}

$comments = $_POST['comments'];

$success = false;
$message = '';

header('Content-Type: application/json');

if (trim($first_name) == '') {
	$message = 'You must enter your name.';
	echo json_encode(array('success' => $success, 'message' => $message));
	exit();
} else if (trim($email) == '') {
	$message = 'Attention! Please enter a valid email address';
	echo json_encode(array('success' => $success, 'message' => $message));
	exit();
} else if (!isEmail($email)) {
	$message = 'Attention! You have enter an invalid e-mail address, try again.';
	echo json_encode(array('success' => $success, 'message' => $message));
	exit();
}

if (trim($comments) == '') {
	$message = 'Attention! Please enter your message.';
	echo json_encode(array('success' => $success, 'message' => $message));
	exit();
}

$address = "ketanchauhan2048@gmail.com";

$e_subject = 'New inquiry - ' . $first_name . ' ' . $last_name;


//$headers = "From: $email" . PHP_EOL;
$headers .= "Reply-To: $email" . PHP_EOL;
$headers .= "MIME-Version: 1.0" . PHP_EOL;
$headers .= "Content-type: text/plain; charset=utf-8" . PHP_EOL;
$headers .= "Content-Transfer-Encoding: quoted-printable" . PHP_EOL;


// Build the email content.
$email_content = "Dear user, \n\nWe have received below inquiry:\n\n";
$email_content .= "Name: $first_name\n";
$email_content .= "Surname: $last_name\n";
$email_content .= "Email: $email\n";
$email_content .= "Country: $country\n";
$email_content .= "Phone: $phone\n\n";
if (trim($product) != '') {
	$email_content .= "Product: \n$product\n\n";
}
$email_content .= "Message: \n$comments\n\n";
$email_content .= "Thanks.";

try {
	if (@mail($address, $e_subject, $email_content, $headers)) {
		$success = true;
		$message = 'Thank you! Your response is received.';
		echo json_encode(array('success' => $success, 'message' => $message));
	} else {
		$message = 'Error occured';
		echo json_encode(array('success' => $success, 'message' => $message));
	}
} catch (Exception $e) {
	$message = 'Error occured';
	echo json_encode(array('success' => $success, 'message' => $message));
}
