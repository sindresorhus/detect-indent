import {expectType} from 'tsd';
import detectIndent from './index.js';

const indent = detectIndent('');
expectType<detectIndent.Indent>(indent);
expectType<number>(indent.amount);
expectType<string>(indent.indent);
expectType<'space' | 'tab' | undefined>(indent.type);
