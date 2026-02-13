import{K as F}from"./entry-KvResponsiveImage-DoJgYEfBin.js";import{c as w,m as v,D as f,K as G,z as k,C as _,r as S,o as n,a as I,q as a,L as i,A as P}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as q}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import{w as R}from"./entry-KvGrid-Cgm16aFdnL.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as W}from"./entry-KvPageContainer-Dh8GJwjiow.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-index-CWclSTHHJk.js";const j={name:"MainCategoryTile",props:{tileSize:{type:String,default:"small",validator:t=>["small","medium","large"].indexOf(t)!==-1},categoryName:{type:String,default:""},categoryDescription:{type:String,default:""},numberLoans:{type:Number,default:0},image:{type:String,default:""},retinaImage:{type:String,default:""},categoryUrl:{type:String,default:""}},components:{KvResponsiveImage:F},data(){return{}},computed:{retinaImageExists(){return this.retinaImage!==""},altText(){return`Kiva loans to ${this.categoryName}`},cleanURL(){return this.categoryUrl.substring(this.categoryUrl.lastIndexOf("/")+1)}},methods:{chooseImage(t){return t==="large"?this.retinaImageExists?[["small",this.retinaImage],["small retina",this.retinaImage]]:[["small",this.image]]:t==="medium"?this.retinaImageExists?[["small",this.retinaImage],["small retina",this.retinaImage],["large",this.image],["large retina",this.retinaImage]]:[["small",this.image]]:this.retinaImageExists?[["small",this.image],["small retina",this.retinaImage]]:[["small",this.image]]}}},A={key:0,class:"tw-mb-6 tw-group","data-testid":"all-categories-tiles"},J={class:"tw-text-center tw-flex tw-justify-between"},Q={class:"tw-mt-2 tw-mb-2 group-hover:tw-underline"},X={class:"tw-line-clamp-3"},Y={key:0,class:"tw-mt-1 tw-mb-2 tw-hidden md:tw-block"},Z={key:1,class:"tw-mb-6 tw-group","data-testid":"all-categories-tiles"},$={class:"tw-flex"},ee={class:"tw-mr-2 tw-flex-none"},ae={class:"tw-grow"},te={class:"tw-mb-2 group-hover:tw-underline"},ie={class:"tw-line-clamp-2"},re={class:"tw-mt-1 tw-mb-1"};function se(t,r,e,o,oe,s){const y=S("kv-responsive-image"),h=S("router-link"),b=G("kv-track-event");return e.tileSize==="large"||e.tileSize==="medium"?(n(),w("div",A,[f((n(),k(h,{class:"remove-link-decoration",to:`/lend-by-category/${s.cleanURL}`},{default:_(()=>[I(y,{class:"category-image category-image__large",images:s.chooseImage(e.tileSize),loading:"lazy",alt:s.altText},null,8,["images","alt"]),a("div",null,[a("div",J,[a("h3",Q,i(e.categoryName),1),a("h4",{class:P(["tw-mt-2 tw-mb-2",e.tileSize==="medium"?"md:tw-hidden":""])},i(e.numberLoans)+" loans ",3)]),a("div",null,[a("p",X,i(e.categoryDescription),1)])]),e.tileSize==="medium"?(n(),w("h4",Y,i(e.numberLoans)+" loans ",1)):v("",!0)],void 0),_:1},8,["to"])),[[b,["Lending","click-Category",e.categoryName]]])])):e.tileSize==="small"?(n(),w("div",Z,[f((n(),k(h,{class:"remove-link-decoration",to:`/lend-by-category/${s.cleanURL}`},{default:_(()=>[a("div",$,[a("div",ee,[I(y,{class:"category-image category-image__small",images:s.chooseImage(e.tileSize),loading:"lazy",alt:s.altText},null,8,["images","alt"])]),a("div",ae,[a("h3",te,i(e.categoryName),1),a("div",null,[a("span",ie,i(e.categoryDescription),1)]),a("h4",re,i(e.numberLoans)+" loans ",1)])])],void 0),_:1},8,["to"])),[[b,["Lending","click-Category",e.categoryName]]])])):v("",!0)}const p=q(j,[["render",se],["__scopeId","data-v-59219025"]]);j.__docgenInfo={displayName:"MainCategoryTile",exportName:"default",description:"",tags:{},props:[{name:"tileSize",type:{name:"string"},defaultValue:{func:!1,value:"'small'"}},{name:"categoryName",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"categoryDescription",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"numberLoans",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"image",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"retinaImage",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"categoryUrl",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Categories/MainCategoryTile.vue"]};const fe={title:"Components/Main Category Tile",component:p,args:{tileSize:"small",numberTiles:3},argTypes:{tileSize:{control:{type:"select"},options:["small","medium","large"]}}},u=(t={})=>{const r=(e,{argTypes:o})=>({props:Object.keys(o),components:{MainCategoryTile:p,KvGrid:R,KvPageContainer:W},setup(){return t},template:`
            <kv-page-container>
                <kv-grid class="tw-grid-cols-12">
                    <div class="tw-col-span-12 md:tw-col-span-6" >
                        <main-category-tile
                            :tileSize="tileSize"
                            :categoryName="categoryName"
                            :categoryDescription="categoryDescription"
                            :numberLoans="numberLoans" :image="image"
                            :retinaImage="retinaImage" :categoryUrl="categoryUrl" />
                    </div>
                </kv-grid>
            </kv-page-container>
        `});return r.args=t,r},ne=(t={})=>{const r=(e,{argTypes:o})=>({props:Object.keys(o),components:{MainCategoryTile:p,KvGrid:R,KvPageContainer:W},setup(){return t},template:`
            <kv-page-container>
                <kv-grid class="tw-grid-cols-12">
                    <div v-for="index in numberTiles" :key="index" class="tw-col-span-12 md:tw-col-span-6" >
                        <main-category-tile
                            :tileSize="tileSize"
                            :categoryName="categoryName"
                            :categoryDescription="categoryDescription"
                            :numberLoans="numberLoans" :image="image"
                            :retinaImage="retinaImage" :categoryUrl="categoryUrl" />
                    </div>
                </kv-grid>
            </kv-page-container>
        `});return r.args=t,r},c=u({tileSize:"small",categoryName:"Food",categoryDescription:"These borrowers are fueling their communities with food (and love) at markets, small grocery stores and restaurants.",numberLoans:1913,image:"https://www.kiva.org/img/w313h176/ad03fb699615d7ea3061dd80220100c2.webp",retinaImage:"https://www.kiva.org/img/w626h352/2b5c9493edddac4fe3210cddb930ec47.webp",categoryUrl:"/lend-by-category/food"}),m=u({tileSize:"large",categoryName:"Women",categoryDescription:"Worldwide, women have much less economic opportunity, security, and freedom. Support women starting their own businesses, going to school, and investing in the health of their communities and families.",numberLoans:6216,image:"https://www.kiva.org/img/w313h176/bd25843149e68a42a681f4bc00a660b8.webp",retinaImage:"https://www.kiva.org/img/w626h352/59b6320c2bb65324522c35619bc57932.webp",categoryUrl:"/lend-by-category/women"}),l=u({tileSize:"medium",categoryName:"Livestock",categoryDescription:"Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",numberLoans:118,image:"https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",retinaImage:"https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",categoryUrl:"/lend-by-category/livestock"}),g=u({tileSize:"small",categoryName:"Health",categoryDescription:"Help families and communities access the medicine, surgeries and healthcare services they need.",numberLoans:79,image:"https://www.kiva.org/img/w313h176/4682bd972ac323a6ba8cdc55ea75bd99.webp",retinaImage:"https://www.kiva.org/img/w626h352/3b1616d297b2fd575934568882068ace.webp",categoryUrl:"/lend-by-category/health"}),d=ne({tileSize:"small",categoryName:"Livestock",categoryDescription:"Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",numberLoans:118,image:"https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",retinaImage:"https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",categoryUrl:"/lend-by-category/livestock",numberTiles:3});var L,z,N;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`story({
  tileSize: 'small',
  categoryName: 'Food',
  categoryDescription: "These borrowers are fueling their communities with food (and love) at markets, small grocery stores and restaurants.",
  numberLoans: 1913,
  image: "https://www.kiva.org/img/w313h176/ad03fb699615d7ea3061dd80220100c2.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/2b5c9493edddac4fe3210cddb930ec47.webp",
  categoryUrl: "/lend-by-category/food"
})`,...(N=(z=c.parameters)==null?void 0:z.docs)==null?void 0:N.source}}};var C,D,x;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  tileSize: 'large',
  categoryName: 'Women',
  categoryDescription: "Worldwide, women have much less economic opportunity, security, and freedom. Support women starting their own businesses, going to school, and investing in the health of their communities and families.",
  numberLoans: 6216,
  image: "https://www.kiva.org/img/w313h176/bd25843149e68a42a681f4bc00a660b8.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/59b6320c2bb65324522c35619bc57932.webp",
  categoryUrl: "/lend-by-category/women"
})`,...(x=(D=m.parameters)==null?void 0:D.docs)==null?void 0:x.source}}};var U,T,M;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`story({
  tileSize: 'medium',
  categoryName: 'Livestock',
  categoryDescription: "Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",
  numberLoans: 118,
  image: "https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",
  categoryUrl: "/lend-by-category/livestock"
})`,...(M=(T=l.parameters)==null?void 0:T.docs)==null?void 0:M.source}}};var V,H,K;g.parameters={...g.parameters,docs:{...(V=g.parameters)==null?void 0:V.docs,source:{originalSource:`story({
  tileSize: 'small',
  categoryName: 'Health',
  categoryDescription: "Help families and communities access the medicine, surgeries and healthcare services they need.",
  numberLoans: 79,
  image: "https://www.kiva.org/img/w313h176/4682bd972ac323a6ba8cdc55ea75bd99.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/3b1616d297b2fd575934568882068ace.webp",
  categoryUrl: "/lend-by-category/health"
})`,...(K=(H=g.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var E,O,B;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`manyCategoriesStory({
  tileSize: 'small',
  categoryName: 'Livestock',
  categoryDescription: "Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",
  numberLoans: 118,
  image: "https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",
  categoryUrl: "/lend-by-category/livestock",
  numberTiles: 3
})`,...(B=(O=d.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};const ke=["Default","Large","Medium","Small","ManyCategories"];export{c as Default,m as Large,d as ManyCategories,l as Medium,g as Small,ke as __namedExportsOrder,fe as default};
