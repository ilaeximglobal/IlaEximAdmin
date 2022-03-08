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
            if(o['selection_' + f].length>=1){
                o[f] = o['selection_' + f].join(',');
            }else if(o['single_selection_' + f]!=undefined){
                o[f] = o['single_selection_' + f];
            }
        });
    }
    static updateListFromString(o) {
        o.listFields.forEach(f => {
            o['selection_' + f] = o[f].split(',');
            if(o[f].split(',').length==1){
                o['single_selection_' + f] = o[f].split(',')[0];
            }
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
    static listFields = [];
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
        { name: 'country', type: 'string' , default: ''},
        { name: 'person_type', type: 'string' , default: ''},
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
    static listFields = [];
    static fileFields = ['image'];
    static historyFields = ['name', 'designation', 'expertise', 'country', 'person_type', 'about', 'image', 'showing'];

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
        { name: 'title', type: 'string' , default: ''},
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
    static listFields = [];
    static fileFields = ['image'];
    static historyFields = ['title', 'image', 'showing'];

    constructor(){
        super(Certificate.fields,Certificate.uiFields,Certificate.booleanFields,Certificate.printableFields,Certificate.listFields,Certificate.fileFields,Certificate.historyFields);
    }

    static blankCertificate = function () {
        return new Certificate();
    }

    static blankNewCertificate = function () {
        let newCertificate = new Certificate();
        newCertificate.setDefaultForNewObject();
        return newCertificate;
    }
}

class AboutDetail extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'name', type: 'string' , default: ''},
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
    static listFields = [];
    static fileFields = [];
    static historyFields = ['name', 'detail', 'showing'];

    constructor(){
        super(AboutDetail.fields,AboutDetail.uiFields,AboutDetail.booleanFields,AboutDetail.printableFields,AboutDetail.listFields,AboutDetail.fileFields,AboutDetail.historyFields);
    }

    static blankAboutDetail = function () {
        return new AboutDetail();
    }

    static blankNewAboutDetail = function () {
        let newAboutDetail = new AboutDetail();
        newAboutDetail.setDefaultForNewObject();
        return newAboutDetail;
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
    static listFields = ['product_ids'];
    static fileFields = [];
    static historyFields = ['title', 'review', 'reviewer_name', 'reviewer_designation', 'product_ids', 'showing'];

    constructor(){
        super(Review.fields,Review.uiFields,Review.booleanFields,Review.printableFields,Review.listFields,Review.fileFields,Review.historyFields);
    }

    static blankReview = function () {
        return new Review();
    }

    static blankNewReview = function () {
        let newReview = new Review();
        newReview.setDefaultForNewObject();
        return newReview;
    }
}

class Product extends BaseObject{
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
    static printableFields = ['description'];
    static listFields = [];
    static fileFields = ['image'];
    static historyFields = ['string_id', 'item_order', 'name', 'type', 'short_description', 'description', 'image', 'showing'];

    constructor(){
        super(Product.fields,Product.uiFields,Product.booleanFields,Product.printableFields,Product.listFields,Product.fileFields,Product.historyFields);
    }

    static blankProduct = function () {
        return new Product();
    }

    static blankNewProduct = function () {
        let newProduct = new Product();
        newProduct.setDefaultForNewObject();
        return newProduct;
    }

    toDataString = function () {
        // return this.id + ' - ' + this.item_order;
        return this.name + ' - ' + this.type;
    }
}

class SubProduct extends BaseObject{
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
    static printableFields = ['description','benefit','uses'];
    static listFields = ['main_product_id'];
    static fileFields = ['image'];
    static historyFields = ['main_product_id', 'item_order', 'name', 'image', 'description', 'benefit', 'uses', 'showing'];

    constructor(){
        super(SubProduct.fields,SubProduct.uiFields,SubProduct.booleanFields,SubProduct.printableFields,SubProduct.listFields,SubProduct.fileFields,SubProduct.historyFields);
    }

    static blankSubProduct = function () {
        return new SubProduct();
    }

    static blankNewSubProduct = function () {
        let newSubProduct = new SubProduct();
        newSubProduct.setDefaultForNewObject();
        console.log(newSubProduct);
        return newSubProduct;
    }

    toDataString = function () {
        // return this.id + ' - ' + this.item_order;
        return this.name;
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
    static printableFields = [];
    static listFields = ['main_product_id'];
    static fileFields = [];
    static historyFields = ['main_product_id', 'name', 'showing'];

    constructor(){
        super(ProductItem.fields,ProductItem.uiFields,ProductItem.booleanFields,ProductItem.printableFields,ProductItem.listFields,ProductItem.fileFields,ProductItem.historyFields);
    }

    static blankProductItem = function () {
        return new ProductItem();
    }

    static blankNewProductItem = function () {
        let newProductItem = new ProductItem();
        newProductItem.setDefaultForNewObject();
        return newProductItem;
    }
}

class ProductImage extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'product_id', type: 'number' , default: -1},
        { name: 'image', type: 'string' , default: ''},
        { name: 'short_description', type: 'string' , default: ''},
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
    static listFields = ['product_id'];
    static fileFields = ['image'];
    static historyFields = ['product_id', 'image', 'description', 'short_description', 'item_order', 'showing'];

    constructor(){
        super(ProductImage.fields,ProductImage.uiFields,ProductImage.booleanFields,ProductImage.printableFields,ProductImage.listFields,ProductImage.fileFields,ProductImage.historyFields);
    }

    static blankProductImage = function () {
        return new ProductImage();
    }

    static blankNewProductImage = function () {
        let newProductImage = new ProductImage();
        newProductImage.setDefaultForNewObject();
        return newProductImage;
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
    static printableFields = [];
    static listFields = ['product_id'];
    static fileFields = [];
    static historyFields = ['product_id', 'name', 'link', 'showing'];

    constructor(){
        super(ProductLink.fields,ProductLink.uiFields,ProductLink.booleanFields,ProductLink.printableFields,ProductLink.listFields,ProductLink.fileFields,ProductLink.historyFields);
    }

    static blankProductLink = function () {
        return new ProductLink();
    }

    static blankNewProductLink = function () {
        let newProductLink = new ProductLink();
        newProductLink.setDefaultForNewObject();
        return newProductLink;
    }
}

class DiamondSubProduct extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'product_id', type: 'number' , default: -1},
        { name: 'item_order', type: 'number' , default: 0},
        { name: 'name', type: 'string' , default: ''},
        { name: 'showing', type: 'string' , default: 'Y'},
    ];
    static uiFields = [
        { name: 'isContactFormDisabled', type: 'boolean' , default: true},
        { name: 'messageType', type: 'string' , default: 'none'},
        { name: 'messageText', type: 'string' , default: ''},
    ];
    static booleanFields = ['showing'];
    static printableFields = [];
    static listFields = ['product_id'];
    static fileFields = [];
    static historyFields = ['product_id', 'item_order', 'name', 'showing'];

    constructor(){
        super(DiamondSubProduct.fields,DiamondSubProduct.uiFields,DiamondSubProduct.booleanFields,DiamondSubProduct.printableFields,DiamondSubProduct.listFields,DiamondSubProduct.fileFields,DiamondSubProduct.historyFields);
    }

    static blankSubProduct = function () {
        return new DiamondSubProduct();
    }

    static blankNewSubProduct = function () {
        let newDiamondSubProduct = new DiamondSubProduct();
        newDiamondSubProduct.setDefaultForNewObject();
        console.log(newDiamondSubProduct);
        return newDiamondSubProduct;
    }

    toDataString = function () {
        // return this.id + ' - ' + this.item_order;
        return this.name;
    }
}

class DiamondItem extends BaseObject{
    static fields = [
        { name: 'id', type: 'number' , default: -1},
        { name: 'subproduct_id', type: 'number' , default: -1},
        { name: 'item_order', type: 'number' , default: 0},
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
    static printableFields = [];
    static listFields = ['subproduct_id'];
    static fileFields = ['image'];
    static historyFields = ['subproduct_id', 'item_order', 'name', 'description', 'image', 'showing'];

    constructor(){
        super(DiamondItem.fields,DiamondItem.uiFields,DiamondItem.booleanFields,DiamondItem.printableFields,DiamondItem.listFields,DiamondItem.fileFields,DiamondItem.historyFields);
    }

    static blankDiamondItem = function () {
        return new DiamondItem();
    }

    static blankNewDiamondItem = function () {
        let newDiamondItem = new DiamondItem();
        newDiamondItem.setDefaultForNewObject();
        return newDiamondItem;
    }
}
