<?php defined('C5_EXECUTE') or exit('Access Denied.');

use Concrete\Core\Support\Facade\Application;

$app = Application::getFacadeApplication();

/**
 * @var Concrete\Core\Page\Page $c
 */
?>

<meta property="og:type" content="website">
<meta property="og:url" content="<?= h($c->getCollectionLink()); ?>">
<meta property="og:title" content="<?= h($pageTitle ?? ''); ?>">
<meta property="og:description" content="<?= h($pageDescription ?? ''); ?>">
<meta property="og:site_name" content="<?= h($app->make('config')->get('concrete.site')); ?>">
<?php $siteImagePath = 'application/themes/theme/dist/images/site-image.jpg'; ?>
<?php if (file_exists($siteImagePath)): ?>
    <meta property="og:image" content="<?= h($siteImagePath); ?>">
<?php endif; ?>
