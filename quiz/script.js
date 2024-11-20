// Esto sirve para limpiar el localStorage que es donde se guardan los datos.
(function () {
    localStorage.clear();
})();

//Esto sirve para que itere desde 0
let indicePreguntas = 0;
//Aqui guardamos en un array todas las preguntas
let listaPreguntas = [];
// Contador de respuestas correctas
let respCorrecta = 0;
// Contador de respuestas incorrectas
let respIncorrecta = 0;

// n es el numero de preguntas. En los parametros de la funcion tenemos que meterle los datos con los que va a hacer las ordenes que le demos dentro de la funcion
function crearPregunta(n, texto, pregunta, div, esCorrecta){
    let preguntaDiv = document.getElementById('question'); 
    //Esto sirve para limpiar la pregunta anterior
    let h3 = document.createElement('h3');
    let button = document.createElement('button');
    // Con esta funcion le indicamos al boton con un onclick que nos indique si la respuesta es correcta o incorrecta partiendo de la funcion respuestas que tenemos mas abajo
    button.onclick = function() { 
        // Aqui hace la llamada a la funcion respuestas
        respuestas(esCorrecta);
    }
    if(pregunta){
        h3.innerText = `Pregunta ${n}: ${texto}`; 
        preguntaDiv.appendChild(h3);
    } else{  
        button.innerText = `Respuesta ${n}: ${texto}`; 
        div.appendChild(button);
    } 
}

//Con esta funcion hacemos que itere por todas las preguntas incrementando cada pregunta en 1 despues de ejecutar la anterior
function siguientePregunta() {
    let div = document.getElementById("question")
    // Aqui verifica que la posicion en la que se encuentra la pregunta sea menor que el largo del array de las preguntas para que cuando llegue al final del array ya no cargue mas preguntas
    if (indicePreguntas < listaPreguntas.length) {
        div.innerHTML = '';
        //Aqui muestra la pregunta segun su indice(posicion)
        let pregunta = listaPreguntas[indicePreguntas];
        // Si existe la pregunta le suma 1 para que pase a la siguiente, muestra el texto de la pregunta y true indica que es una pregunta. Aqui modificamos los parametros de la funcion crearPregunta, n lo cambiamos por la posicion del indice de las preguntas; el texto por el texto de que contiene el json en su posicion question; true es el parametro preguntas, aqui le decimos que existe, null es el valor del div que hasta ahora es null y false es el parametro es correcta, porque hasta ahora no es correcta
        crearPregunta(indicePreguntas + 1, pregunta.question, true, null, false);
        // Este forEach itera por todas las respuestas incorrectas donde incorrectas representa la respuesta incorrecta en cada iteracion e i representa el indice de la respuesta incorrecta dentro del array
        // Muestra las respuestas incorrectas 
        pregunta.incorrect_answers.forEach((incorrecta, i) => { 
            // Aqui creamos un div para las respuestas incorrectas
            let divIncorrecta = document.createElement('div'); 
            // Esto le da un id al div diferente segun cada una de las respuestas incorrectas
            divIncorrecta.id = `incorrecta-${indicePreguntas + 1}-${i + 1}`; 
            document.getElementById('question').appendChild(divIncorrecta); 
            // Aqui es false en la posicion del parametro esCorrecta porque la pregunta no es correcta
            crearPregunta(`${indicePreguntas + 1}.${i + 1}`, incorrecta, false, divIncorrecta, false);
        })
        let divCorrecta = document.createElement('div');
        divCorrecta.id = `correcta-${indicePreguntas + 1}`; 
        document.getElementById('question').appendChild(divCorrecta); 
        // Aqui tomamos el dato de la pregunta en su posicion correcta, por eso en el parametro esCorrecta le damos el valor true
        crearPregunta(indicePreguntas + 1, pregunta.correct_answer, false, divCorrecta, true);
        // Esto sirve para guardar la pregunta y las respuestas en la memoria del locaStorage
        localStorage.setItem("pregunta" + (indicePreguntas + 1), pregunta.question);
        localStorage.setItem("respuestaCorrecta" + (indicePreguntas + 1), pregunta.correct_answer);
        localStorage.setItem("respuestaIncorrecta" + (indicePreguntas + 1), JSON.stringify(pregunta.incorrect_answers)); 
    }
    indicePreguntas++;
} 

function respuestas(esCorrecta) {
    if (esCorrecta) {
        let p = document.createElement('p');
        let correcto = document.getElementById('correcto'); 
        p.id = 'pCorrecta';
        p.innerText = `Respuesta correcta`; 
        correcto.appendChild(p);
        // alert('Respuesta correcta');
        respCorrecta++;
    } else{
        let p = document.createElement('p');
        let correcto = document.getElementById('correcto'); 
        p.id = 'pIncorrecta';
        p.innerText = `Respuesta incorrecta`; 
        correcto.appendChild(p);
        // alert('Respuesta incorrecta');
        respIncorrecta++;
    }
}

//Aqui ponemos el api
fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
.then(datos => datos.json()) 
.then(preguntas => {
    listaPreguntas = preguntas.results;
    siguientePregunta();
})