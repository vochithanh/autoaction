import { Container } from 'react-bootstrap';
import SlotFree, { Stack } from './Slots';

// { bar:<>, left:{}, right: {up: {}, down: {}} }
function LayoutLRUP(p){
    const right = <Stack list={[p.right.up, p.right.down]} />;
    const list = [{comp: p.left, fill: 2, key:'left'}, {comp:right, fill:10, key:'right'}];
    return( 
        <Container>
            {p.bar}
            <SlotFree list={list} />
        </Container>
     );
}

// {bar:<>, up:<>, down:<>
function LayoutUpDown(p){
    return( <Container>
        {p.bar}
        <Stack list={[ p.up, p.down ]}/> );
    </Container>)
}

export default LayoutLRUP
export {LayoutUpDown}
