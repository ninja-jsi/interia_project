<?php
require '../config/config.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $conn->query("DELETE FROM user_quotes WHERE id=$id");
}

$conn->close();
header("Location: ../dashboard.php");
exit();
?>
