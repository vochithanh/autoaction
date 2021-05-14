import { useEffect, useState } from "react";
import {Link, useHistory, useParams } from "react-router-dom";
import { pick, useFetch, usePost, log, buildMove, pickModels } from "../App";
import {  ActionItem, BackLink, Bar, BarItem, ContentForm, Del, InnerDom, Input, List, MediaCarousel, MediaItem, MediaLive, MenuLink, NotificationBar, Rub, ScriptContent, SubmitBtn } from "../template/Brick";
import {  icDel, icRun } from "../template/Icon";
import LayoutLRUP from "../template/Layouts";
import {  Line, Stack } from "../template/Slots";
import { PickScript, ScriptList } from "./Script";
import {TaskRunItem} from "./TaskRun";


function TaskItem(p) {
    const task = p.model;
    return(
        <Link to = {`/task/${task.data.id}`} className = "pure-menu-link" >{task.data.name}</Link>
    );
}

// {db:{}}
function Task(p){
    const db = p.db;
    const {id} = useParams();
    const [pro, task,] = pickModels( id, 2, p);

    useEffect(() =>{
        pro && p.setDb({ ...db, curTask:id})
    },[id]);

    const [setInput, output] = useFetch();
    let history = useHistory();

    // BAR
    const runTask = task && <BarItem icon={icRun} label='Run' link='#' key='runTask' action = {() => {
        setInput({path:`spelruntask/${task.data.id}/admin`});
    }}/>;  
    useEffect(() =>{
        const runDt = output?.data;
        const postRun = () =>{
            p.refresh();
            runDt.id && history?.push('/taskrun/' + runDt.id);
        };
        runDt && postRun();
    }, [output]);  

    const delTask = task && <Del app={p} path={`spelremove/tasks/${task.data.id}`} setInput={setInput} key='del'/>;     
    const actions = [runTask, delTask]
    const actionBar = <Bar list={actions}  />

    // LEFT
    const runs = task?.runList.sort(
        (i1,i2) => i2.data.id - i1.data.id
    ).map( trun =>{
        return <TaskRunItem model = {trun} label={trun.data.id} />;
    });
    const left = <Rub ip={{variant:'danger'}} header="Task runs" list = {runs} />;

    // RIGHT
    const move = <Line list={[buildMove({db:db, level:1}),actionBar]} />;
    const total = `Total: ${runs?.length || 0} task run(s)!`;
    const up = <Stack list={[move,total]} />
    const down = <TaskContent {...p} model={task} curProject={pro}/>;

    return( LayoutLRUP({ left: left, right:{ up: up, down: down} }));  
}

// {path:'', model:{}}
function TaskContent(p){
    const task = p.model;
    const pro = p.curProject;
    const [setInput,output] = usePost();
    const [showMsg,setShowMsg] = useState(false);

    const submit = event => {
        event.preventDefault();
        const proPath= `projects.$[data.id == ${pro.data.id}]`;
        const path = task?`spelsave/${proPath}.tasks.$[data.id == ${task.data.id}]`:`spelnew/tasks/${pro.data.id}`;
        const formData = new FormData(event.target);
        setInput({path:path,form:formData, postAction:() => setShowMsg(true),});
    }    
    
    let history = useHistory();
    useEffect(() =>{
        const postTask = () => {
            p.refresh();
            const outTask = output.data;
            outTask?.data && history?.replace('/task/' + outTask.data.id);
        };
        output && postTask();
    }, [output]);

    const notice = output && <NotificationBar title={output.result} show={showMsg} setShow={setShowMsg} />;
    const inner = <>
        <Input name='data.name' type ='text' tip='' value ={task ? task.data.name : ''} label='Task name' />
        <Input name='data.browser' type ='text' tip='' value ={task ? task.data.browser : ''} label='Browser' />
        <PickScript {...p}  name='data.preIds' ids={task?.data.preIds}/>
        <ScriptContent script={task? task.data.script:''} name='data.script' />
        <PickScript {...p}  name='data.postIds' ids={ task?.data.postIds}/>
        <SubmitBtn value='Save' />
    </>
    const form = <ContentForm type='pure-form-stacked' inner={inner} submit={submit} />


    return( <Stack list={[notice,form]} />);
}


export default Task
export {TaskItem, }