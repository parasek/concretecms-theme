<?php defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Page\Page;

/** @var Page $c */
?>

<?php // Load Google Fonts ?>
<?php $fontURL = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap'; ?>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="<?php echo h($fontURL); ?>">
<link rel="stylesheet"
      media="print"
      onload="this.onload=null;this.removeAttribute('media');"
      href="<?php echo h($fontURL); ?>"
>

<?php // Styles ?>
<?php
$manifestPath = 'application/themes/theme/dist/manifest.json';
?>
<?php if (file_exists($manifestPath)): ?>
    <style><?php echo h(file_get_contents($manifestPath)); ?></style>
<?php endif; ?>
