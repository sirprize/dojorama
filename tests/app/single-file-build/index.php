<?php
    $base = dirname(dirname(dirname(dirname($_SERVER['SCRIPT_NAME']))));
    $base = ($base === '/') ? '' : $base;
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="<?php echo $base; ?>/builds/single-file/dojorama/styles/everything.css">
        <title>Browse Build</title>
        <script>
            document.write('<style media="all">#static { display: none; }</style>');
        </script>
    </head>

    <body class="container">
        <div id="static">
            Please enable JavaScript in your browser
        </div>
        
        <script>
            var dojoConfig = {
                async: 1,
                cacheBust: 1,
                'routing-map': {
                    pathPrefix: '<?php echo $base; ?>/tests/app/single-file-build',
                    layers: {
                        home: ["dojorama/layers/home"],
                        release: ["dojorama/layers/release"],
                        storage: ["dojorama/layers/storage"]
                    }
                }
            };
        </script>
        
        <script src="<?php echo $base; ?>/vendor/scottschiller/SoundManager2/script/soundmanager2-nodebug-jsmin.js"></script>
        <script src="<?php echo $base; ?>/tests/config-services.js"></script>
        <script src="<?php echo $base; ?>/builds/single-file/dojo/dojo.js"></script>

        <script>
            soundManager.setup({
                url: '<?php echo $base; ?>/vendor/scottschiller/SoundManager2/swf/'
            });
            
            require(['dojorama/App'], function (App) { new App(); });
        </script>
    </body>
</html>