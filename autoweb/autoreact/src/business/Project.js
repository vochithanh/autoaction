import {Link, useHistory, useParams } from "react-router-dom";
import LayoutLRUP from "../template/Layouts";
import { MenuLink, ContentForm, Input, SubmitBtn, NotificationBar, ActionItem, BarItem, Bar, Move, New, Del, List, Rub } from "../template/Brick";
import {TaskItem} from "./Task";
import { buildMove, pick, pickModels, useFetch, usePost } from "../App";
import { Line, Stack } from "../template/Slots";
import { useEffect, useState } from "react";
import { icNew, icDel } from "../template/Icon";

// { model:{},app:{} }
function ProjectItem(p) {
    const pro = p.model;
    const app = p.app;
    const proLink = <Link to = {`/project/${pro.data.id}`} className = "pure-menu-link" >{pro.data.name}</Link>;
    //const delPro = pro && <Del app={app} path={`spelremove/projects/${pro.data.id}`} key='del'/>;
    return( <Line list={[proLink]} />);
}

//{ model:{} }
function Project(p){
    const db = p.db;
    const {id} = useParams();
    const [pro,] = pickModels( id, 1, p);

    useEffect(() =>{
        p.setDb({ ...db, curPro:id})
    },[id]);
    
    // BAR
    const newTask = pro && <New link='/task/0' key='new'/>;
    const delPro = pro && <Del app={p} path={`spelremove/projects/${pro.data.id}`} key='del'/>;
    const actions = [newTask, delPro]
    const actionBar = <Bar list={actions} />

    // LEFT
    const tasks = pro?.tasks?.map( (task,_) =>{
        return <TaskItem model = {task} label={task.data.name} />
    });
    const left = <Rub ip={{variant:'warning'}} header="Tasks" list = {tasks} />;
    
    // RIGHT
    const move = <Line list={[buildMove({db:db, level:0}),actionBar]} />;
    const total = `Total: ${pro?.tasks?.length || 0} task(s)!`;
    const up = <Stack list={[move, total]} />;
    const down = <ProjectContent {...p} model = {pro}/>;

    return( LayoutLRUP({ left: left, right:{ up: up, down: down} }));    
}

// {model:{}}
function ProjectContent(p){
    const pro = p.model;
    const [setInput,output] = usePost();
    const [showMsg,setShowMsg] = useState(false);

    const submit = event => {
        event.preventDefault();
        const path = pro?`spelsave/projects.$[data.id == ${pro.data.id}]`:'spelnew/projects';
        const formData = new FormData(event.target);
        setInput({path:path,form:formData, postAction:() => setShowMsg(true), });
    }

    let history = useHistory();
    useEffect(() =>{
        const postProject = () =>{
            const outPro = output.data;
            p.refresh();
            outPro?.data && history?.replace('/project/' + outPro.data.id);
        };
        output && postProject();
    }, [output]);

    const notice = output && <NotificationBar title={output.result} show={showMsg} setShow={setShowMsg} />;
    const inner = <div>
        <Input name='data.name' type ='text' tip='' value ={pro ? pro.data.name : ''} label='Project name' />
        <SubmitBtn value='Save' />
    </div>
    const form = <ContentForm inner={inner} submit={submit} />


    return( <Stack list={[notice, form]} />);
}

export default Project
export { ProjectItem, ProjectContent }