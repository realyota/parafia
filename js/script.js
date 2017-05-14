/**
 * Created by Maciej on 2017-05-13.
 */

// ten plik został tylko przekopiowany z przykładu więc trzeba go przerobić

//zmienne globalne
var services = [];

//ustawienie wysokości kontenera
function setContainerHeight(){
    var val = document.documentElement.clientHeight;
    val = val - 150;
    $(".mainContainer").css("min-height",val);
}

//kontrola dostępu
function protect(){
    if( !isLogin() ){
        window.location.assign('../index.html');
    }else{
        if( window.location.pathname === "/project_example/html/home.html" ){
            getUserInfo();
        }
    }
}

function block(){
    if( isLogin() ){

        var string, path;
        path = window.location.pathname;
        if( path === "/project_example/"){
            string = "html/home.html";
        }else{
            string = "home.html";
        }
        window.location.assign( string );
    }else{
        console.log('not logged');
    }
}

function isLogin(){
    if( sessionStorage.getItem('loggedUser') === null ){
        return false;
    }
    return true;
}

//logowanie i wylogowanie
function logIn(){
    var obj, username, password, json;
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    obj = {
        username: username,
        password: password
    };

    json = JSON.stringify(obj);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var response = JSON.parse(this.responseText);
            if( response == 'error' ){
                document.getElementById('loginError').innerHTML = "Błędne dane logowania!";
            }else if( response == 'noUser'){
                document.getElementById('loginError').innerHTML = "Nie ma takiego użytkonika";
            }else if( response == 'incorrectPassword' ){
                document.getElementById('loginError').innerHTML = "Hasło niepoprawne!";
            }else{
                console.log(response);
                sessionStorage.setItem('loggedUser', response );
                window.location.assign('html/home.html');
            }
        }
    };
    xhttp.open("POST", "php/user.php", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(json);
}

function logOut( string ){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            //var response = JSON.parse(this.response);
            console.log(this.response);
            if( this.response == 'success' ){
                sessionStorage.clear();
                window.location.assign('../index.html');
            }else{
                alert('Ups! Coś poszło nie tak.');
            }
        }
    };

    xhttp.open("GET", string, true);
    xhttp.send();
}

//pozyskiwanie danych zalogowanego użytkownika
function getUserInfo(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.response);
            displayInfo(json);
        }
    };
    xhttp.open("GET", "../php/user.php", true);
    xhttp.send();
}

function displayInfo( array ){
    var h2 = document.getElementById('helloUser');
    h2.innerHTML = 'Witaj ' + array['firstname'] + " " + array['lastname'] + "!";
}


//Rejestracja
function validForm(){
    event.preventDefault(event);

    var firstName, lastName, username, password, password2;
    firstName = document.getElementById('firstName').value;
    lastName = document.getElementById('lastName').value;
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    password2 = document.getElementById('password2').value;

    if( password === password2 && password !== "" ){
        var obj;

        var obj = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password
        };

        createUser( obj );

    }else{
        var label = document.getElementById('infoLabel');
        label.style.color = "red";
        label.innerHTML = "Obydwa hasła muszą być takie same!";
    }
}

function createUser( object ) {

    var json = JSON.stringify(object);
    var label;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            console.log(this.response);
            var response = JSON.parse(this.responseText);
            if( response == 'userExist' ){
                label = document.getElementById('infoLabel');
                label.style.color = "red";
                label.innerHTML = "Ta nazwa użytkownika jest już zajęta!";
            }else if( response == 'success' ){
                label = document.getElementById('infoLabel');
                label.style.color = "black";
                label.innerHTML = "Rejestracja powiodła się! ";
                var link = document.createElement('a');
                link.href = "../index.html";
                link.innerHTML = "Logowanie";
                label.appendChild(link);

                clearRegistrationForm();
            }
        }
    };
    xhttp.open("POST", "../php/createUser.php", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(json);
}

function clearRegistrationForm() {
    document.getElementById('firstName').value = "";
    document.getElementById('lastName').value = "";
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    document.getElementById('password2').value = "";
}

