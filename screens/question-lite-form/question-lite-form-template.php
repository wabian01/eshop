<template id= 'question-lite-form'>
    <div :class="one ? 'col-md-10' :'col-md-12' " style="height: 100%;">
        <div v-if='question.type == "note"' style="margin-top: 7px;">
            <div v-html="question.content"></div>
        </div>
        <div v-if='question.type == "text"'>
            <input :class='"input-"+formid+"-"+question.name' type='text' class='form-control' style='border: none;border-bottom: 1px solid;' v-model="value" :placeholder="question.hint!=undefined?question.hint:''"> </input>
            <input :id='question.name' :name='question.name' :value='value' type='hidden'> </input>
        </div>
        <div v-if='question.type == "select_one"'>
            <label :id='question.name +"-"+index+"-"+formid' :class='"label-"+question.name+"-"+formid' style='background-color: #e5e5e5;padding: 10px;color: black;border-radius: 30px !important;margin-right:2%' v-for='(choice,index) in question.choices'> 
                <input :class='"input-"+formid+"-"+question.name' type="radio" :value='index' v-model="checkedAnswer" style='display:none' v-on:click=' change(question.name,index)' />
                <span class="kt-valign-middle" style="display: table-cell;float:right" v-html="handleLanguege(choice)"></span>
             </label>
             <input :id='question.name' :name='question.name' class="radio-select" :value='checkedAnswer' type='hidden'> </input>
        </div>
        <div v-if='question.type == "select_multiple"'>
            <label :id='question.name +"-"+index+"-"+formid' :class='"label-"+question.name+"-"+formid' style='background-color: #e5e5e5;padding: 10px;color: black;border-radius: 30px !important;margin-right:2%' v-for='(choice,index) in question.choices'> 
                <input :class='"input-"+formid+"-"+question.name' type="checkbox" :value='index' v-model="checkedAnswer" style='display:none' v-on:change='change(question.name,checkedAnswer,index)'/>
                <span class="kt-valign-middle" style="display: table-cell;float:right" v-html="handleLanguege(choice)"> </span>
             </label>
             <input :id='question.name' :name='question.name' :value='Object.values(checkedAnswer).join(" ")' type='hidden' > </input>
        </div>
        <div v-if='question.type == "image"'>
            <div style='text-align:center'>
                <label :class='"labelImg-"+question.name+"-"+formid' style='background-color: #ddd;margin: 0px;vertical-align: bottom;position: absolute;display:none;opacity:60%;padding:1.39rem 4.75rem'>
                </label>
                <label :class='"camera label-"+question.name+"-"+formid' style='border-radius: 50% !important;background-color: #009688;padding: 8px 10px;color:white;vertical-align: bottom;' data-toggle="modal" :data-target="'#'+formid+'-'+question.name+'-modal'" v-on:click='openModal'>
                    <div style='vertical-align:bottom'> <i class="fa fa-camera"></i></div>
                </label>
                <label :id='formid+"-"+question.name+"-preview"' style='width: 37px;height: 37px;background-color: rgb(0, 150, 136);border-radius: 50% !important;overflow:hidden;display:none;margin:0px !important' data-toggle="modal" :data-target="'#'+formid+'-'+question.name+'-modal'" v-on:click='openModal'> </label>
                <div class="modal fade" :id="formid+'-'+question.name+'-modal'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document" style="margin-top: 130px;width:450px;">
                        <div class="modal-content">
                        <div class="modal-header" style='border: 0px;background-color: #009688;'>
                            <h5 class="modal-title" id="exampleModalLabel"></h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" style='background-color: #2e2f32;'>
                            <video :id='formid+"-"+question.name+"-webcam"' playsInline={true} style='width:100%;height: 350px'></video>
                            <canvas :id='formid+"-"+question.name+"-canvas"' style='display:none'></canvas>
                        </div>
                        <div class='modal-footer' style='text-align: center;padding: 0px !important;border-top: 0px solid;background-color: #2e2f32;'>
                            <label style='width: 3rem;background-color: #ff4b55;text-align: center;height: 3rem;border-radius: 50% !important;' v-on:click="snap">
                            </label>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
            <input :id='question.name' :name='question.name' :value='file_name' type='hidden'> </input>
        </div>
        <div v-if='question.type == "video"'>
            <div style='text-align:center'>
                <label :class='"labelImg-"+question.name+"-"+formid' style='background-color: #ddd;margin: 0px;vertical-align: bottom;position: absolute;display:none;opacity:60%;padding:1.39rem 4.75rem'>
                </label>
                <label v-show="videoURL===''" :class='"camera label-"+question.name+"-"+formid' style='border-radius: 50% !important;background-color: #009688;padding: 8px 10px;color:white;vertical-align: bottom;' data-toggle="modal" :data-target="'#'+formid+'-'+question.name+'-modal'" v-on:click='openModal'>
                    <div style='vertical-align:bottom'> <i class="fa fa-video"></i></div>
                </label>
                <label v-show="videoURL!==''" :id='formid+"-"+question.name+"-preview"' style='border-radius: 50% !important;background-color: #009688;padding: 8px 10px;color:white;vertical-align: bottom;' data-toggle="modal" :data-target="'#'+formid+'-'+question.name+'-modal'">
                    <div style='vertical-align:bottom'> <i class="fa  fa-play"></i></div>
                </label>
                <div class="modal fade" :id="formid+'-'+question.name+'-modal'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document" style="margin-top: 130px;width:450px;">
                        <div class="modal-content">
                        <div class="modal-header" style='border: 0px;background-color: #009688;height:39px'>
                            <div v-show="videoURL!==''" style='vertical-align:bottom;color:white;' @click="reupVideo"> <i class="fa fa-video"></i></div>
                            <h5 class="modal-title" id="exampleModalLabel"></h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div v-show="videoURL===''" class="modal-body" style='background-color: #2e2f32;'>
                            <video :id='formid+"-"+question.name+"-webcam"' playsInline={true} style='width:100%;height: 350px'></video>
                            <canvas :id='formid+"-"+question.name+"-canvas"' style='display:none'></canvas>
                        </div>
                        <div v-if="videoURL!==''" class="modal-body" :id='formid+"-"+question.name+"-previewvideo"' style='background-color: #2e2f32;'></div>
                        <div v-show="videoURL===''" class='modal-footer' style='text-align: center;padding: 0px !important;border-top: 0px solid;background-color: #2e2f32;'>
                            <label v-show="statusWebcam==='record'" style='border: 6px solid white;width: 3rem;background-color: #ff4b55;text-align: center;height: 3rem;border-radius: 50% !important;' v-on:click="startRecordVideo">
                            </label>
                            <button 
                                v-show="statusWebcam==='stop'" 
                                type="button" 
                                style="
                                    background: transparent;
                                    border-radius:50% !important;
                                    margin-bottom: 10px;
                                    display: -webkit-inline-box;
                                    display: -ms-inline-flexbox;
                                    display: inline-flex;
                                    -webkit-box-align: center;
                                    -ms-flex-align: center;
                                    align-items: center;
                                    -webkit-box-pack: center;
                                    -ms-flex-pack: center;
                                    justify-content: center;
                                    padding: 0;border: 5px solid rgb(255, 255, 255); 
                                    height: 3em; 
                                    width: 3em;
                                " 
                                v-on:click="stopRecordVideo"
                            >
                                <label style="width: 16px; height: 16px; background: rgb(252, 61, 58); margin: 0px; border-radius: 2px;"></label>
                            </button>
                            </label>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
            <input :id='question.name' :name='question.name' :value='file_name' type='hidden'> </input>
        </div>
        <div v-if='question.type == "file"'>
            <div style='text-align:center'>
                <label v-if="file_name===''" :class='"label-"+question.name+"-"+formid' style='border-radius: 50% !important;background-color: #009688;padding:8px 13px;color:white'>
                        <input :class='"input-"+formid+"-"+question.name' type='file' style='display:none' v-on:change='(e) => {uploadFile(e)}'> </input>
                        <div style='vertical-align:bottom'> <i class="fa fa-paperclip"></i></div>
                </label>
                <label v-else style="margin: -3px;height: 42px;">
                    <input :class='"input-"+formid+"-"+question.name' type='file' style='display:none' v-on:change='(e) => {uploadFile(e)}'> </input>
                    <span 
                        class="" 
                        style="
                            display: inline-block;
                            width: 22px;
                            height: 22px;
                            -ms-transform: rotate(45deg);
                            -webkit-transform: rotate(45deg);
                            transform: rotate(45deg);
                        "
                    >
                        <div 
                            class="" 
                            style="
                                position: absolute;
                                width: 38px;
                                height: 38px;
                                background-color: #1fba1f;
                                border-radius: 20px !important;
                                left: 0;
                                top: 0;
                            "
                        >
                        </div>
                        <div class="" 
                            style="
                                position: absolute;
                                width: 3px;
                                height: 20px;
                                background-color: #fff;
                                left: 21px;
                                top: 6px;
                            "
                        >
                        </div>
                        <div 
                            class="" 
                            style="
                                position: absolute;
                                width: 14px;
                                height: 2.5px;
                                background-color: #fff;
                                left: 10px;
                                top: 25px;
                            "
                        >
                        </div>
                    </span>
                </label>
            </div>
            <input :id='question.name' :name='question.name' :value='file_name' type='hidden'> </input>
            <p class="filetext" style='text-align:center;margin:0px;margin-bottom:1%'> {{file_name}} </p>
        </div>
    </div>
</template>