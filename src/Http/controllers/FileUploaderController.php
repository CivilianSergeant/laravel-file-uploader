<?php
namespace Muhimel\FileUploader\Laravel\Http\Controllers;
use App\Http\Controllers\Controller;
use Muhimel\Helper\HtmlHelper;
use Muhimel\Uploader;
use Muhimel\Interfaces\UploaderInterface;

class FileUploaderController extends Controller implements UploaderInterface
{
    private $base_url;
    public function __construct()
    {
        $this->base_url = url('/').'/';
    }

    public function index($category='upload',$accept="png"){
        
        HtmlHelper::setAssetPath($this->base_url.'app-assets/');
        HtmlHelper::setAsset('css/bootstrap.min.css');
        
        HtmlHelper::setAsset('js/vue/vue.js');
        HtmlHelper::setAsset('js/axios/axios.min.js');
        if(!empty($suffix)){
            $suffix = str_replace(' ','-',$suffix);
            $suffix = trim($suffix);
        }
        Uploader::getUI([
            'base_url'=>$this->base_url,
            'upload_url'=>'file-uploader/file-uploader/upload-process/'.$category.(!empty($suffix)? '/'.$suffix : ''),
            'csrf_token'=> md5(time()),
            'uploader-object' => '',
            'accept'=>$accept
        ]);
        exit;
    }

    public function beforeUpload(&$file)
    {

    }

    public function afterUpload($file)
    {

    }

    public function uploadProcess($category,$suffix=null) 
    {
        $this->category = $category;
        
        $suffix = explode(".",$suffix);
        $suffix = implode("/",$suffix);

        if($this->request->allowMethod(['post'])){
            $targetDir = $_SERVER['DOCUMENT_ROOT'].$this->request->webroot.'webroot/uploads/'.((!empty($suffix))? $suffix.'/' : '');
            Uploader::setOptions(['target_dir'=>$targetDir]);
            Uploader::upload($this);
        }
        exit;
    }
}