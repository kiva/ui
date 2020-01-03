import * as changeCase from 'change-case';

export default (value, type = 'no') => changeCase[type](value);
