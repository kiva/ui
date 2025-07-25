import{K as W}from"./entry-KvResponsiveImage-DWSQ0nX4WP.js";import{c as y,d as v,D as b,H as G,f as k,b as _,r as S,o as n,a as I,e as t,F as r,n as P}from"./entry-vue.esm-bundler-Duz9TGGLcr.js";import{_ as q}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvSecondaryNav-CSFqCa1lom.js";import{g as B}from"./entry-KvGrid-B8f0oqDP-J.js";import"./entry-numeral-xVHG5DEP0A.js";import{x as F}from"./entry-KvPageContainer-ZX0JKbX2d4.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-index-DzTqzqs3pZ.js";const R={name:"MainCategoryTile",props:{tileSize:{type:String,default:"small",validator:a=>["small","medium","large"].indexOf(a)!==-1},categoryName:{type:String,default:""},categoryDescription:{type:String,default:""},numberLoans:{type:Number,default:0},image:{type:String,default:""},retinaImage:{type:String,default:""},categoryUrl:{type:String,default:""}},components:{KvResponsiveImage:W},data(){return{}},computed:{retinaImageExists(){return this.retinaImage!==""},altText(){return`Kiva loans to ${this.categoryName}`},cleanURL(){return this.categoryUrl.substring(this.categoryUrl.lastIndexOf("/")+1)}},methods:{chooseImage(a){return a==="large"?this.retinaImageExists?[["small",this.retinaImage],["small retina",this.retinaImage]]:[["small",this.image]]:a==="medium"?this.retinaImageExists?[["small",this.retinaImage],["small retina",this.retinaImage],["large",this.image],["large retina",this.retinaImage]]:[["small",this.image]]:this.retinaImageExists?[["small",this.image],["small retina",this.retinaImage]]:[["small",this.image]]}}},A={key:0,class:"tw-mb-6 tw-group","data-testid":"all-categories-tiles"},J={class:"tw-text-center tw-flex tw-justify-between"},Q={class:"tw-mt-2 tw-mb-2 group-hover:tw-underline"},X={class:"tw-line-clamp-3"},Y={key:0,class:"tw-mt-1 tw-mb-2 tw-hidden md:tw-block"},Z={key:1,class:"tw-mb-6 tw-group","data-testid":"all-categories-tiles"},$={class:"tw-flex"},ee={class:"tw-mr-2 tw-flex-none"},te={class:"tw-grow"},ae={class:"tw-mb-2 group-hover:tw-underline"},re={class:"tw-line-clamp-2"},ie={class:"tw-mt-1 tw-mb-1"};function se(a,i,e,o,oe,s){const h=S("kv-responsive-image"),f=S("router-link"),w=G("kv-track-event");return e.tileSize==="large"||e.tileSize==="medium"?(n(),y("div",A,[b((n(),k(f,{class:"remove-link-decoration",to:`/lend-by-category/${s.cleanURL}`},{default:_(()=>[I(h,{class:"category-image category-image__large",images:s.chooseImage(e.tileSize),loading:"lazy",alt:s.altText},null,8,["images","alt"]),t("div",null,[t("div",J,[t("h3",Q,r(e.categoryName),1),t("h4",{class:P(["tw-mt-2 tw-mb-2",e.tileSize==="medium"?"md:tw-hidden":""])},r(e.numberLoans)+" loans ",3)]),t("div",null,[t("p",X,r(e.categoryDescription),1)])]),e.tileSize==="medium"?(n(),y("h4",Y,r(e.numberLoans)+" loans ",1)):v("",!0)],void 0),_:1},8,["to"])),[[w,["Lending","click-Category",e.categoryName]]])])):e.tileSize==="small"?(n(),y("div",Z,[b((n(),k(f,{class:"remove-link-decoration",to:`/lend-by-category/${s.cleanURL}`},{default:_(()=>[t("div",$,[t("div",ee,[I(h,{class:"category-image category-image__small",images:s.chooseImage(e.tileSize),loading:"lazy",alt:s.altText},null,8,["images","alt"])]),t("div",te,[t("h3",ae,r(e.categoryName),1),t("div",null,[t("span",re,r(e.categoryDescription),1)]),t("h4",ie,r(e.numberLoans)+" loans ",1)])])],void 0),_:1},8,["to"])),[[w,["Lending","click-Category",e.categoryName]]])])):v("",!0)}const p=q(R,[["render",se],["__scopeId","data-v-59219025"]]);R.__docgenInfo={displayName:"MainCategoryTile",exportName:"default",description:"",tags:{},props:[{name:"tileSize",type:{name:"string"},defaultValue:{func:!1,value:"'small'"}},{name:"categoryName",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"categoryDescription",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"numberLoans",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"image",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"retinaImage",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"categoryUrl",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Categories/MainCategoryTile.vue"]};const be={title:"Components/Main Category Tile",component:p,args:{tileSize:"small",numberTiles:3},argTypes:{tileSize:{control:{type:"select"},options:["small","medium","large"]}}},u=(a={})=>{const i=(e,{argTypes:o})=>({props:Object.keys(o),components:{MainCategoryTile:p,KvGrid:B,KvPageContainer:F},setup(){return a},template:`
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
        `});return i.args=a,i},ne=(a={})=>{const i=(e,{argTypes:o})=>({props:Object.keys(o),components:{MainCategoryTile:p,KvGrid:B,KvPageContainer:F},setup(){return a},template:`
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
        `});return i.args=a,i},l=u({tileSize:"small",categoryName:"Food",categoryDescription:"These borrowers are fueling their communities with food (and love) at markets, small grocery stores and restaurants.",numberLoans:1913,image:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/ad03fb699615d7ea3061dd80220100c2.jpg",retinaImage:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/2b5c9493edddac4fe3210cddb930ec47.jpg",categoryUrl:"/lend-by-category/food"}),c=u({tileSize:"large",categoryName:"Women",categoryDescription:"Worldwide, women have much less economic opportunity, security, and freedom. Support women starting their own businesses, going to school, and investing in the health of their communities and families.",numberLoans:6216,image:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/bd25843149e68a42a681f4bc00a660b8.jpg",retinaImage:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/59b6320c2bb65324522c35619bc57932.jpg",categoryUrl:"/lend-by-category/women"}),m=u({tileSize:"medium",categoryName:"Livestock",categoryDescription:"Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",numberLoans:118,image:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.jpg",retinaImage:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/4b28a0879c81077484e0ed28a18eba23.jpg",categoryUrl:"/lend-by-category/livestock"}),g=u({tileSize:"small",categoryName:"Health",categoryDescription:"Help families and communities access the medicine, surgeries and healthcare services they need.",numberLoans:79,image:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4682bd972ac323a6ba8cdc55ea75bd99.jpg",retinaImage:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/3b1616d297b2fd575934568882068ace.jpg",categoryUrl:"/lend-by-category/health"}),d=ne({tileSize:"small",categoryName:"Livestock",categoryDescription:"Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",numberLoans:118,image:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.jpg",retinaImage:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/4b28a0879c81077484e0ed28a18eba23.jpg",categoryUrl:"/lend-by-category/livestock",numberTiles:3});var L,z,N;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`story({
  tileSize: 'small',
  categoryName: 'Food',
  categoryDescription: "These borrowers are fueling their communities with food (and love) at markets, small grocery stores and restaurants.",
  numberLoans: 1913,
  image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/ad03fb699615d7ea3061dd80220100c2.jpg",
  retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/2b5c9493edddac4fe3210cddb930ec47.jpg",
  categoryUrl: "/lend-by-category/food"
})`,...(N=(z=l.parameters)==null?void 0:z.docs)==null?void 0:N.source}}};var C,D,j;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  tileSize: 'large',
  categoryName: 'Women',
  categoryDescription: "Worldwide, women have much less economic opportunity, security, and freedom. Support women starting their own businesses, going to school, and investing in the health of their communities and families.",
  numberLoans: 6216,
  image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/bd25843149e68a42a681f4bc00a660b8.jpg",
  retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/59b6320c2bb65324522c35619bc57932.jpg",
  categoryUrl: "/lend-by-category/women"
})`,...(j=(D=c.parameters)==null?void 0:D.docs)==null?void 0:j.source}}};var x,U,T;m.parameters={...m.parameters,docs:{...(x=m.parameters)==null?void 0:x.docs,source:{originalSource:`story({
  tileSize: 'medium',
  categoryName: 'Livestock',
  categoryDescription: "Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",
  numberLoans: 118,
  image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.jpg",
  retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/4b28a0879c81077484e0ed28a18eba23.jpg",
  categoryUrl: "/lend-by-category/livestock"
})`,...(T=(U=m.parameters)==null?void 0:U.docs)==null?void 0:T.source}}};var M,V,H;g.parameters={...g.parameters,docs:{...(M=g.parameters)==null?void 0:M.docs,source:{originalSource:`story({
  tileSize: 'small',
  categoryName: 'Health',
  categoryDescription: "Help families and communities access the medicine, surgeries and healthcare services they need.",
  numberLoans: 79,
  image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4682bd972ac323a6ba8cdc55ea75bd99.jpg",
  retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/3b1616d297b2fd575934568882068ace.jpg",
  categoryUrl: "/lend-by-category/health"
})`,...(H=(V=g.parameters)==null?void 0:V.docs)==null?void 0:H.source}}};var K,E,O;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`manyCategoriesStory({
  tileSize: 'small',
  categoryName: 'Livestock',
  categoryDescription: "Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",
  numberLoans: 118,
  image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.jpg",
  retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/4b28a0879c81077484e0ed28a18eba23.jpg",
  categoryUrl: "/lend-by-category/livestock",
  numberTiles: 3
})`,...(O=(E=d.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};const ke=["Default","Large","Medium","Small","ManyCategories"];export{l as Default,c as Large,d as ManyCategories,m as Medium,g as Small,ke as __namedExportsOrder,be as default};
