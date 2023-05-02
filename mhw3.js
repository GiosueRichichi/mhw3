// ApiKey per l'api di musixmatch e il suo enpoint, ho annesso all'endpoint anche il link dei cors poiché l'api non poteva essere utilizzata senza
const mm_key = '54761013a66d2ff93cee63eb3e541ea8';
const api_endpoint= 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?'; //'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?' 

const salbums = document.querySelectorAll("#album");

// Id e Secret di spotify 
const spotify_id = "ce247109cbcb4e4faeecf885a1aecdd1";
const spotify_secret = "2938b65e34f54d4e830c5305e316a1a8";
let token_data;

// Effettuo un fetch per richiedere il token all'api di spotify, per poi farmelo restituire in token_data poiché servirà per le future richieste che faremo
const data = fetch("https://accounts.spotify.com/api/token",
    {
    method:"POST",
    headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        'Authorization': 'Basic '+ btoa(spotify_id+":"+spotify_secret)
    },
    body:"grant_type=client_credentials"
}).then(onTokenResponse).then(getToken);


// Aggiungo gli event listener per i vari bottoni che ricercano gli album
function setListenersAlbums(){
    for(const salbum of salbums){
        salbum.addEventListener("click",searchAlbum);
    }
}
setListenersAlbums();

// aggiungo l'event listener per il bottone che restitusce la classifica delle canzoni più ascoltate
const STop = document.querySelector("#classifica").addEventListener("click",searchSongs);


function onTokenResponse(response_spotify){
    console.log(response_spotify);
    return response_spotify.json();
    
}


function getToken(json)
{
	token_data = json;
	console.log(json);
}


// Funzione che fornisce lista completa delle canzoni dell'album. 
// Inizialmente svuoto il contenuto del div in maniera tale da non sovrapporre i vari album
function showAlbum(album){
    document.querySelector("#album_list").innerHTML="";
    const x = album.items
    const y = document.querySelector("Testa");
    for(let i=0; i<x.length;i++){
        console.log(x[i]);
        const newDiv = document.createElement("div");
        const Content = document.createTextNode(x[i].name);
        newDiv.appendChild(Content);
        const currDiv = document.getElementById(`album_list`);
        currDiv.appendChild(newDiv);
    }
    document.getElementById("album_list").scrollIntoView({behavior:"smooth"});
}

// Una volta premuto il bottone associato all'album viene richiesto all'api di spotify la lista delle canzoni all'interno dell'album per poi passarle alla funzione showAlbum 
// che le scriverà tutte all'interno del div specifico
function searchAlbum(event){

    event.preventDefault();

    const cliccato = event.currentTarget;
    const artista = cliccato.dataset.artist;
    console.log(artista);

    const id = cliccato.dataset.id;
    console.log(id);
    const sptify_result = fetch(`https://api.spotify.com/v1/albums/${id}/tracks`,{
        method:'GET',
        headers:{ 'Authorization' : 'Bearer ' + token_data.access_token}
    }).then(onResponse).then(showAlbum)

}

function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

// Simile alla funzione showAlbum questa funzione stampa nel div con id="dinamico" la lista delle canzoni più ascoltate in italia, lista che viene passata dalla funzione searchSongs
function showtop(classifica){
    document.querySelector("#dinamico").innerHTML="";
    const x = classifica.message.body.track_list;
    console.log(x);
    for(let i=0;i<x.length;i++){
        console.log(x[i].track.track_name);
        const newDiv = document.createElement("div");
        const Content = document.createTextNode(x[i].track.track_name);
        newDiv.appendChild(Content);
        const currDiv = document.getElementById("dinamico");
        currDiv.appendChild(newDiv);
    } 
}

// Funzione che richiede all'api di musixmatch, previa autorizzazione con apikey, una lista delle canzoni più ascoltate in italia 
function searchSongs(event){

    event.preventDefault();

    const cliccato = event.currentTarget;

    song_request = api_endpoint +'apikey=' + mm_key + "&chart_name=top&page=1&page_size=10&country=it";  //+ '&q_track='+song+'&q_artist='+artista; 
    console.log(song_request);
    const searchLyric = fetch(song_request).then(onResponse).then(showtop);
    console.log(searchLyric);
}



