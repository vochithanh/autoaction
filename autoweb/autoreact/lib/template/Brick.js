function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel'; // CodeMirror

import { UnControlled as CodeMirror } from 'react-codemirror2';
import autoactionMode from '../codemirror/mode/autoaction/autoaction';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import { Nav, Navbar, Tabs, Tab, Form, Breadcrumb, Button, Row, Col, ResponsiveEmbed, Toast, Modal, ListGroup, OverlayTrigger, Tooltip, FormControl, Accordion, Card, CardGroup, CardColumns } from 'react-bootstrap';
import { icNew, icDel, iRemove } from './Icon';
import { log, useFetch } from '../App';
import { Line, Stack } from './Slots';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { isElement } from 'react-dom/test-utils'; // {list:{comp:<>, label:'New pro'}, gp:{}, ip{}}

function Train(p) {
  const cards = p.list?.map((item, i) => {
    const {
      comp,
      label
    } = item;
    return /*#__PURE__*/React.createElement(Card, _extends({
      body: true
    }, p.ip), comp, label && /*#__PURE__*/React.createElement(Card.Text, null, label));
  });
  return /*#__PURE__*/React.createElement(Line, {
    list: cards
  });
} // {list:[{label:'', comp:<>}]}


function Accord(p) {
  const items = p.list?.map((item, i) => {
    const eKey = i + "";
    return /*#__PURE__*/React.createElement(Card, {
      key: item.label
    }, /*#__PURE__*/React.createElement(Card.Header, null, /*#__PURE__*/React.createElement(Accordion.Toggle, {
      as: Button,
      variant: "link",
      eventKey: eKey
    }, item.label)), /*#__PURE__*/React.createElement(Accordion.Collapse, {
      eventKey: eKey
    }, /*#__PURE__*/React.createElement(Card.Body, null, item.comp)));
  });
  return /*#__PURE__*/React.createElement(Accordion, null, items);
} // { oprops:{}, oComp:<>}


function Over(p) {
  const op = {
    placement: 'right',
    delay: {
      show: 250,
      hide: 1000
    },
    ...p.oprops
  };

  op.overlay = props => /*#__PURE__*/React.createElement(Tooltip, props, p.oComp);

  return /*#__PURE__*/React.createElement(OverlayTrigger, op, p.children);
} // {list:[{label:'', val:'', comp:<>, }]}


function PickList(p) {
  const [search, setSearch] = useState('');
  const items = p.list.filter(item => item.label.indexOf(search) >= 0).map(item => item.comp);
  return /*#__PURE__*/React.createElement(Over, {
    oComp: /*#__PURE__*/React.createElement(List, {
      list: items
    }),
    oprops: {
      placement: 'bottom-start'
    }
  }, /*#__PURE__*/React.createElement(Form.Control, {
    type: "text",
    tip: "search",
    onChange: e => {
      setSearch(e.target.value);
    }
  }));
} // {show:false, title:'', content:'', action: f(), close:f()}


function ModalYn(p) {
  const handleClose = () => p.close();

  const cancelBtn = /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: handleClose,
    key: "cancel"
  }, "Cancel");
  const yesBtn = /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    key: "yes",
    onClick: () => {
      p.action();
      handleClose();
    }
  }, "Yes");
  return /*#__PURE__*/React.createElement(Modal, {
    show: p.show,
    onHide: handleClose
  }, /*#__PURE__*/React.createElement(Modal.Header, {
    closeButton: true
  }, /*#__PURE__*/React.createElement(Modal.Title, null, p.title)), p.content && /*#__PURE__*/React.createElement(Modal.Body, null, p.content), /*#__PURE__*/React.createElement(Modal.Footer, null, [yesBtn, cancelBtn]));
}

function Rev(p) {
  return /*#__PURE__*/React.createElement(Button, p, iRemove);
} // {link:'', action:f()}


function New(p) {
  return /*#__PURE__*/React.createElement(BarItem, {
    icon: icNew,
    label: "New",
    link: p.link,
    action: p.action
  });
} // {path:'', app:{}, action:f()}


