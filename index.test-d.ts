import {expectType} from 'tsd';
import detectIndent, {Indent} from './index.js';

const indent = detectIndent('');
expectType<Indent>(indent);
expectType<number>(indent.amount);
expectType<string>(indent.indent);
expectType<'space' | 'tab' | undefined>(indent.type);
