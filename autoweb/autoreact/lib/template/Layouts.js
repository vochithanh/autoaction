import { Container } from 'react-bootstrap';
import SlotFree, { Stack } from './Slots'; // { bar:<>, left:{}, right: {up: {}, down: {}} }

function LayoutLRUP(p) {
  const right = /*#__PURE__*/React.createElement(Stack, {
    list: [p.right.up, p.right.down]
  });
  const list = [{
    comp: p.left,
    fill: 2,
    key: 'left'
  }, {
    comp: right,
    fill: 10,
    key: 'right'
  }];
  return /*#__PURE__*/React.createElement(Container, null, p.bar, /*#__PURE__*/React.createElement(SlotFree, {
    list: list
  }));
} // {bar:<>, up:<>, down:<>


function LayoutUpDown(p) {
  return /*#__PURE__*/React.createElement(Container, null, p.bar, /*#__PURE__*/React.createElement(Stack, {
    list: [p.up, p.down]
  }), " );");
}

export default LayoutLRUP;
export { LayoutUpDown };