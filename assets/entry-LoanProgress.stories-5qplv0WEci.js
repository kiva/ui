import{L as e}from"./entry-LoanProgress-CuN5ok6BYw.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-index-CWclSTHHJk.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const Ee={title:"Components/BorrowerProfile/LoanProgress",component:e,parameters:{docs:{description:{component:`LoanProgress renders in both FullBorrowerProfile and MinimalBorrowerProfile.

Public statuses:  fundraising, funded (virtual), expired, refunded
Privileged-only:  raised, payingBack, ended, defaulted, inactive,
                  inactiveExpired, reviewed, deleted, issue`}}}},r=()=>({components:{LoanProgress:e},template:`
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
    `});n.storyName="Funded / Raised";const a=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="expired"
            :progress-percent="0.65"
            money-left="350.00"
            :loading="false"
            :loan-id="123"
        />
    `}),t=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactive"
            :progress-percent="0"
            money-left="600.00"
            :loading="false"
            :loan-id="123"
        />
    `}),l=()=>({components:{LoanProgress:e},template:`
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
    `}),p=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="payingBack"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    `}),s=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="payingBack"
            :is-delinquent="true"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    `});s.storyName="Paying Back / Delinquent";const d=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="ended"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `}),o=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="ended"
            :has-currency-exchange-loss="true"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `});o.storyName="Ended / Currency Loss";const c=()=>({components:{LoanProgress:e},template:`
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
    `}),m=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactiveExpired"
            :progress-percent="0"
            money-left="500.00"
            :loading="false"
            :loan-id="123"
        />
    `}),g=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),u=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="deleted"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),f=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="issue"
            :progress-percent="0.20"
            money-left="800.00"
            :loading="false"
            :loan-id="123"
        />
    `}),y=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    `});var P,L,v;r.parameters={...r.parameters,docs:{...(P=r.parameters)==null?void 0:P.docs,source:{originalSource:`() => ({
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
})`,...(v=(L=r.parameters)==null?void 0:L.docs)==null?void 0:v.source}}};var S,x,B;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
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
})`,...(B=(x=n.parameters)==null?void 0:x.docs)==null?void 0:B.source}}};var E,k,w;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`() => ({
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
})`,...(w=(k=a.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var F,h,D;t.parameters={...t.parameters,docs:{...(F=t.parameters)==null?void 0:F.docs,source:{originalSource:`() => ({
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
})`,...(D=(h=t.parameters)==null?void 0:h.docs)==null?void 0:D.source}}};var R,I,q;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`() => ({
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
})`,...(q=(I=l.parameters)==null?void 0:I.docs)==null?void 0:q.source}}};var b,C,N;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`() => ({
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
})`,...(N=(C=p.parameters)==null?void 0:C.docs)==null?void 0:N.source}}};var _,W,M;s.parameters={...s.parameters,docs:{...(_=s.parameters)==null?void 0:_.docs,source:{originalSource:`() => ({
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
})`,...(M=(W=s.parameters)==null?void 0:W.docs)==null?void 0:M.source}}};var O,j,z;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`() => ({
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
})`,...(z=(j=d.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var A,G,H;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="ended"
            :has-currency-exchange-loss="true"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(H=(G=o.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,Q;c.parameters={...c.parameters,docs:{...(J=c.parameters)==null?void 0:J.docs,source:{originalSource:`() => ({
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
})`,...(Q=(K=c.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var T,U,V;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`() => ({
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
})`,...(V=(U=i.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var X,Y,Z;m.parameters={...m.parameters,docs:{...(X=m.parameters)==null?void 0:X.docs,source:{originalSource:`() => ({
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
})`,...(Z=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,ee,ne;g.parameters={...g.parameters,docs:{...($=g.parameters)==null?void 0:$.docs,source:{originalSource:`() => ({
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
})`,...(ne=(ee=g.parameters)==null?void 0:ee.docs)==null?void 0:ne.source}}};var se,oe,re;u.parameters={...u.parameters,docs:{...(se=u.parameters)==null?void 0:se.docs,source:{originalSource:`() => ({
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
})`,...(re=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:re.source}}};var ae,te,le;f.parameters={...f.parameters,docs:{...(ae=f.parameters)==null?void 0:ae.docs,source:{originalSource:`() => ({
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
})`,...(le=(te=f.parameters)==null?void 0:te.docs)==null?void 0:le.source}}};var pe,de,ce;y.parameters={...y.parameters,docs:{...(pe=y.parameters)==null?void 0:pe.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    \`
})`,...(ce=(de=y.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};const ke=["Fundraising","FundedRaised","Expired","Inactive","PrivateFundraisingPeriod","PayingBack","PayingBackDelinquent","Ended","EndedWithCurrencyLoss","Defaulted","Refunded","InactiveExpired","Reviewed","Deleted","Issue","Loading"];export{c as Defaulted,u as Deleted,d as Ended,o as EndedWithCurrencyLoss,a as Expired,n as FundedRaised,r as Fundraising,t as Inactive,m as InactiveExpired,f as Issue,y as Loading,p as PayingBack,s as PayingBackDelinquent,l as PrivateFundraisingPeriod,i as Refunded,g as Reviewed,ke as __namedExportsOrder,Ee as default};
