function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { pick, useFetch, usePost, log, buildMove, pickModels } from "../App";
import { Rev, Bar, BarItem, ContentForm, Del, InnerDom, Input, List, MediaCarousel, MediaItem, MediaLive, MenuLink, New, NotificationBar, Over, PickList, ScriptContent, SubmitBtn, Accord, Rub } from "../template/Brick";
import { icImport } from "../template/Icon";
import LayoutLRUP from "../template/Layouts";
import { Line, Stack, Lane } from "../template/Slots"; // {ids:''}

function PickScript(p) {
  const scripts = p.db.scripts;
  const [ids, setIds] = useState(p.ids);

  const fContains = s => ids?.indexOf(s.id) >= 0;

  const list = scripts.filter(s => !fContains(s)).map(s => {
    return /*#__PURE__*/React.createElement(ScriptItem, {
      label: s.data.name,
      model: s,
      action: () => {
        setIds(f => f + ',' + s.id);
      }
    });
  });
  const pick = /*#__PURE__*/React.createElement(Rub, {
    list: list
  });
  const accPick = /*#__PURE__*/React.createElement(Accord, {
    list: [{
      label: 'Add script',
      comp: pick
    }]
  });
  const curList = scripts.filter(fContains).sort((i1, i2) => ids.indexOf(i1.id) - ids.indexOf(i2.id));
  const sList = /*#__PURE__*/React.createElement(ScriptList, {
    scripts: curList,
    name: p.name,
    action: id => {
      setIds(f => f.split(',').filter(item => id !== item).join(','));
    }
  });
  return /*#__PURE__*/React.createElement(Stack, {
    list: [accPick, sList]
  });
} // {scripts:[], name:'', action:f(id)}


function ScriptList(p) {
  const scripts = p.scripts;
  const list = scripts.map(s => {
    return /*#__PURE__*/React.createElement(Over, {
      oComp: /*#__PURE__*/React.createElement(Rev, {
        onClick: () => {
          p.action(s.id);
        }
      })
    }, /*#__PURE__*/React.createElement("span", null, s.data.name));
  });
  const ids = scripts.map(s => s.id).join(',') || '';
  const hInput = /*#__PURE__*/React.createElement(Input, {
    type: "hidden",
    value: ids,
    name: p.name
  });
  const items = /*#__PURE__*/React.createElement(List, {
    list: list,
    ip: {
      variant: 'warning'
    }
  });
  return /*#__PURE__*/React.createElement(Stack, {
    list: [hInput, items]
  });
} // {model:{}, action:f()}


function ScriptItem(p) {
  const script = p.model;
  return /*#__PURE__*/React.createElement(BarItem, {
    link: "#",
    action: p.action,
    label: script?.data.name
  });
} // {db:{}}


function Script(p) {
  const db = p.db; // const scripts = db.projects[0].tasks;

  const scripts = db.scripts;
  const [script, setScript] = useState(); // BAR

  const newS = /*#__PURE__*/React.createElement(New, {
    link: "#",
    key: "new",
    action: () => {
      setScript({
        id: 0,
        data: {
          name: ''
        }
      });
    }
  });
  const delS = script?.id > 0 && /*#__PURE__*/React.createElement(Del, {
    app: p,
    path: `spelremove/scripts/${script.id}`,
    key: "del",
    action: () => {
      p.refresh();
      setScript(null);
    }
  });
  const [setInput, output] = usePost();

  const handleImp = e => {
    e.preventDefault();

    const onload = e => {
      const reader = e.target;
      const text = reader.result;
      reader.postData['data.script'] = text;
      const path = `spelnew/scripts/0`;
      setInput({
        path: path,
        data: reader.postData
      });
      p.refresh();
    };

    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = onload;
      reader.postData = {
        id: 0,
        'data.name': file.name,
        'data.script': ''
      };
      reader.readAsText(file);
    });
  };

  const impS = /*#__PURE__*/React.createElement(Form.File, {
    id: "custom-file",
    label: "Import script files",
    custom: true,
    multiple: true,
    onChange: handleImp
  });
  const actions = [impS, newS, delS];
  const actionBar = /*#__PURE__*/React.createElement(Bar, {
    list: actions
  }); // LEFT

  const runs = scripts.sort((i1, i2) => i2.data.id - i1.data.id).map(scr => {
    return /*#__PURE__*/React.createElement(ScriptItem, {
      model: scr,
      label: scr.data.name,
      action: () => {
        setScript(scr);
      }
    });
  });
  const left = /*#__PURE__*/React.createElement(Rub, {
    header: "Scripts",
    list: runs,
    ip: {
      variant: 'danger'
    }
  }); // RIGHT

  const move = /*#__PURE__*/React.createElement(Line, {
    list: [buildMove({
      db: db,
      level: 0
    }), actionBar]
  });
  const total = `Total: ${runs?.length} scripts(s)!`;
  const up = /*#__PURE__*/React.createElement(Stack, {
    list: [move, total]
  });
  const down = script && /*#__PURE__*/React.createElement(ScrContent, _extends({}, p, {
    model: script,
    setScript: setScript
  }));
  return LayoutLRUP({
    left: left,
    right: {
      up: up,
      down: down
    }
  });
} // {path:'', model:{}, setScript:f()}


function ScrContent(p) {
  const script = p.model;
  const [setInput, output] = usePost();
  const [showMsg, setShowMsg] = useState(false);

  const submit = event => {
    event.preventDefault();
    const path = script.id > 0 ? `spelsave/scripts.$[id == ${script.id}]` : `spelnew/scripts/${script.id}`;
    const formData = new FormData(event.target);
    setInput({
      path: path,
      form: formData,
      postAction: () => setShowMsg(true)
    });
  };

  useEffect(() => {
    const postScript = () => {
      p.refresh();
      p.setScript(output.data);
    };

    output && postScript();
  }, [output]);
  const notice = output && /*#__PURE__*/React.createElement(NotificationBar, {
    title: output.result,
    show: showMsg,
    setShow: setShowMsg
  });
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    name: "data.name",
    type: "text",
    tip: "",
    value: script ? script.data.name : '',
    label: "Script name"
  }), /*#__PURE__*/React.createElement(ScriptContent, {
    script: script?.data.script || '',
    name: "data.script"
  }), /*#__PURE__*/React.createElement(SubmitBtn, {
    value: "Save"
  }));
  const form = /*#__PURE__*/React.createElement(ContentForm, {
    inner: inner,
    submit: submit,
    id: "form-script",
    type: "application/x-www-form-urlencoded"
  });
  return /*#__PURE__*/React.createElement(Stack, {
    list: [notice, form]
  });
}

export default Script;
export { PickScript, ScriptList };