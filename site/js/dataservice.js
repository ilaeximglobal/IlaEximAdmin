
app.factory('dataService', ['$http', function ($http) {
    var userData = undefined;
    return {
        isUserLoggedIn: function(){
            return userData != undefined;
        },
        setUserData: function(data){
            userData = data;
        },
        getUserData: function(data){
            return userData;
        },

        getEmail: function (onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'site/js/getEmail.js'
            }).then(onSuccess, onError);;
        },
        getContactDetails: function () {
            return data.contact;
        },
        getProducts: function (onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/product'
            }).then(onSuccess, onError);
        },
        getOfflineProducts: function () {
            return productdata.products.filter(c => c.type != 'service');
        },
        getServices: function () {
            return productdata.products.filter(c => c.type == 'service');
        },
        // getProductListByCategoryName: function (name) {
        //     return productdata.category.find(c => c.id == name);
        // },
        getProductDataById: function (string_id, onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/product/' + string_id
            }).then(onSuccess, onError);
        },
        getOfflineProductDataById: function (id) {
            for (c of productdata.products) {
                if (c && c.id == id) {
                    return c;
                }
            }
        },
        getFeatures: function () {
            return data.home.features;
        },
        getReviews: function (onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/review'
            }).then(onSuccess, onError);
        },
        getCertificates: function (onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/certificate'
            }).then(onSuccess, onError);
        },
        getAboutDetails: function (onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/aboutdetails'
            }).then(onSuccess, onError);
        },
        getAboutKeyPersons: function (onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/keyperson'
            }).then(onSuccess, onError);
        },
        getAboutKeyPersons2: function (onSuccess, onError) {
            return $http({
                method: 'GET',
                url: 'api/v1/keyperson'
            }).then(function (response) {
                return response.data;
            });
        },
        getAboutClients: function () {
            return data.about.clients;
        },
        getProductParagraphs: function () {
            return data.products.paragraphs;
        },
        getBlogPosts: function (onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/blog'
            }).then(onSuccess, onError);
        },

        getFaq: function (token, onSuccess, onError) {
            $http({
                method: 'GET',
                url: 'api/v1/faq',
                headers: {
                    "Authorization": "Bearer " + token,
                }
            }).then(onSuccess, onError);
        },
        updateFaq: function (faq, token, onSuccess, onError) {
            $http({
                method: 'POST',
                url: 'api/v1/faq.php',
                headers: {
                    "Authorization": "Bearer " + token,
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: faq
            }).then(onSuccess, onError);
        },

        getQuotationOptions: function () {
            return data.quotation.options;
        },
        getCountries: function () {
            return data.other.countries;
        },
    }

}]);