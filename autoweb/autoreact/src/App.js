import './App.css';
import { useEffect, useState } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, useParams, } from "react-router-dom";

import Workspace from './business/Workspace';
import Project from './business/Project';
import Task from './business/Task';
import TaskRun from './business/TaskRun';
import { Move, ModalYn } from './template/Brick';
import Script from './business/Script';


function App() {
  const [db, setDb] = useState({projects:[], curPro:null, curTask:null, curTaskrun:null, scripts:[]});
  const [flag,setFlag] = useState(new Date());
  const [config,setConfig] = useState({aaServer:'/', livePeriod:'5000', liveStatusPeriod:'10000'});
  const [app, setApp] = useState({modal:{title:'',content:'',show:false, action: () =>{}}, });
  
  // config
  useEffect(() =>{
    baseUrl = config.aaServer;
    setFlag(flag + 1);
  },[config]);

  // fetch db
  const [setInput, output] = useFetch();
  useEffect(() =>{
    const input = {path:'spelquery/db'};
    setInput(input);
  },[flag]);

  useEffect(() =>{
    const filterDelete = (projects) =>{
      return projects.filter( p => p?.data?.status !== 'DELETE');     
    };
    output?.result == 'success' && setDb({...db , projects: filterDelete(output.data.projects), scripts: output.data.scripts });
  },[output]);
  
  const refresh = () => { setFlag(new Date());};
  const appProp = {setDb: setDb, db:db, refresh: refresh, config:config, setConfig:setConfig, app:app, setApp:setApp};
  const wsInner = <Workspace {...appProp} />;
  const proInner = <Project {...appProp} />;
  const taskInner = <Task {...appProp} />;
  const runInner = <TaskRun {...appProp} />;
  const scripts = <Script {...appProp} />;
  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/"> {wsInner} </Route>
        <Route path="/project/:id"> {proInner}</Route>
        <Route path="/task/:id"> {taskInner} </Route>
        <Route path="/taskrun/:id"> { runInner} </Route>
        <Route path="/scripts/"> { scripts} </Route>
      </Switch>
    </Router>

    <ModalYn {...app.modal}/>
    </>
  ); 
} 

function pickModels(id, level, p){
  const db = p.db;
  const pro = pick( level == 1 ? id : db.curPro,db.projects);
  const task = pick(level == 2 ? id : db.curTask, pro?.tasks);
  const taskRun = pick(level == 3 ? id : db.curTaskrun, task?.runList)
  return [pro,task,taskRun];
}

var baseUrl = '/';
function log(msg){ 
  console.log(msg);
}
 
// {db:{},level:}
function buildMove(p){
  const db = p.db;
  var level = p.level;

  const items = [{label:'Home',link:'/'}];
  if( level > 0){
    items.push({label:'\\Project', link:'/project/' + db.curPro})
  } 
  if( level > 1){
    items.push({label:'\\Task', link:'/task/' + db.curTask})
  }
  if( level > 2){
    items.push({label:'\\TaskRun', link:'/taskrun/' + db.curTaskrun})
  }  
    
  return <Move items={items}/>
}

function pick(id, models){
  return models?.find( m => m.data.id == id);
}
// input:{path:'', preAction:f(), transform: f(), postAction:f(), }, output:{data:{}, result:'success/error'}
function useFetch(){
  const [input,setInput] = useState();
  const [output,setOutput] = useState();
  
  useEffect( () =>{
    const url = (input?.absPath?'':baseUrl) + input?.path;
    const transform = input?.transform || ((r) => r.json());
    input?.path && fetch(url).then( result => transform(result) ).then(
      jsonRes =>{ 
        input.preAction && input.preAction(jsonRes);
        setOutput({result:'success', data: jsonRes} );
      }, err => {
        setOutput({result:'error', data:{error: err}});
      },).then( () =>{
        log("useFetch(): " + url);
        input.postAction && input.postAction();
      });
  },[input]);

  return [setInput, output]  
}

// input:{path:'', form:"HTML Form", data:{json}, preAction:f(), postAction:f(), }, output:{data:{}, result:'success/error'}
function usePost(){
  const [input,setInput] = useState();
  const [output,setOutput] = useState();

  useEffect( () => {
    // prepare action
    const postAction = async () =>{
      const path = baseUrl + input.path;
      log("usePost(): " + path);
      const data = input.form || new URLSearchParams(input.data);
      await axios.post(path, data).then( res => res.data).then(
        jsonRes =>{ 
          input.preAction && input.preAction(jsonRes);
          setOutput({result:'success', data: jsonRes} );
        }, err => {
          setOutput({result:'error', data:{error: err}});
        },).then( () =>{
          input.postAction && input.postAction();
        });
    };
    // action
    input?.path && postAction();
  },[input]);

  return [setInput, output]  
}

export default App;
export {useFetch, usePost, };
export {log,pick,buildMove, pickModels};