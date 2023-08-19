<?php
    
    require_once('./db.php');

    // Fetch enum values for species
    $species = getEnumValues($conn, 'pets', 'species');

    // Fetch enum values for gender
    $genders = getEnumValues($conn, 'pets', 'gender');

    // Fetch enum values for size
    $sizes = getEnumValues($conn, 'pets', 'size');

    // Fetch enum values for statuses
    $statuses = getEnumValues($conn, 'connections', 'request_status');

    $response = array(
        'species' => $species,
        'genders' => $genders,
        'sizes' => $sizes,
        'statuses' => $statuses
    );

    echo json_encode($response);

    $conn->close();

    function getEnumValues($conn, $table, $column) {
        $sql = "SHOW COLUMNS FROM $table LIKE '$column'";
        $result = $conn->query($sql);
    
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $enumValues = explode("','", substr($row['Type'], 6, -2));
            return $enumValues;
        } else {
            return array();
        }
    }
?>