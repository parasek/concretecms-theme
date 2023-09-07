<?php defined('C5_EXECUTE') or exit('Access Denied.');

use Concrete\Core\View\View;

/**
 * @var Concrete\Core\Page\View\PageView $view
 */
?>

</div><?php // .ccm-page ?>

<?php $view->inc('elements/footer/structured_data.php'); ?>

<?php $view->inc('elements/footer/svg_sprites.php'); ?>

<?php View::element('footer_required'); ?>

<?php
// Javascript
$distPath = 'application/themes/theme/dist';
$manifestPath = $distPath . '/manifest.json';
?>
<?php if (file_exists($manifestPath)): ?>
    <script src="<?= h($distPath . '/js/' . json_decode(file_get_contents($manifestPath))->{'app.min.js'}); ?>"></script>
<?php endif; ?>

</body>
</html>