//Pobieranie danych o dosetępnych usłychach
function getServices() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            services = JSON.parse(this.response);
            showServices();
        }
    };
    xhttp.open("GET", "../php/services.php", true);
    xhttp.send();
}

function showServices() {
    var obj, option, parent = document.getElementById('servicesSelect');
    option = document.createElement('option');
    option.value = "0";
    option.innerHTML = "Wybierz usługę";
    option.selected = true;
    parent.appendChild(option);

    for( var i = 0; i < services.length; i++ ){
        obj = services[i];
        option = document.createElement('option');
        option.value = obj.id;
        option.innerHTML = obj.service_name;
        parent.appendChild(option);
    }
    document.getElementById('servicesDiv').style.display = 'block';
}

//wyświetl dane o konkretnej usłudze
function showService( serviceId ){
    var obj;
    if( serviceId !== '0'){
        for( var i = 0; i < services.length; i++ ){
            if( services[i].id === serviceId ){
                obj = services[i];
                break;
            }
        }

        document.getElementById('serviceName').value = obj.service_name;
        document.getElementById('servicePrice').value = obj.price;
        document.getElementById('serviceDescription').innerHTML = obj.service_description;
    }else{
        document.getElementById('serviceName').value = "";
        document.getElementById('servicePrice').value = "";
        document.getElementById('serviceDescription').innerHTML = "";
    }

}

//zaksięguj nową usługę
function bookService( serviceId ) {
    var obj = {
        serviceId: serviceId,
        comment: document.getElementById('userComment').value
    };
    var json = JSON.stringify( obj );

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log( JSON.parse( this.responseText ) );
            hideServices();
            document.getElementById('homeInfo').innerHTML = "Usługa zaksięgowana.";
        }
    };
    xhttp.open("POST", "../php/services.php", true);
    xhttp.send( json );
}

//ukrycie formularza serwisów
function hideServices(){

    document.getElementById('homeInfo').innerHTML = "";
    document.getElementById('serviceName').value = "";
    document.getElementById('servicePrice').value = "";
    document.getElementById('serviceDescription').innerHTML = "";
    document.getElementById('servicesDiv').style.display = 'none';

    var select = document.getElementById('servicesSelect');
    while (select.firstChild ){
        select.removeChild( select.firstChild );
    }
}

//przekierowanie na inne podstrony
function goToHistory() {
    window.location.assign('history.html');
}

function goToHome() {
    window.location.assign('home.html');
}

//zaksięgowane usługi użytkownika
function getUserServices(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            services = JSON.parse(this.response);
            console.log(services);
            displayHistory();
        }
    };
    xhttp.open("GET", "../php/userServices.php", true);
    xhttp.send();
}

function displayHistory(){
    var tr, td, tbody = document.getElementById('historyTBody');

    if( services.length == 0 ){
        document.getElementById('historyInfo').innerHTML = "Nie posiadasz żadnych zaksięgowanych usług.";
        document.getElementById('historyTable').style.display = 'none';
    }else if( services.length == 1 ){
        document.getElementById('historyInfo').innerHTML = "Posiadasz " + services.length + " zaksięgowaną usługę.";
        document.getElementById('historyTable').style.display = 'block';
    }else if( services.length > 1 && services.length < 5 ){
        document.getElementById('historyInfo').innerHTML = "Posiadasz " + services.length + " zaksięgowane usługi.";
        document.getElementById('historyTable').style.display = 'block';
    }else if( services.length >= 5 ){
        document.getElementById('historyInfo').innerHTML = "Posiadasz " + services.length + " zaksięgowanych usług.";
        document.getElementById('historyTable').style.display = 'block';
    }

    for( var i = 0; i < services.length; i++ ){
        tr = document.createElement('tr');

        for( var j = 0; j <= 6; j++ ){
            var data;
            switch ( j ){
                case 0: data = i + 1;
                    break;
                case 1: data = services[i].id;
                    break;
                case 2: data = services[i].name;
                    break;
                case 3: data = services[i].description;
                    break;
                case 4: data = services[i].comment;
                    break;
                case 5: data = services[i].price;
                    break;
                case 6: data = services[i].date;
                    break;
            }
            td = document.createElement('td');
            td.innerHTML = data;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

}
