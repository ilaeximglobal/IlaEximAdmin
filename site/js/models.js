class Factory {
    static object(fields) {
        let o = new Object();
        Factory.addFields(fields, o);
        return o;
    }
    static addFields(fields,o) {
        fields.forEach(f => {
            o[f.name] = f.default;
        });
    }
    static copyFields(fields,src,dest) {
        fields.forEach(f => {
            dest[f.name] = src[f.name];
        });
    }

    static updateStringFromBoolean(o) {
        o.booleanFields.forEach(f => {
            o[f] = o['is_' + f] ? 'Y' : 'N';
        });
    }
    static updateBooleanFromString(o) {
        o.booleanFields.forEach(f => {
            o['is_' + f] = o[f] == 'Y';
        });
    }

    static updateStringFromPrintable(o) {
        o.printableFields.forEach(f => {
            o[f] = o['printable_' + f].replaceAll('\n\n', '<br>');
        });
    }
    static updatePrintableFromString(o) {
        o.printableFields.forEach(f => {
            o['printable_' + f] = o[f].replaceAll('<br>', '\n\n');
        });
    }

    static updateStringFromHistory(o) {
        o.historyFields.forEach(f => {
            o[f] = o['older_' + f];
        });
    }
    static updateHistoryFromString(o) {
        o.historyFields.forEach(f => {
            o['older_' + f] = o[f];
        });
    }
}

class BaseObject{
    constructor(fields,uiFields,booleanFields,printableFields,historyFields) {
        this.fields = fields;
        this.uiFields = uiFields;
        this.booleanFields = booleanFields;
        this.printableFields = printableFields;
        this.historyFields = historyFields;
        Factory.object(this.fields);
    }

    preProcess(){
        Factory.addFields(this.uiFields,this);
        Factory.updateBooleanFromString(this);
        Factory.updatePrintableFromString(this);
        Factory.updateHistoryFromString(this);
    }

    preProcessWithoutUIUpdate(){
        Factory.updateBooleanFromString(this);
        Factory.updatePrintableFromString(this);
        Factory.updateHistoryFromString(this);
    }

    postProcess(){
        Factory.updateStringFromBoolean(this);
        Factory.updateStringFromPrintable(this);
        this.isContactFormDisabled = true;
    }

    revertOlder(){
        Factory.updateStringFromHistory(this);
        this.preProcess();
    }

    finalizeNewer(){
        Factory.updateHistoryFromString(this);
        this.preProcessWithoutUIUpdate();
    }

    setMessage(message){
        this.messageType = message.type;
        this.messageText = message.text;
    }

    static fromData = function (o,data) {
        Factory.copyFields(this.fields, data, o);
        o.preProcess();
        return o;
    }

    static toData = function (o,data) {
        data.postProcess();
        Factory.copyFields(this.fields, data, o);
        return o;
    }
}

class Faq extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'question', type: 'string' , default: ''},
        { name: 'answer', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['answer'];
    static historyFields = ['question', 'answer', 'showing'];

    constructor(){
        super(Faq.fields,Faq.uiFields,Faq.booleanFields,Faq.printableFields,Faq.historyFields);
    }

    static blankFaq = function () {
        return new Faq();
    }
}

class KeyPerson extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'name', type: 'string' , default: ''},
        { name: 'designation', type: 'string' , default: ''},
        { name: 'expertise', type: 'string' , default: ''},
        { name: 'about', type: 'string' , default: ''},
        { name: 'image', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = [];
    static historyFields = ['name', 'designation', 'expertise', 'about', 'image', 'showing'];

    constructor(){
        super(KeyPerson.fields,KeyPerson.uiFields,KeyPerson.booleanFields,KeyPerson.printableFields,KeyPerson.historyFields);
    }

    static blankKeyperson = function () {
        return new KeyPerson();
    }
}

class Blog extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'string_id', type: 'string' , default: ''},
        { name: 'title', type: 'string' , default: ''},
        { name: 'description', type: 'string' , default: ''},
        { name: 'image', type: 'string' , default: ''},
        { name: 'author', type: 'string' , default: ''},
        { name: 'product_ids', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['description'];
    static historyFields = ['string_id', 'title', 'description', 'image', 'author', 'product_ids', 'showing'];

    constructor(){
        super(Blog.fields,Blog.uiFields,Blog.booleanFields,Blog.printableFields,Blog.historyFields);
    }

    static blankBlog = function () {
        return new Blog();
    }
}