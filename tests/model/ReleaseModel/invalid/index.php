<?php

$data = array(
    'message' => 'Validation failed',
    'errors' => array(
        0 => array(
            'field' => 'title',
            'code' => 'missing'// missing|invalid|exists
        )
    )
);

header("HTTP/1.1 422 Unprocessable entity");
echo json_encode($data);