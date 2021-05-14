import LayoutLRUP from "../template/Layouts";
import { Bar, BarItem, ContentForm, Input, InputField, List, Move, New, Pan, Rub, Train } from "../template/Brick";
import { ProjectItem } from "./Project";
import { Line, Stack } from "../template/Slots";
import { icAdd } from "../template/Icon";
import { Card, Col, Row } from "react-bootstrap";

function Workspace(p) {
  const db = p.db; // LEFT

  const projects = db.projects?.map((pro, _) => {
    return /*#__PURE__*/React.createElement(ProjectItem, {
      model: pro,
      app: p,
      label: pro.data.name
    });
  });
  const left = /*#__PURE__*/React.createElement(Rub, {
    header: "Projects",
    list: projects
  }); // UP

  const move = /*#__PURE__*/React.createElement(Move, {
    items: [{
      label: 'Scripts',
      link: '/scripts'
    }]
  });
  const up = /*#__PURE__*/React.createElement(Line, {
    list: [move]
  }); // DOWN

  const down = /*#__PURE__*/React.createElement(WorkspaceContent, p);
  return LayoutLRUP({
    left: left,
    right: {
      up: up,
      down: down
    }
  });
}

function WorkspaceContent(p) {
  const {
    db,
    config
  } = p; // WORKSPACE

  const newPro = {
    comp: /*#__PURE__*/React.createElement(New, {
      link: "/project/0",
      key: "new"
    })
  };
  const actions = /*#__PURE__*/React.createElement(Train, {
    list: [newPro],
    ip: {
      border: 'warning'
    }
  });
  const sum = /*#__PURE__*/React.createElement(Card, {
    body: true
  }, `Total: ${db.projects?.length || 0} project(s)!`);
  const wsContent = /*#__PURE__*/React.createElement(Stack, {
    list: [actions, sum]
  }); // CONFIG

  const wsConfig = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    name: "aaServer",
    type: "text",
    tip: "",
    value: config.aaServer,
    label: "AutoAction server",
    setValue: url => {
      p.setConfig({ ...config,
        aaServer: url
      });
    }
  }), /*#__PURE__*/React.createElement(Input, {
    name: "livePeriod",
    type: "text",
    tip: "",
    value: config.livePeriod,
    label: "Live period",
    setValue: period => {
      p.setConfig({ ...config,
        livePeriod: period
      });
    }
  }), /*#__PURE__*/React.createElement(Input, {
    name: "liveStatusPeriod",
    type: "text",
    tip: "",
    value: config.liveStatusPeriod,
    label: "Live status period",
    setValue: period => {
      p.setConfig({ ...config,
        liveStatusPeriod: period
      });
    }
  }));
  const pConfig = /*#__PURE__*/React.createElement(ContentForm, {
    inner: wsConfig
  });
  const pItems = [{
    comp: wsContent,
    label: 'Workspace'
  }, {
    comp: pConfig,
    label: 'Config'
  }];
  return /*#__PURE__*/React.createElement(Pan, {
    items: pItems,
    id: "ws-content",
    activeKey: "Summary"
  });
}

export default Workspace;