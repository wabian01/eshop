<?php 
    $view = "dynamicTemplateUI";
    include_once __DIR__ . '/appLoader.php';

    foreach (scandir(__DIR__ . '/dynamictemplate') as $file) {
        if ($file != '.' && $file != '..') {
            if (is_file(__DIR__ . '/dynamictemplate/' .$file)) {
                include_once __DIR__ . '/dynamictemplate/' . $file;
            }
        }
    }

    include_once __DIR__ . '/utils/common/style.php';
?>
<script>
    let module_view = 'rtcloud_webapp_modules_public',
        module_power_view = 'rtcloud_webapp_module_power_public';
</script>


<!-- BEGIN::Flowbite modal -->
<div id="popup-modal" data-modal-placement="center" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full">
    <div id="popup-modal--container" class="relative p-4 w-full max-w-lg h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <button id="popup-modal--header" type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Close modal</span>
            </button>
            <!-- Modal body -->
            <div id="popup-modal--body" class="p-6 text-center">
                <!-- Modal body::Icons -->
                <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-blue-400 popup-icon info" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-yellow-400 popup-icon warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-red-400 popup-icon danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <!-- Modal body::Message -->
                <h3 class="mb-5 text-lg font-normal text-gray-900"></h3>
                <!-- Modal body::Buttons -->
            </div>
        </div>
    </div>
</div>
<!-- END::Flowbite modal -->

<?php 
    include_once __DIR__ . '/utils/common/appCore.php';
    include_once __DIR__ . '/worker.php';
?>
