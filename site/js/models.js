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
    static copyFileFields(fileFields,src,dest) {
        fileFields.forEach(f => {
            dest['file_' + f] = src['file_' + f];
            dest['path_' + f] = src['path_' + f];
            dest['isfilechanged_' + f] = src['isfilechanged_' + f];
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

    static updateStringFromList(o) {
        o.listFields.forEach(f => {
            o[f] = o['selection_' + f].join(',');
        });
    }
    static updateListFromString(o) {
        o.listFields.forEach(f => {
            o['selection_' + f] = o[f].split(',');
        });
    }

    static updateFileFromString(o) {
        o.fileFields.forEach(f => {
            o['file_' + f] = {name:'',data:''};
            o['isfilechanged_' + f] = false;
        });
    }
    static setDefaultForFileFields(o) {
        o.fileFields.forEach(f => {
            o['isfilechanged_' + f] = true;
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
    constructor(fields,uiFields,booleanFields,printableFields,listFields,fileFields,historyFields) {
        this.fields = fields;
        this.uiFields = uiFields;
        this.booleanFields = booleanFields;
        this.printableFields = printableFields;
        this.listFields = listFields;
        this.fileFields = fileFields;
        this.historyFields = historyFields;
        Factory.object(this.fields);
    }

    preProcess(){
        Factory.addFields(this.uiFields,this);
        Factory.updateBooleanFromString(this);
        Factory.updatePrintableFromString(this);
        Factory.updateListFromString(this);
        Factory.updateFileFromString(this);
        Factory.updateHistoryFromString(this);
    }

    preProcessWithoutUIUpdate(){
        Factory.updateBooleanFromString(this);
        Factory.updatePrintableFromString(this);
        Factory.updateListFromString(this);
        Factory.updateFileFromString(this);
        Factory.updateHistoryFromString(this);
    }

    postProcess(){
        Factory.updateStringFromBoolean(this);
        Factory.updateStringFromPrintable(this);
        Factory.updateStringFromList(this);
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

    setDefaultForNewObject(){
        this.is_showing = true;
        Factory.setDefaultForFileFields(this);
    }

    static fromData = function (o,data) {
        Factory.copyFields(this.fields, data, o);
        Factory.copyFileFields(this.fileFields, data, o);
        o.preProcess();
        return o;
    }

    static toData = function (o,data) {
        data.postProcess();
        Factory.copyFields(this.fields, data, o);
        Factory.copyFileFields(this.fileFields, data, o);
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
    static fileFields = [];
    static historyFields = ['question', 'answer', 'showing'];

    constructor(){
        super(Faq.fields,Faq.uiFields,Faq.booleanFields,Faq.printableFields,Faq.listFields,Faq.fileFields,Faq.historyFields);
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
    static fileFields = ['image'];
    static historyFields = ['name', 'designation', 'expertise', 'about', 'image', 'showing'];

    constructor(){
        super(KeyPerson.fields,KeyPerson.uiFields,KeyPerson.booleanFields,KeyPerson.printableFields,KeyPerson.listFields,KeyPerson.fileFields,KeyPerson.historyFields);
    }

    static blankKeyperson = function () {
        return new KeyPerson();
    }

    static blankNewKeyperson = function () {
        let newKeyperson = new KeyPerson();
        newKeyperson.setDefaultForNewObject();
        return newKeyperson;
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
    static listFields = ['product_ids'];
    static fileFields = ['image'];
    static historyFields = ['string_id', 'title', 'description', 'image', 'author', 'product_ids', 'showing'];

    constructor(){
        super(Blog.fields,Blog.uiFields,Blog.booleanFields,Blog.printableFields,Blog.listFields,Blog.fileFields,Blog.historyFields);
    }

    static blankBlog = function () {
        return new Blog();
    }

    static blankNewBlog = function () {
        let newBlog = new Blog();
        newBlog.setDefaultForNewObject();
        return newBlog;
    }
}

class Certificate extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'name', type: 'string' , default: ''},
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
    static fileFields = [];
    static historyFields = ['name', 'image', 'showing'];

    constructor(){
        super(Certificate.fields,Certificate.uiFields,Certificate.booleanFields,Certificate.printableFields,Certificate.listFields,Certificate.fileFields,Certificate.historyFields);
    }

    static blankCertificate = function () {
        return new Certificate();
    }
}

class AboutDetail extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'title', type: 'string' , default: ''},
        { name: 'detail', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['detail'];
    static fileFields = [];
    static historyFields = ['title', 'detail', 'showing'];

    constructor(){
        super(AboutDetail.fields,AboutDetail.uiFields,AboutDetail.booleanFields,AboutDetail.printableFields,AboutDetail.listFields,AboutDetail.fileFields,AboutDetail.historyFields);
    }

    static blankAboutDetail = function () {
        return new AboutDetail();
    }
}

class Review extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'title', type: 'string' , default: ''},
        { name: 'review', type: 'string' , default: ''},
        { name: 'reviewer_name', type: 'string' , default: ''},
        { name: 'reviewer_designation', type: 'string' , default: ''},
        { name: 'product_ids', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['review'];
    static fileFields = [];
    static historyFields = ['title', 'review', 'reviewer_name', 'reviewer_designation', 'product_ids', 'showing'];

    constructor(){
        super(Review.fields,Review.uiFields,Review.booleanFields,Review.printableFields,Review.listFields,Review.fileFields,Review.historyFields);
    }

    static blankReview = function () {
        return new Review();
    }
}

class MainProduct extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'string_id', type: 'string' , default: ''},
        { name: 'item_order', type: 'number' , default: 0},
        { name: 'name', type: 'string' , default: ''},
        { name: 'type', type: 'string' , default: ''},
        { name: 'short_description', type: 'string' , default: ''},
        { name: 'description', type: 'string' , default: ''},
        { name: 'image', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['short_description','description'];
    static fileFields = [];
    static historyFields = ['string_id', 'item_order', 'name', 'type', 'short_description', 'description', 'image', 'showing'];

    constructor(){
        super(MainProduct.fields,MainProduct.uiFields,MainProduct.booleanFields,MainProduct.printableFields,MainProduct.listFields,MainProduct.fileFields,MainProduct.historyFields);
    }

    static blankMainProduct = function () {
        return new MainProduct();
    }
}

class Product extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'main_product_id', type: 'number' , default: -1},
        { name: 'item_order', type: 'number' , default: 0},
        { name: 'name', type: 'string' , default: ''},
        { name: 'image', type: 'string' , default: ''},
        { name: 'description', type: 'string' , default: ''},
        { name: 'benefit', type: 'string' , default: ''},
        { name: 'uses', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['description'];
    static fileFields = [];
    static historyFields = ['main_product_id', 'item_order', 'name', 'image', 'description', 'benefit', 'uses', 'showing'];

    constructor(){
        super(Product.fields,Product.uiFields,Product.booleanFields,Product.printableFields,Product.listFields,Product.fileFields,Product.historyFields);
    }

    static blankProduct = function () {
        return new Product();
    }
}

class ProductItem extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'main_product_id', type: 'number' , default: -1},
        { name: 'name', type: 'string' , default: ''},
        { name: 'description', type: 'string' , default: ''},
        { name: 'image', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['description'];
    static fileFields = [];
    static historyFields = ['main_product_id', 'name', 'description', 'image', 'showing'];

    constructor(){
        super(ProductItem.fields,ProductItem.uiFields,ProductItem.booleanFields,ProductItem.printableFields,ProductItem.listFields,ProductItem.fileFields,ProductItem.historyFields);
    }

    static blankProductItem = function () {
        return new ProductItem();
    }
}

class ProductImage extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'product_id', type: 'number' , default: -1},
        { name: 'image', type: 'string' , default: ''},
        { name: 'description', type: 'string' , default: ''},
        { name: 'item_order', type: 'number' , default: 0},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['description'];
    static fileFields = [];
    static historyFields = ['product_id', 'image', 'description', 'item_order', 'showing'];

    constructor(){
        super(ProductImage.fields,ProductImage.uiFields,ProductImage.booleanFields,ProductImage.printableFields,ProductImage.listFields,ProductImage.fileFields,ProductImage.historyFields);
    }

    static blankProductImage = function () {
        return new ProductImage();
    }
}

class ProductLink extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'product_id', type: 'number' , default: -1},
        { name: 'name', type: 'string' , default: ''},
        { name: 'link', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = ['name'];
    static fileFields = [];
    static historyFields = ['product_id', 'name', 'link', 'showing'];

    constructor(){
        super(ProductLink.fields,ProductLink.uiFields,ProductLink.booleanFields,ProductLink.printableFields,ProductLink.listFields,ProductLink.fileFields,ProductLink.historyFields);
    }

    static blankProductLink = function () {
        return new ProductLink();
    }
}
