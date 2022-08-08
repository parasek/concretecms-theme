<?php defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Http\Request;
use Concrete\Core\Support\Facade\Application;

$app = Application::getFacadeApplication();
$request = $app->make(Request::class);
?>

<?php if ($request->server->get('HTTP_HOST')==='localhost:'.getenv('APP_PORT_SSL')): ?>
    <script async="" src="https://localhost:3000/browser-sync/browser-sync-client.js"></script>
<?php endif; ?>
