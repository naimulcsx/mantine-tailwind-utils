import { getCompiledTemplate } from '../utils/get-compiled-template.js';

export function getWithRestrictedProps() {
  const template = getCompiledTemplate('with-restricted-props');
  return template({});
}
