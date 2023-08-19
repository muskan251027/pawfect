<?php
    require_once('./db.php'); // Include your database connection file

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $pet_id_send = $conn->real_escape_string($_POST['pet_id_send']);
        $pet_id_recieve = $conn->real_escape_string($_POST['pet_id_recieve']);

        // Fetch the request status from the database
        $sql = "SELECT request_status FROM connections WHERE (pet_id_send = '$pet_id_send' AND pet_id_recieve = '$pet_id_recieve')";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $request_status = $row['request_status'];
            $response = array('success' => true, 'request_status' => $request_status);
        } else {
            $response = array('success' => false, 'error' => 'No matching request found.');
        }

        echo json_encode($response);
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>