<?php
    require_once('./db.php'); // Include your database connection file

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $pet_id_send = $conn->real_escape_string($_POST['pet_id_send']);
        $pet_id_recieve = $conn->real_escape_string($_POST['pet_id_recieve']);
        $status = $conn->real_escape_string($_POST['status']);

        if($status == "") {
            $new_status = 'pending';
            $sql = "INSERT INTO connections (pet_id_send, pet_id_recieve, request_status) VALUES ('$pet_id_send', '$pet_id_recieve', '$new_status')";
        }
        else if($status == "pending" || $status == "rejected" || $status == "accepted") {
            $sql = "DELETE FROM connections WHERE (pet_id_send = '$pet_id_send' AND pet_id_recieve = '$pet_id_recieve')";
        }

        $result = $conn->query($sql);

        if ($result === TRUE) {
            $response = array('success' => true, 'data' => 'Status updated');
        } else {
            $response = array('success' => false, 'error' => 'Status not updated');
        }

        echo json_encode($response);
    } else {
        $response = array('success' => false, 'error' => 'Invalid request method.');
        echo json_encode($response);
    }

    $conn->close();
?>