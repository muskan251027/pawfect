<?php

    require_once('./db.php');

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $name = $conn->real_escape_string($_POST['name']);
        $size = $conn->real_escape_string($_POST['size']);
        $gender = $conn->real_escape_string($_POST['gender']);
        $species = $conn->real_escape_string($_POST['species']);
        $ownerId = $conn->real_escape_string($_POST['ownerId']);
        
        $sql = "SELECT * FROM pets WHERE user_id != '$ownerId'"; // Start with a base query
        
        // Add conditions based on filter values
        if (!empty($name)) {
            $sql .= " AND pet_name LIKE '%$name%'";
        }
        if ($size != 0) {
            $sql .= " AND size = '$size'";
        }
        if ($gender != 0) {
            $sql .= " AND gender = '$gender'";
        }
        if ($species != 0) {
            $sql .= " AND species = '$species'";
        }
        
        $result = $conn->query($sql);
        
        $filteredPets = array();
        
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
                $filteredPets[] = $finalrow;
            }
        }
        
        $response = array('success' => true, 'data' => $filteredPets);
        echo json_encode($response);
        
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>