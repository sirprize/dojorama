<?php
    $base = dirname(dirname(dirname(dirname($_SERVER['SCRIPT_NAME']))));
    $base = ($base === '/') ? '' : $base;
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="<?php echo $base; ?>/builds/multi-file-v002/dojorama/styles/global.css">
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

        <div id="dojorama"></div>
        
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
                    pathPrefix: '<?php echo $base; ?>/tests/app/multi-file-build',
                    layers: {
                        release: [
                            "dojorama/layers/release-widgets",
                            "dojorama/layers/release-pages"
                        ],
                        home: ["dojorama/layers/home"],
                        storage: ["dojorama/layers/storage"]
                    }
                }
            };
        </script>

        <script src="<?php echo $base; ?>/tests/config-services.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojo/dojo.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d01.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d02.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d03.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d04.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d05.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d06.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d07.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d08.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/d09.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/mijit.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/app.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/model.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/form.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/dobolo.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/dgrid-common.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/dgrid-extra.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file-v002/dojorama/layers/global-stuff.js"></script>
        
        <script>
            require(['dojorama/App'], function (App) { new App({}, 'dojorama'); });
        </script>
    </body>
</html>