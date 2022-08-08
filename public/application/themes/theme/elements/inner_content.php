<?php defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\View\View;

View::element('system_errors', [
    'format' => 'block',
    'error' => $error ?? null,
    'success' => $success ?? null,
    'message' => $message ?? null,
]);

echo $innerContent ?? null;
