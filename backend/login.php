<?php
    require_once('./db.php');

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        // $data = json_decode(file_get_contents("php://input"), true);
        $email = $conn->real_escape_string($_POST['email']);
        $password = $conn->real_escape_string($_POST['password']);
    
        $sqlCheckEmail = "SELECT * FROM owners WHERE email = '$email'";
        $result = $conn->query($sqlCheckEmail);
    
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['password'])) {
                $locationId = $row['location_id'];
                $sqlGetLocation = "SELECT * FROM locations WHERE location_id = '$locationId'";
                $result2 = $conn->query($sqlGetLocation);
                $row2 = $result2->fetch_assoc();
                $ownerDetails = array(
                    'ownerId' => $row['user_id'],
                    'fName' => $row['first_name'],
                    'lName' => $row['last_name'],
                    'contact' => $row['contact_info'],
                    'location' => $row['location_id'],
                    'about' => $row['about_info'],
                    'email' => $row['email'],
                    'ownerImg' => base64_encode($row['user_image']), // Convert BLOB image to base64
                    'ownerImgType' => $row['user_image_type'],
                    'locationName' => $row2['location_name']
                    // Add other user details as needed
                );
                $response = array('success' => true, 'data' => $ownerDetails);
                echo json_encode($response);
            } else {
                $response = array('success' => false, 'error' => 'Password unmatched');
                echo json_encode($response);
            }
        } else {
            $response = array('success' => false, 'error' => 'Not registered');
            echo json_encode($response);
        }
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>