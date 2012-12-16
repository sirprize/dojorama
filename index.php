<?php $base = dirname($_SERVER['SCRIPT_NAME']); ?>

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
        
        <script src="<?php echo $base; ?>/builds/single-file/dojo/dojo.js"></script>

        <script>
            require(['dojorama/App'], function (App) { new App(); });
        </script>
    </body>
</html>