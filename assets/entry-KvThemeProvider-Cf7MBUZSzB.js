import{c as r,g as o,M as i,o as a}from"./entry-vue.esm-bundler-gh2KZVgkoT.js";import{_ as s}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const e={props:{theme:{type:Object,default:null}}};function d(n,m,t,l,c,h){return a(),r("div",{style:i({...t.theme,color:"rgb(var(--text-primary))"})},[o(n.$slots,"default")],4)}const u=s(e,[["render",d]]);e.__docgenInfo={description:`A wrapper component that sets CSS custom properties to theme its children.
Most of the time you'll be importing a predefined theme from kv-tokens.`,tags:{usage:[{description:`\`\`\`
import {
  darkTheme,
  darkGreenTheme,
  mintTheme,
  defaultTheme
} from '@kiva/kv-tokens/configs/kivaColors.cjs';
...
data() { return { darkTheme }; }
...
<kv-theme-provider :theme="darkTheme">...</kv-theme-provider>
\`\`\``,title:"usage"}]},exportName:"default",displayName:"KvThemeProvider",props:[{name:"theme",description:`An object containing CSS custom properties set to RGB values.

For custom theming, see all available custom properties set to white in RGB, below`,tags:{usage:[{description:`\`\`\`
{
   --text-primary: '255, 255, 255',
   --text-primary-inverse: '255, 255, 255',
   --text-secondary: '255, 255, 255',
   --text-tertiary: '255, 255, 255',
   --text-action: '255, 255, 255',
   --text-action-highlight: '255, 255, 255',
   --text-danger: '255, 255, 255',
   --text-danger-highlight: '255, 255, 255',

   --bg-primary: '255, 255, 255',
   --bg-primary-inverse: '255, 255, 255',
   --bg-secondary: '255, 255, 255',
   --bg-tertiary: '255, 255, 255',
   --bg-action: '255, 255, 255',
   --bg-action-highlight: '255, 255, 255',
   --bg-danger: '255, 255, 255',
   --bg-danger-highlight: '255, 255, 255',
   --bg-caution: '255, 255, 255',

   --border-primary: '255, 255, 255',
   --border-primary-inverse: '255, 255, 255',
   --border-secondary: '255, 255, 255',
   --border-tertiary: '255, 255, 255',
   --border-action: '255, 255, 255',
   --border-action-highlight: '255, 255, 255',
   --border-danger: '255, 255, 255',
   --border-danger-highlight: '255, 255, 255',

   --heading-underline-primary: url('/kvui/heading-underline.svg#FFFFFF'),
}
\`\`\``,title:"usage"}]},type:{name:"object"},defaultValue:{func:!1,value:"null"}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/node_modules/@kiva/kv-components/dist/components/KvThemeProvider.vue"]};export{u as K};
