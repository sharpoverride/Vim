// XXX: use graceful-fs ??
import fs = require('fs');

import node = require('../node');
import util = require('../../util');
import error = require('../../error');

export interface WriteCommandArguments extends node.CommandArgs {
    opt? : string;
    optValue? : string;
    bang? : boolean;
    range? : node.LineRange;
    file? : string;
    append? : boolean;
    cmd? : string;
}

//
//  Implements :write
//  http://vimdoc.sourceforge.net/htmldoc/editing.html#:write
//
export class WriteCommand extends node.CommandBase {
    protected _arguments : WriteCommandArguments;

    constructor(args : WriteCommandArguments = {}) {
        super();
        this._name = 'write';
        this._shortName = 'w';
        this._arguments = args;
    }

    get arguments() : WriteCommandArguments {
        return this._arguments;
    }

    execute() : void {
        if (this.arguments.opt) {
            util.showError("Not implemented.");
            return;
        } else if (this.arguments.file) {
            util.showError("Not implemented.");
            return;
        } else if (this.arguments.append) {
            util.showError("Not implemented.");
            return;
        } else if (this.arguments.cmd) {
            util.showError("Not implemented.");
            return;
        }

        if (this.activeTextEditor.document.isUntitled) {
            throw error.VimError.fromCode(error.ErrorCode.E32);
        }

        fs.access(this.activeTextEditor.document.fileName, fs.W_OK, (accessErr) => {
            if (accessErr) {
                if (this.arguments.bang) {
                    fs.chmod(this.activeTextEditor.document.fileName, 666, (e) => {
                        if (e) {
                            util.showError(e.message);
                        } else {
                            this.save();
                        }
                    });
                } else {
                    util.showError(accessErr.message);
                }
            } else {
                this.save();
            }
        });
    }

    private save() {
        this.activeTextEditor.document.save().then(
            (ok) => {
                if (ok) {
                    util.showInfo("File saved.");
                } else {
                    util.showError("File not saved.");
                }
            },
            (e) => util.showError(e)
        );
    }
}
