<?php
    
    require_once('./db.php');

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $user_id = $conn->real_escape_string($_POST['ownerId']);
        $pet_id = $conn->real_escape_string($_POST['petId']);
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
        $imgStat = $conn->real_escape_string($_POST['imgStat']);

        if($imgStat == 0) {
            // no change in image
            $sql = "UPDATE pets SET 
            pet_name = ?, 
            species = ?, 
            breed = ?, 
            age = ?, 
            gender = ?,
            size = ?, 
            weight = ?, 
            personality_traits = ?, 
            health_details = ?, 
            vaccination_details = ?
            WHERE pet_id = ?";
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                // Bind parameters
                $stmt->bind_param("sssissdsssi", $pet_name, $species, $breed, $age, $gender, $size, $weight, $personality_traits, $health_details, $vaccination_details, $pet_id);
        
                // Execute the statement
                if ($stmt->execute()) {
                    $petDetails = array(
                        // 'petId' => $pet_id,
                        // 'ownerId' => $user_id,
                        'petName' => $pet_name,
                        'species' => $species,
                        'breed' => $breed,
                        'age' => $age,
                        'gender' => $gender,
                        'size' => $size,
                        'weight' => $weight,
                        'traits' => $personality_traits,
                        'health' => $health_details,
                        'vaccine' => $vaccination_details,
                        // 'petImg' => base64_encode($row['pet_image']), // Convert BLOB image to base64
                        // 'petImgType' => $row['pet_image_type']
                    );
                    $response = array('success' => true, 'data' => $petDetails);
                    echo json_encode($response);
                } else {
                    $response = array('success' => false, 'error' => 'pet could not be updated');
                    echo json_encode($response);
                }
        
                // Close the statement
                $stmt->close();
            } else {
                $response = array('success' => false, 'error' => 'pet could not be updated because statement was not prepared');
                echo json_encode($response);
            }
        }
        else {
            if($imgStat == 1) {
                // image is edited
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
            }
            else {
                //image is deleted
                $pet_image = null;
                $pet_image_type = null;
            }

            $sql = "UPDATE pets SET 
            pet_name = ?, 
            species = ?, 
            breed = ?, 
            age = ?, 
            gender = ?,
            size = ?, 
            weight = ?, 
            personality_traits = ?, 
            health_details = ?, 
            vaccination_details = ?,
            pet_image = ?,
            pet_image_type = ?
            WHERE pet_id = ?";
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                // Bind parameters
                $stmt->bind_param("sssissdsssssi", $pet_name, $species, $breed, $age, $gender, $size, $weight, $personality_traits, $health_details, $vaccination_details, $pet_image, $pet_image_type, $pet_id);
        
                // Execute the statement
                if ($stmt->execute()) {
                    $petDetails = array(
                        // 'petId' => $pet_id,
                        // 'ownerId' => $user_id,
                        'petName' => $pet_name,
                        'species' => $species,
                        'breed' => $breed,
                        'age' => $age,
                        'gender' => $gender,
                        'size' => $size,
                        'weight' => $weight,
                        'traits' => $personality_traits,
                        'health' => $health_details,
                        'vaccine' => $vaccination_details,
                        'petImg' => base64_encode($pet_image), // Convert BLOB image to base64
                        'petImgType' => $pet_image_type
                    );
                    $response = array('success' => true, 'data' => $petDetails);
                    echo json_encode($response);
                } else {
                    $response = array('success' => false, 'error' => 'pet could not be updated');
                    echo json_encode($response);
                }
        
                // Close the statement
                $stmt->close();
            } else {
                $response = array('success' => false, 'error' => 'pet could not be updated because statement was not prepared.');
                echo json_encode($response);
            }
        }
    
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>