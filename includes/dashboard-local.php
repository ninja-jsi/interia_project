<?php
// require 'config/config.php';
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// $username = htmlspecialchars($_SESSION['username']); // Escape output
// $sql = "SELECT * FROM user_quotes ORDER BY created_at DESC";
// $result = $conn->query($sql);

// if (!$result) {
//     die("Query failed: " . $conn->error);
// }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <div class="header">
        <h1>Dashboard</h1>
        <a href="logout.php" class="logout-btn">Logout</a>
    </div>

    <div class="container">
        <div class="welcome">
            <h2>Welcome, <?php echo $username; ?>!</h2>
        </div>

        <!-- message container  -->
        <div class="grid-container">
        <?php while ($row = $result->fetch_assoc()) { ?>
            <div class="card">
                    <h3><i class="fas fa-user"></i> <?php echo htmlspecialchars($row["name"]); ?></h3>
                    <p><i class="fas fa-envelope"></i> <strong>Email:</strong> <?php echo htmlspecialchars($row["email"]); ?></p>
                    <p><i class="fas fa-phone"></i> <strong>Mobile:</strong> <?php echo htmlspecialchars($row["mobile"]); ?></p>
                    <p><i class="fas fa-building"></i> <strong>Service:</strong> <?php echo htmlspecialchars($row["service_type"]); ?></p>
                    <p><i class="fas fa-comment"></i> <strong>Message:</strong> <?php echo nl2br(htmlspecialchars($row["message"])); ?></p>
                    <p><small><i class="far fa-clock"></i> <?php echo date('M d, Y H:i', strtotime($row["created_at"])); ?></small></p>
                    <button class="delete-btn" onclick="confirmDelete(<?php echo $row['id']; ?>)">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>            
                </div>
        <?php } ?>
    </div>
    </div>
    <script>
        function confirmDelete(id) {
            if (confirm("Are you sure you want to delete this entry?")) {
                window.location.href = "includes/delete.php?id=" + id;
            }
        }
    </script>
</body>
</html>