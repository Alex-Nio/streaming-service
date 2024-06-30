/* eslint indent: "off" */
import { setInputTemplate as renderDefaultTemplate } from './../templates/default_template/input-render.js';
import { setInputTemplate as renderSearchTemplate } from './../templates/search_template/input-render.js';

//? Шаблонизатор
export const getTemplate = (options, nodeName, data) => {
  const { type: dropdown } = options;
  let template;

  switch (dropdown) {
    case 'search':
      template = renderSearchTemplate(options, nodeName, data);
      break;
    case 'city':
      template = renderDefaultTemplate(options, nodeName, data);
      break;
    case 'model':
      template = renderSearchTemplate(options, nodeName, data);
      break;
    default:
      template = renderDefaultTemplate(options, nodeName, data);
      break;
  }

  return template;
};
