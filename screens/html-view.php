<?php
    foreach (scandir(__DIR__ . '/html-view') as $file) {
        if ($file != '.' && $file != '..') {
            include __DIR__ . '/html-view/' . $file;
        }
    }
?>
