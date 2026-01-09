<?php defined('C5_EXECUTE') or exit('Access Denied.');

use Application\EncoreHelper;

/**
 * @var Concrete\Core\Page\Page $c
 */
?>

<?php
// Google Fonts
$fontUrl = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap';
?>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="<?= h($fontUrl); ?>">
<link rel="stylesheet"
      media="print"
      onload="this.onload=null;this.removeAttribute('media');"
      href="<?= h($fontUrl); ?>"
>

<?= EncoreHelper::getEntryTags('app', 'css'); ?>
