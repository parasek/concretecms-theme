<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>

<?php $view->inc('elements/header/header_top.php'); ?>

<header class="header-top is-fixed">
    <div class="container side-space">
        <div class="logo-area">
            logo
        </div>
        <div class="desktop-nav-area desktop-nav">
            <?php
            $a = new GlobalArea('Navigation');
            $a->display();
            ?>
        </div>
        <div class="contact-top-area">
            contact
        </div>
        <span class="main-nav-toggle js-main-nav-toggle"><i class="fas fa-bars"></i></span>
    </div>
</header>

<div class="fixed-header-fake-height"></div>
