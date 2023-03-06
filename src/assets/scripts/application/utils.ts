/**
 * Set screen match media stats for qvp
 */
export function ssm (options: { [size: string]: string }) {

  const states = [];

  for (const id in options)  states.push({ id, query: options[id] });

  return states;

}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function randomId(length = 5) {
  return Math.random().toString(36).slice(2, length + 2);
}

export function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

export function parseScriptTag($script: HTMLElement | null) {
  try {
    return JSON.parse($script.innerHTML)
  } catch (error) {
    return null;
  }
}


export function formatMoney(cents: number | string, format = "${{amount}}") {
  if(typeof cents === 'string') { cents = cents.replace('.', '') }

  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format;

  function defaultOption(opt, def) {
    return (typeof opt === 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal = defaultOption(decimal, '.');

    if(isNaN(number) || number === null) return 0;

    number = (number/100.0).toFixed(precision);

    var parts = number.split('.'),    
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }


  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2, undefined, undefined);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0, undefined, undefined);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
}