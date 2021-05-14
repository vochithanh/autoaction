import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { pick, useFetch, usePost, log, buildMove, pickModels } from "../App";
import { Rev, Bar, BarItem, ContentForm, Del, InnerDom, Input, List, MediaCarousel, MediaItem, MediaLive, MenuLink, New, NotificationBar, Over, PickList, ScriptContent, SubmitBtn, Accord, Rub } from "../template/Brick";
import { icImport } from "../template/Icon";
import LayoutLRUP from "../template/Layouts";
import {  Line, Stack,Lane } from "../template/Slots";

// {ids:''}
function PickScript(p){
    const scripts = p.db.scripts;
    const [ids, setIds] = useState(p.ids);

    const fContains = (s) => ids?.indexOf(s.id) >= 0;
    const list = scripts.filter(s => !fContains(s)).map( s => { 
        return <ScriptItem label={s.data.name} model={s} action = {() =>{
            setIds( f => f + ',' + s.id)
        }}/>
    });
    const pick = <Rub list={list}/>;
    const accPick = <Accord list={[{label:'Add script', comp:pick}]} />
    const curList = scripts.filter(fContains).sort( (i1,i2) => ids.indexOf(i1.id) - ids.indexOf(i2.id));
    const sList = <ScriptList scripts = {curList} name={p.name} action={ (id) =>{
        setIds( f => f.split(',').filter( item => id !== item).join(','))
    }}/>

    return (<Stack list = {[accPick,sList]}/>)
}

// {scripts:[], name:'', action:f(id)}
function ScriptList(p){
    const scripts = p.scripts;
    const list = scripts.map( s => { return <Over oComp={<Rev onClick={ () => { p.action(s.id)}} />}><span>{s.data.name}</span></Over> });
    const ids = scripts.map( s => s.id).join(',') || '';
    const hInput = <Input type="hidden" value={ids} name={p.name} />
    const items = <List list={list} ip={{variant:'warning'}}/>
    return (<Stack list={[hInput,items]}/>)
}

// {model:{}, action:f()}
function ScriptItem(p) {
    const script = p.model;
    return(
        <BarItem link='#' action={p.action} label={script?.data.name} />
    );
}

// {db:{}}
function Script(p){
    const db = p.db;
    // const scripts = db.projects[0].tasks;
    const scripts = db.scripts;
    const [script, setScript] = useState();

    // BAR
    const newS = <New link='#' key='new' action={ () => { setScript({id: 0, data:{name:''}});}}/>;
    const delS = (script?.id > 0) && <Del app={p} path={`spelremove/scripts/${script.id}`} key='del' action={
        () => { p.refresh(); setScript(null); }
    }/>;

    const [setInput,output] = usePost();
    const handleImp = (e) => {
        e.preventDefault();
        const onload =  (e) =>{
            const reader = e.target;
            const text = reader.result;
            reader.postData['data.script'] = text;
            const path = `spelnew/scripts/0`;
            setInput({path:path,data:reader.postData});
            p.refresh();            
        }
        Array.from(e.target.files).forEach( (file) =>{
            const reader = new FileReader();
            reader.onload = onload;
            reader.postData = {id: 0, 'data.name':file.name,'data.script':''};
            reader.readAsText(file);
        });
    }
    
    const impS = <Form.File id='custom-file' label='Import script files' custom multiple onChange={handleImp}></Form.File>
    const actions = [impS, newS, delS]
    const actionBar = <Bar list={actions} />

    // LEFT
    const runs = scripts.sort(
        (i1,i2) => i2.data.id - i1.data.id
    ).map( scr =>{
        return <ScriptItem model = {scr} label={scr.data.name} action = {() => { setScript(scr)}} />;
    });
    const left = <Rub header='Scripts' list = {runs} ip={{variant:'danger'}}/>;

    // RIGHT
    const move = <Line list={[buildMove({db:db, level:0}),actionBar]} />;
    const total = `Total: ${runs?.length} scripts(s)!`;
    const up = <Stack list={[move,total]} />
    const down = script && <ScrContent {...p} model={script} setScript={setScript}/>;

    return( LayoutLRUP({ left: left, right:{ up: up, down: down} }));  
}

// {path:'', model:{}, setScript:f()}
function ScrContent(p){
    const script = p.model;
    const [setInput,output] = usePost();
    const [showMsg,setShowMsg] = useState(false);

    
    const submit = event => {
        event.preventDefault();
        const path = (script.id > 0) ?`spelsave/scripts.$[id == ${script.id}]`:`spelnew/scripts/${script.id}`;
        const formData = new FormData(event.target);
        setInput({path:path,form:formData, postAction:() => setShowMsg(true),});
    }    
    
    useEffect(() =>{
        const postScript = () => {
            p.refresh();
            p.setScript(output.data);
        };
        output && postScript();
    }, [output]);

    const notice = output && <NotificationBar title={output.result} show={showMsg} setShow={setShowMsg} />;
    const inner = <>
        <Input name='data.name' type ='text' tip='' value ={script ? script.data.name : ''} label='Script name' />
        <ScriptContent script={ script?.data.script ||''} name='data.script' />
        <SubmitBtn value='Save' />
    </>
    const form = <ContentForm inner={inner} submit={submit} id='form-script' type='application/x-www-form-urlencoded'/>

    return( <Stack list={[notice,form]} />);
}

export default Script
export {PickScript, ScriptList}