import{g as f}from"./entry-index-CWclSTHHJk.js";import{c as p,d as m,h as s,o as u}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import{_ as y}from"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-numeral-xVHG5DEP0A.js";import{K as _}from"./entry-KvMap-BB1e8Wen8j.js";import{C as g}from"./entry-CountryInfo-C-4flwwrdA.js";import{_ as h}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const c={name:"BorrowerCountry",inject:["apollo","cookieStore"],components:{CountryInfo:g,KvLoadingPlaceholder:y,KvMap:_},props:{loanId:{type:Number,default:0}},data(){return{mapZoomLevel:5,mapInitialZoom:4,mapAutoZoomDelay:500,mapAspectRatio:1.3,mapLat:null,mapLong:null,loading:!0}},apollo:{lazy:!0,query:f`query borrowerCountryCoords($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					geocode {
						latitude
						longitude
						country {
							id
							geocode {
								latitude
								longitude
							}
						}
					}
				}
			}
		}`,variables(){return{loanId:this.loanId}},result({data:e}){var n,r,t,i,l,a;const o=(r=(n=e==null?void 0:e.lend)==null?void 0:n.loan)==null?void 0:r.geocode;this.mapLat=(o==null?void 0:o.latitude)??null,this.mapLong=(o==null?void 0:o.longitude)??null,(!this.mapLat||!this.mapLong)&&(this.mapLat=((i=(t=o==null?void 0:o.country)==null?void 0:t.geocode)==null?void 0:i.latitude)??null,this.mapLong=((a=(l=o==null?void 0:o.country)==null?void 0:l.geocode)==null?void 0:a.longitude)??null),this.loading=!1}}},v={key:0},w={key:1};function L(e,o,n,r,t,i){const l=s("KvLoadingPlaceholder"),a=s("kv-map"),d=s("country-info");return t.loading?(u(),p("article",v,[m(l,{class:"tw-w-full tw-h-full tw-mt-2",style:{"aspect-ratio":"8 / 5"}})])):(u(),p("article",w,[m(a,{"data-testid":"bp-country-map",class:"tw-rounded tw-overflow-hidden tw-mb-6","auto-zoom-delay":t.mapAutoZoomDelay,"aspect-ratio":t.mapAspectRatio,lat:t.mapLat,long:t.mapLong,"zoom-level":t.mapZoomLevel,"initial-zoom":t.mapInitialZoom},null,8,["auto-zoom-delay","aspect-ratio","lat","long","zoom-level","initial-zoom"]),m(d,{"loan-id":n.loanId},null,8,["loan-id"])]))}const x=h(c,[["render",L]]);c.__docgenInfo={displayName:"BorrowerCountry",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/BorrowerCountry.vue"]};export{x as B};
