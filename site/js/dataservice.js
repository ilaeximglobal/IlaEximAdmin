
app.factory('dataService', ['$http', '$location', function ($http, $location) {
    var getAuthorisationVerification = function (onSuccess) {
        return function (data, status, headers, config) {
            if (data.data.success == false && data.data.authorised == false) {
                console.log('redirect login');
                $location.path("/login");
                deleteAllCookies();
            }
            onSuccess(data, status, headers, config);
        };
    }

    function deleteAllCookies() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    var userData = undefined;
    return {
        ...userManagment(),
        ...aboutManagment(),
        ...certificateManagment(),
        ...keyPersonManagment(),
        ...productManagment(),
        ...faqManagment(),
        ...diamondFaqManagment(),
        ...blogManagment(),
        ...reviewManagment(),
        ...otherManagment(),
    };

    function userManagment(){
        return {
            isUserLoggedIn: function () {
                return userData != undefined;
            },
            setUserData: function (data) {
                userData = data;
            },
            getUserData: function () {
                return userData;
            },
            checkLogin: function (onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/logincheck.php',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                }).then(onSuccess, onError);
            },
        };
    }

    function otherManagment(){
        return {
            getProductBriefList: function (jwt,onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/product?type=brief'
                }).then(onSuccess, onError);
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
            getQuotationOptions: function () {
                return data.quotation.options;
            },
            getCountries: function () {
                return data.other.countries;
            },
        };
    }

    function aboutManagment(){
        return {
            getAboutDetail: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/aboutdetails',
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                }).then(onSuccess, onError);
            },
            updateAboutDetail: function (about, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/aboutdetails',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: about
                }).then(onSuccess, onError);
            },
        };
    }

    function certificateManagment(){
        return {
            getCertificate: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/certificate',
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                }).then(onSuccess, onError);
            },
            updateCertificate: function (certificate, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/certificate',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: certificate
                }).then(onSuccess, onError);
            },
            createCertificate: function (certificate, token, onSuccess, onError) {
                $http({
                    method: 'PUT',
                    url: 'api/v1/certificate',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: certificate
                }).then(onSuccess, onError);
            },
            deleteCertificate: function (certificate, token, onSuccess, onError) {
                $http({
                    method: 'DELETE',
                    url: 'api/v1/certificate',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: certificate
                }).then(onSuccess, onError);
            },
        };
    }

    function keyPersonManagment(){
        return {
            getKeyperson: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/keyperson',
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                }).then(onSuccess, onError);
            },
            updateKeyperson: function (keyperson, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/keyperson',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: keyperson
                }).then(onSuccess, onError);
            },
            createKeyperson: function (keyperson, token, onSuccess, onError) {
                $http({
                    method: 'PUT',
                    url: 'api/v1/keyperson',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: keyperson
                }).then(onSuccess, onError);
            },
            deleteKeyperson: function (keyperson, token, onSuccess, onError) {
                $http({
                    method: 'DELETE',
                    url: 'api/v1/keyperson',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: keyperson
                }).then(onSuccess, onError);
            },
        };
    }

    function productManagment(){
        return {
            getProduct: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/mainproduct',
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                }).then(onSuccess, onError);
            },
            updateProduct: function (product, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/mainproduct',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: product
                }).then(onSuccess, onError);
            },
            updateProductBulk: function (products, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/mainproduct?bulk=true',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: products
                }).then(onSuccess, onError);
            },
            createProduct: function (product, token, onSuccess, onError) {
                $http({
                    method: 'PUT',
                    url: 'api/v1/mainproduct',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: product
                }).then(onSuccess, onError);
            },
            deleteProduct: function (product, token, onSuccess, onError) {
                $http({
                    method: 'DELETE',
                    url: 'api/v1/mainproduct',
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: product
                }).then(onSuccess, onError);
            },
        };
    }

    function faqManagment(){
        return {
            getFaq: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/faq',
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            updateFaq: function (faq, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/faq',
                    data: faq
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            createFaq: function (faq, token, onSuccess, onError) {
                $http({
                    method: 'PUT',
                    url: 'api/v1/faq',
                    data: faq
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            deleteFaq: function (faq, token, onSuccess, onError) {
                $http({
                    method: 'DELETE',
                    url: 'api/v1/faq',
                    data: faq
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
        };
    }

    function diamondFaqManagment(){
        return {
            getDiamondFaq: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/diamondfaq',
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            updateDiamondFaq: function (faq, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/diamondfaq',
                    data: faq
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            createDiamondFaq: function (faq, token, onSuccess, onError) {
                $http({
                    method: 'PUT',
                    url: 'api/v1/diamondfaq',
                    data: faq
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            deleteDiamondFaq: function (faq, token, onSuccess, onError) {
                $http({
                    method: 'DELETE',
                    url: 'api/v1/diamondfaq',
                    data: faq
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
        };
    }

    function blogManagment(){
        return {
            getBlog: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/blog',
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            updateBlog: function (blog, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/blog',
                    data: blog
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            createBlog: function (blog, token, onSuccess, onError) {
                $http({
                    method: 'PUT',
                    url: 'api/v1/blog',
                    data: blog
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            deleteBlog: function (blog, token, onSuccess, onError) {
                $http({
                    method: 'DELETE',
                    url: 'api/v1/blog',
                    data: blog
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
        };
    }

    function reviewManagment(){
        return {
            getReview: function (token, onSuccess, onError) {
                $http({
                    method: 'GET',
                    url: 'api/v1/review',
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            updateReview: function (review, token, onSuccess, onError) {
                $http({
                    method: 'POST',
                    url: 'api/v1/review',
                    data: review
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            createReview: function (review, token, onSuccess, onError) {
                $http({
                    method: 'PUT',
                    url: 'api/v1/review',
                    data: review
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
            deleteReview: function (review, token, onSuccess, onError) {
                $http({
                    method: 'DELETE',
                    url: 'api/v1/review',
                    data: review
                }).then(getAuthorisationVerification(onSuccess), onError);
            },
        };
    }

}]);