<?php defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Area\GlobalArea;

/** @var Concrete\Core\View\View $this */
/** @var Concrete\Core\View\View $view */
?>

<?php $view->inc('elements/header/header_top.php'); ?>

<header id="header" class="header is-fixed">

    <div class="header-container container side-space">

        <div class="logo-area">
            <div class="logo">
                <a href="<?php echo h(BASE_URL); ?>" class="logo-link">
                    <img src="<?php echo $this->getThemePath(); ?>/dist/images/logo.svg"
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
