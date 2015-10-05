import './JsxMode.less';
import 'react-codemirror/node_modules/codemirror/addon/mode/multiplex.js'
import 'react-codemirror/node_modules/codemirror/mode/javascript/javascript.js';
import 'react-codemirror/node_modules/codemirror/mode/xml/xml.js';

import CodeMirror from 'react-codemirror/node_modules/codemirror';

CodeMirror.defineMode("jsx", function(config) {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, "javascript"),
    {
      open: '<', close: '>',
      mode: CodeMirror.multiplexingMode(
        CodeMirror.getMode(config, { name: "xml", htmlMode: true }),
        {
          open: "{", close: "}",
          mode: CodeMirror.getMode(config, "javascript"),
          parseDelimiters: false
        }),
      parseDelimiters: true
    });
});