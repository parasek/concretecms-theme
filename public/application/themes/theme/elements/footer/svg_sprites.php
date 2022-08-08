<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>

<?php if (file_exists('application/themes/theme/dist/svg/symbol/icons.svg')): ?>
    <?php echo file_get_contents('application/themes/theme/dist/svg/symbol/icons.svg'); ?>
<?php endif; ?>
