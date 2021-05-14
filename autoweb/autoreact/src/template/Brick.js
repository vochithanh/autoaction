import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

// CodeMirror
import {UnControlled as CodeMirror} from 'react-codemirror2';
import autoactionMode from '../codemirror/mode/autoaction/autoaction';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import { Nav, Navbar, Tabs, Tab, Form, Breadcrumb, Button, Row, Col, ResponsiveEmbed, Toast, Modal, ListGroup, OverlayTrigger, Tooltip, FormControl, Accordion, Card, CardGroup, CardColumns } from 'react-bootstrap';
import { icNew, icDel, iRemove } from './Icon';
import { log, useFetch } from '../App';
import { Line, Stack } from './Slots';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { isElement } from 'react-dom/test-utils';

// {list:{comp:<>, label:'New pro'}, gp:{}, ip{}}
function Train(p){
    const cards = p.list?.map( (item,i) => { 
        const {comp,label} = item
        return <Card body {...p.ip}>
            {comp}
            {label && <Card.Text>{label}</Card.Text>}
        </Card>
    })
    return (<Line list={cards} />)
}

// {list:[{label:'', comp:<>}]}
function Accord(p){
    const items = p.list?.map( (item,i) =>{
        const eKey = i+"";
        return <Card key={item.label}>
            <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={eKey}>
                {item.label}
            </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={eKey}>
            <Card.Body>{item.comp}</Card.Body>
            </Accordion.Collapse>
        </Card>
    });
    return( <Accordion>{items}</Accordion>)
}

// { oprops:{}, oComp:<>}
function Over(p){
    const op = {placement:'right', delay:{show:250, hide:1000} , ...p.oprops};
    op.overlay = (props) => <Tooltip {...props}>{p.oComp}</Tooltip>;
    return (<OverlayTrigger {...op}>{p.children}</OverlayTrigger>)
}

// {list:[{label:'', val:'', comp:<>, }]}
function PickList(p){
    const [search, setSearch] = useState('');
    const items = p.list.filter( item => item.label.indexOf(search) >= 0 ).map( item => item.comp );
    return(<Over oComp={<List list={items} />} oprops={{placement:'bottom-start'}} >
            <Form.Control type='text' tip="search" onChange={(e) =>{setSearch(e.target.value) }}/>
        </Over>)
}

