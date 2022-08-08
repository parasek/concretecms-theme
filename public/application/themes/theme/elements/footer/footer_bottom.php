<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>

<?php $view->inc('elements/footer/structured_data.php'); ?>

<?php $view->inc('elements/footer/svg_sprites.php'); ?>

<?php View::element('footer_required'); ?>

<?php $manifestPath = 'application/themes/theme/dist/manifest.json'; ?>
<?php if (file_exists($manifestPath)): ?>
    <script
        src="/application/themes/theme/dist/js/<?php echo json_decode(file_get_contents($manifestPath))->{'app.min.js'}; ?>"></script>
<?php endif; ?>

<?php $view->inc('elements/footer/browser_sync.php'); ?>

</body>
</html>
