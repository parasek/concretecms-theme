<?php

defined('C5_EXECUTE') or exit('Access Denied.');

$distPath = 'application/themes/theme/dist/svg/symbol/icons.svg';

if (file_exists($distPath)) {
    echo file_get_contents($distPath);
}
