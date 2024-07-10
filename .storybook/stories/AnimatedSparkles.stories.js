import AnimatedSparkles from '@/components/Thanks/AnimatedSparkles.vue';

export default {
  title: 'Components/AnimatedSparkles',
  component: AnimatedSparkles,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AnimatedSparkles },
  template: '<div class="tw-bg-brand"><animated-sparkles v-bind="$props" /></div>',
});

export const Default = Template.bind({});
Default.args = {
  // Define your default args here. For example:
  // color: 'blue',
  // size: 'large',
};
