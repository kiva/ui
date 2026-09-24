import{M as d}from"./entry-KvLightbox-DVXBz7pz3Z.js";import{g as f}from"./entry-index-CWclSTHHJk.js";import{r as m}from"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import{g as p,a as v}from"./entry-contentfulUtils-BxnXHmGqQJ.js";import{h,o as k,f as g,d as _,e as y,a as b,S}from"./entry-vue.esm-bundler-ED6DvobC3-.js";import{_ as x}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const N=`query salesforceQuery (
	$id: String!,
){
	general {
		salesforceSolution(id: $id) {
			name
			note
		}
	}
}`,D={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"salesforceQuery"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"salesforceSolution"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"note"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:147,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:N}}};async function q(i,o){var e;const{data:n}=await i.query({query:D,variables:{id:o}}),t=((e=n==null?void 0:n.general)==null?void 0:e.salesforceSolution)??null;return t?{title:t.name??"",content:t.note??""}:null}const w=f`query contentfulDefinitions {
	contentful {
		searchEntries(contentKey: "borrower-profile-definitions", contentType: "contentGroup") {
			total
			skip
			limit
			items {
				entryId
				entry
			}
		}
	}
}`;let l=null,a=null;function T(i){function o(){return a||(a=i.query({query:w}).then(t=>{var r;const e=p(t.data);e&&(l=((r=v(e).borrowerProfileDefinitions)==null?void 0:r.contents)??null)}).catch(t=>{throw a=null,t}),a)}async function n({cid:t,sfid:e,forceSalesforce:r=!1}){if(!r){if(l===null)try{await o()}catch{}const s=l==null?void 0:l.find(u=>u.key===t);if(s)return{title:s.name,content:m.documentToHtmlString(s.richText)}}return e?q(i,e):null}return{loadDefinitions:o,resolveDefinition:n}}const c={name:"DefinitionsLightbox",inject:["apollo"],components:{KvLightbox:d},created(){this.definitions=T(this.apollo)},data(){return{visible:!1,title:"",content:""}},methods:{async open({cid:i,sfid:o,forceSalesforce:n=!1,track:t=null}={}){t&&this.$kvTrackEvent(...t);const e=await this.definitions.resolveDefinition({cid:i,sfid:o,forceSalesforce:n});e&&(this.title=e.title??"",this.content=e.content??"",this.visible=!0)},close(){this.visible=!1,setTimeout(()=>{this.visible||(this.title="",this.content="")},500)}}},L=["innerHTML"];function F(i,o,n,t,e,r){const s=h("kv-lightbox");return k(),g(S,{to:"#teleports"},[_(s,{visible:e.visible,title:e.title,onLightboxClosed:r.close},{default:y(()=>[b("div",{innerHTML:e.content,class:"tw-prose"},null,8,L)],void 0),_:1},8,["visible","title","onLightboxClosed"])])}const C=x(c,[["render",F]]);c.__docgenInfo={displayName:"DefinitionsLightbox",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/DefinitionsLightbox.vue"]};C.preFetchOperations=[];export{C as _};
