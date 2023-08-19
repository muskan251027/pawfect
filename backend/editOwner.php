<?php
    
    require_once('./db.php');

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $first_name = $conn->real_escape_string($_POST['fName']);
        $last_name = $conn->real_escape_string($_POST['lName']);
        $contact_info = $conn->real_escape_string($_POST['contact']);
        $location_id = $conn->real_escape_string($_POST['location']);
        $about_info = $conn->real_escape_string($_POST['about']);
        $email = $conn->real_escape_string($_POST['email']);
        $imgStat = $conn->real_escape_string($_POST['imgStat']);

        if($imgStat == 0) {
            // no change in image
            $sql = "UPDATE owners SET 
            first_name = ?, 
            last_name = ?, 
            contact_info = ?, 
            location_id = ?, 
            about_info = ?
            WHERE email = ?";
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                // Bind parameters
                $stmt->bind_param("sssiss", $first_name, $last_name, $contact_info, $location_id, $about_info, $email);
        
                // Execute the statement
                if ($stmt->execute()) {
                    $sqlGetLocation = "SELECT * FROM locations WHERE location_id = '$location_id'";
                    $result2 = $conn->query($sqlGetLocation);
                    $row2 = $result2->fetch_assoc();
                    $ownerDetails = array(
                        'fName' => $first_name,
                        'lName' => $last_name,
                        'contact' => $contact_info,
                        'location' => $location_id,
                        'about' => $about_info,
                        'email' => $email,
                        'locationName' => $row2['location_name']
                        // Add other user details as needed
                    );
                    $response = array('success' => true, 'data' => $ownerDetails);
                    echo json_encode($response);
                } else {
                    $response = array('success' => false, 'error' => 'Owner could not be updated');
                    echo json_encode($response);
                }
        
                // Close the statement
                $stmt->close();
            } else {
                $response = array('success' => false, 'error' => 'Owner could not be updated because statement was not prepared');
                echo json_encode($response);
            }
        }
        else {
            if($imgStat == 1) {
                // image is edited
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
            }
            else {
                //image is deleted
                $user_image = null;
                $user_image_type = null;
            }

            $sql = "UPDATE owners SET 
            first_name = ?, 
            last_name = ?, 
            contact_info = ?, 
            location_id = ?, 
            about_info = ?,
            user_image = ?,
            user_image_type = ?
            WHERE email = ?";
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                // Bind parameters
                $stmt->bind_param("sssissss", $first_name, $last_name, $contact_info, $location_id, $about_info, $user_image, $user_image_type, $email);
        
                // Execute the statement
                if ($stmt->execute()) {
                    $sqlGetLocation = "SELECT * FROM locations WHERE location_id = '$location_id'";
                    $result2 = $conn->query($sqlGetLocation);
                    $row2 = $result2->fetch_assoc();
                    $ownerDetails = array(
                        'fName' => $first_name,
                        'lName' => $last_name,
                        'contact' => $contact_info,
                        'location' => $location_id,
                        'about' => $about_info,
                        'email' => $email,
                        'ownerImg' => base64_encode($user_image), // Convert BLOB image to base64
                        'ownerImgType' => $user_image_type,
                        'locationName' => $row2['location_name']
                        // Add other user details as needed
                    );
                    $response = array('success' => true, 'data' => $ownerDetails);
                    echo json_encode($response);
                } else {
                    $response = array('success' => false, 'error' => 'Owner could not be updated');
                    echo json_encode($response);
                }
        
                // Close the statement
                $stmt->close();
            } else {
                $response = array('success' => false, 'error' => 'Owner could not be updated because statement was not prepared.');
                echo json_encode($response);
            }
        }
    
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>