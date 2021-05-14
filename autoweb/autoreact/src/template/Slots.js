import React from 'react';
import { Col, Row } from 'react-bootstrap';


// {list: [{comp:{},fill:'1', key:1},], style:{}}
function  SlotFree(p){
    const fillList = p.list?.map( (item,i) =>{
        return <Col xl={item.fill} key={item.key || i}> {item.comp} </Col>
    });
    return(<Row {...p.prpps}> {fillList} </Row>)
}

// { list:[<>,<>], ... }
function  Stack(p){
    const list = p.list.map( (comp,i) => { 
        return {comp: comp, fill: '12', key:i}
    });
    return( <SlotFree {...p} list={list} /> );
}

// { list:[<>,<>], ... }
function  Line(p){
    const list = p.list.map( (comp,i) => { 
        return {comp: comp, fill: 'auto', key:i}
    });
    return( <SlotFree {...p} list={list} /> );
}

function  Lane(p){
    const list = p.children?.map( (comp,i) => { 
        return {comp: comp, fill: 'auto', key:i}
    });
    return( <SlotFree {...p} list={list} /> );
}

export default SlotFree
export { Stack, Line, Lane}