import{z as t,v as o,C as l}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{l as u}from"./entry-logFormatter-DhjghUk5Me.js";const d=`query userId {
	my {
		id
		userAccount {
			id
		}
	}
}
`,m={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"userId"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userAccount"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:95,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:d}}};function f(a){const i=t(!1),n=t(!1),s=async()=>{await a.query({query:m}).then(({data:e})=>{n.value=(e==null?void 0:e.my)??null}).catch(e=>{u(e,"useMyKivaHome composable")})},r=o(()=>i.value?"/mykiva":"/"),c=o(()=>i.value?"/mykiva":"/portfolio");return l(async()=>{var e;await s(),i.value=((e=n.value)==null?void 0:e.id)||!1}),{homePagePath:r,portfolioPath:c}}export{f as u};
