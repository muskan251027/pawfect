<?php
    
    require_once('./db.php');

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $first_name = $conn->real_escape_string($_POST['fName']);
        $last_name = $conn->real_escape_string($_POST['lName']);
        $contact_info = $conn->real_escape_string($_POST['contact']);
        $location_id = $conn->real_escape_string($_POST['location']);
        $about_info = $conn->real_escape_string($_POST['about']);
        $email = $conn->real_escape_string($_POST['email']);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
       
        if(!empty($_FILES)) {
            if ($_FILES['ownerImg']['error'] === UPLOAD_ERR_OK) {
                $user_image = file_get_contents($_FILES['ownerImg']['tmp_name']);
                $user_image_type = $_FILES["ownerImg"]["type"];
            } else {
                $user_image = null;
                $user_image_type = null;
            }
        }
        else {
            $user_image = null;
            $user_image_type = null;
        }

        $sqlCheckDuplicate = "SELECT user_id FROM owners WHERE email = '$email'";
        $result = $conn->query($sqlCheckDuplicate);

        if ($result->num_rows > 0) {
            $response = array('success' => false, 'error' => 'Email address is already registered.');
            echo json_encode($response);
        }
        else {
            $stmt = $conn->prepare("INSERT INTO owners (first_name, last_name, email, password, contact_info, location_id, about_info, user_image, user_image_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssisss", $first_name, $last_name, $email, $password, $contact_info, $location_id, $about_info, $user_image, $user_image_type); // "i" for integer, "s" for string, "b" for BLOB
            // $sql = "INSERT INTO owners (first_name, last_name, email, password, contact_info, location_id, about_info, user_image, user_image_type)
            //         VALUES ('$first_name', '$last_name', '$email', '$password', '$contact_info', '$location_id', '$about_info', '$user_image', '$user_image_type')";

            if ($stmt->execute()) {
                $response = array('success' => true);
                echo json_encode($response);
            } else {
                $response = array('success' => false, 'error' => 'Error registering: ' . $conn->error);
                echo json_encode($response);
            }
            
            $stmt->close();
        
            // if ($conn->query($sql) === TRUE) {
            //     $response = array('success' => true);
            //     echo json_encode($response);
            // } else {
            //     $response = array('success' => false, 'error' => 'Error registering: ' . $conn->error);
            //     echo json_encode($response);
            // }
        }
    
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>