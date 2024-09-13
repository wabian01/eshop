<template id= 'lite-form'>
    <div class="col-md-12 liteform" style="height: 100%" v-if="render">
        <div  v-if="status_load" class="overflow-load-liteform"></div>
        <div v-if="status_load" class="load-liteform"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <form v-if='body_area.fields.length > 1' :id='id_random' encType="multipart/form-data" method="POST" :style="gridLayout">
            <question-lite-form v-for='question in questions' :key="JSON.stringify(question)" :question="question" :formid='id_random' :one='false' :body_area='body_area_tem' :style="styleField[question.name]"> </question-lite-form>
            <button :disabled="arrayValue.length==0" v-if="typeSubmit==='__submit_button__'" type='button' :class='"btn-primary col-md-12 submitButton-"+id_random' style='margin: auto;background-color:#009688;border: 0px solid;border-radius: 2px !important;padding:1%' v-on:click='saveInstance' :style="styleSubmit"><?php echo Yii::t('app','SUBMIT'); ?></button>
            <button :disabled="arrayValue.length==0" v-if="typeSubmit==='__submit_icon__'" type='button' :class='"btn-primary col-md-12 submitButton-"+id_random' style='margin: auto;background-color:#009688;border: 0px solid;border-radius: 50% !important;padding:1%;width: 35px;height: 35px;' v-on:click='saveInstance' :style="styleSubmit"> 
                <svg fill="#fff" style="margin-top: 4px;" width="20px" height="20px" viewBox="0 0 24 24"><path id="liteform-icon" d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"></path></svg>
            </button>
            <div :class='"loader-submit-"+id_random' style="position: absolute;width: 100%;height: 100%;display:none;">
                <div id="loader-submit-1" ></div>
            </div>
        </form>
        <button :disabled="arrayValue.length==0" v-if="styleSubmit==='display:none;'" type='button' :class='"btn-primary col-md-12 submitButton-"+id_random' style='width: 100%;background-color:#009688;margin:2% 0%;border: 0px solid;border-radius: 2px !important;padding:5px;' v-on:click='saveInstance'><?php echo Yii::t('app','SUBMIT'); ?></button>
        <p :id='id_random+"-result"' v-if='body_area.fields.length > 1' style='float:right;margin:0px'> </p>
        <form v-if='body_area.fields.length == 1 && body_area.fields[0].type == "text"' :id='id_random' encType="multipart/form-data" method="POST">
            <div  style="display: flex;flex-wrap: nowrap;">
                <question-lite-form v-for='question in questions' :key="JSON.stringify(question)" :question="question" :formid='id_random' :one='true' :body_area='body_area_tem'> </question-lite-form>
                <button :disabled="arrayValue.length==0" type='button' :class='"btn-primary col-md-2 submitButton-"+id_random' style='background-color:#009688;border: 0px solid;border-radius: 2px !important;padding:1%;' v-on:click='saveInstance'><?php echo Yii::t('app','SUBMIT'); ?></button>
            </div>
            <div id="loader-submit-2" :class='"loader-submit-"+id_random' style="display:none;position: absolute;top: -31%;left: 50%;"></div>
            <p :id='id_random+"-result"' style='float:right;margin:0px'> </p>
        </form>
        <form v-if='body_area.fields.length == 1 && (body_area.fields[0].type == "select_one"|| body_area.fields[0].type == "select_multiple")' :id='id_random' encType="multipart/form-data" method="POST">
            <question-lite-form v-for='question in questions' :key="JSON.stringify(question)" :question="question" :formid='id_random' :one='true' :body_area='body_area_tem'> </question-lite-form>
            <div id="loader-submit-3" :class='"loader-submit-"+id_random' style="display:none;position: absolute;top: 0;left: 50%;"></div>
            <p :id='id_random+"-result"' style='float:right;margin:0px'> </p>
        </form>
    </div>
</template>