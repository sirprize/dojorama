<?php
    $base = dirname(dirname(dirname(dirname($_SERVER['SCRIPT_NAME']))));
    $base = ($base === '/') ? '' : $base;
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="<?php echo $base; ?>/builds/single-file/dojorama/styles/global.css">
        <title>Browse Build</title>
        <script>
            document.write('<style media="all">#static { display: none; }</style>');
        </script>

        <!--[if lt IE 9]>
            <script src="<?php echo $base; ?>/vendor/aFarkas/html5shiv/dist/html5shiv.js"></script>
            <script src="<?php echo $base; ?>/vendor/scottjehl/Respond/respond.min.js"></script>
        <![endif]-->
    </head>

    <body>
        <div id="static">
            Please enable JavaScript in your browser
        </div>
        
        <script src="<?php echo $base; ?>/vendor/scottschiller/SoundManager2/script/soundmanager2-nodebug-jsmin.js"></script>
        
        <script>
            soundManager.setup({
                url: '<?php echo $base; ?>/vendor/scottschiller/SoundManager2/swf/'
            });
        </script>
        
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
        
        <script src="<?php echo $base; ?>/tests/config-services.js"></script>
        <script src="<?php echo $base; ?>/builds/single-file/dojo/dojo.js"></script>

        <script>
            require(['dojorama/App'], function (App) { new App(); });
        </script>
    </body>
</html>