function Del(p) {
  let history = useHistory();
  const [setInput, output] = useFetch();
  const app = p.app;
  const delModal = {
    show: true,
    title: 'Delete item',
    content: 'Are you sure?',
    action: () => {
      const postAction = () => {
        p.app.refresh();
        history?.goBack();
      };

      setInput({
        path: p.path,
        postAction: p.action || postAction
      });
    },
    close: () => {
      app.setApp({ ...app.app,
        modal: {
          show: false
        }
      });
    }
  };
  return /*#__PURE__*/React.createElement(BarItem, {
    icon: icDel,
    label: "Delete",
    link: "#",
    action: () => {
      app.setApp({ ...app.app,
        modal: delModal
      });
    }
  });
} // {items:[{label:'', link:'#'}]}


function Move(p) {
  const list = p.items?.map((item, i) => {
    return /*#__PURE__*/React.createElement(Link, {
      to: item.link,
      key: item.label
    }, item.label);
  });
  return /*#__PURE__*/React.createElement(Breadcrumb, null, list);
} // {gp:{}, ip:{}, header:<>, list:[<>]}


function List(p) {
  const list = p.list;
  const items = list?.map((item, i) => {
    return /*#__PURE__*/React.createElement(ListGroup.Item, _extends({
      as: "div",
      action: true,
      variant: "primary"
    }, p.ip, {
      key: item.props?.label || i
    }), item);
  });
  return /*#__PURE__*/React.createElement(ListGroup, p.gp, p.header, items);
}

const keyMatch = (key, text) => key.length == 0 || text?.toLowerCase().indexOf(key.toLowerCase()) >= 0;

function Rub(p) {
  const [key, setKey] = useState('');
  const search = /*#__PURE__*/React.createElement(Form.Control, {
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
} // {list:[<>,], style:{}}


function Bar(p) {
  return /*#__PURE__*/React.createElement(Navbar, p.style, p.list);
} // {icon:<>, label:'', link:'/home', action:f()}


function BarItem(p) {
  const label = p.icon ? p.icon : p.label;
  const link = /*#__PURE__*/React.createElement(Link, {
    to: p.link
  }, label);
  const btn = /*#__PURE__*/React.createElement(Nav.Link, {
    href: p.link,
    onSelect: p.action
  }, label, " ");
  const fill = p.action ? btn : link;
  return /*#__PURE__*/React.createElement(Nav.Item, null, fill);
} // {items:[{comp:<>, label:''},], props:{}}


function Pan(p) {
  const list = p.items?.map((item, i) => {
    return /*#__PURE__*/React.createElement(Tab, {
      title: item.label,
      key: i,
      eventKey: item.label
    }, item.comp);
  });
  return /*#__PURE__*/React.createElement(Tabs, p.props, list);
} // {label:'New', link:''}


function ActionItem(p) {
  return /*#__PURE__*/React.createElement(Nav.Item, null, /*#__PURE__*/React.createElement(Nav.Link, {
    href: p.link
  }, p.label));
} //{ items:[{label:'', link:''},] , className:''}


function ActionMenu(p) {
  // build items
  const items = p.items?.map(item => {
    return /*#__PURE__*/React.createElement(ActionItem, _extends({}, item, {
      key: item.label
    }));
  });
  return /*#__PURE__*/React.createElement(Nav, {
    className: p.className
  }, items);
} // {label:'Back', link:'/Home'}


function BackLink(p) {
  let history = useHistory();
  const label = p.label ? p.label : 'Back';
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      history.goBack();
    }
  }, label);
} //{ header:'Header', items:[{comp:<>, key:k},{comp:<>,key:k}], isLeftRight:false}


function MenuLink(p) {
  const horizontal = p.isLeftRight ? 'pure-menu-horizontal' : ''; // build items

  const items = p.items?.map((item, _) => {
    return /*#__PURE__*/React.createElement("li", {
      className: "pure-menu-item",
      key: item.key
    }, item.comp);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: 'pure-menu ' + horizontal
  }, /*#__PURE__*/React.createElement("div", {
    className: "pure-menu-heading"
  }, " ", p.header, " "), /*#__PURE__*/React.createElement("ul", {
    className: "pure-menu-list"
  }, " ", items, " "));
} //{ labels: ['New','Run'], actions:[newAction,runAction]


