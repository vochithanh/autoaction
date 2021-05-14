import React, { useState } from 'react';

const keyMatch = (key,text) => key.length == 0 || text?.toLowerCase().indexOf(key.toLowerCase()) >= 0

function List(p){
    return <ul>{p.list}</ul>
}

function Stack(p){
    return <div>{p.list}</div>
}

function Rub(p){
    const [key, setKey] = useState('');
    
    const search = <input type='text' placeholder="Search..." onChange={(e) =>{setKey(e.target.value) } } />

    const list = p.list?.filter( item => keyMatch(key, item?.props?.label) );
    const group = <List {...p} list={list} />

    return(<Stack list={[search, group]}/>)
}

function Pig(p){
    const list = [<li label='item1'>item1</li>, <li label='item2'>item2</li>];
    return <Rub {...p} list = {list}/>
}