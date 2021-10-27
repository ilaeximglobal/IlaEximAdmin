<?php
    // My modifications to mailer script from:
    // http://blog.teamtreehouse.com/create-ajax-contact-form
    // Added input sanitizing to prevent injection

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $shape = trim($_POST["shape"]);
        $caratRequired = trim($_POST["caratRequired"]);
        $weightFrom = trim($_POST["weightFrom"]);
        $weightTo = trim($_POST["weightTo"]);
        $colorFrom = trim($_POST["colorFrom"]);
        $colorTo = trim($_POST["colorTo"]);
        $clarityFrom = trim($_POST["clarityFrom"]);
        $clarityTo = trim($_POST["clarityTo"]);
        $cutFrom = trim($_POST["cutFrom"]);
        $cutTo = trim($_POST["cutTo"]);
        $other = trim($_POST["other"]);
        $name = trim($_POST["name"]);
        $phone = trim($_POST["phone"]);
        $email = trim($_POST["email"]);
        $country = trim($_POST["country"]);
        $priority = trim($_POST["priority"]);
        $rapnetId = trim($_POST["rapnetId"]);

        // Check that data was sent to the mailer.
        if ( empty($shape) OR empty($caratRequired) 
			OR empty($weightFrom) OR empty($weightTo) 
			OR empty($colorFrom) OR empty($colorTo) 
			OR empty($clarityFrom) OR empty($clarityTo) 
			OR empty($cutFrom) OR empty($cutTo) 
			OR empty($name) OR empty($phone) 
			OR empty($email) OR empty($country) 
			OR empty($priority)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Please provide all mandatory details.";
            exit;
        }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "ketanchauhan2048@gmail.com";

        // Set the email subject.
        $subject = "New quotation from $name";

        // Build the email content.
        $email_content = "Dear user, \n\nWe have received below quotation on Ila Exim:\n\n";
        $email_content .= "Name: $name\n";
        $email_content .= "Email: $email\n";
        $email_content .= "Phone: $phone\n";
        $email_content .= "Country: $country\n";
        $email_content .= "Rapnet Id: $rapnetId\n";
        $email_content .= "Priority: $priority\n\n";
        $email_content .= "Shape: $shape\n";
        $email_content .= "Carat Required: $caratRequired\n";
        $email_content .= "Weight From: $weightFrom\n";
        $email_content .= "Weight To: $weightTo\n";
        $email_content .= "Color From: $colorFrom\n";
        $email_content .= "Color To: $colorTo\n";
        $email_content .= "Clarity From: $clarityFrom\n";
        $email_content .= "Clarity To: $clarityTo\n";
        $email_content .= "Cut From: $cutFrom\n";
        $email_content .= "Cut To: $cutTo\n\n";
        $email_content .= "Message: \n$other\n\n";
        $email_content .= "Thanks.";
		
        // Build the email headers.
        $email_headers = "From: $firstName $lastName <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "SUCCESS";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>
