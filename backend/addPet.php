<?php
    
    require_once('./db.php');

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $user_id = $conn->real_escape_string($_POST['userId']);
        $pet_name = $conn->real_escape_string($_POST['name']);
        $species = $conn->real_escape_string($_POST['species']);
        $breed = $conn->real_escape_string($_POST['breed']);
        $age = $conn->real_escape_string($_POST['age']);
        $gender = $conn->real_escape_string($_POST['gender']);
        $size = $conn->real_escape_string($_POST['size']);
        $weight = $conn->real_escape_string($_POST['weight']);
        $personality_traits = $conn->real_escape_string($_POST['traits']);
        $health_details = $conn->real_escape_string($_POST['health']);
        $vaccination_details = $conn->real_escape_string($_POST['vaccine']);
       
        if(!empty($_FILES)) {
            if ($_FILES['petImg']['error'] === UPLOAD_ERR_OK) {
                $pet_image = file_get_contents($_FILES['petImg']['tmp_name']);
                $pet_image_type = $_FILES["petImg"]["type"];
            } else {
                $pet_image = null;
                $pet_image_type = null;
            }
        }
        else {
            $pet_image = null;
            $pet_image_type = null;
        }

    
        $stmt = $conn->prepare("INSERT INTO pets (user_id, pet_name, species, breed, age, gender, size, weight, personality_traits, health_details, vaccination_details, pet_image, pet_image_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssissdsssss", $user_id, $pet_name, $species, $breed, $age, $gender, $size, $weight, $personality_traits, $health_details, $vaccination_details, $pet_image, $pet_image_type); // "i" for integer, "s" for string, "b" for BLOB

        if ($stmt->execute()) {
            // get details of just added pet
            $newlyInsertedPetId = $stmt->insert_id;
            $newPetQuery = "SELECT * FROM pets WHERE pet_id = '$newlyInsertedPetId'";
            $result2 = $conn->query($newPetQuery);
            $row = $result2->fetch_assoc();
            $petDetails = array(
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

            $response = array('success' => true, 'data' => $petDetails);
            echo json_encode($response);
        } else {
            $response = array('success' => false, 'error' => 'Error registering: ' . $conn->error);
            echo json_encode($response);
        }
        
        $stmt->close();
    
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>