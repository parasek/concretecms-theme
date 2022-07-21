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

<?php // Load default CSS/purged CSS/critical CSS depending on which files were generated ?>
<?php
$cssPath = false;
$distPath = 'application/themes/theme/dist';
$manifestPath = $distPath . '/manifest.json';
$criticalCssPath = $distPath . '/css/critical/' . $c->getCollectionID() . '-critical.html';
$purgedCssPath = false;
if (file_exists($manifestPath)) {
    $purgedCssPath = $distPath . '/css/purged/' . $c->getCollectionID() . '-' . json_decode(file_get_contents($manifestPath))->{'app.min.css'} . '-purged.css';
}
if ($purgedCssPath and file_exists($purgedCssPath)) {
    $cssPath = $purgedCssPath;
} elseif (file_exists($manifestPath)) {
    $cssPath = $distPath . '/css/' . json_decode(file_get_contents($manifestPath))->{'app.min.css'};
}
?>
<?php if ($cssPath): ?>
    <?php if (file_exists($criticalCssPath)): ?>
        <style><?php echo h(file_get_contents($criticalCssPath)); ?></style>
    <?php endif; ?>
    <link rel="stylesheet"
          href="<?php echo h(BASE_URL . '/' . $cssPath); ?>"
        <?php if (file_exists($criticalCssPath)): ?>
            media="print"
            onload="this.media='all'; this.onload=null;"
        <?php else: ?>
            media="all"
        <?php endif; ?>
    >
<?php endif; ?>
