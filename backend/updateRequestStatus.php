<?php
    require_once('./db.php'); // Include your database connection file

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $pet_id_send = $conn->real_escape_string($_POST['pet_id_send']);
        $pet_id_recieve = $conn->real_escape_string($_POST['pet_id_recieve']);
        $request_status = $conn->real_escape_string($_POST['status']);

        $sql = "UPDATE connections SET request_status = '$request_status' WHERE pet_id_send = '$pet_id_send' AND pet_id_recieve = '$pet_id_recieve'";
        
        if ($conn->query($sql)) {
            $response = array('success' => true, 'message' => 'Request status updated successfully.');
        } else {
            $response = array('success' => false, 'error' => 'Error updating request status: ' . $conn->error);
        }

        echo json_encode($response);
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>