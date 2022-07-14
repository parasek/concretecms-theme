<?php defined('C5_EXECUTE') or die('Access Denied.'); ?>

<?php $view->inc('elements/header.php'); ?>

<?php $view->inc('elements/breadcrumbs.php'); ?>

<?php $view->inc('elements/heading.php'); ?>

<main>

    <div class="container side-space">

        <?php $view->inc('elements/inner_content.php'); ?>

        <?php
        $a = new Area('Main');
        $a->display();
        ?>

    </div>

</main>

<?php $view->inc('elements/footer.php'); ?>
