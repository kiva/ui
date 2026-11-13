import{r as w,f as u,a as L,b as q}from"./entry-contentfulUtils-BhgUSuS-pN.js";import{r as _}from"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";function E(e){return JSON.stringify(e).replace(/'/g,"\\'").replace(/"/g,"'")}function M(e){var h,p,g,x;if(e){const r=e==null?void 0:e.content,a=r[r.length-1],i={...e};return a.nodeType==="paragraph"&&Object.keys(a.data).length===0&&a.content.length===1&&((p=(h=a.content)==null?void 0:h[0])==null?void 0:p.value)===""&&((x=(g=a.content)==null?void 0:g[0])==null?void 0:x.nodeType)==="text"&&(i.content=i.content.slice(0,-1)),i}return e}function H(e){const h=r=>{var k,v,$,R,T,d,m,l,n,S;const a=(k=r==null?void 0:r.file)==null?void 0:k.contentType.includes("video");return((v=r==null?void 0:r.file)==null?void 0:v.contentType.includes("image"))?`
			<kv-contentful-img
				class="tw-whitespace-normal"
				contentful-src="${encodeURI(($=r==null?void 0:r.file)==null?void 0:$.url)}"
				alt="${r==null?void 0:r.description}"
				height="${(d=(T=(R=r==null?void 0:r.file)==null?void 0:R.details)==null?void 0:T.image)==null?void 0:d.height}"
				width="${(n=(l=(m=r==null?void 0:r.file)==null?void 0:m.details)==null?void 0:l.image)==null?void 0:n.width}"/>
			`:a?`
			<video
				:src="${encodeURI((S=r==null?void 0:r.file)==null?void 0:S.url)}"
				autoplay
				loop
				muted
				playsinline
			></video>`:""},p=r=>{var T,d,m,l,n,S,I,y,D;const a=(n=(l=(m=(d=(T=r==null?void 0:r.data)==null?void 0:T.target)==null?void 0:d.sys)==null?void 0:m.contentType)==null?void 0:l.sys)==null?void 0:n.id,i=(S=r==null?void 0:r.data)==null?void 0:S.target,k=a==="richTextContent",v=a==="button",$=a==="responsiveImageSet",R=((I=i==null?void 0:i.fields)==null?void 0:I.type)==="frequentlyAskedQuestions";if(k)return`<div>${H((y=i==null?void 0:i.fields)==null?void 0:y.richText)}</div>`;if(v)return`<button-wrapper class="tw-whitespace-normal" :content="${E(i==null?void 0:i.fields)}" />`;if($){const s=u(i),o=L(s),B=E(o);return`<kv-contentful-img
						class="tw-whitespace-normal"
						contentful-src="${encodeURI(o[0].url)}"
						width="${o[0].width}"
						height="${o[0].height}"
						fallback-format="jpg"
						alt="${s==null?void 0:s.description}"
						:source-sizes="${B}" />`}if(R){const s=q((D=i==null?void 0:i.fields)==null?void 0:D.contents).filter(o=>o.contentType==="richTextContent");return`<kv-frequently-asked-questions
						:questions="${E(s)}"
					/>`}return""},g={renderNode:{[w.INLINES.EMBEDDED_ENTRY]:r=>p(r),[w.BLOCKS.EMBEDDED_ENTRY]:r=>p(r),[w.BLOCKS.EMBEDDED_ASSET]:r=>{var a,i;return h((i=(a=r==null?void 0:r.data)==null?void 0:a.target)==null?void 0:i.fields)}}},x=M(e);return _.documentToHtmlString(x,g)}function F(e,h){if(e&&(h!=null&&h.enableBlankTargetLinks)){const p=e.querySelectorAll("a");p.length>0&&Array.prototype.forEach.call(p,g=>{g.target="_blank"})}}export{F as a,H as r};
