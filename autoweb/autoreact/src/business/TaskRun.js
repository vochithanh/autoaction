import { useEffect, useState } from "react";
import {Link, useHistory, useParams } from "react-router-dom";
import {  pickModels, useFetch, log } from "../App";
import { ActionItem, BackLink, Bar, BarItem, ContentForm, Del, MediaCarousel, MediaLive, MenuLink, NotificationBar, Pan, ScriptContent } from "../template/Brick";
import { icDel, icRun, } from "../template/Icon";
import LayoutLRUP, {LayoutUpDown} from "../template/Layouts";
import { Stack, Line } from "../template/Slots";


function TaskRunItem(p) {
    const taskRun = p.model;
    return(
        <Link to = {`/taskrun/${taskRun.data.id}`}>{taskRun.data.id}</Link>
    );       
}

function TaskRun(p){    
    const db = p.db;
    const {id} = useParams();
    const [pro, task, taskRun] = pickModels( id, 3, p);
    const finished = taskRun?.data.status == 'FINISH';

    useEffect(() =>{
        p.setDb({ ...db, curTaskrun:id})
    },[id]);    

    const [flag,setFlag] = useState(0);
    const [setInput,output] = useFetch();
    // result of run
    useEffect(() => {
        const url = `spelrunresult/${task?.data.id}/${taskRun?.data.id}`;
        taskRun && setInput({path:url});
    },[flag]);    

    // update content
    useEffect(() =>{
        const liveInterval = !finished && setInterval(() => setFlag(f => f + 1), p.config.livePeriod);
        const dbInterval = !finished && setInterval(p.refresh, p.config.liveStatusPeriod);
        return(() =>{
            clearInterval(liveInterval);
            clearInterval(dbInterval);
        });
    },[finished]);

    // BAR
    const back = <BackLink/>;
    const remove = taskRun && <Del app={p} path={`spelremove/taskruns/${taskRun.data.id}`} key='del'/>;
    // const pause = <BarItem label = 'Pause' action = {() => {  }}/>; 
    const liveActions = [back];
    const doneActions = [back, remove];
    const actionBar = <Bar list={ finished ? doneActions : liveActions } />

    
    // LIVE TASK
    const [liveSetInput, liveOutput] = useFetch();
    const liveUp = `Action: ${liveOutput?.data || 'waiting...'}`;
    const liveJsonPath = output?.data.filter( item => item?.path.endsWith('livestream.json') ).slice().pop()?.path;
    useEffect(() =>{
        const blobToTxt = (blob) => blob.text();
        !finished && liveSetInput({path:liveJsonPath, absPath:true, transform:blobToTxt});
    },[liveJsonPath,flag]);
    
    const livestream = liveOutput && <MediaLive path={`${liveJsonPath.replace("livestream.json","element_livestream.png")}?ts=${flag}`} 
                                    style={{width:'1000px', height:'auto'}} />
    const liveDown = <Stack list={[livestream ]}/>;
    const liveTask = <LayoutUpDown bar={actionBar}  up = {liveUp} down = {liveDown} />;
    
    // DONE TASK
    const up = `Status: ${taskRun?.data.status ||""}` ;
    const down = <TaskRunContent {...p} model={taskRun} pathList={output?.data?.filter(item => item?.path.endsWith("png"))}/>;
    const doneTask = <LayoutUpDown  bar={actionBar} up={up} down={down} />;

    return( finished ? doneTask : liveTask )  
}

// {path:'', model:{}, curTask:{}}
function TaskRunContent(p){
    const taskRun = p.model;
    
    const status = 'Output:';
    const up = Stack({list: [status]});
 
    const medias = <MediaCarousel list = {p.pathList} />;
    const script = <ScriptContent script={ taskRun?.data.script ||''} name='data.script' />
    const pItems = [{comp:medias, label:'Media'}, {comp:script, label:'Script'}];
    const down = <Pan items = {pItems} id='ws-content' props={{mountOnEnter:true}} />;
    return(<Stack list={[up, down]} />);
}

export default TaskRun
export { TaskRunItem, }