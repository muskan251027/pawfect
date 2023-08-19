<?php
    
    require_once('./db.php');

    $query = "SELECT location_id, location_code, location_name FROM locations";
    $result = $conn->query($query);

    $locations = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($locations);

    $conn->close();
?>