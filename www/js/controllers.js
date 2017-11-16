//  Tela de Inicio
    app.controller('InicioCtrl', function($scope, $state) {
              
        $scope.logar = function(){
            $state.go('login');
        };
        $scope.cadastro = function(){
            $state.go('cadastro');
        };
        
    })
// Cadastro Novo Usuario e Login
    app.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, $firebaseAuth) {

        $scope.usuario = {};
        $scope.voltar = function(){
            $state.go('inicio');
        };
        
        $scope.authObj = $firebaseAuth();
        var firebaseUser = $scope.authObj.$getAuth();
        if (firebaseUser) {
            $state.go('home');
        }
        $scope.login = function (usuario) {
            $ionicLoading.show({ template: 'Loading...' });
            $scope.authObj.$signInWithEmailAndPassword(usuario.email, usuario.password)
                    .then(function (firebaseUser) {
                        console.log("Signed in as:", firebaseUser.uid);
                        $ionicLoading.hide();
                        $state.go('home');
                    }).catch(function (error) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Falha no Login',
                            template: error.message
                        });
                    });
            };
        
    })
    app.controller('CadastroCtrl',function($scope, $state, $firebaseAuth, $firebaseObject, $ionicPopup, $ionicLoading){
        $scope.volta = function(){
            $state.go('inicio');
        };
        $scope.usuario = {};
            $scope.authObj = $firebaseAuth();
            $scope.cadastrar = function (usuario) {
                console.log(usuario);
                $ionicLoading.show({ template: 'Saving...' });
                $scope.authObj.$createUserWithEmailAndPassword(usuario.email, usuario.password)
                    .then(function (firebaseUser) {
                        $ionicLoading.hide();
                        console.log("User " + firebaseUser.uid + " created successfully!");
                        addUsuario(firebaseUser);
                        var auth = firebase.auth().currentUser;
                        $state.go('inicio');
                    }).catch(function (error) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Falha no Registro',
                            template: error.message
                        });
                    });
            }
            function addUsuario(firebaseUser) {
                var ref = firebase.database().ref('usuarios/' + firebaseUser.uid);
                var obj = $firebaseObject(ref);
                obj.nome = firebaseUser.email;
                obj.email = firebaseUser.email;
                obj.$save().then(function (ref) {
                    ref.key === obj.$id; // true
                    console.log('Usuário criado na base de dados');
                }, function (error) {
                    console.log("Error:", error);
                });
            }
        
    })
app.controller('HomeCtrl',function($scope, $state, $firebaseAuth, $firebaseObject, $ionicLoading){
   // Link firebase 
    $scope.home = "Home";
    $scope.authObj = $firebaseAuth();
    var firebaseUser = $scope.authObj.$getAuth();
    $scope.usuario = angular.copy(firebaseUser);
   // Logon - Sair do APP  
    $scope.logout = function () {
        $scope.authObj.$signOut();
        $state.go('inicio');
    };
   // Botões 
    $scope.listar = function() { $state.go('itemTroca'); }; 
    $scope.listarVenda = function() { $state.go('itemVenda'); };
    $scope.listarTrocaVenda = function() { $state.go('itemAmbos'); };
    $scope.cadastros = function() { $state.go('produto'); };

    })
// Acessos 
 app.controller('ProdutoCtrl',function($scope, $state, $ionicPopup, $ionicLoading, $firebaseAuth,$cordovaCamera){
   
    

    //Botões --------
        $scope.retorno = function () { $state.go('home') };
        $scope.troca = function () { $state.go('troca') };
        $scope.venda = function () { $state.go('venda') };
        $scope.ambos = function () { $state.go('ambos') };
 })

/* 

*/
// trocas
    app.controller('ListaProdutosCtrl',function($scope, $state, $firebaseAuth, $firebaseArray){
        // Link com firebase
            var auth = firebase.auth().currentUser;
            var ref = firebase.database().ref('produtos/');       
            $scope.produtos = $firebaseArray(ref);
        //Botões  
            $scope.newProduto = function () { $state.go('troca'); };
            $scope.pgnItemTroca = function(){ $state.go('itemTroca'); };
        /* */
        
    })
    app.controller('TrocaCtrl',function($scope,$state,$cordovaCamera, $ionicPopup, $ionicLoading, $firebaseStorage, $firebaseArray, $firebaseAuth, $firebaseObject,$cordovaCapture){
        
        //Botões
            $scope.produto = function(){ $state.go('itemTroca'); };
             $scope.sair = function(){ $state.go('home'); };
        /* */

        // cadastro de Produto
            $scope.troca = {}; 

            $scope.registrarTroca = function(troca){

                $ionicLoading.show({ template: 'Salvando...' });

                troca.data = new Date().getTime();
                troca.status = 'ativo';

                var storageRef = firebase.storage().ref('fotos/troca/' + new Date().getTime() + ".jpg");
                var storage = $firebaseStorage(storageRef);
                var uploadTask = storage.$putString($scope.imagem, 'base64', { contentType: "image/jpg" });

                uploadTask.$complete(function(snapshot) {      
                    troca.imagem = snapshot.downloadURL;

                    // salvar no banco de dados:
                    var ref = firebase.database().ref("produtos/");
                    $firebaseArray(ref).$add(troca).then(function() {
                        $ionicLoading.hide();
                        $state.go('itemTroca');
                    })
                });
            }; 
        /* */ 
            
        // tirar foto   
            $scope.tirarfoto = function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true
                };   
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    $scope.imagem = imageData;
                    
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            }
        /* */

    })
    /* */
    app.controller('ItemTrocaCtrl',function($scope,$state,$cordovaCamera, $ionicPopup, $ionicLoading, $firebaseStorage, $firebaseArray, $firebaseAuth, $firebaseObject,$cordovaCapture){
       
         // Link com firebase
            var auth = firebase.auth().currentUser;
            var ref = firebase.database().ref('produtos/');       
            $scope.itemTrocas = $firebaseArray(ref);
        //Botões  
         $scope.newProduto = function () { $state.go('troca'); };
    })
