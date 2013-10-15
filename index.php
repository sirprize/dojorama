<?php
    $base = dirname($_SERVER['SCRIPT_NAME']);
    $base = ($base === '/') ? '' : $base;
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="<?php echo $base; ?>/builds/single-file-v002/dojorama/styles/global.css">
        <title>Dojorama - Single page demo application based on Dojo 1.9, Twitter Bootstrap 3 and history API</title>
        <meta http-equiv="cache-control" content="no-cache">
        <meta http-equiv="pragma" content="no-cache">
        <script>
            document.write('<style media="all">#static { display: none; }</style>');
        </script>

        <script>
            (function () {
                var key = 'TEST_NS_ERROR_FILE_CORRUPTED';

                try {
                    if (localStorage !== undefined && localStorage.setItem !== undefined) {
                        localStorage.setItem(key, '');
                        localStorage.removeItem(key);
                    }
                } catch(e) {
                    if (e.name === 'NS_ERROR_FILE_CORRUPTED') {
                        msg = 'Sorry, it looks like your browser storage has been corrupted.\n';
                        msg += 'More info can be found at the Mozilla Developer Website:\n\n'; 
                        msg += 'https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage#Storage_location_and_clearing_the_data';
                        alert(msg);
                    }
                }
            })();
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
        
        <?php if ($_SERVER['HTTP_HOST'] === 'dojorama.org'): ?>
            <script type="text/javascript">
                var _gaq = _gaq || [];
                _gaq.push(['_setAccount', 'UA-37233914-1']);
                // page tracking happens in App.js

                (function() {
                    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
                })();
            </script>
        <?php endif; ?>
        
        <script src="<?php echo $base; ?>/vendor/scottschiller/SoundManager2/script/soundmanager2-nodebug-jsmin.js"></script>
        
        <script>
            soundManager.setup({
                url: '<?php echo $base; ?>/vendor/scottschiller/SoundManager2/swf/'
            });
        </script>
        
        <script>
            var dojoConfig = {
                async: 1,
                'routing-map': {
                    pathPrefix: '<?php echo $base; ?>',
                    layers: {
                        home: ["dojorama/layers/home"],
                        release: ["dojorama/layers/release"],
                        storage: ["dojorama/layers/storage"]
                    }
                },
                'service/release-store': {
                    deps: [
                        'dojo-local-storage/LocalStorage',
                        'dojo-data-model/ModelStore',
                        '../model/ReleaseModel'
                    ],
                    callback: function (LocalStorage, ModelStore, ReleaseModel) {
                        "use strict";
                        return ModelStore(new LocalStorage({
                            subsetProperty: 'dojoramaSubset',
                            subsetName: "release"
                        }), ReleaseModel);
                    }
                }
            };
        </script>
        
        <script src="<?php echo $base; ?>/builds/single-file-v002/dojo/dojo.js"></script>

        <script>
            require(['dojorama/App'], function (App) { new App({}, 'dojorama'); });
        </script>
    </body>
</html>