// {show:false, title:'', content:'', action: f(), close:f()}
function ModalYn(p){
    const handleClose = () => p.close();
    const cancelBtn = <Button variant="secondary" onClick={handleClose} key='cancel'>Cancel</Button>
    const yesBtn = <Button variant="primary" key='yes' onClick={ () =>{
        p.action();
        handleClose();
    }}>Yes</Button>
    return(
        <Modal show={p.show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{p.title}</Modal.Title>
          </Modal.Header>
          {p.content && <Modal.Body>{p.content}</Modal.Body>}
          <Modal.Footer>{[yesBtn, cancelBtn]}</Modal.Footer>
        </Modal>
    );
}

function Rev(p){
    return (<Button {...p} >{iRemove}</Button>);
}

// {link:'', action:f()}
function New(p){
    return (<BarItem icon={icNew} label='New' link={p.link} action={p.action} />)
}

// {path:'', app:{}, action:f()}
function Del(p){
    let history = useHistory();
    const [setInput, output] = useFetch();
    const app = p.app;
    const delModal = { show:true, title:'Delete item', content:'Are you sure?', action:() => {
        const postAction = () =>{
            p.app.refresh();
            history?.goBack();
        };
        setInput({path: p.path, postAction: p.action || postAction});
    }, close:() => { 
        app.setApp({...app.app , modal:{show:false}});
    }};

    return(<BarItem icon={icDel} label='Delete' link='#' action = {() => {
        app.setApp({...app.app , modal:delModal});
    }}/> );
}

// {items:[{label:'', link:'#'}]}
function Move(p){
    const list = p.items?.map( (item,i) => {
        return <Link to={item.link} key={item.label} >{item.label}</Link>
    });

    return(
        <Breadcrumb>{list}</Breadcrumb>        
    )
}

// {gp:{}, ip:{}, header:<>, list:[<>]}
function List(p){
    const list = p.list;
    const items = list?.map( (item,i) =>{
        return <ListGroup.Item as='div' action variant='primary' {...p.ip} key={item.props?.label || i}>{item}</ListGroup.Item>
    })

    return(<ListGroup {...p.gp}>{p.header}{items}</ListGroup>)
}

const keyMatch = (key,text) => key.length == 0 || text?.toLowerCase().indexOf(key.toLowerCase()) >= 0
function Rub(p){
    const [key, setKey] = useState('');
    
    const search = <Form.Control type='text' placeholder="Search..." onChange={(e) =>{setKey(e.target.value) } } />

    const list = p.list?.filter( item => keyMatch(key, item?.props?.label) );
    const group = <List {...p} list={list} />

    return(<Stack list={[search, group]}/>)
}

// {list:[<>,], style:{}}
function Bar(p){
    return(<Navbar {...p.style }>
        {p.list}
    </Navbar>);
}

// {icon:<>, label:'', link:'/home', action:f()}
function BarItem(p){
    const label = p.icon? p.icon : p.label;
    const link = <Link to = {p.link} >{label}</Link>;
    const btn = <Nav.Link href={p.link} onSelect = {p.action} >{label} </Nav.Link>;
    const fill = p.action ? btn : link;
    return ( <Nav.Item>{fill}</Nav.Item>);
}

// {items:[{comp:<>, label:''},], props:{}}
function Pan(p){
    const list = p.items?.map( (item,i) =>{
        return <Tab title = { item.label} key={i} eventKey={item.label} >{item.comp}</Tab>
    })
    return(<Tabs {...p.props} >{list}</Tabs>)
}

// {label:'New', link:''}
function ActionItem(p){
    return(<Nav.Item>
        <Nav.Link href={p.link} >{p.label}</Nav.Link>
    </Nav.Item>)
}

//{ items:[{label:'', link:''},] , className:''}
function ActionMenu(p) {
    // build items
    const items = p.items?.map( (item) =>{
        return <ActionItem {...item} key={item.label} />
    });

    return(
        <Nav className={p.className} >{items}</Nav>
    );
}

// {label:'Back', link:'/Home'}
function BackLink(p){
    let history = useHistory();
    const label = p.label? p.label:'Back';
    return (<button onClick = {() => { history.goBack(); }}>{label}</button>)
}

//{ header:'Header', items:[{comp:<>, key:k},{comp:<>,key:k}], isLeftRight:false}
function MenuLink(p) {
    const horizontal = p.isLeftRight ? 'pure-menu-horizontal' : ''
    // build items
    const items = p.items?.map( (item,_) =>{
        return <li className = "pure-menu-item" key={item.key}>{item.comp}</li>
    });

    return(
        <div className= {'pure-menu ' + horizontal}>
            <div className='pure-menu-heading'> {p.header} </div>
            <ul className="pure-menu-list"> {items} </ul>
        </div>
    );
}


//{ labels: ['New','Run'], actions:[newAction,runAction]
function MenuControl(p) {
    
    const actions = p.actions;
    const items = p.labels.map( (label, i) => {
        return <li className = 'pure-menu-item' key = {label} ><Link to = {actions[i]} className = "pure-menu-link" >{label}</Link></li>
    });

    return(
        <div className = "pure-menu pure-menu-horizontal">
            <ul className = "pure-menu-list">
                {items}
            </ul>
        </div>
    );
}


//{  inner:<>, onSubmit:()=>{}, init:f(), type:''}
function ContentForm(p) {
    return(
        <Form onSubmit={p.submit} method='post' encType={ p.type || "multipart/form-data"} id={p.id}>
            {p.inner}
        </Form>
    );
}

// {name:'name', type:'text', tip:'Please input', value:'Jame', label:'Project name', setValue:f()}
function Input(p) {
    const [value,setValue] = useState('');
    const name = p.name

    useEffect( () => { setValue(p.value) }, [p.value]);

    return(
        <Form.Group as={Row} >
            <Form.Label column sm={2}>{p.label}</Form.Label>
            <Col sm={10}>
            <Form.Control type={p.type} name = {name} placeholder={p.tip} value={value} onChange={(e) => { 
                const newVal = e.target.value;
                p.setValue && p.setValue(newVal);
                setValue(newVal);
            }} />
            </Col>
        </Form.Group>        
    );
}

// {value:'Save'}
function SubmitBtn(p){
    return(
        <Button variant='primary' type='submit'>{p.value}</Button>
    )
}

// {title:'', content:'', show:false, setShow:f()}
function NotificationBar(p){
    return(
        <Toast onClose={() => p.setShow(false)} show={p.show} delay={3000} autohide>
          <Toast.Header>
            <strong className="mr-auto">{p.title || ''}</strong>
          </Toast.Header>
          {p.content && <Toast.Body>{p.content}</Toast.Body>}
        </Toast>
    )
}

// {script:'', name:''}
function ScriptContent(p){
    const [script,setScript] = useState(p.script);
    const name = p.name

    return(<>
        <CodeMirror value={p.script} options={{ mode: 'autoaction', theme:'eclipse', lineNumbers:true}}
            defineMode={{name:'autoaction',fn: autoactionMode}} onChange={(editor, data, value) => {
                setScript(value);
        }} />
        <textarea name={name} hidden={true} value={script} readOnly></textarea>  
    </>)
}

// {html:''}
function InnerDom(p){
    const inner = p.html;
    return (<div dangerouslySetInnerHTML={{__html: inner}}></div>)
}

// {list:[{path:''},{path:''}]}
function MediaCarousel(p){
    const itemList = p.list?.map( m => { 
        return <Carousel.Item key={m.path}>
            <MediaItem {...m} />
        </Carousel.Item>});

  return <Carousel>{itemList}</Carousel>;
}

// {path:""}
function MediaItem(p){
    const path = p.path;
    const image = <img src={path} alt = '' className="d-block w-100"/>;
    const video = <video className="" controls = {true} src = {path} type = "video/ogg"></video>
    const dom = <InnerDom />
    const media = path.endsWith(".png") ? image: <div/>;
    return( media )
}

// {path:"", style:{}}
function MediaLive(p){
    const path = p.path;
    const style = p.style;
    
    const image = <ResponsiveEmbed aspectRatio="16by9">
        <embed type="image/svg+xml" src={path} />
    </ResponsiveEmbed>;

    return(<div style={style}>{image}</div>)
}

export {Accord, Train}
export {Rev, New, Del, ModalYn, PickList, List, Rub, Over}
export {Bar, BarItem, Pan, Move}
export {ActionItem, ActionMenu}
export { MediaLive, MediaCarousel}
export { MenuLink, MenuControl, ContentForm, Input, SubmitBtn, NotificationBar, BackLink, ScriptContent, InnerDom, MediaItem}