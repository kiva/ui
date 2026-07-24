import{L as e}from"./entry-LoanProgress-ncvHoFD7g4.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-index-CWclSTHHJk.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const ve={title:"Components/BorrowerProfile/LoanProgress",component:e,parameters:{docs:{description:{component:`LoanProgress renders in both FullBorrowerProfile and MinimalBorrowerProfile.

Public statuses:  fundraising, funded (virtual), expired, refunded
Privileged-only:  raised, payingBack, ended, defaulted, inactive,
                  inactiveExpired, reviewed, deleted, issue`}}}},s=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="fundraising"
            :progress-percent="0.75"
            money-left="250.00"
            time-left="5 days"
            :loading="false"
            :loan-id="123"
        />
    `}),n=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="funded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `});n.storyName="Funded / Raised";const r=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="expired"
            :progress-percent="0.65"
            money-left="350.00"
            :loading="false"
            :loan-id="123"
        />
    `}),a=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactive"
            :progress-percent="0"
            money-left="600.00"
            :loading="false"
            :loan-id="123"
        />
    `}),t=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="pfp"
            :progress-percent="0.5"
            money-left="500.00"
            time-left="12 days"
            :loading="false"
            :loan-id="123"
            :number-of-lenders="350"
            :pfp-min-lenders="700"
        />
    `}),l=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="payingBack"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    `}),o=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="payingBack"
            :is-delinquent="true"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    `});o.storyName="Paying Back / Delinquent";const p=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="ended"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `}),d=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="defaulted"
            :progress-percent="0.45"
            money-left="550.00"
            :loading="false"
            :loan-id="123"
        />
    `}),i=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="refunded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `}),c=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactiveExpired"
            :progress-percent="0"
            money-left="500.00"
            :loading="false"
            :loan-id="123"
        />
    `}),m=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),g=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="deleted"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),u=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="issue"
            :progress-percent="0.20"
            money-left="800.00"
            :loading="false"
            :loan-id="123"
        />
    `}),f=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    `});var y,P,L;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="fundraising"
            :progress-percent="0.75"
            money-left="250.00"
            time-left="5 days"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(L=(P=s.parameters)==null?void 0:P.docs)==null?void 0:L.source}}};var v,S,B;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="funded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(B=(S=n.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var x,k,E;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="expired"
            :progress-percent="0.65"
            money-left="350.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(E=(k=r.parameters)==null?void 0:k.docs)==null?void 0:E.source}}};var w,F,D;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="inactive"
            :progress-percent="0"
            money-left="600.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(D=(F=a.parameters)==null?void 0:F.docs)==null?void 0:D.source}}};var R,I,q;t.parameters={...t.parameters,docs:{...(R=t.parameters)==null?void 0:R.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="pfp"
            :progress-percent="0.5"
            money-left="500.00"
            time-left="12 days"
            :loading="false"
            :loan-id="123"
            :number-of-lenders="350"
            :pfp-min-lenders="700"
        />
    \`
})`,...(q=(I=t.parameters)==null?void 0:I.docs)==null?void 0:q.source}}};var b,_,N;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="payingBack"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(N=(_=l.parameters)==null?void 0:_.docs)==null?void 0:N.source}}};var h,C,M;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="payingBack"
            :is-delinquent="true"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(M=(C=o.parameters)==null?void 0:C.docs)==null?void 0:M.source}}};var O,j,z;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="ended"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(z=(j=p.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var A,G,H;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="defaulted"
            :progress-percent="0.45"
            money-left="550.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(H=(G=d.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,Q;i.parameters={...i.parameters,docs:{...(J=i.parameters)==null?void 0:J.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="refunded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(Q=(K=i.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var T,U,V;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="inactiveExpired"
            :progress-percent="0"
            money-left="500.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(V=(U=c.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var W,X,Y;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(Y=(X=m.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,ee;g.parameters={...g.parameters,docs:{...(Z=g.parameters)==null?void 0:Z.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="deleted"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(ee=($=g.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var ne,oe,se;u.parameters={...u.parameters,docs:{...(ne=u.parameters)==null?void 0:ne.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="issue"
            :progress-percent="0.20"
            money-left="800.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(se=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:se.source}}};var re,ae,te;f.parameters={...f.parameters,docs:{...(re=f.parameters)==null?void 0:re.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    \`
})`,...(te=(ae=f.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};const Se=["Fundraising","FundedRaised","Expired","Inactive","PrivateFundraisingPeriod","PayingBack","PayingBackDelinquent","Ended","Defaulted","Refunded","InactiveExpired","Reviewed","Deleted","Issue","Loading"];export{d as Defaulted,g as Deleted,p as Ended,r as Expired,n as FundedRaised,s as Fundraising,a as Inactive,c as InactiveExpired,u as Issue,f as Loading,l as PayingBack,o as PayingBackDelinquent,t as PrivateFundraisingPeriod,i as Refunded,m as Reviewed,Se as __namedExportsOrder,ve as default};
