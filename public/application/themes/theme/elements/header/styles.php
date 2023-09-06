<?php defined('C5_EXECUTE') or exit('Access Denied.');

/**
 * @var Concrete\Core\Page\Page $c
 */
?>

<?php // Load Google Fonts ?>
<?php $fontURL = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap'; ?>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="<?= h($fontURL); ?>">
<link rel="stylesheet"
      media="print"
      onload="this.onload=null;this.removeAttribute('media');"
      href="<?= h($fontURL); ?>"
>

<?php // Styles ?>
<?php
$manifestPath = 'application/themes/theme/dist/manifest.json';
?>
<?php if (file_exists($manifestPath)): ?>
    <style><?= h(file_get_contents($manifestPath)); ?></style>
<?php endif; ?>
