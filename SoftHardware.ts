export class SoftHardware {
    private txtureID: string;
    private name: string;
    private desc: string;

    public constructor(txtureID: string, name: string, desc: string, ) {
        this.txtureID = txtureID;
        this.name = name;
        this.desc = desc;
    }

    public getID() {
        return this.txtureID;
    }


    public getName() {
        return this.name;
    }

    public getDesc() {
        return this.desc;
    }
}