function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState } from 'react';

const keyMatch = (key, text) => key.length == 0 || text?.toLowerCase().indexOf(key.toLowerCase()) >= 0;

function List(p) {
  return /*#__PURE__*/React.createElement("ul", null, p.list);
}

function Stack(p) {
  return /*#__PURE__*/React.createElement("div", null, p.list);
}

function Rub(p) {
  const [key, setKey] = useState('');
  const search = /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search...",
    onChange: e => {
      setKey(e.target.value);
    }
  });
  const list = p.list?.filter(item => keyMatch(key, item?.props?.label));
  const group = /*#__PURE__*/React.createElement(List, _extends({}, p, {
    list: list
  }));
  return /*#__PURE__*/React.createElement(Stack, {
    list: [search, group]
  });
}

function Pig(p) {
  const list = [/*#__PURE__*/React.createElement("li", {
    label: "item1"
  }, "item1"), /*#__PURE__*/React.createElement("li", {
    label: "item2"
  }, "item2")];
  return /*#__PURE__*/React.createElement(Rub, _extends({}, p, {
    list: list
  }));
}