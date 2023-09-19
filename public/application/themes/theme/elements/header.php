<?php defined('C5_EXECUTE') or exit('Access Denied.');

use Concrete\Core\Area\GlobalArea;

/**
 * @var Concrete\Core\Page\View\PageView $view
 */
?>

<?php $view->inc('elements/header/header_top.php'); ?>

<header id="header" class="header is-fixed">

    <div class="header-container container side-space">

        <div class="logo-area">
            <div class="logo">
                <a href="<?= h(BASE_URL); ?>" class="logo-link">
                    <img src="<?= h($view->getThemePath()); ?>/dist/images/logo.svg"
                         alt="Site logo"
                         width="210"
                         height="59"
                         class="logo-image"
                    />
                </a>
            </div>
        </div>

        <div class="desktop-nav-area">
            <?php
            $a = new GlobalArea('Navigation');
            $a->display();
            ?>
        </div>

        <div class="contact-top-area">
            <?php
            $a = new GlobalArea('Contact Top');
            $a->display();
            ?>
        </div>

        <span class="main-nav-toggle js-main-nav-toggle"></span>

    </div>

</header>

<div class="fixed-header-spacer"></div>
