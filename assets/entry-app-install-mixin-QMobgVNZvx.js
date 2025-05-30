import{_ as i}from"./entry-get-BUjo_hX5jl.js";import{c as d}from"./entry-injectionCheck-7gO_RAaPL1.js";import{l as r}from"./entry-logReadQueryError-Codcl0QZ_g.js";const l=`query appInstall($basketId: String) {
	shop (basketId: $basketId) {
		id
		basket {
			id
			hasFreeCredits
		}
		lendingRewardOffered
	}
}


`,o={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"appInstall"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basket"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"hasFreeCredits"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"lendingRewardOffered"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:180,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:l}}},c=["apollo","cookieStore"],k={head(){return{meta:this.showBanner?[{name:"apple-itunes-app",content:"app-id=1453093374"}]:[]}},data(){return{appInstallHasFreeCredits:!1,appInstallLendingRewardOffered:!1}},computed:{showBanner(){if(this.appInstallHasFreeCredits||this.appInstallLendingRewardOffered)return!1;const e=this.$route,n=["start","portfolio","lend","lend-by-category","about"],t=["upc","promo_code","lending_reward"];let a=!1;return(n.includes(e.path.split("/")[1])||e.path==="/")&&(a=!0,Object.keys(e.query).forEach(s=>{t.includes(s)&&(a=!1)})),a}},created(){d(this,c);try{const e=this.apollo.readQuery({query:o,variables:{basketId:this.cookieStore.get("kvbskt")}});this.appInstallHasFreeCredits=i(e,"shop.basket.hasFreeCredits"),this.appInstallLendingRewardOffered=i(e,"shop.lendingRewardOffered")}catch(e){r(e,"app-install-mixin")}},mounted(){this.showBanner||window.addEventListener("beforeinstallprompt",e=>{e.preventDefault()})}};export{k as a};
