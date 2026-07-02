import{K as j}from"./entry-KvResponsiveImage-hIdm9wg8gx.js";import{c as n,k as b,a as v,b as a,t as r,I as R,g as f,j as W,r as B,o}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{_ as F}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{u as K}from"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-tailwind.config-DnDN25xoV6.js";import{w as E}from"./entry-KvGrid-CrG2GQ5mYQ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";const O={name:"MainCategoryTile",props:{tileSize:{type:String,default:"small",validator:t=>["small","medium","large"].indexOf(t)!==-1},categoryName:{type:String,default:""},categoryDescription:{type:String,default:""},numberLoans:{type:Number,default:0},image:{type:String,default:""},retinaImage:{type:String,default:""},categoryUrl:{type:String,default:""}},components:{KvResponsiveImage:j},data(){return{}},computed:{retinaImageExists(){return this.retinaImage!==""},altText(){return`Kiva loans to ${this.categoryName}`},cleanURL(){return this.categoryUrl.substring(this.categoryUrl.lastIndexOf("/")+1)}},methods:{chooseImage(t){return t==="large"?this.retinaImageExists?[["small",this.retinaImage],["small retina",this.retinaImage]]:[["small",this.image]]:t==="medium"?this.retinaImageExists?[["small",this.retinaImage],["small retina",this.retinaImage],["large",this.image],["large retina",this.retinaImage]]:[["small",this.image]]:this.retinaImageExists?[["small",this.image],["small retina",this.retinaImage]]:[["small",this.image]]}}},G={key:0,class:"tw-mb-6 tw-group","data-testid":"all-categories-tiles"},P=["href"],q={class:"tw-text-center tw-flex tw-justify-between"},A={class:"tw-text-title tw-mt-2 tw-mb-2 group-hover:tw-underline"},J={class:"tw-line-clamp-3"},Q={key:0,class:"tw-text-base tw-text-upper tw-mt-1 tw-mb-2 tw-hidden md:tw-block"},X={key:1,class:"tw-mb-6 tw-group","data-testid":"all-categories-tiles"},Y=["href"],Z={class:"tw-flex"},$={class:"tw-mr-2 tw-flex-none"},ee={class:"tw-grow"},ae={class:"tw-text-title tw-mb-2 group-hover:tw-underline"},te={class:"tw-line-clamp-2"},re={class:"tw-text-base tw-text-upper tw-mt-1 tw-mb-1"};function ie(t,i,e,c,ne,s){const h=B("kv-responsive-image"),y=W("kv-track-event");return e.tileSize==="large"||e.tileSize==="medium"?(o(),n("div",G,[b((o(),n("a",{class:"remove-link-decoration",href:`/lend-by-category/${s.cleanURL}`},[v(h,{class:"category-image category-image__large",images:s.chooseImage(e.tileSize),loading:"lazy",alt:s.altText},null,8,["images","alt"]),a("div",null,[a("div",q,[a("h3",A,r(e.categoryName),1),a("h4",{class:R(["tw-text-base tw-text-upper tw-mt-2 tw-mb-2",e.tileSize==="medium"?"md:tw-hidden":""])},r(e.numberLoans)+" loans ",3)]),a("div",null,[a("p",J,r(e.categoryDescription),1)])]),e.tileSize==="medium"?(o(),n("h4",Q,r(e.numberLoans)+" loans ",1)):f("",!0)],8,P)),[[y,["Lending","click-Category",e.categoryName]]])])):e.tileSize==="small"?(o(),n("div",X,[b((o(),n("a",{class:"remove-link-decoration",href:`/lend-by-category/${s.cleanURL}`},[a("div",Z,[a("div",$,[v(h,{class:"category-image category-image__small",images:s.chooseImage(e.tileSize),loading:"lazy",alt:s.altText},null,8,["images","alt"])]),a("div",ee,[a("h3",ae,r(e.categoryName),1),a("div",null,[a("span",te,r(e.categoryDescription),1)]),a("h4",re,r(e.numberLoans)+" loans ",1)])])],8,Y)),[[y,["Lending","click-Category",e.categoryName]]])])):f("",!0)}const p=F(O,[["render",ie],["__scopeId","data-v-be19aba0"]]);O.__docgenInfo={displayName:"MainCategoryTile",exportName:"default",description:"",tags:{},props:[{name:"tileSize",type:{name:"string"},defaultValue:{func:!1,value:"'small'"}},{name:"categoryName",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"categoryDescription",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"numberLoans",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"image",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"retinaImage",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"categoryUrl",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Categories/MainCategoryTile.vue"]};const Se={title:"Components/Main Category Tile",component:p,args:{tileSize:"small",numberTiles:3},argTypes:{tileSize:{control:{type:"select"},options:["small","medium","large"]}}},w=(t={})=>{const i=(e,{argTypes:c})=>({props:Object.keys(c),components:{MainCategoryTile:p,KvGrid:E,KvPageContainer:K},setup(){return t},template:`
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
        `});return i.args=t,i},se=(t={})=>{const i=(e,{argTypes:c})=>({props:Object.keys(c),components:{MainCategoryTile:p,KvGrid:E,KvPageContainer:K},setup(){return t},template:`
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
        `});return i.args=t,i},m=w({tileSize:"small",categoryName:"Food",categoryDescription:"These borrowers are fueling their communities with food (and love) at markets, small grocery stores and restaurants.",numberLoans:1913,image:"https://www.kiva.org/img/w313h176/ad03fb699615d7ea3061dd80220100c2.webp",retinaImage:"https://www.kiva.org/img/w626h352/2b5c9493edddac4fe3210cddb930ec47.webp",categoryUrl:"/lend-by-category/food"}),l=w({tileSize:"large",categoryName:"Women",categoryDescription:"Worldwide, women have much less economic opportunity, security, and freedom. Support women starting their own businesses, going to school, and investing in the health of their communities and families.",numberLoans:6216,image:"https://www.kiva.org/img/w313h176/bd25843149e68a42a681f4bc00a660b8.webp",retinaImage:"https://www.kiva.org/img/w626h352/59b6320c2bb65324522c35619bc57932.webp",categoryUrl:"/lend-by-category/women"}),g=w({tileSize:"medium",categoryName:"Livestock",categoryDescription:"Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",numberLoans:118,image:"https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",retinaImage:"https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",categoryUrl:"/lend-by-category/livestock"}),d=w({tileSize:"small",categoryName:"Health",categoryDescription:"Help families and communities access the medicine, surgeries and healthcare services they need.",numberLoans:79,image:"https://www.kiva.org/img/w313h176/4682bd972ac323a6ba8cdc55ea75bd99.webp",retinaImage:"https://www.kiva.org/img/w626h352/3b1616d297b2fd575934568882068ace.webp",categoryUrl:"/lend-by-category/health"}),u=se({tileSize:"small",categoryName:"Livestock",categoryDescription:"Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",numberLoans:118,image:"https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",retinaImage:"https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",categoryUrl:"/lend-by-category/livestock",numberTiles:3});var k,_,S;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`story({
  tileSize: 'small',
  categoryName: 'Food',
  categoryDescription: "These borrowers are fueling their communities with food (and love) at markets, small grocery stores and restaurants.",
  numberLoans: 1913,
  image: "https://www.kiva.org/img/w313h176/ad03fb699615d7ea3061dd80220100c2.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/2b5c9493edddac4fe3210cddb930ec47.webp",
  categoryUrl: "/lend-by-category/food"
})`,...(S=(_=m.parameters)==null?void 0:_.docs)==null?void 0:S.source}}};var I,L,x;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  tileSize: 'large',
  categoryName: 'Women',
  categoryDescription: "Worldwide, women have much less economic opportunity, security, and freedom. Support women starting their own businesses, going to school, and investing in the health of their communities and families.",
  numberLoans: 6216,
  image: "https://www.kiva.org/img/w313h176/bd25843149e68a42a681f4bc00a660b8.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/59b6320c2bb65324522c35619bc57932.webp",
  categoryUrl: "/lend-by-category/women"
})`,...(x=(L=l.parameters)==null?void 0:L.docs)==null?void 0:x.source}}};var z,N,C;g.parameters={...g.parameters,docs:{...(z=g.parameters)==null?void 0:z.docs,source:{originalSource:`story({
  tileSize: 'medium',
  categoryName: 'Livestock',
  categoryDescription: "Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",
  numberLoans: 118,
  image: "https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",
  categoryUrl: "/lend-by-category/livestock"
})`,...(C=(N=g.parameters)==null?void 0:N.docs)==null?void 0:C.source}}};var D,U,T;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`story({
  tileSize: 'small',
  categoryName: 'Health',
  categoryDescription: "Help families and communities access the medicine, surgeries and healthcare services they need.",
  numberLoans: 79,
  image: "https://www.kiva.org/img/w313h176/4682bd972ac323a6ba8cdc55ea75bd99.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/3b1616d297b2fd575934568882068ace.webp",
  categoryUrl: "/lend-by-category/health"
})`,...(T=(U=d.parameters)==null?void 0:U.docs)==null?void 0:T.source}}};var M,V,H;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`manyCategoriesStory({
  tileSize: 'small',
  categoryName: 'Livestock',
  categoryDescription: "Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",
  numberLoans: 118,
  image: "https://www.kiva.org/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.webp",
  retinaImage: "https://www.kiva.org/img/w626h352/4b28a0879c81077484e0ed28a18eba23.webp",
  categoryUrl: "/lend-by-category/livestock",
  numberTiles: 3
})`,...(H=(V=u.parameters)==null?void 0:V.docs)==null?void 0:H.source}}};const Ie=["Default","Large","Medium","Small","ManyCategories"];export{m as Default,l as Large,u as ManyCategories,g as Medium,d as Small,Ie as __namedExportsOrder,Se as default};
