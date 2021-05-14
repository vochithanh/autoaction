function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { Link, useHistory, useParams } from "react-router-dom";
import LayoutLRUP from "../template/Layouts";
import { MenuLink, ContentForm, Input, SubmitBtn, NotificationBar, ActionItem, BarItem, Bar, Move, New, Del, List, Rub } from "../template/Brick";
import { TaskItem } from "./Task";
import { buildMove, pick, pickModels, useFetch, usePost } from "../App";
import { Line, Stack } from "../template/Slots";
import { useEffect, useState } from "react";
import { icNew, icDel } from "../template/Icon"; // { model:{},app:{} }

function ProjectItem(p) {
  const pro = p.model;
  const app = p.app;
  const proLink = /*#__PURE__*/React.createElement(Link, {
    to: `/project/${pro.data.id}`,
    className: "pure-menu-link"
  }, pro.data.name); //const delPro = pro && <Del app={app} path={`spelremove/projects/${pro.data.id}`} key='del'/>;

  return /*#__PURE__*/React.createElement(Line, {
    list: [proLink]
  });
} //{ model:{} }


function Project(p) {
  const db = p.db;
  const {
    id
  } = useParams();
  const [pro] = pickModels(id, 1, p);
  useEffect(() => {
    p.setDb({ ...db,
      curPro: id
    });
  }, [id]); // BAR

  const newTask = pro && /*#__PURE__*/React.createElement(New, {
    link: "/task/0",
    key: "new"
  });
  const delPro = pro && /*#__PURE__*/React.createElement(Del, {
    app: p,
    path: `spelremove/projects/${pro.data.id}`,
    key: "del"
  });
  const actions = [newTask, delPro];
  const actionBar = /*#__PURE__*/React.createElement(Bar, {
    list: actions
  }); // LEFT

  const tasks = pro?.tasks?.map((task, _) => {
    return /*#__PURE__*/React.createElement(TaskItem, {
      model: task,
      label: task.data.name
    });
  });
  const left = /*#__PURE__*/React.createElement(Rub, {
    ip: {
      variant: 'warning'
    },
    header: "Tasks",
    list: tasks
  }); // RIGHT

  const move = /*#__PURE__*/React.createElement(Line, {
    list: [buildMove({
      db: db,
      level: 0
    }), actionBar]
  });
  const total = `Total: ${pro?.tasks?.length || 0} task(s)!`;
  const up = /*#__PURE__*/React.createElement(Stack, {
    list: [move, total]
  });
  const down = /*#__PURE__*/React.createElement(ProjectContent, _extends({}, p, {
    model: pro
  }));
  return LayoutLRUP({
    left: left,
    right: {
      up: up,
      down: down
    }
  });
} // {model:{}}


function ProjectContent(p) {
  const pro = p.model;
  const [setInput, output] = usePost();
  const [showMsg, setShowMsg] = useState(false);

  const submit = event => {
    event.preventDefault();
    const path = pro ? `spelsave/projects.$[data.id == ${pro.data.id}]` : 'spelnew/projects';
    const formData = new FormData(event.target);
    setInput({
      path: path,
      form: formData,
      postAction: () => setShowMsg(true)
    });
  };

  let history = useHistory();
  useEffect(() => {
    const postProject = () => {
      const outPro = output.data;
      p.refresh();
      outPro?.data && history?.replace('/project/' + outPro.data.id);
    };

    output && postProject();
  }, [output]);
  const notice = output && /*#__PURE__*/React.createElement(NotificationBar, {
    title: output.result,
    show: showMsg,
    setShow: setShowMsg
  });
  const inner = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Input, {
    name: "data.name",
    type: "text",
    tip: "",
    value: pro ? pro.data.name : '',
    label: "Project name"
  }), /*#__PURE__*/React.createElement(SubmitBtn, {
    value: "Save"
  }));
  const form = /*#__PURE__*/React.createElement(ContentForm, {
    inner: inner,
    submit: submit
  });
  return /*#__PURE__*/React.createElement(Stack, {
    list: [notice, form]
  });
}

export default Project;
export { ProjectItem, ProjectContent };