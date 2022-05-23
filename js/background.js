//import background scripts
const path = "./background-scripts/"
try {
  importScripts(path+'intellisense.js', path+"dom.js");
} catch (e) {
  console.error(e);
}