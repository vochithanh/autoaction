function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { Col, Row } from 'react-bootstrap'; // {list: [{comp:{},fill:'1', key:1},], style:{}}

function SlotFree(p) {
  const fillList = p.list?.map((item, i) => {
    return /*#__PURE__*/React.createElement(Col, {
      xl: item.fill,
      key: item.key || i
    }, " ", item.comp, " ");
  });
  return /*#__PURE__*/React.createElement(Row, p.prpps, " ", fillList, " ");
} // { list:[<>,<>], ... }


function Stack(p) {
  const list = p.list.map((comp, i) => {
    return {
      comp: comp,
      fill: '12',
      key: i
    };
  });
  return /*#__PURE__*/React.createElement(SlotFree, _extends({}, p, {
    list: list
  }));
} // { list:[<>,<>], ... }


function Line(p) {
  const list = p.list.map((comp, i) => {
    return {
      comp: comp,
      fill: 'auto',
      key: i
    };
  });
  return /*#__PURE__*/React.createElement(SlotFree, _extends({}, p, {
    list: list
  }));
}

function Lane(p) {
  const list = p.children?.map((comp, i) => {
    return {
      comp: comp,
      fill: 'auto',
      key: i
    };
  });
  return /*#__PURE__*/React.createElement(SlotFree, _extends({}, p, {
    list: list
  }));
}

export default SlotFree;
export { Stack, Line, Lane };