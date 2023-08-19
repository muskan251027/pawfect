<?php
    require_once('./db.php'); // Include your database connection file

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $pet_id_recieve = $conn->real_escape_string($_POST['pet_id_recieve']);
        $status = $conn->real_escape_string($_POST['status']);

        $sql = "SELECT * FROM connections WHERE pet_id_recieve = '$pet_id_recieve' AND request_status = '$status'";
        $result = $conn->query($sql);

        $requests = array();

        if ($result->num_rows > 0) {
            for ($i = 0; $i < $result->num_rows; $i++) {
                $row = $result->fetch_assoc();
                $sender = $row['pet_id_send'];
                $sql2 = "SELECT * FROM pets WHERE pet_id = '$sender'";
                $result2 = $conn->query($sql2);
                $row2 = $result2->fetch_assoc();
                $finalrow = array(
                    'petId' => $row2['pet_id'],
                    'ownerId' => $row2['user_id'],
                    'petName' => $row2['pet_name'],
                    'species' => $row2['species'],
                    'breed' => $row2['breed'],
                    'age' => $row2['age'],
                    'gender' => $row2['gender'],
                    'size' => $row2['size'],
                    'weight' => $row2['weight'],
                    'traits' => $row2['personality_traits'],
                    'health' => $row2['health_details'],
                    'vaccine' => $row2['vaccination_details'],
                    'petImg' => base64_encode($row2['pet_image']), // Convert BLOB image to base64
                    'petImgType' => $row2['pet_image_type']
                    // Add other user details as needed
                );
                $requests[] = $finalrow;
            }
            $response = array('success' => true, 'data' => $requests);
        } else {
            $response = array('success' => false, 'error' => 'No requests found for the entered reciever ID.');
        }

        echo json_encode($response);
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>