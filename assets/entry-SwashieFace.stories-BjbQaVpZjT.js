import{c as t,e,h as c,G as g,v as J,n as Q,o as l,R as X,S as $}from"./entry-vue.esm-bundler-CTwdbZZHjD.js";import{_ as ee}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{K as Y}from"./entry-KvProgressCircle-CuWy2zKxMj.js";const G={name:"SwashieFace",props:{percentFull:{type:Number,default:0,validator(s){return s>=0&&s<=100}},showLiquid:{type:Boolean,default:!0}},data(){return{fillLevel:null}},computed:{excitementLevel(){return this.fillLevel?this.fillLevel>=0&&this.fillLevel<50?"sleepy":this.fillLevel>=50&&this.fillLevel<80?"content":this.fillLevel>=80?"elated":"asleep":"asleep"}},watch:{percentFull(){this.percentFull>100&&(this.fillLevel=100),this.timer||this.fillErUp()}},mounted(){this.fillErUp()},beforeUnmount(){clearInterval(this.timer),this.timer=null},methods:{fillErUp(){const s=()=>{this.fillLevel===this.percentFull?(clearInterval(this.timer),this.timer=null):this.fillLevel+=this.fillLevel<this.percentFull?1:-1};this.timer=setInterval(s,50)}}},r=s=>(X("data-v-0845c388"),s=s(),$(),s),se={class:"kv-swashie__wrapper"},re={class:"kv-swashie__circle"},ne={class:"kv-swashie__face"},ie={viewBox:"0 0 205 205",fill:"none",xmlns:"http://www.w3.org/2000/svg"},te={key:0,class:"kv-swashie__face-asleep"},le=r(()=>e("path",{class:"kv-swashie__face-open-eyes",d:"M145.04 104.92C149.436 104.92 153 101.356 153 96.9602C153 92.5639 149.436 89 145.04 89C140.644 89 137.08 92.5639 137.08 96.9602C137.08 101.356 140.644 104.92 145.04 104.92Z",fill:"#3E4653"},null,-1)),ae=r(()=>e("path",{class:"kv-swashie__face-open-eyes",d:"M59.9602 104.921C64.3565 104.921 67.9204 101.357 67.9204 96.9604C67.9204 92.5641 64.3565 89.0002 59.9602 89.0002C55.5639 89.0002 52 92.5641 52 96.9604C52 101.357 55.5639 104.921 59.9602 104.921Z",fill:"#3E4653"},null,-1)),ce=r(()=>e("path",{class:"kv-swashie__face-flat-mouth",d:"M89.6187 113.421H115.382C115.828 113.421 116.182 113.103 116.409 112.699C116.642 112.287 116.778 111.735 116.778 111.138C116.778 110.541 116.642 109.989 116.409 109.577C116.182 109.173 115.828 108.855 115.382 108.855H89.6187C89.1715 108.855 88.8179 109.174 88.5903 109.578C88.3583 109.991 88.2228 110.543 88.2228 111.138C88.2228 111.735 88.3588 112.287 88.5911 112.699C88.819 113.103 89.1727 113.421 89.6187 113.421Z",fill:"#2E495D",stroke:"#2E495D","stroke-width":".5"},null,-1)),oe=[le,ae,ce],pe={key:1,class:"kv-swashie__face-sleeping"},he=r(()=>e("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M137.08 96.0006C138.467 96.0006 139.591 97.1249 139.591 98.5117C139.591 101.52 142.031 103.961 145.04 103.961C148.048 103.961 150.489 101.52 150.489 98.5117C150.489 97.1249 151.613 96.0006 153 96.0006C154.387 96.0006 155.511 97.1249 155.511 98.5117C155.511 104.294 150.822 108.983 145.04 108.983C139.257 108.983 134.568 104.294 134.568 98.5117C134.568 97.1249 135.693 96.0006 137.08 96.0006Z",fill:"#3E4653"},null,-1)),de=r(()=>e("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M52 96.0012C53.3869 96.0012 54.5112 97.1255 54.5112 98.5124C54.5112 101.521 56.9515 103.961 59.9602 103.961C62.9688 103.961 65.4092 101.521 65.4092 98.5124C65.4092 97.1255 66.5335 96.0012 67.9204 96.0012C69.3072 96.0012 70.4315 97.1255 70.4315 98.5124C70.4315 104.295 65.7426 108.984 59.9602 108.984C54.1778 108.984 49.4888 104.295 49.4888 98.5124C49.4888 97.1255 50.6131 96.0012 52 96.0012Z",fill:"#3E4653"},null,-1)),ue=r(()=>e("path",{class:"kv-swashie__face-snore-mouth",d:"M102.5 116.568C106.206 116.568 109.211 113.563 109.211 109.857C109.211 106.15 106.206 103.146 102.5 103.146C98.7935 103.146 95.7888 106.15 95.7888 109.857C95.7888 113.563 98.7935 116.568 102.5 116.568Z",fill:"#3E4653"},null,-1)),we=[he,de,ue],me=r(()=>e("path",{class:"kv-swashie__face-open-eyes",d:"M145.04 104.92C149.436 104.92 153 101.356 153 96.9602C153 92.5639 149.436 89 145.04 89C140.644 89 137.08 92.5639 137.08 96.9602C137.08 101.356 140.644 104.92 145.04 104.92Z",fill:"#3E4653"},null,-1)),_e=r(()=>e("path",{class:"kv-swashie__face-open-eyes",d:"M59.9602 104.921C64.3565 104.921 67.9204 101.357 67.9204 96.9604C67.9204 92.5641 64.3565 89.0002 59.9602 89.0002C55.5639 89.0002 52 92.5641 52 96.9604C52 101.357 55.5639 104.921 59.9602 104.921Z",fill:"#3E4653"},null,-1)),fe=r(()=>e("path",{d:"M120.581 98.4638C120.581 108.449 112.485 116.545 102.5 116.545C92.5151 116.545 84.4192 108.449 84.4192 98.4638",stroke:"#3E4653","stroke-width":"3.76773","stroke-miterlimit":"10","stroke-linecap":"round","stroke-linejoin":"round"},null,-1)),ge=r(()=>e("path",{class:"kv-swashie__face-open-eyes",d:"M145.04 104.92C149.436 104.92 153 101.356 153 96.9602C153 92.5639 149.436 89 145.04 89C140.644 89 137.08 92.5639 137.08 96.9602C137.08 101.356 140.644 104.92 145.04 104.92Z",fill:"#3E4653"},null,-1)),ve=r(()=>e("path",{class:"kv-swashie__face-open-eyes",d:"M59.9602 104.921C64.3565 104.921 67.9204 101.357 67.9204 96.9604C67.9204 92.5641 64.3565 89.0002 59.9602 89.0002C55.5639 89.0002 52 92.5641 52 96.9604C52 101.357 55.5639 104.921 59.9602 104.921Z",fill:"#3E4653"},null,-1)),ye=r(()=>e("mask",{id:"mask0","mask-type":"alpha",maskUnits:"userSpaceOnUse",x:"84",y:"98",width:"37",height:"19"},[e("path",{d:"M84.3181 98.2867C84.3181 108.24 92.3886 116.311 102.342 116.311C112.296 116.311 120.366 108.24 120.366 98.2867H84.3181Z",fill:"#3E4D61"})],-1)),ke=r(()=>e("g",{mask:"url(#mask0)"},[e("path",{d:"M84.3181 98.2867C84.3181 108.24 92.3886 116.311 102.342 116.311C112.296 116.311 120.366 108.24 120.366 98.2867H84.3181Z",fill:"#3E4653"}),e("path",{d:"M120.367 125.323C120.367 115.369 112.296 107.299 102.342 107.299C92.3888 107.299 84.3183 115.369 84.3183 125.323H120.367Z",fill:"#DF5D4F"})],-1)),Ce=r(()=>e("svg",{class:"kv-swashie__liquid-svg",fill:"none",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 560 389"},[e("path",{d:"M139.749 20c-21.384-.4116-38.597-2.503-50.849-4.4953-13.4-2.2-26.5-5.2-27.3-5.4-7.2024-1.66204-11.9322-2.94046-15.9706-4.03202l-.0004-.00009C40.9207 4.79996 37.1521 3.78133 31.5 2.70474c-7.2-1.3-17.9-2.8-31.5-2.7V389h560V.00474c-13.6-.1-24.4 1.4-31.5 2.7-5.652 1.07659-9.421 2.09522-14.129 3.36785v.00009c-4.039 1.09156-8.769 2.36998-15.971 4.03202-.8.2-13.9 3.2-27.3 5.4-12.252 1.9923-29.465 4.0837-50.849 4.4953h-.502c-21.384-.4116-38.597-2.503-50.849-4.4953-13.4-2.2-26.5-5.2-27.3-5.4-7.203-1.6621-11.932-2.94053-15.971-4.03211-4.708-1.27263-8.477-2.29126-14.129-3.36785-7.2-1.3-17.9-2.8-31.5-2.7-13.6-.1-24.4 1.4-31.5 2.7-5.652 1.07659-9.421 2.09522-14.129 3.36785-4.039 1.09158-8.768 2.37001-15.971 4.03211-.8.2-13.9 3.2-27.3 5.4-12.252 1.9923-29.465 4.0837-50.849 4.4953h-.502z"})],-1)),Fe=[Ce];function qe(s,i,R,Le,A,a){return l(),t("div",{class:Q(["kv-swashie",`kv-swashie--${a.excitementLevel}`])},[e("div",se,[e("div",re,[e("div",ne,[(l(),t("svg",ie,[a.excitementLevel==="asleep"?(l(),t("g",te,oe)):c("",!0),a.excitementLevel==="sleepy"?(l(),t("g",pe,we)):c("",!0),a.excitementLevel==="content"?(l(),t(g,{key:2},[me,_e,fe],64)):c("",!0),a.excitementLevel==="elated"?(l(),t(g,{key:3},[ge,ve,ye,ke],64)):c("",!0)]))]),R.showLiquid?(l(),t("div",{key:0,class:"kv-swashie__liquid",style:J({transform:`translateY(${100-A.fillLevel}%)`})},Fe,4)):c("",!0)])])],2)}const f=ee(G,[["render",qe],["__scopeId","data-v-0845c388"]]);G.__docgenInfo={displayName:"SwashieFace",exportName:"default",description:"",tags:{},props:[{name:"percentFull",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"showLiquid",type:{name:"boolean"},defaultValue:{func:!1,value:"true"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/15Years/SwashieFace.vue"]};const Ee={title:"components/SwashieFace",component:f,args:{percentFull:25,showLiquid:!0},argTypes:{percentFull:{control:"range",options:{min:0,max:100,step:1}}}},n=(s,{argTypes:i})=>({props:Object.keys(i),components:{SwashieFace:f},setup(){return s},template:`
        <swashie-face
            :percent-full="percentFull"
            :show-liquid="showLiquid"
            style="width: 10rem;"
         />
    `}),o=n.bind({});o.args={percentFull:null};const p=n.bind({});p.args={percentFull:50};const h=n.bind({});h.args={percentFull:80};const d=n.bind({});d.args={percentFull:100};const u=n.bind({});u.args={percentFull:80,showLiquid:!1};const w=(s,{argTypes:i})=>({props:Object.keys(i),components:{SwashieFace:f},template:`
        <div style="display: flex; flex-wrap: wrap;">
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 2rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 3rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 5rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 8rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 13rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 21rem;" />
        </div>
    `});w.args={percentFull:100};const m=(s,{argTypes:i})=>({props:Object.keys(i),components:{KvProgressCircle:Y,SwashieFace:f},template:`
    <div>
        <component is="style">
            .swashie {
                position: relative;
                width: 9.5rem;
                height: 9.5rem;
            }

            .swashie__progress-circle,
            .swashie__face {
                position: absolute;
                z-index: 1;
                width: 100%;
                height: 100%;
            }

            .swashie__progress-circle {
                --kv-progress-circle-foreground-color: #3E4653;
            }

            .swashie__face {
                padding: 7%;
            }
        </component>
        <div class="swashie">
            <kv-progress-circle :stroke-width="5" class="swashie__progress-circle" :value="percentFull" :show-number="true" />
            <swashie-face class="swashie__face" :percent-full="percentFull" :show-liquid="showLiquid" />
        </div>
    </div>
    `});m.args={percentFull:80};const _=(s,{argTypes:i})=>({props:Object.keys(i),components:{KvProgressCircle:Y,SwashieFace:f},template:`
    <div>
        <component is="style">
            .swashie {
                position: relative;
                width: 9.5rem;
                height: 9.5rem;
            }

            .swashie__progress-circle,
            .swashie__face {
                position: absolute;
                z-index: 1;
                width: 100%;
                height: 100%;
            }

            .swashie__progress-circle {
                --kv-progress-circle-background-color: transparent;
                transform: rotate(36deg);
            }

            .swashie__progress-circle--background {
                --kv-progress-circle-foreground-color: #E1DBD2;
            }

            .swashie__progress-circle--foreground {
                --kv-progress-circle-foreground-color: #319788;
                z-index: 2;
            }

            .swashie__face {
                padding: 10%;
            }
        </component>

        <div class="swashie">
            <kv-progress-circle
                class="swashie__progress-circle swashie__progress-circle--background"
                :stroke-width="12"
                :value="80"
                :show-number="false"
                aria-hidden="true"
             />
            <kv-progress-circle
                class="swashie__progress-circle swashie__progress-circle--foreground"
                :stroke-width="12"
                :value="parseInt(percentFull * .8)"
                :show-number="false"
             />
            <swashie-face
                class="swashie__face"
                :percent-full="percentFull"
                :show-liquid="showLiquid"
             />
        </div>
    </div>
    `});_.args={percentFull:80};var v,y,k;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    SwashieFace
  },
  setup() {
    return args;
  },
  template: \`
        <swashie-face
            :percent-full="percentFull"
            :show-liquid="showLiquid"
            style="width: 10rem;"
         />
    \`
})`,...(k=(y=n.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var C,F,q;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    SwashieFace
  },
  setup() {
    return args;
  },
  template: \`
        <swashie-face
            :percent-full="percentFull"
            :show-liquid="showLiquid"
            style="width: 10rem;"
         />
    \`
})`,...(q=(F=o.parameters)==null?void 0:F.docs)==null?void 0:q.source}}};var L,b,S;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    SwashieFace
  },
  setup() {
    return args;
  },
  template: \`
        <swashie-face
            :percent-full="percentFull"
            :show-liquid="showLiquid"
            style="width: 10rem;"
         />
    \`
})`,...(S=(b=p.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var x,E,T;h.parameters={...h.parameters,docs:{...(x=h.parameters)==null?void 0:x.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    SwashieFace
  },
  setup() {
    return args;
  },
  template: \`
        <swashie-face
            :percent-full="percentFull"
            :show-liquid="showLiquid"
            style="width: 10rem;"
         />
    \`
})`,...(T=(E=h.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var O,M,j;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    SwashieFace
  },
  setup() {
    return args;
  },
  template: \`
        <swashie-face
            :percent-full="percentFull"
            :show-liquid="showLiquid"
            style="width: 10rem;"
         />
    \`
})`,...(j=(M=d.parameters)==null?void 0:M.docs)==null?void 0:j.source}}};var P,Z,D;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    SwashieFace
  },
  setup() {
    return args;
  },
  template: \`
        <swashie-face
            :percent-full="percentFull"
            :show-liquid="showLiquid"
            style="width: 10rem;"
         />
    \`
})`,...(D=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:D.source}}};var I,z,B;w.parameters={...w.parameters,docs:{...(I=w.parameters)==null?void 0:I.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    SwashieFace
  },
  template: \`
        <div style="display: flex; flex-wrap: wrap;">
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 2rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 3rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 5rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 8rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 13rem;" />
            <swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 21rem;" />
        </div>
    \`
})`,...(B=(z=w.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var H,N,K;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvProgressCircle,
    SwashieFace
  },
  template: \`
    <div>
        <component is="style">
            .swashie {
                position: relative;
                width: 9.5rem;
                height: 9.5rem;
            }

            .swashie__progress-circle,
            .swashie__face {
                position: absolute;
                z-index: 1;
                width: 100%;
                height: 100%;
            }

            .swashie__progress-circle {
                --kv-progress-circle-foreground-color: #3E4653;
            }

            .swashie__face {
                padding: 7%;
            }
        </component>
        <div class="swashie">
            <kv-progress-circle :stroke-width="5" class="swashie__progress-circle" :value="percentFull" :show-number="true" />
            <swashie-face class="swashie__face" :percent-full="percentFull" :show-liquid="showLiquid" />
        </div>
    </div>
    \`
})`,...(K=(N=m.parameters)==null?void 0:N.docs)==null?void 0:K.source}}};var U,V,W;_.parameters={..._.parameters,docs:{...(U=_.parameters)==null?void 0:U.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvProgressCircle,
    SwashieFace
  },
  template: \`
    <div>
        <component is="style">
            .swashie {
                position: relative;
                width: 9.5rem;
                height: 9.5rem;
            }

            .swashie__progress-circle,
            .swashie__face {
                position: absolute;
                z-index: 1;
                width: 100%;
                height: 100%;
            }

            .swashie__progress-circle {
                --kv-progress-circle-background-color: transparent;
                transform: rotate(36deg);
            }

            .swashie__progress-circle--background {
                --kv-progress-circle-foreground-color: #E1DBD2;
            }

            .swashie__progress-circle--foreground {
                --kv-progress-circle-foreground-color: #319788;
                z-index: 2;
            }

            .swashie__face {
                padding: 10%;
            }
        </component>

        <div class="swashie">
            <kv-progress-circle
                class="swashie__progress-circle swashie__progress-circle--background"
                :stroke-width="12"
                :value="80"
                :show-number="false"
                aria-hidden="true"
             />
            <kv-progress-circle
                class="swashie__progress-circle swashie__progress-circle--foreground"
                :stroke-width="12"
                :value="parseInt(percentFull * .8)"
                :show-number="false"
             />
            <swashie-face
                class="swashie__face"
                :percent-full="percentFull"
                :show-liquid="showLiquid"
             />
        </div>
    </div>
    \`
})`,...(W=(V=_.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};const Te=["Default","Loading","FiftyPercent","EightyPercent","OneHundredPercent","NoLiquid","Scaled","WithKvProgressCircle","WithCShapeProgressCircle"];export{n as Default,h as EightyPercent,p as FiftyPercent,o as Loading,u as NoLiquid,d as OneHundredPercent,w as Scaled,_ as WithCShapeProgressCircle,m as WithKvProgressCircle,Te as __namedExportsOrder,Ee as default};
