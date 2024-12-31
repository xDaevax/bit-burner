export class ExecutableData {
    AutoLink;
    BruteSSH;
    DeepscanV1;
    DeepscanV2;
    FTPCrack;
    HTTPWorm;
    NUKE;
    SQLInject;
    ServerProfiler;
    fl1ght;
    relaySMTP;
    Formulas;

    constructor(existing) {
        if (existing) {
            Object.assign(this, existing);
        } else {
            this.AutoLink = false;
            this.BruteSSH = false;
            this.DeepscanV1 = false;
            this.DeepscanV2 = false;
            this.fl1ght = false;
            this.FTPCrack = false;
            this.HTTPWorm = false;
            this.NUKE = false;
            this.SQLInject = false;
            this.ServerProfiler = false;
            this.relaySMTP = false;
            this.Formulas = false;
        }
    }
}