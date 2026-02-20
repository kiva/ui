import{K as i}from"./entry-KvLightbox-JLv-P5W0bg.js";import{_ as g}from"./entry-KvButton-C9WvITgRyG.js";import"./entry-vue-focus-lock-CNihYe2Wyn.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvIcon-BUhAos7YaB.js";import"./iframe-Cc_r_Bkf.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-lock-scroll-Bww220JhDP.js";const m=`
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.
    </p>
    <p>
        Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Sed odio morbi quis commodo odio aenean. Et tortor at risus viverra. Bibendum enim facilisis gravida neque. Ut tellus elementum sagittis vitae et leo duis. Aliquet lectus proin nibh nisl condimentum id venenatis a condimentum. Et malesuada fames ac turpis egestas integer eget aliquet. In hac habitasse platea dictumst quisque. Dignissim cras tincidunt lobortis feugiat. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Quam nulla porttitor massa id. Ac tortor dignissim convallis aenean et tortor at risus. Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Vitae aliquet nec ullamcorper sit amet. Ornare arcu odio ut sem nulla. Viverra orci sagittis eu volutpat odio. Ut venenatis tellus in metus. Amet justo donec enim diam.
    </p>
    <p>
        Amet risus nullam eget felis eget nunc. Mollis nunc sed id semper risus. Et magnis dis parturient montes. Ipsum dolor sit amet consectetur adipiscing elit. Nam aliquam sem et tortor consequat id porta nibh venenatis. Nibh venenatis cras sed felis eget velit. Volutpat blandit aliquam etiam erat. Mauris augue neque gravida in fermentum et sollicitudin. Tempor nec feugiat nisl pretium. Faucibus pulvinar elementum integer enim. Bibendum neque egestas congue quisque egestas diam. Nunc sed velit dignissim sodales ut eu sem integer vitae. Odio ut enim blandit volutpat maecenas volutpat blandit. In mollis nunc sed id. Cras adipiscing enim eu turpis egestas pretium aenean pharetra. Mi eget mauris pharetra et ultrices neque ornare aenean euismod. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien.
    </p>
    <p>
        Habitant morbi tristique senectus et netus et. Nullam eget felis eget nunc lobortis mattis aliquam. Nunc consequat interdum varius sit amet mattis vulputate enim. Mattis vulputate enim nulla aliquet porttitor. Scelerisque purus semper eget duis at tellus. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan. Facilisi cras fermentum odio eu feugiat pretium. Elementum sagittis vitae et leo. Duis ut diam quam nulla porttitor. Id leo in vitae turpis massa. Ultricies tristique nulla aliquet enim tortor at auctor urna nunc. Viverra mauris in aliquam sem fringilla ut morbi tincidunt augue. Sed augue lacus viverra vitae congue. Semper eget duis at tellus at urna condimentum. Sagittis aliquam malesuada bibendum arcu. Etiam dignissim diam quis enim lobortis scelerisque. Sit amet venenatis urna cursus eget nunc scelerisque viverra. Dignissim enim sit amet venenatis urna cursus eget.
    </p>
`,t={visible:!0,preventClose:!1,title:"Test Title",inverted:!1,noPaddingTop:!1,noPaddingBottom:!1,noPaddingSides:!1},U={title:"Kv/KvLightbox",component:i,args:t},n=(o,{argTypes:e})=>({components:{KvLightbox:i},props:Object.keys(e),data:()=>({lightboxVisible:!1}),methods:{showLightbox(){this.lightboxVisible=!0},hideLightbox(){this.lightboxVisible=!1}},setup(){return o},template:`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
                @lightbox-closed="hideLightbox"
            >
                ${m}
            </kv-lightbox>
        </div>
    `}),s=n.bind({});s.args={...t,inverted:!0};const a=n.bind({});a.args={...t,preventClose:!0};const l=n.bind({});l.args={...t,noPaddingTop:!0,noPaddingBottom:!0,noPaddingSides:!0};const r=(o,{argTypes:e})=>({components:{KvLightbox:i,KvButton:g},props:Object.keys(e),setup(){return t},template:`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
            >
                <p>Small amount of content</p>
                <template #controls>
                    <kv-button>Button 1</kv-button>
                    <kv-button>Button 2</kv-button>
                </template>
            </kv-lightbox>
        </div>
    `}),d=(o,{argTypes:e})=>({components:{KvLightbox:i,KvButton:g},props:Object.keys(e),setup(){return t},template:`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
            >
                ${m}
                <template #controls>
                    <kv-button>Button 1</kv-button>
                    <kv-button>Button 2</kv-button>
                </template>
            </kv-lightbox>
        </div>
    `}),u=(o,{argTypes:e})=>({components:{KvLightbox:i,KvButton:g},props:Object.keys(e),setup(){return t},template:`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
            >
                <p>Hi, I'm outside the grid</p>
                <div class="row">
                    <div class="small-12 large-6 columns">
                        <b>Grid, Full mobile, half large</b>
                    </div>
                    <div class="small-12 large-6 columns">
                        <b>Grid, Full mobile, half large</b>

                        <div class="row">
                            <div class="small-12 large-6 columns">
                                <b>Nested Grid, Full mobile, half large</b>
                            </div>
                            <div class="small-12 large-6 columns">
                                <b>Nested Grid, Full mobile, half large</b>
                            </div>
                        </div>
                    </div>
                </div>
                ${m}
                <template #controls>
                    <kv-button>Button 1</kv-button>
                    <kv-button>Button 2</kv-button>
                </template>
            </kv-lightbox>
        </div>
    `}),p=(o,{argTypes:e})=>({components:{KvLightbox:i},props:Object.keys(e),setup(){return t},template:`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
                style="--kv-lightbox-title-color: blue"
            >
                ${m}
            </kv-lightbox>
        </div>
    `});var v,b,c;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    KvLightbox
  },
  props: Object.keys(argTypes),
  data: () => ({
    lightboxVisible: false
  }),
  methods: {
    showLightbox() {
      this.lightboxVisible = true;
    },
    hideLightbox() {
      this.lightboxVisible = false;
    }
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
                @lightbox-closed="hideLightbox"
            >
                \${loremIpsum}
            </kv-lightbox>
        </div>
    \`
})`,...(c=(b=n.parameters)==null?void 0:b.docs)==null?void 0:c.source}}};var h,x,k;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    KvLightbox
  },
  props: Object.keys(argTypes),
  data: () => ({
    lightboxVisible: false
  }),
  methods: {
    showLightbox() {
      this.lightboxVisible = true;
    },
    hideLightbox() {
      this.lightboxVisible = false;
    }
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
                @lightbox-closed="hideLightbox"
            >
                \${loremIpsum}
            </kv-lightbox>
        </div>
    \`
})`,...(k=(x=s.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};var f,P,q;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    KvLightbox
  },
  props: Object.keys(argTypes),
  data: () => ({
    lightboxVisible: false
  }),
  methods: {
    showLightbox() {
      this.lightboxVisible = true;
    },
    hideLightbox() {
      this.lightboxVisible = false;
    }
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
                @lightbox-closed="hideLightbox"
            >
                \${loremIpsum}
            </kv-lightbox>
        </div>
    \`
})`,...(q=(P=a.parameters)==null?void 0:P.docs)==null?void 0:q.source}}};var T,B,S;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    KvLightbox
  },
  props: Object.keys(argTypes),
  data: () => ({
    lightboxVisible: false
  }),
  methods: {
    showLightbox() {
      this.lightboxVisible = true;
    },
    hideLightbox() {
      this.lightboxVisible = false;
    }
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
                @lightbox-closed="hideLightbox"
            >
                \${loremIpsum}
            </kv-lightbox>
        </div>
    \`
})`,...(S=(B=l.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};var y,C,L;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  components: {
    KvLightbox,
    KvButton
  },
  props: Object.keys(argTypes),
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
            >
                <p>Small amount of content</p>
                <template #controls>
                    <kv-button>Button 1</kv-button>
                    <kv-button>Button 2</kv-button>
                </template>
            </kv-lightbox>
        </div>
    \`
})`,...(L=(C=r.parameters)==null?void 0:C.docs)==null?void 0:L.source}}};var K,V,I;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  components: {
    KvLightbox,
    KvButton
  },
  props: Object.keys(argTypes),
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
            >
                \${loremIpsum}
                <template #controls>
                    <kv-button>Button 1</kv-button>
                    <kv-button>Button 2</kv-button>
                </template>
            </kv-lightbox>
        </div>
    \`
})`,...(I=(V=d.parameters)==null?void 0:V.docs)==null?void 0:I.source}}};var O,j,_;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  components: {
    KvLightbox,
    KvButton
  },
  props: Object.keys(argTypes),
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
            >
                <p>Hi, I'm outside the grid</p>
                <div class="row">
                    <div class="small-12 large-6 columns">
                        <b>Grid, Full mobile, half large</b>
                    </div>
                    <div class="small-12 large-6 columns">
                        <b>Grid, Full mobile, half large</b>

                        <div class="row">
                            <div class="small-12 large-6 columns">
                                <b>Nested Grid, Full mobile, half large</b>
                            </div>
                            <div class="small-12 large-6 columns">
                                <b>Nested Grid, Full mobile, half large</b>
                            </div>
                        </div>
                    </div>
                </div>
                \${loremIpsum}
                <template #controls>
                    <kv-button>Button 1</kv-button>
                    <kv-button>Button 2</kv-button>
                </template>
            </kv-lightbox>
        </div>
    \`
})`,...(_=(j=u.parameters)==null?void 0:j.docs)==null?void 0:_.source}}};var F,E,$;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  components: {
    KvLightbox
  },
  props: Object.keys(argTypes),
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-lightbox
                :visible="visible"
                :inverted="inverted"
                :prevent-close="preventClose"
                :title="title"
                :no-padding-top="noPaddingTop"
                :no-padding-bottom="noPaddingBottom"
                :no-padding-sides="noPaddingSides"
                style="--kv-lightbox-title-color: blue"
            >
                \${loremIpsum}
            </kv-lightbox>
        </div>
    \`
})`,...($=(E=p.parameters)==null?void 0:E.docs)==null?void 0:$.source}}};const Q=["Default","Inverted","PreventClose","Padding","SmallContent","WithControls","WithFoundationGrid","CustomTitleColor"];export{p as CustomTitleColor,n as Default,s as Inverted,l as Padding,a as PreventClose,r as SmallContent,d as WithControls,u as WithFoundationGrid,Q as __namedExportsOrder,U as default};
