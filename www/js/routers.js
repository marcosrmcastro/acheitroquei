app.config(function($stateProvider, $urlRouterProvider) {
    // definição da pagina de abertura
        $urlRouterProvider.otherwise('/inicio');

    // rotas
        $stateProvider.state('inicio', {
            url: '/inicio',
            templateUrl: 'templates/inicio.html',
            controller: 'InicioCtrl'
        });
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        });
        $stateProvider.state('cadastro', {
            url: '/cadastro',
            templateUrl: 'templates/cadastro.html',
            controller: 'CadastroCtrl'
        });
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        });
        $stateProvider.state('lista-produtos', {
            url: '/lista-produtos',
            templateUrl: 'templates/lista-produtos.html',
            controller: 'ListaProdutosCtrl'
        });
        $stateProvider.state('produto', {
            url: '/produto',
            templateUrl: 'templates/produto.html',
            controller: 'ProdutoCtrl'
        });    
        $stateProvider.state('troca', {
            url: '/troca',
            templateUrl: 'templates/troca.html',
            controller: 'TrocaCtrl'
        });
        $stateProvider.state('venda', {
            url: '/venda',
            templateUrl: 'templates/venda.html',
            controller: 'VendaCtrl'
        });
        $stateProvider.state('ambos', {
            url: '/ambos',
            templateUrl: 'templates/ambos.html',
            controller: 'AmbosCtrl'
        });
        $stateProvider.state('itemTroca', {
            url: '/itemTroca',
            templateUrl: 'templates/itemTroca.html',
            controller: 'ItemTrocaCtrl'
        });
        $stateProvider.state('itemVenda', {
            url: '/itemVenda',
            templateUrl: 'templates/itemVenda.html',
            controller: 'ItemVendaCtrl'
        });
        $stateProvider.state('itemAmbos', {
            url: '/itemAmbos',
            templateUrl: 'templates/itemAmbos.html',
            controller: 'ItemAmbosCtrl'
        });
    
})