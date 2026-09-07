module.exports = function (source) {
  const classes = Object.fromEntries([...source.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(match => [match[1], match[1]]));
  return `const style=document.createElement('style');style.textContent=${JSON.stringify(source)};document.head.appendChild(style);export default ${JSON.stringify(classes)};`;
};
