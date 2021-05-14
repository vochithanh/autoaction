import { FcAddDatabase, FcAddRow, FcDeleteDatabase, FcFlashOff, FcImport, FcVideoCall} from 'react-icons/fc';

const icProps = {size:'2em'}
const icNew = <FcAddRow {...icProps} />;
const icDel = <FcDeleteDatabase {...icProps}/>;
const icRun = <FcVideoCall {...icProps}/>;
const iRemove = <FcFlashOff {...icProps}/>;
const icImport = <FcImport {...icProps}/>;

export {icNew, icDel, icRun, iRemove, icImport}