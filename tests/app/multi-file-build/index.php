<?php
    $base = dirname(dirname(dirname(dirname($_SERVER['SCRIPT_NAME']))));
    $base = ($base === '/') ? '' : $base;
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="<?php echo $base; ?>/builds/multi-file/dojorama/styles/everything.css">
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

        <script src="<?php echo $base; ?>/vendor/scottschiller/SoundManager2/script/soundmanager2-nodebug-jsmin.js"></script>
        <script src="<?php echo $base; ?>/tests/config-services.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojo/dojo.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d01.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d02.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d03.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d04.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d05.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d06.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d07.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d08.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/d09.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/mijit.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/app.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/model.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/form.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/dobolo.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/dgrid-common.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/dgrid-extra.js"></script>
        <script src="<?php echo $base; ?>/builds/multi-file/dojorama/layers/global-stuff.js"></script>
        
        <script>
            soundManager.setup({
                url: '<?php echo $base; ?>/vendor/scottschiller/SoundManager2/swf/'
            });
            
            require(['dojorama/App'], function (App) { new App(); });
        </script>
    </body>
</html>