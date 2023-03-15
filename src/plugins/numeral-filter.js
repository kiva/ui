import numeral from 'numeral';

export default (value, format = '0', roundingFunction = Math.round) => numeral(value).format(format, roundingFunction);
