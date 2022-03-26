<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>

<?php $view->inc('elements/header.php'); ?>

<main>

    <div class="container side-space">

        <div class="container-inner">

            <div class="main-content">

                <?php $view->inc('elements/breadcrumbs.php'); ?>

                <?php $view->inc('elements/heading.php'); ?>

                <?php $view->inc('elements/inner_content.php'); ?>

                <?php
                $a = new Area('Main');
                $a->display();
                ?>

            </div>

        </div>

    </div>

</main>

<?php $view->inc('elements/footer.php'); ?>
