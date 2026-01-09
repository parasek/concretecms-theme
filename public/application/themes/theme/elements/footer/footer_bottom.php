<?php defined('C5_EXECUTE') or exit('Access Denied.');

use Application\EncoreHelper;
use Concrete\Core\View\View;

/**
 * @var Concrete\Core\Page\View\PageView $view
 */
?>

</div><?php // .ccm-page ?>

<?php $view->inc('elements/footer/structured_data.php'); ?>

<?php $view->inc('elements/footer/svg_sprites.php'); ?>

<?php View::element('footer_required'); ?>

<?= EncoreHelper::getEntryTags('app', 'js'); ?>

</body>
</html>
