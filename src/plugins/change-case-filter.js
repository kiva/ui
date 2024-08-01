import * as changeCase from 'change-case';
import { titleCase } from 'title-case';

const caseMethods = { ...changeCase };
caseMethods.titleCase = titleCase;

export default (value, type = 'no') => caseMethods[type](value);
