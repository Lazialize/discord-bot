const { format } = require('util');
const vm = require('vm');

const CommandBase = require('../command-base');
const Config = require('../../config.json');


/**
 * 渡された文字列をJavaScriptとして評価する
 */
class Eval extends CommandBase {
    constructor() {
        super();
        this.name = 'eval';
        this.description =
            '`eval [...javaScriptCode]`:\n' +
            ' evaluates given strings as JavaScript code\n' +
            ' `console.log` and `print` have been implemented';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        const code = args.join(' ');
        const logs = [];
        const log = (...args) => void logs.push(args.map(v => format(v)).join(' '));
        const ctx = {
            console: { log },
            print: log
        };
        try {
            const result = String(vm.runInNewContext(code, ctx, { timeout: 5000 }));
            return [...logs, result].join('\n');
        } catch (error) {
            return `Oops! Some **ERROR** occured during evaluating script!\n${error}`;
        }
    }

    /**
     * 設定ファイルに記述された言語情報を取得する
     * @returns {Map<string, Array<string>>}
     */
    getLanguages() {
        const languages = {}

        for (const language of Config.eval.languages) {
            if (
                typeof language.source !== 'string' ||
                !Array.isArray(language.names) ||
                !Array.isArray(language.steps) ||
                !this.validateStringArray(language.names) ||
                !this.validateStringArray(language.steps)
            ) {
                continue;
            }

            for (const name of language.names) {
                languages[name.toLocaleLowerCase()] = { source, steps }
            }
        }

        return languages
    }

    /**
     * 配列が string のみで構成されるか確認する
     * @param {any} array 
     * @returns {boolean}
     */
    validateStringArray(array) {
        for (const item of array) {
            if (typeof item !== 'string') {
                return false;
            }
        }
        return true;
    }
}

module.exports = Eval;
