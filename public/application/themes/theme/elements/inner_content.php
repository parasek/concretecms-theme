<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>

<?php
View::element('system_errors', [
    'format' => 'block',
    'error' => $error ?? null,
    'success' => $success ?? null,
    'message' => $message ?? null,
]);

echo $innerContent ?? null;
?>
