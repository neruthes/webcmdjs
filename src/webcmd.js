const PROTOAPP = function () {
    this._defined_commands = {};
    return this;
};

PROTOAPP.prototype.define = function (cmd_name, cmd_handler) {
    this._defined_commands[cmd_name] = cmd_handler;
};

PROTOAPP.prototype.accept = function (req, res, env) {
    const bodyjson = JSON.parse(env.reqbody);
    console.log(bodyjson);
    const cmd_name = bodyjson.cmd;
    const data = {
        cmd: bodyjson.cmd,
        args: bodyjson.args,
        env,
        req, res
    }
    this._defined_commands[cmd_name](data);
};



const WEBCMD = {
};

WEBCMD.createApp = function () {
    const newapp = new PROTOAPP();
    return newapp;
}

module.exports = WEBCMD;
