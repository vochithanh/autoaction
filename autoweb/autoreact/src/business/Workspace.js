import LayoutLRUP from "../template/Layouts";
import {Bar, BarItem, ContentForm, Input, InputField, List, Move, New, Pan, Rub, Train} from "../template/Brick";
import {ProjectItem} from "./Project";
import { Line, Stack } from "../template/Slots";
import { icAdd } from "../template/Icon";
import { Card, Col, Row } from "react-bootstrap";

function Workspace(p) {
    const db = p.db;
    
    // LEFT
    const projects = db.projects?.map( (pro,_) =>{
        return <ProjectItem model={pro} app={p} label={pro.data.name}/>
    });    
    const left = <Rub header="Projects" list={projects} />;
    
    // UP
    const move = <Move items ={[{label:'Scripts', link:'/scripts'}]} />
    const up = <Line list={[move]} />;
    
    // DOWN
    const down = < WorkspaceContent {...p} />;

    return( LayoutLRUP({left: left, right:{ up: up, down: down} }));
}

function WorkspaceContent(p) {
    const {db,config} = p;

    // WORKSPACE
    const newPro = {comp:<New link='/project/0' key='new'/>};
    const actions = <Train list={[newPro]} ip={ {border:'warning'} }/>    
    const sum = <Card body>{`Total: ${db.projects?.length || 0 } project(s)!`}</Card>
    const wsContent = <Stack list={[actions,sum ]} />

    // CONFIG
    const wsConfig = <>
        <Input name='aaServer' type ='text' tip='' value ={config.aaServer} label='AutoAction server' setValue={
            (url) => { p.setConfig({ ...config , aaServer:url })}
        }/>
        <Input name='livePeriod' type ='text' tip='' value = {config.livePeriod} label='Live period' setValue={
            (period) => { p.setConfig({ ...config , livePeriod:period })}
        }/>
        <Input name='liveStatusPeriod' type ='text' tip='' value = {config.liveStatusPeriod} label='Live status period' setValue={
            (period) => { p.setConfig({ ...config , liveStatusPeriod:period })}
        }/>     
    </>
    const pConfig = <ContentForm inner={wsConfig} />;

    const pItems = [{comp:wsContent, label:'Workspace'}, {comp:pConfig, label:'Config'}];
    return(<Pan items = {pItems} id='ws-content' activeKey='Summary' />);
}

export default Workspace