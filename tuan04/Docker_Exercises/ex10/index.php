<?php
    // Hiển thị nội dung đơn giản để chứng minh PHP đã chạy
    echo "<h1>Bài tập 10: Dockerize ứng dụng PHP với Apache</h1>";
    echo "<p>Mã nguồn này được Mount trực tiếp từ máy host (MacBook) vào container.</p>";
    
    // Chứng minh môi trường PHP 8.2 đúng yêu cầu
    echo "<ul>";
    echo "<li><b>Phiên bản PHP:</b> " . phpversion() . "</li>";
    echo "<li><b>Thời gian hệ thống:</b> " . date('Y-m-d H:i:s') . "</li>";
    echo "</ul>";

    // Dòng này rất quan trọng để thầy cô thấy cấu hình Apache bên dưới
    echo "<hr>";
    echo "<h3>Thông tin chi tiết cấu hình:</h3>";
    phpinfo(); 
?>