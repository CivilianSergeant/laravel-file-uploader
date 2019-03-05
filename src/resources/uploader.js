

Vue.component('uploader',{
    props:['dir','uploadedfiles','category','accept'],
    data:function(){
        return {
            uploaderFlag:true,
            libraryFlag:false,
            items:[],
            base_url:base_url,
            selectedItems:[],
            baseUrl:base_url+'file-uploader/file-uploader/index/'+this.category+'/'+this.accept+(this.dir? '/'+this.dir+'?v=' : '?v=')+ (new Date()).getTime()
        }
    },
    template: `<div>
        <button type="button" @click="fixRender" class="btn btn-info btn-sm" data-toggle="modal" data-target="#uploader">Attachement</button>
        <div class="modal fade w-100" id="uploader" ref="uploader" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="padding-right:0px; !important;">
           
            <div class="modal-dialog" role="document" style="max-width:75% !important;margin:20px auto;">
                <div class="modal-content" >
                    <div class="modal-header">
                        <h3>File Attachement</h3>
                        <button type="button" class="btn btn-danger pull-right btn-sm" data-dismiss="modal"><i class="fa fa-times"></i></button>
                        
                    </div>
                    <div class="modal-body">
                        <div class="position-fixed d-block">
                            <button type="button" @click="showUploader" class="btn btn-info btn-sm"> Upload Files </button>
                            <button type="button" @click="showLibrary" class="btn btn-info btn-sm"> Library </button>
                        </div>
                        <div v-if="uploaderFlag">
                            <iframe id="idIframe" ref="uploader" :src="baseUrl" width="100%" style="min-height:350px;position: relative;
                            top: 32px;border:1px solid #ddd;"></iframe>
                        </div>
                        <div v-if="libraryFlag">
                            <div style="background:#f3f3f3;height:350px;position: relative;
                            top: 32px;padding:10px;border:1px solid #ddd;overflow-y:scroll">
                                <div v-for="(item,i) in items" :key="i" style="display:table;float:left; background:#fff; height:213px;overflow:hidden; margin:5px;">
                                        <div style="display:table-cell;vertical-align:middle;padding: 40px 30px;">
                                            <img style="width:100px; border:1px solid #aaa; padding:4px;" :title="item.original_filename" :src="showImage(item)"/>
                                        </div>
                                        <input type="checkbox" style="position:relative;top:8px;right:8px;" v-model="item.selected" @change="selectItem(item)"/> 
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-info mt-1" @click="uploadedFiles()" data-dismiss="modal">Attach</button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>`,
    
    methods:{
        fixRender:function(){
            this.uploaderFlag = true;
            this.libraryFlag = false;
            setTimeout(()=>{
                console.log('here')
                this.$refs.uploader.style.paddingRight="0px"
                this.baseUrl=base_url+'file-uploader/file-uploader/index/'+this.category+'/'+this.accept+(this.dir? '/'+this.dir+'?v=' : '?v=')+ (new Date()).getTime();
                
            },100);
            setInterval(this.iframeLoaded,100);
            
        },
        iframeLoaded:function() {
            var iFrameID = document.getElementById('idIframe');
            if(iFrameID) {
                  // here you can make the height, I delete it first, then I make it again
                  iFrameID.height = "";
                  
                  iFrameID.style.minHeight = (iFrameID.contentWindow.document.body.scrollHeight+50) + "px";
                  console.log(iFrameID.style.minHeight);
            }   
        },
        showImage:function(item){
            
            if(item.type.match('presentationml')){
                return base_url+'theme_admin/app-assets/img/ppt-512.png';
            };
            if(item.type.match('wordprocessingml')){
                return base_url+'theme_admin/app-assets/img/doc-512.png';
            }
            if(item.type.match('spreadsheetml')){
                return base_url+'theme_admin/app-assets/img/xls-512.png';
            }
            if(item.type.match('pdf')){
                return base_url+'theme_admin/app-assets/img/pdf-512.png';
            }
            return base_url+item.path+item.filename
        },
        selectItem:function(item){
            
            if(item.selected){
                this.selectedItems.push(item)
            }else{
                this.selectedItems = this.selectedItems.filter((i)=>{
                   return (i.id != item.id)
                });
            }
            
        },
        uploadedFiles:function(){
            if(this.uploaderFlag){
                this.uploadedfiles(document.getElementsByTagName("iframe")[0].contentWindow.uploadedFiles);
                
            }
            if(this.libraryFlag){
                this.uploadedfiles(this.selectedItems);
                
            }
            document.getElementsByTagName("iframe")[0].contentWindow.location.reload();
        },
        showUploader:function(){
            this.uploaderFlag = true;
            this.libraryFlag = false;
            
        },
        showLibrary:function(){
            this.libraryFlag = true;
            this.uploaderFlag = false;
            
            axios.get(base_url+'file-uploader/file-uploader/get-library/'+this.category).then(res=>{
                this.items = res.data.libraryItems;
                this.selectedItems = [];
            }).catch(error=>{

            });
        }
    }
});