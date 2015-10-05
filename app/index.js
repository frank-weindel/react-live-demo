import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import babel from 'babel-core/browser';
import esprima from 'esprima';
import escodegen from 'escodegen';
import estraverse from 'estraverse';
import Codemirror from 'react-codemirror';

import classNames from 'classnames';
import { iff, default as globalUtils } from 'app/utils/globalUtils';

import './styles/app.less';

import 'react-codemirror/node_modules/codemirror/lib/codemirror.css';
import 'react-codemirror/node_modules/codemirror/theme/material.css';

import 'app/modules/JsxMode';


const localStorage = window.localStorage;

const TAB_SOURCE = 'SOURCE';
const TAB_TRANSCODE = 'TRANSCODE';

const LiveDemoApp = React.createClass({
  getInitialState() {
    return {
      sourceCode: '',
      transCode: '',
      transError: '',
      tab: TAB_SOURCE,
      func: function() { }
    };
  },
  componentWillMount() {
    this._setSource(localStorage.getItem('sourceCode') || '');
  },
  componentDidMount() {
    this._renderPreview();
  },
  componentDidUpdate() {
    this._renderPreview();
  },
  render() {
    const {
      sourceCode,
      transCode,
      tab,
      transError
    } = this.state;
    const showSource = (tab === TAB_SOURCE);

    const cmOptions = {
      lineNumbers: true,
      readOnly: !showSource,
      mode: 'jsx',
      theme: 'material',
      tabSize: 2,
      smartIndent: true,
      indentWithTabs: false
    };
    const srcTabClassName = classNames({
      'otsLiveDemoApp-tab': true,
      'otsLiveDemoApp-active': showSource
    });
    const transTabClassName = classNames({
      'otsLiveDemoApp-tab': true,
      'otsLiveDemoApp-active': !showSource
    });
    console.log((transCode || transError));
    return (
      <div className='otsLiveDemoApp'>
        <div className='otsLiveDemoApp-tabs'>
          <button className={srcTabClassName} onClick={this._onSrcClick}>Source</button>
          <button className={transTabClassName} onClick={this._onTransClick}>Transcode</button>
        </div>
        <div className='otsLiveDemoApp-src'>
          <Codemirror
            value={showSource ? sourceCode : (transCode || transError)}
            onChange={this._onChangeEditor}
            options={cmOptions}
          />
        </div>
      </div>
    );
  },
  _onChangeEditor(value) {
    const { tab } = this.state;
    if (tab === TAB_SOURCE) {
      this._setSource(value);
    }
  },
  _onSrcClick() {
    this.setState({
      tab: TAB_SOURCE
    });
  },
  _onTransClick() {
    this.setState({
      tab: TAB_TRANSCODE
    });
  },

  _setSource(sourceCode) {

    localStorage.setItem('sourceCode', sourceCode);

    const dependencies = [];
    let transCode;
    let transError;

    try {
      const es5trans = babel.transform(sourceCode);

      let uniqueId = 0;

      estraverse.replace(es5trans.ast.program, {
        enter(node, parent) {
          if (
            node.type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'require' &&
            node.arguments.length === 1 &&
            node.arguments[0].type === 'Literal'
          ) {
            const dep = {
              identifier: '__DEPENDENCY_'+ (uniqueId++) ,
              depName: node.arguments[0].value
            };

            dependencies.push(dep);
            return {
              name: dep.identifier,
              type: 'Identifier'
            };
          }
          else if (
            node.type === 'AssignmentExpression' &&
            node.left.type === 'MemberExpression' &&
            node.left.object.type === 'Identifier' &&
            node.left.object.name === 'module' &&
            node.left.property.type === 'Identifier' &&
            node.left.property.name === 'exports'
          ) {
            return {
              type: 'ReturnStatement',
              argument: node.right
            }
          }
        }
      });

      transCode = escodegen.generate(es5trans.ast.program);
    }
    catch (e) {
      const msg = 'Error transpiling source code: ';
      transError = msg + e.toString();
      globalUtils.error(msg, e);
    }

    this.setState({
      sourceCode,
      transCode,
      transError
    });

    if (transCode) {
      try {
        const fnConstArgs = [{ what: 'aaa'}].concat(dependencies.map((dep) => {
          return dep.identifier;
        }));
        fnConstArgs.push('exports');
        fnConstArgs.push(transCode);

        this.setState({
          func: new (Function.prototype.bind.apply(Function, fnConstArgs))
        });
      }
      catch(e) {
        console.error('Runtime Error', e);
      }
    }

  },
  _renderPreview() {
    const { func } = this.state;
    const { Component, error } = (() => {
      try {
        return {
          Component: func(React, {})
        };
      }
      catch(e) {
        return {
          error: e
        };
      }
    })();

    try {
      if (Component) {
        ReactDOM.render(<Component />, document.getElementById('preview'));
      }
      else if (error) {
        ReactDOM.render(<div className='otsLiveDemoApp-error'>{error.toString()}</div>, document.getElementById('preview'));
      }
    }
    catch (e) {
      globalUtils.error('Fatal error rendering preview: ', e);
    }
  }
});

ReactDOM.render(<LiveDemoApp />, document.getElementById('editor'));


// const newProgram = {
//   type: 'Program',
//   body: [
//     {
//       type: 'CallExpression',
//       callee: {
//         type: 'FunctionExpression',
//         id: null,
//         params: dependencies.map((dep) => {
//           return {
//             type: 'Identifier',
//             name: dep.identifier
//           }
//         }),
//         body: {
//           type: 'BlockStatement',
//           body: es5trans.ast.program.body
//         }
//       },
//       arguments: []
//     }
//   ]
// };