<?php defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Support\Facade\Application;

$app = Application::getFacadeApplication();

/** @var Concrete\Core\Page\Page $c */
?>

<meta property="og:type" content="website">
<meta property="og:url" content="<?php echo h($c->getCollectionLink()); ?>">
<meta property="og:title" content="<?php echo h($pageTitle ?? ''); ?>">
<meta property="og:description" content="<?php echo h($pageDescription ?? ''); ?>">
<meta property="og:site_name" content="<?php echo h($app->make('config')->get('concrete.site')); ?>">
<?php $siteImagePath = 'application/themes/theme/dist/images/site-image.jpg'; ?>
<?php if (file_exists($siteImagePath)): ?>
    <meta property="og:image" content="<?php echo h($siteImagePath); ?>">
<?php endif; ?>
