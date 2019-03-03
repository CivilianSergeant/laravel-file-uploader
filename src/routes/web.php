<?php
    Route::group(['namespace'=>'Muhimel\FileUploader\Laravel\Http\Controllers','middleware'=>['web']],function(){
        Route::get('uploader', 'FileUploaderController@index');
    });
    
?>