/* 

*/
// Vendas    
    app.controller('VendaCtrl',function($scope,$state,$cordovaCamera, $ionicPopup, $ionicLoading, $firebaseStorage, $firebaseArray, $firebaseAuth, $firebaseObject,$cordovaCapture){
        
        //Botões
            $scope.produto = function(){ $state.go('itemVenda'); };
            $scope.sair = function(){ $state.go('home'); };
        /* */

        // cadastro de Produto
            $scope.vendas = {}; 

            $scope.registrarVendas = function(vendas){

                $ionicLoading.show({ template: 'Salvando...' });

                vendas.data = new Date().getTime();
                vendas.status = 'ativo';

                var storageRef = firebase.storage().ref('fotos/vendas/' + new Date().getTime() + ".jpg");
                var storage = $firebaseStorage(storageRef);
                var uploadTask = storage.$putString($scope.imagem, 'base64', { contentType: "image/jpg" });

                uploadTask.$complete(function(snapshot) {      
                    vendas.imagem = snapshot.downloadURL;

                    // salvar no banco de dados:
                    var ref = firebase.database().ref("vendas/");
                    $firebaseArray(ref).$add(vendas).then(function() {
                        $ionicLoading.hide();
                        $state.go('itemVendas');
                    })
                });
            }; 
        /* */ 
            
        // tirar foto   
            $scope.tirarfoto = function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true
                };   
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    $scope.imagem = imageData;
                    
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            }
        /* */

    })
    /* */
    app.controller('ItemVendaCtrl',function($scope,$state,$cordovaCamera, $ionicPopup, $ionicLoading, $firebaseStorage, $firebaseArray, $firebaseAuth, $firebaseObject,$cordovaCapture){
       
         // Link com firebase
            var auth = firebase.auth().currentUser;
            var ref = firebase.database().ref('vendas/');       
            $scope.itemVendas = $firebaseArray(ref);
        //Botões  
         $scope.newProduto = function () { $state.go('venda'); };
        })
/* 

*/
// Vendas & Trocas    
    app.controller('AmbosCtrl',function($scope,$state,$cordovaCamera, $ionicPopup, $ionicLoading, $firebaseStorage, $firebaseArray, $firebaseAuth, $firebaseObject,$cordovaCapture){
        
        //Botões
            $scope.produto = function(){ $state.go('itemAmbos'); };
             $scope.sair = function(){ $state.go('home'); };
        /* */

        // cadastro de Produto
            $scope.ambos = {}; 

            $scope.registrarAmbos = function(ambos){

                $ionicLoading.show({ template: 'Salvando...' });

                ambosdata = new Date().getTime();
                ambos.status = 'ativo';

                var storageRef = firebase.storage().ref('fotos/ambos/' + new Date().getTime() + ".jpg");
                var storage = $firebaseStorage(storageRef);
                var uploadTask = storage.$putString($scope.imagem, 'base64', { contentType: "image/jpg" });

                uploadTask.$complete(function(snapshot) {      
                    ambos.imagem = snapshot.downloadURL;

                    // salvar no banco de dados:
                    var ref = firebase.database().ref("ambos/");
                    $firebaseArray(ref).$add(ambos).then(function() {
                        $ionicLoading.hide();
                        $state.go('itemAmbos');
                    })
                });
            }; 
        /* */ 
            
        // tirar foto   
            $scope.tirarfoto = function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true
                };   
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    $scope.imagem = imageData;
                    
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            }
        /* */
    })
     app.controller('ItemAmbosCtrl',function($scope,$state,$cordovaCamera, $ionicPopup, $ionicLoading, $firebaseStorage, $firebaseArray, $firebaseAuth, $firebaseObject,$cordovaCapture){
        
         // Link com firebase
            var auth = firebase.auth().currentUser;
            var ref = firebase.database().ref('ambos/');       
            $scope.itemAmbos = $firebaseArray(ref);
        //Botões  
            $scope.newProduto = function () { $state.go('ambos'); };
    })
    
   
    
     
