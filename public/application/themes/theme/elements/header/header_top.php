<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>
<!doctype html>

<html class="<?php echo h($htmlClasses ?? ''); ?>" lang="<?php echo h(Localization::activeLanguage()); ?>">

<head>
    <?php
    View::element('header_required', [
        'pageTitle' => $pageTitle ?? '',
        'pageDescription' => $pageDescription ?? '',
        'pageMetaKeywords' => $pageMetaKeywords ?? ''
    ]);
    ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php $fontURL = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap'; ?>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="<?php echo h($fontURL); ?>">
    <link rel="stylesheet" media="print" onload="this.onload=null;this.removeAttribute('media');"
          href="<?php echo h($fontURL); ?>">

    <?php $manifestPath = 'application/themes/theme/dist/manifest.json'; ?>
    <?php if (file_exists($manifestPath)): ?>
        <link rel="stylesheet" href="<?php echo json_decode(file_get_contents($manifestPath))->{'app.min.css'}; ?>"/>
    <?php endif; ?>

    <?php $view->inc('elements/header/favicons.php'); ?>

    <?php /*
    <?php if ($publisherLink = $app->make('site')->getSite()->getAttribute('rel_publisher')): ?>
        <link rel="publisher" href="<?php echo h($publisherLink); ?>">
    <?php endif; ?>
    */ ?>

    <?php $view->inc('elements/header/open_graph.php'); ?>

</head>

<body class="<?php echo $c->getPageWrapperClass(); ?>">