function MenuControl(p) {
  const actions = p.actions;
  const items = p.labels.map((label, i) => {
    return /*#__PURE__*/React.createElement("li", {
      className: "pure-menu-item",
      key: label
    }, /*#__PURE__*/React.createElement(Link, {
      to: actions[i],
      className: "pure-menu-link"
    }, label));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "pure-menu pure-menu-horizontal"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "pure-menu-list"
  }, items));
} //{  inner:<>, onSubmit:()=>{}, init:f(), type:''}


function ContentForm(p) {
  return /*#__PURE__*/React.createElement(Form, {
    onSubmit: p.submit,
    method: "post",
    encType: p.type || "multipart/form-data",
    id: p.id
  }, p.inner);
} // {name:'name', type:'text', tip:'Please input', value:'Jame', label:'Project name', setValue:f()}


function Input(p) {
  const [value, setValue] = useState('');
  const name = p.name;
  useEffect(() => {
    setValue(p.value);
  }, [p.value]);
  return /*#__PURE__*/React.createElement(Form.Group, {
    as: Row
  }, /*#__PURE__*/React.createElement(Form.Label, {
    column: true,
    sm: 2
  }, p.label), /*#__PURE__*/React.createElement(Col, {
    sm: 10
  }, /*#__PURE__*/React.createElement(Form.Control, {
    type: p.type,
    name: name,
    placeholder: p.tip,
    value: value,
    onChange: e => {
      const newVal = e.target.value;
      p.setValue && p.setValue(newVal);
      setValue(newVal);
    }
  })));
} // {value:'Save'}


function SubmitBtn(p) {
  return /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit"
  }, p.value);
} // {title:'', content:'', show:false, setShow:f()}


function NotificationBar(p) {
  return /*#__PURE__*/React.createElement(Toast, {
    onClose: () => p.setShow(false),
    show: p.show,
    delay: 3000,
    autohide: true
  }, /*#__PURE__*/React.createElement(Toast.Header, null, /*#__PURE__*/React.createElement("strong", {
    className: "mr-auto"
  }, p.title || '')), p.content && /*#__PURE__*/React.createElement(Toast.Body, null, p.content));
} // {script:'', name:''}


function ScriptContent(p) {
  const [script, setScript] = useState(p.script);
  const name = p.name;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CodeMirror, {
    value: p.script,
    options: {
      mode: 'autoaction',
      theme: 'eclipse',
      lineNumbers: true
    },
    defineMode: {
      name: 'autoaction',
      fn: autoactionMode
    },
    onChange: (editor, data, value) => {
      setScript(value);
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    name: name,
    hidden: true,
    value: script,
    readOnly: true
  }));
} // {html:''}


function InnerDom(p) {
  const inner = p.html;
  return /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: inner
    }
  });
} // {list:[{path:''},{path:''}]}


function MediaCarousel(p) {
  const itemList = p.list?.map(m => {
    return /*#__PURE__*/React.createElement(Carousel.Item, {
      key: m.path
    }, /*#__PURE__*/React.createElement(MediaItem, m));
  });
  return /*#__PURE__*/React.createElement(Carousel, null, itemList);
} // {path:""}


function MediaItem(p) {
  const path = p.path;
  const image = /*#__PURE__*/React.createElement("img", {
    src: path,
    alt: "",
    className: "d-block w-100"
  });
  const video = /*#__PURE__*/React.createElement("video", {
    className: "",
    controls: true,
    src: path,
    type: "video/ogg"
  });
  const dom = /*#__PURE__*/React.createElement(InnerDom, null);
  const media = path.endsWith(".png") ? image : /*#__PURE__*/React.createElement("div", null);
  return media;
} // {path:"", style:{}}


function MediaLive(p) {
  const path = p.path;
  const style = p.style;
  const image = /*#__PURE__*/React.createElement(ResponsiveEmbed, {
    aspectRatio: "16by9"
  }, /*#__PURE__*/React.createElement("embed", {
    type: "image/svg+xml",
    src: path
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, image);
}

export { Accord, Train };
export { Rev, New, Del, ModalYn, PickList, List, Rub, Over };
export { Bar, BarItem, Pan, Move };
export { ActionItem, ActionMenu };
export { MediaLive, MediaCarousel };
export { MenuLink, MenuControl, ContentForm, Input, SubmitBtn, NotificationBar, BackLink, ScriptContent, InnerDom, MediaItem };