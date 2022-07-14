<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>

<?php $view->inc('elements/header/header_top.php'); ?>

<header class="header is-fixed">

    <div class="container side-space">

        <div class="logo-area">
            <?php
            $a = new GlobalArea('Logo');
            $a->display();
            ?>
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
