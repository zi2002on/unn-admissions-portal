<?php
file_put_contents('submissions.json', file_get_contents('php://input'));
echo "saved";
?>