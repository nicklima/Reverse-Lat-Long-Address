document.addEventListener("DOMContentLoaded", function(event) {

    document.querySelector('form input[type="file"]').addEventListener('change', function(e) {
        document.querySelector('form p').innerHTML = this.files[0].name;
    });
    
    const form_el = document.querySelector("form");
    form_el.addEventListener("submit", function(evt) {
        evt.preventDefault();        
        fillArray();
        form_el.reset();
        document.querySelector('form p').innerHTML = 'Arraste seu arquivo ou clique nessa área.';
    });

    function fillArray() {
        var fileUpload = document.getElementById("sendfile");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {                
                    var rows = e.target.result.split("\n");
                    
                    for (var i = 0; i < rows.length; i++) {
                        if(rows[i] !== '' && i != 0){
                            console.log(rows[i]);
                            getLatLong(rows[i]);
                        }
                    }
                }
                reader.readAsText(fileUpload.files[0]);
            } else {
                alert("Este browser não suporta HTML5.");
            }
        } else {
            alert("Favor enviar um arquivo CSV válido.");
        }
    }

    function getLatLong(item) {  
        const target = document.getElementById('target');
              target.innerHTML = '';
        const newEl = document.createElement('span');

        const apikey = '3e48b1dea774438997c0035eb0122606';
        const api_url = 'https://api.opencagedata.com/geocode/v1/json'
        const request_url = api_url
        + '?'
        + 'key=' + apikey
        + '&q=' + encodeURIComponent(item)
        + '&pretty=1'
        + '&no_annotations=1';
        
        // see full list of required and optional parameters:
        // https://opencagedata.com/api#forward        
        const request = new XMLHttpRequest();
        request.open('GET', request_url, true);        
        request.onload = function() {
            // see full list of possible response codes:
            // https://opencagedata.com/api#codes
            
            if (request.status == 200){ 
                // Success!
                const data = JSON.parse(request.responseText);
                newEl.appendChild(document.createTextNode(data.results[0].formatted));
                target.append(newEl)
            } else if (request.status <= 500){ 
                // We reached our target server, but it returned an error                                
                console.log("Incapaz de executar o geocode! Código da resposta: " + request.status);
                const data = JSON.parse(request.responseText);
                console.log(data.status.message);
                newEl.appendChild(document.createTextNode('Incapaz de executar o geocode! Código da resposta:' + data.status.message));
                target.append(newEl)
            } else {
                console.log("Erro de servidor");
                newEl.appendChild(document.createTextNode('Erro de servidor'));
                target.append(newEl)
            }
        };
        
        request.onerror = function() {
            // There was a connection error of some sort
            console.log("Incapaz de conectar ao servidor");        
            newEl.appendChild(document.createTextNode('Incapaz de conectar ao servidor'));
            target.append(newEl)
        };
        
        request.send();  // make the request
    }
});