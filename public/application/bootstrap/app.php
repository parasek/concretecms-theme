<?php

/* @var Concrete\Core\Application\Application $app */
/* @var Concrete\Core\Console\Application $console only set in CLI environment */

/*
 * ----------------------------------------------------------------------------
 * # Custom Application Handler
 *
 * You can do a lot of things in this file.
 *
 * ## Set a theme by route:
 *
 * $app->make('\Concrete\Core\Page\Theme\ThemeRouteCollection')
 *     ->setThemeByRoute('/login', 'greek_yogurt');
 *
 * ## Register a class override.
 *
 * $app->bind('helper/feed', function() {
 * 	   return new \Application\Core\CustomFeedHelper();
 * });
 *
 * $app->bind('\Concrete\Attribute\Boolean\Controller', function($app, $params) {
 * 	    return new \Application\Attribute\Boolean\Controller($params[0]);
 * });
 *
 * ## Register Events.
 *
 * Events::addListener('on_page_view', function($event) {
 * 	  $page = $event->getPageObject();
 * });
 *
 *
 * ## Register some custom MVC Routes
 *
 * Route::register('/test', function() {
 * 	  print 'This is a contrived example.';
 * });
 *
 * Route::register('/custom/view', '\My\Custom\Controller::view');
 * Route::register('/custom/add', '\My\Custom\Controller::add');
 *
 * ## Pass some route parameters
 *
 * Route::register('/test/{foo}/{bar}', function ($foo, $bar) {
 *    echo 'Here is foo: ' . $foo . ' and bar: ' . $bar;
 * });
 *
 *
 * ## Override an Asset
 *
 * \Concrete\Core\Asset\AssetList::getInstance()
 *     ->getAsset('javascript', 'jquery')
 *     ->setAssetURL('/path/to/new/jquery.js');
 *
 * or, override an asset by providing a newer version.
 *
 * use \Concrete\Core\Asset\AssetList;
 * use \Concrete\Core\Asset\Asset;
 * $al = AssetList::getInstance();
 * $al->register(
 *     'javascript', 'jquery', 'path/to/new/jquery.js',
 *     ['version' => '2.0', 'position' => Asset::ASSET_POSITION_HEADER, 'minify' => false, 'combine' => false]
 * );
 *
 * ----------------------------------------------------------------------------
 */

// Local mail server
$config = $this->app->make('config');
$productionMode = $config->get('concrete.security.production.mode');
if ($productionMode === \Concrete\Core\Production\Modes::MODE_DEVELOPMENT) {
    $this->app->make('config')->set('concrete.mail', [
        'method' => 'smtp',
        'methods' => [
            'smtp' => [
                'server' => getenv('MAIL_SERVER_ADDRESS'),
                'username' => '',
                'port' => getenv('MAIL_SERVER_SMTP_PORT'),
                'encryption' => '',
                'messages_per_connection' => null,
                'helo_domain' => 'localhost',
                'password' => '',
            ],
        ],
    ]);
}
