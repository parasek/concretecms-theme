<?php defined('C5_EXECUTE') or exit('Access Denied.');

use Application\PageInfoService;
use Concrete\Core\Localization\Localization;

/**
 * @var Concrete\Core\Page\Page $c
 * @var Concrete\Core\Page\View\PageView $view
 */
?>
<!doctype html>

<html class="<?= h(PageInfoService::getInstance()->getHtmlClasses()); ?>"
      lang="<?= h(Localization::activeLanguage()); ?>"
>

<head>
    <?php
    View::element('header_required', [
        'pageTitle' => $pageTitle ?? '',
        'pageDescription' => $pageDescription ?? '',
        'pageMetaKeywords' => $pageMetaKeywords ?? '',
    ]);
    ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php $view->inc('elements/header/styles.php'); ?>

    <?php $view->inc('elements/header/favicons.php'); ?>

    <?php $view->inc('elements/header/open_graph.php'); ?>

</head>

<body>

<div class="<?= $c->getPageWrapperClass(); ?>">
