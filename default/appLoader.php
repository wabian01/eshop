<?php

    $check = Yii::app()->user;
    $baseUrl = Yii::app()->baseUrl;
    $cs = Yii::app()->clientScript;
    $plugins = [
        'vue',
        'select2',
        'moment',
        'fullcalendar',
        'jquery-minicolors',
        'datetimepicker',
        'bootstrap-sweetalert',
        'calendar_webapp_css'
    ];

    $this->loadPlugins($plugins);
    
    $includeFiles = function ($directory) use ($cs) {
        $path = __DIR__ . DIRECTORY_SEPARATOR . $directory;
    
        if (!is_dir($path)) {
            return;
        }
    
        $files = CFileHelper::findFiles($path, [
            'level' => -1, // Set to -1 to include all subdirectories
            'fileTypes' => ['php', 'js', 'css'],
        ]);
    
        foreach ($files as $file) {
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $relativePath = str_replace(Yii::getPathOfAlias('webroot'), '', $file);
            switch ($extension) {
                case 'php':
                    include_once $file;
                    break;
                case 'js':
                    $cs->registerScriptFile($relativePath. '?v=' . time());
                    break;
                case 'css':
                    $cs->registerCssFile($relativePath);
                    break;
                default:
                    break;
            }
        }
    };
    
    // Directories to scan
    $directories = [
        'mixins', 'modules', 'search', 'submodules', 'components', 'objects', 'tasks', 'screens'
    ];
    
    
    // Include files from all directories
    foreach ($directories as $directory) {
        $includeFiles($directory);
    }  

    $translationKeys = [
            'Loading...',
            'Screen definition not found',
            'Your work cannot be saved!',
            'Getting modules...',
            'Modules have been updated!',
            'Syncing modules...',
            'No records found.'
        ];
    $translationsJSON = $this->getTranslationForJS($translationKeys);

    $variableSystem = $this->loadVariableSystem();
    
    $variablePrivate = "";
    $resetModuleList = isset($_GET['resetModuleList']) && $_GET['resetModuleList'] ? true : false;
    if(isset($view) && $view === 'index'){
        $this->loadJsWebapp($view);
        $listVariables = [
            'token' => $token,
            'resetModuleList' => $resetModuleList,
            'viewName' => $view,
        ];
        $variablePrivate = $this->loadVariableJs($listVariables);
    }else if(isset($view) && ($view === 'indexDmView' || $view === 'dynamicTemplateUI')){
        $this->loadJsWebapp($view);
        $isTitle = isset($statetitle) ? $statetitle : true;
        $listModule = isset($listmodules) ? json_decode($listmodules) : [];
        $isModuleCode = isset($modulecode) ? $modulecode : false;
        $isSubmoduleCode = isset($submodulecode) ? $submodulecode : false;
        $isComponentCode = isset($componentcode) ? $componentcode : false;
        $isObjectCode = isset($objectcode) ? $objectcode : false;
        $isScreenCode = isset($screencode) ? $screencode : false;
        $eleID = $view_params['settings']['hydra:member'][0]['forms'][0] ?? 'undefined';
        $listVariables = [
            'token' => $token,
            'resetModuleList' => $resetModuleList,
            'langPublic' => $lang,
            'query_params' => $query_params,
            'isTitle' => $isTitle,
            'listmodules' => $listModule,
            'modulecode' => $modulecode,
            'isModuleCode' => $isModuleCode,
            'isSubmoduleCode' => $isSubmoduleCode,
            'isComponentCode' => $isComponentCode,
            'isObjectCode' => $isObjectCode,
            'isScreenCode' => $isScreenCode,
            'objectCode' => $objectcode,
            'eleID' => $eleID,
            'viewName' => $view,
        ];
        $variablePrivate = $this->loadVariableJs($listVariables);
    }else if(isset($view) && $view === 'indexLiteView'){
        $this->loadJsWebapp($view);
        $listVariables = [
            'token' => $token,
            'resetModuleList' => $resetModuleList,
            'profile' => [],
            'modulecode' => $modulecode,
            'showNofSystem' => $show_nofsystem,
            'show_module' => $modulecode,
            'viewName' => $view,
        ];
        $variablePrivate = $this->loadVariableJs($listVariables);
    }
?>
<script>
    const translations = <?= $translationsJSON ?>;
    <?=  $variableSystem ?>
    <?=  $variablePrivate ?>
</script>