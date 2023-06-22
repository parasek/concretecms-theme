<?php defined('C5_EXECUTE') or die('Access Denied.');

use Application\PageInfoService;
use Concrete\Core\Localization\Localization;
use Concrete\Core\Page\Page;
use Concrete\Core\View\View;

/** @var Page $c */
/** @var View $view */
?>
<!doctype html>

<html class="<?php echo h(PageInfoService::getInstance()->getHtmlClasses()); ?>" lang="<?php echo h(Localization::activeLanguage()); ?>">

<head>
    <?php
    View::element('header_required', [
        'pageTitle' => $pageTitle ?? '',
        'pageDescription' => $pageDescription ?? '',
        'pageMetaKeywords' => $pageMetaKeywords ?? ''
    ]);
    ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php $view->inc('elements/header/styles.php'); ?>

    <?php $view->inc('elements/header/favicons.php'); ?>

    <?php /*
    <?php if ($publisherLink = $app->make('site')->getSite()->getAttribute('rel_publisher')): ?>
        <link rel="publisher" href="<?php echo h($publisherLink); ?>">
    <?php endif; ?>
    */ ?>

    <?php $view->inc('elements/header/open_graph.php'); ?>

</head>

<body>

    <div class="<?php echo $c->getPageWrapperClass(); ?>">
