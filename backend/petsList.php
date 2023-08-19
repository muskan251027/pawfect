<?php
    
    require_once('./db.php');

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $user_id = $conn->real_escape_string($_POST['userId']);
        $sql = "SELECT * FROM pets WHERE user_id = '$user_id'";
        $result = $conn->query($sql);
        
        $pets = array();
        
        if ($result->num_rows > 0) {
            for ($i = 0; $i < $result->num_rows; $i++) {
                $row = $result->fetch_assoc();
                $finalrow = array(
                    'petId' => $row['pet_id'],
                    'ownerId' => $row['user_id'],
                    'petName' => $row['pet_name'],
                    'species' => $row['species'],
                    'breed' => $row['breed'],
                    'age' => $row['age'],
                    'gender' => $row['gender'],
                    'size' => $row['size'],
                    'weight' => $row['weight'],
                    'traits' => $row['personality_traits'],
                    'health' => $row['health_details'],
                    'vaccine' => $row['vaccination_details'],
                    'petImg' => base64_encode($row['pet_image']), // Convert BLOB image to base64
                    'petImgType' => $row['pet_image_type']
                    // Add other user details as needed
                );
                $pets[] = $finalrow;
            }
        }
        
        $response = array('success' => true, 'data' => $pets);
        echo json_encode($response);
        
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>