import MyKivaProgressCard from '#src/components/MyKiva/MyKivaProgressCard.vue';
import { ID_BASIC_NEEDS, ID_CLIMATE_ACTION, ID_REFUGEE_EQUALITY, ID_US_ECONOMIC_EQUALITY, ID_WOMENS_EQUALITY } from '../../src/composables/useBadgeData';

export default {
  title: 'MyKiva/MyKivaProgressCard',
  component: MyKivaProgressCard,
};

const story = (args = {}) => {
  const template = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MyKivaProgressCard },
    setup() { return { args }; },
    template: `
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${args.height ? `height: ${args.height}px;` : ''}" />
      </div>
    `,
  });
  template.args = args;
  return template;
};

export const Default = story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 0,
  isAnnualGoal: true,
});

export const InProgressGoal = story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 38,
  isAnnualGoal: true,
});

export const CompletedGoal = story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 100,
  isAnnualGoal: true,
});


export const AchievementWomen = story({
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
  },
  goalProgress: 0,
});


export const AchievementWomenInProgress = story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20,
  },
  goalProgress: 4,
});


export const AchievementWomenCompleted = story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 1200,
  },
  goalProgress: 5,
});

export const AchievementRefugees = story({
  goal: {
    target: 10,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
  },
  goalProgress: 0,
});


export const AchievementRefugeesInProgress = story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20,
  },
  goalProgress: 3,
});


export const AchievementRefugeesCompleted = story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200,
  },
  goalProgress: 5,
});

export const AchievementClimateAction = story({
  goal: {
    target: 10,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 1,
    totalLoans: 0,
  },
  goalProgress: 0,
});


export const AchievementClimateActionInProgress = story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 10,
    totalLoans: 20,
  },
  goalProgress: 3,
});


export const AchievementClimateActionCompleted = story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200,
  },
  goalProgress: 5,
});

export const AchievementBasicNeeds = story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0,
  },
  goalProgress: 0,
});


export const AchievementBasicNeedsInProgress = story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20,
  },
  goalProgress: 3,
});


export const AchievementBasicNeedsCompleted = story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200,
  },
  goalProgress: 5,
});


export const AchievementUSBusiness = story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
  },
  goalProgress: 0,
});


export const AchievementUSBusinessInProgress = story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20,
  },
  goalProgress: 3,
});


export const AchievementUSBusinessCompleted = story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200,
  },
  goalProgress: 5,
});

