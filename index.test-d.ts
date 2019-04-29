import {expectType} from 'tsd';
import detectIndent = require('.');

const indent = detectIndent('');
expectType<detectIndent.Indent>(indent);
expectType<number>(indent.amount);
expectType<string>(indent.indent);
expectType<'space' | 'tab' | undefined>(indent.type);
