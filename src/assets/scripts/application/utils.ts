/**
 * Set screen match media stats for qvp
 */
export function ssm (options: { [size: string]: string }) {

  const states = [];

  for (const id in options)  states.push({ id, query: options[id] });

  return states;

}
