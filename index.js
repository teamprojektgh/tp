'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const JSON = require('JSON');
//const config = require('./config');
const Promise = require("promise");
const { WebhookClient } = require('dialogflow-fulfillment')
const { Card, Suggestion } = require('dialogflow-fulfillment');
const CardResponse = require('./Responses/card-response');
const SuggestionsResponse = require('./Responses/suggestions-response');
const PLATFORMS = require('./Responses/rich-response');
let agent;



//Authorization Header muss noch in Config ausgelagert werden
//Automatischer Restart bei erro --> best practices node.js
const authorization = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJkOmQzYmVjNTY4LWNkNjQtNDg3Mi05MDM1LWQwNjRhYzk0Nzc4NyIsInNidCI6ImFwcCIsImlzcyI6InR4dHVyZSIsImV4cCI6MTU4Mjg0NDQwMH0.ZyyU68wDqwG5ED4CFjpSoOVKSEIQL4qdVfK_yRjxMeYB-gu5OjJs5I6F97o6LS7sgvlnrVucQXsbQryc1_ylTAncDcFRloK6VmoL5FGqL6ZEXzWEEdcAxknwN-NMwPyDW7tFAos_Cz2DJIfLAI5pb6_EKCPGjVCkkYSIy-ZvBaaJYFDsXasGjuVr31v1TBKEoPDplqbRZ60t-ikvRHLMLa3xSyfexVT5gdUhk4BxI3bmZAyxo7-7zu8X3cpg6CoMqX1IcjEOMzrSwkgQumLrwTT1MeL0YViw-dV6IEdWaML8wFGrn3TPxVb1DGZzSg00oLVwU61K4nc4EesgQWsdqw4wuV4PJWRQEq63YgQ4Ngtw0NTfuQZlpCxryTEToZZQrKv24iSsEySlgbppNyVt6w1_BSsyJNpc91KUSHCGRQcQsBzSQnUHEYVoIcxIypYBXjsOW-sfijNKyyOqWsNd16tjFMxc1Xr81NqGluZy956FNlSNrLSKiwhibrD_7CYoVjpxg2g0QxgMg9Ld2ZiBCsKIMoMOj8cUncfkbu27z2I3oIwq_7qZh9C4gD72O9BOzboBdhuEq0ntre0voJZrj5kEkzzyW98AZZiBjvdyt0Qhs1VtPnSwl4kIg8vNxSdAofSMxUUEFEE196clSfv4_SQbYRw9D8dxo4SXiRQv3KA"

const app = express();
const {
  dialogflow,
	BasicCard,
	BrowseCarousel,
	BrowseCarouselItem,
	Button,
	Carousel,
	Image,
	LinkOutSuggestion,
	List,
	MediaObject,
	Suggestions,
	SimpleResponse,
	Table,
 } = require('actions-on-google');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//var routes = require('./API/Routes/Routes'); //importing route

//routes(app); //register the route



//Routing	
app.post('/', express.json(), (req, res) => {
	agent = new WebhookClient({ request: req, response: res });

	// Mapping Intents
	let intentMap = new Map()

	intentMap.set('Quotes', getInfo);
	intentMap.set('Default Fallback Intent', fallback);
	intentMap.set('welcomeIntent', welcome);
	intentMap.set('bot.Software.Intent', getSoftware);
	intentMap.set('bot.Software.Intent.Info', getInfo2);


	agent.handleRequest(intentMap)

	// debug logs
	console.log('query : ', agent.query);
	console.log('intent : ', agent.intent);
	console.log('parametres : ', agent.parameters);
	console.log('context : ', agent.contexts);
	console.log('action : ', agent.action);


})
function createXMLReq() {
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	return xhr;
}

function setHeaders(url, xhr, method) {
	var data = null
	xhr.timeout = 5000;

	xhr.open(method, url);
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("Authorization", authorization);

	xhr.send(data);

	return xhr;
}

//Umbenennen
function getSoftware() {

	agent.add("Dies kommt aus der Methode getSoftware");
	console.log('query : ', agent.query);
	console.log('intent : ', agent.intent);
	console.log('parametres : ', agent.parameters);
	console.log('context : ', agent.contexts);
	console.log('action : ', agent.action);

	var query = agent.query;
	agent.add("Wir haben folgende" + query + "'s gefunden (Liste aller Instanzen des gewählten Typs)");
	agent.add(new Suggestion("Storage1"));
	agent.add(new Suggestion("Storage2"));
	agent.add(new Suggestion("Storage3"));


	//txture Query Type is query
	//Auflistung der Ergebnisse als Suggestion
	//Schleife siehe Welcome Intent



}

//TODO umbennen
function getInfo2() {
	agent.add("Dies kommt aus der Methode getInfo2");

	agent.add("Hier könnten Infos stehen zu");

	var timestamp = getTimeStamp();
	console.log(timestamp);

	console.log('query : ', agent.query);
	console.log('intent : ', agent.intent);
	console.log('parametres : ', agent.parameters);
	console.log('context : ', agent.contexts);
	console.log('action : ', agent.action);

	//train intent https://github.com/googleapis/dialogflow-python-client-v2/issues/68
	var xhr = createXMLReq();
	xhr.timeout = 5000;

	xhr = setHeaders("https://htwg-konstanz.txture.io/api/v8/model/master/1567680979092/entities?allowPartialResult=false&entityIds=t%3A00c18363-1415-4bb0-a5a2-71320794a50c&entityIds=t%3A00c18363-1415-4bb0-a5a2-71320794a50c", xhr, "POST");

	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				//An dieser Stelle Repsonse weiterleiten und entsprechend auslesen
				agent.add("This is a timestamp" + xhr.responseText);

				resolve();
			}
		};
	});
}


function welcome() {

	console.log("welcomeIntent");
	//Normaler Text Ausgabe
	agent.add("Herzlich willkommen zu unserem Bot, wie kann ich Ihnen behilflich sein? Bitte wähle eine Art von Software / Hardware")


	//https://dialogflow.com/docs/reference/fulfillment-library/webhook-client
	//https://medium.com/google-developers/creating-smarter-suggestion-chips-for-your-action-f22ff85346ef
	//Dynamisch aufbauen über Schleife um alle Möglichkeiten abzufragen von txture auslesen
	//txture Anfrage

	var data = null;
	var xhr = createXMLReq();

	xhr.open("GET", "https://htwg-konstanz.txture.io/api/v8/refactoring/informationModel/json");
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJkOmQzYmVjNTY4LWNkNjQtNDg3Mi05MDM1LWQwNjRhYzk0Nzc4NyIsInNidCI6ImFwcCIsImlzcyI6InR4dHVyZSIsImV4cCI6MTU4Mjg0NDQwMH0.ZyyU68wDqwG5ED4CFjpSoOVKSEIQL4qdVfK_yRjxMeYB-gu5OjJs5I6F97o6LS7sgvlnrVucQXsbQryc1_ylTAncDcFRloK6VmoL5FGqL6ZEXzWEEdcAxknwN-NMwPyDW7tFAos_Cz2DJIfLAI5pb6_EKCPGjVCkkYSIy-ZvBaaJYFDsXasGjuVr31v1TBKEoPDplqbRZ60t-ikvRHLMLa3xSyfexVT5gdUhk4BxI3bmZAyxo7-7zu8X3cpg6CoMqX1IcjEOMzrSwkgQumLrwTT1MeL0YViw-dV6IEdWaML8wFGrn3TPxVb1DGZzSg00oLVwU61K4nc4EesgQWsdqw4wuV4PJWRQEq63YgQ4Ngtw0NTfuQZlpCxryTEToZZQrKv24iSsEySlgbppNyVt6w1_BSsyJNpc91KUSHCGRQcQsBzSQnUHEYVoIcxIypYBXjsOW-sfijNKyyOqWsNd16tjFMxc1Xr81NqGluZy956FNlSNrLSKiwhibrD_7CYoVjpxg2g0QxgMg9Ld2ZiBCsKIMoMOj8cUncfkbu27z2I3oIwq_7qZh9C4gD72O9BOzboBdhuEq0ntre0voJZrj5kEkzzyW98AZZiBjvdyt0Qhs1VtPnSwl4kIg8vNxSdAofSMxUUEFEE196clSfv4_SQbYRw9D8dxo4SXiRQv3KA");

	xhr.send(data);


	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				//An dieser Stelle Repsonse weiterleiten und entsprechend auslesen

				var result = JSON.parse(xhr.responseText);

				//console.log("asdasdasd"+JSON.stringify(result[0].operations));

				for (var k in result[0].operations) {

					var t = String(result[0].operations[k].type);

					if (t == 'AddEntityClass') {
						//an die buttons muss noch die txture id gebunden werden
						//agent.context.set("asd");
						agent.add(new Suggestion(String(JSON.stringify(result[0].operations[k].className))));
						//txture id an button binden
						//agent.parameters(JSON.stringify(result[0].operations[k].txtureId))
					}
				}

				agent.add(new Suggestion('Abbrechen'));

				resolve();
			}
		};
	});

}

function getInformationModel() {

	var data = null;
	var xhr = createXMLReq();
	xhr.timeout = 5000;


	xhr.open("GET", "https://htwg-konstanz.txture.io/api/v8/model/timestamp");
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJkOmQzYmVjNTY4LWNkNjQtNDg3Mi05MDM1LWQwNjRhYzk0Nzc4NyIsInNidCI6ImFwcCIsImlzcyI6InR4dHVyZSIsImV4cCI6MTU4Mjg0NDQwMH0.ZyyU68wDqwG5ED4CFjpSoOVKSEIQL4qdVfK_yRjxMeYB-gu5OjJs5I6F97o6LS7sgvlnrVucQXsbQryc1_ylTAncDcFRloK6VmoL5FGqL6ZEXzWEEdcAxknwN-NMwPyDW7tFAos_Cz2DJIfLAI5pb6_EKCPGjVCkkYSIy-ZvBaaJYFDsXasGjuVr31v1TBKEoPDplqbRZ60t-ikvRHLMLa3xSyfexVT5gdUhk4BxI3bmZAyxo7-7zu8X3cpg6CoMqX1IcjEOMzrSwkgQumLrwTT1MeL0YViw-dV6IEdWaML8wFGrn3TPxVb1DGZzSg00oLVwU61K4nc4EesgQWsdqw4wuV4PJWRQEq63YgQ4Ngtw0NTfuQZlpCxryTEToZZQrKv24iSsEySlgbppNyVt6w1_BSsyJNpc91KUSHCGRQcQsBzSQnUHEYVoIcxIypYBXjsOW-sfijNKyyOqWsNd16tjFMxc1Xr81NqGluZy956FNlSNrLSKiwhibrD_7CYoVjpxg2g0QxgMg9Ld2ZiBCsKIMoMOj8cUncfkbu27z2I3oIwq_7qZh9C4gD72O9BOzboBdhuEq0ntre0voJZrj5kEkzzyW98AZZiBjvdyt0Qhs1VtPnSwl4kIg8vNxSdAofSMxUUEFEE196clSfv4_SQbYRw9D8dxo4SXiRQv3KA");

	xhr.send(data);

	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				//An dieser Stelle Repsonse weiterleiten und entsprechend auslesen
				agent.add(xhr.responseText);
				agent.add(new Suggestion('Infos über dies (Bei Klick muss hierfür ein Intent aufgerufen werden mit Info über dies, welches dann weitere Dinge tut'));
				agent.add(new Suggestion('Infos über das'));
				agent.add(new Suggestion('Abbrechen'));

				agent.add(new Card({
					title: "Title: this is a card title",
					imageUrl: "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
					text: "This is the body text of a card.  You can even use line\n  breaks and emoji!",
					buttonText: 'This is a button',
					buttonUrl: 'https://assistant.google.com/'
				}));

				resolve();
			}
		};
	});

	//xhr.open("GET", "https://htwg-konstanz.txture.io/api/v8/refactoring/informationModel/json");

	//https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/src/rich-responses
	//https://www.zoho.com/salesiq/help/developer-section/bot-dialogflow-basics.html

}

function getTimeStamp() {

	var data = null;
	var xhr = createXMLReq();
	xhr.timeout = 5000;

	xhr.open("GET", "https://htwg-konstanz.txture.io/api/v8/model/timestamp", false);
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJkOmQzYmVjNTY4LWNkNjQtNDg3Mi05MDM1LWQwNjRhYzk0Nzc4NyIsInNidCI6ImFwcCIsImlzcyI6InR4dHVyZSIsImV4cCI6MTU4Mjg0NDQwMH0.ZyyU68wDqwG5ED4CFjpSoOVKSEIQL4qdVfK_yRjxMeYB-gu5OjJs5I6F97o6LS7sgvlnrVucQXsbQryc1_ylTAncDcFRloK6VmoL5FGqL6ZEXzWEEdcAxknwN-NMwPyDW7tFAos_Cz2DJIfLAI5pb6_EKCPGjVCkkYSIy-ZvBaaJYFDsXasGjuVr31v1TBKEoPDplqbRZ60t-ikvRHLMLa3xSyfexVT5gdUhk4BxI3bmZAyxo7-7zu8X3cpg6CoMqX1IcjEOMzrSwkgQumLrwTT1MeL0YViw-dV6IEdWaML8wFGrn3TPxVb1DGZzSg00oLVwU61K4nc4EesgQWsdqw4wuV4PJWRQEq63YgQ4Ngtw0NTfuQZlpCxryTEToZZQrKv24iSsEySlgbppNyVt6w1_BSsyJNpc91KUSHCGRQcQsBzSQnUHEYVoIcxIypYBXjsOW-sfijNKyyOqWsNd16tjFMxc1Xr81NqGluZy956FNlSNrLSKiwhibrD_7CYoVjpxg2g0QxgMg9Ld2ZiBCsKIMoMOj8cUncfkbu27z2I3oIwq_7qZh9C4gD72O9BOzboBdhuEq0ntre0voJZrj5kEkzzyW98AZZiBjvdyt0Qhs1VtPnSwl4kIg8vNxSdAofSMxUUEFEE196clSfv4_SQbYRw9D8dxo4SXiRQv3KA");

	xhr.send(data);

	var result = null;

	//Synchroner Call, ob das sinnvoll ist muss noch überprüft werden
	//Timestamp wird aber immer vor Aufruf von REST benötigt, deshalb vermutlich sinnvoll

	var a = new Promise((resolve, reject) => {

		if (xhr.readyState === 4 && xhr.status === 200) {
			//An dieser Stelle Repsonse weiterleiten und entsprechend auslesen
			result = xhr.responseText;
			console.log("innerhalb" + result);

			resolve();

		};
	});
	console.log("ausserhalb" + result);
	return result;
}


function fallback(res) {
	console.log("fallback function");
	console.log(agent.contexts);

	var data = null;
	var xhr = createXMLReq();
	xhr.timeout = 5000;


	//Hier handler schreiben der die Möglichkeiten auflistet
	//muss vermutlich auch besser über Dialogflow gesteuert werden
	if (agent.query === "Infos über das") {
		xhr.open("GET", "https://htwg-konstanz.txture.io/api/v8/model/timestamp");
		xhr.setRequestHeader("cache-control", "no-cache");
		xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJkOmQzYmVjNTY4LWNkNjQtNDg3Mi05MDM1LWQwNjRhYzk0Nzc4NyIsInNidCI6ImFwcCIsImlzcyI6InR4dHVyZSIsImV4cCI6MTU4Mjg0NDQwMH0.ZyyU68wDqwG5ED4CFjpSoOVKSEIQL4qdVfK_yRjxMeYB-gu5OjJs5I6F97o6LS7sgvlnrVucQXsbQryc1_ylTAncDcFRloK6VmoL5FGqL6ZEXzWEEdcAxknwN-NMwPyDW7tFAos_Cz2DJIfLAI5pb6_EKCPGjVCkkYSIy-ZvBaaJYFDsXasGjuVr31v1TBKEoPDplqbRZ60t-ikvRHLMLa3xSyfexVT5gdUhk4BxI3bmZAyxo7-7zu8X3cpg6CoMqX1IcjEOMzrSwkgQumLrwTT1MeL0YViw-dV6IEdWaML8wFGrn3TPxVb1DGZzSg00oLVwU61K4nc4EesgQWsdqw4wuV4PJWRQEq63YgQ4Ngtw0NTfuQZlpCxryTEToZZQrKv24iSsEySlgbppNyVt6w1_BSsyJNpc91KUSHCGRQcQsBzSQnUHEYVoIcxIypYBXjsOW-sfijNKyyOqWsNd16tjFMxc1Xr81NqGluZy956FNlSNrLSKiwhibrD_7CYoVjpxg2g0QxgMg9Ld2ZiBCsKIMoMOj8cUncfkbu27z2I3oIwq_7qZh9C4gD72O9BOzboBdhuEq0ntre0voJZrj5kEkzzyW98AZZiBjvdyt0Qhs1VtPnSwl4kIg8vNxSdAofSMxUUEFEE196clSfv4_SQbYRw9D8dxo4SXiRQv3KA");

		xhr.send(data);
	}
	else {
		console.log("elsecase")

		//Methode liefert zu spät den Timestamp muss gelöst werden
		var timestamp = getTimeStamp();
		console.log(timestamp);


		var xhr = createXMLReq();
		xhr.timeout = 5000;

		xhr = setHeaders("https://htwg-konstanz.txture.io/api/v8/model/master/1567680979092/entities?allowPartialResult=false&entityIds=t%3A00c18363-1415-4bb0-a5a2-71320794a50c&entityIds=t%3A00c18363-1415-4bb0-a5a2-71320794a50c", xhr, "POST");

		//xhr.open("POST", "https://htwg-konstanz.txture.io/api/v8/model/master/1567680979092/entities?allowPartialResult=false&entityIds=t%3A00c18363-1415-4bb0-a5a2-71320794a50c&entityIds=t%3A00c18363-1415-4bb0-a5a2-71320794a50c");
		//xhr.setRequestHeader("cache-control", "no-cache");
		//xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJkOmQzYmVjNTY4LWNkNjQtNDg3Mi05MDM1LWQwNjRhYzk0Nzc4NyIsInNidCI6ImFwcCIsImlzcyI6InR4dHVyZSIsImV4cCI6MTU4Mjg0NDQwMH0.ZyyU68wDqwG5ED4CFjpSoOVKSEIQL4qdVfK_yRjxMeYB-gu5OjJs5I6F97o6LS7sgvlnrVucQXsbQryc1_ylTAncDcFRloK6VmoL5FGqL6ZEXzWEEdcAxknwN-NMwPyDW7tFAos_Cz2DJIfLAI5pb6_EKCPGjVCkkYSIy-ZvBaaJYFDsXasGjuVr31v1TBKEoPDplqbRZ60t-ikvRHLMLa3xSyfexVT5gdUhk4BxI3bmZAyxo7-7zu8X3cpg6CoMqX1IcjEOMzrSwkgQumLrwTT1MeL0YViw-dV6IEdWaML8wFGrn3TPxVb1DGZzSg00oLVwU61K4nc4EesgQWsdqw4wuV4PJWRQEq63YgQ4Ngtw0NTfuQZlpCxryTEToZZQrKv24iSsEySlgbppNyVt6w1_BSsyJNpc91KUSHCGRQcQsBzSQnUHEYVoIcxIypYBXjsOW-sfijNKyyOqWsNd16tjFMxc1Xr81NqGluZy956FNlSNrLSKiwhibrD_7CYoVjpxg2g0QxgMg9Ld2ZiBCsKIMoMOj8cUncfkbu27z2I3oIwq_7qZh9C4gD72O9BOzboBdhuEq0ntre0voJZrj5kEkzzyW98AZZiBjvdyt0Qhs1VtPnSwl4kIg8vNxSdAofSMxUUEFEE196clSfv4_SQbYRw9D8dxo4SXiRQv3KA");

		//xhr.send(data);
	}

	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				//An dieser Stelle Repsonse weiterleiten und entsprechend auslesen
				agent.add("This is a timestamp" + xhr.responseText);

				resolve();
			}
		};
	});
}

function getInfo(res) {

	console.log(agent.contexts)

	var data = null;
	var xhr = createXMLReq();
	xhr.timeout = 5000;


	xhr.open("GET", "https://htwg-konstanz.txture.io/api/v8/model/timestamp");
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJkOmQzYmVjNTY4LWNkNjQtNDg3Mi05MDM1LWQwNjRhYzk0Nzc4NyIsInNidCI6ImFwcCIsImlzcyI6InR4dHVyZSIsImV4cCI6MTU4Mjg0NDQwMH0.ZyyU68wDqwG5ED4CFjpSoOVKSEIQL4qdVfK_yRjxMeYB-gu5OjJs5I6F97o6LS7sgvlnrVucQXsbQryc1_ylTAncDcFRloK6VmoL5FGqL6ZEXzWEEdcAxknwN-NMwPyDW7tFAos_Cz2DJIfLAI5pb6_EKCPGjVCkkYSIy-ZvBaaJYFDsXasGjuVr31v1TBKEoPDplqbRZ60t-ikvRHLMLa3xSyfexVT5gdUhk4BxI3bmZAyxo7-7zu8X3cpg6CoMqX1IcjEOMzrSwkgQumLrwTT1MeL0YViw-dV6IEdWaML8wFGrn3TPxVb1DGZzSg00oLVwU61K4nc4EesgQWsdqw4wuV4PJWRQEq63YgQ4Ngtw0NTfuQZlpCxryTEToZZQrKv24iSsEySlgbppNyVt6w1_BSsyJNpc91KUSHCGRQcQsBzSQnUHEYVoIcxIypYBXjsOW-sfijNKyyOqWsNd16tjFMxc1Xr81NqGluZy956FNlSNrLSKiwhibrD_7CYoVjpxg2g0QxgMg9Ld2ZiBCsKIMoMOj8cUncfkbu27z2I3oIwq_7qZh9C4gD72O9BOzboBdhuEq0ntre0voJZrj5kEkzzyW98AZZiBjvdyt0Qhs1VtPnSwl4kIg8vNxSdAofSMxUUEFEE196clSfv4_SQbYRw9D8dxo4SXiRQv3KA");

	xhr.send(data);

	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				//An dieser Stelle Repsonse weiterleiten und entsprechend auslesen
				agent.add(xhr.responseText);
				agent.add(new Suggestion('Infos über dies (Bei Klick muss hierfür ein Intent aufgerufen werden mit Info über dies, welches dann weitere Dinge tut'));
				agent.add(new Suggestion('Infos über das'));
				agent.add(new Suggestion('Abbrechen'));

				agent.add(new Card({
					title: "Title: this is a card title",
					imageUrl: "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
					text: "This is the body text of a card.  You can even use line\n  breaks and emoji!",
					buttonText: 'This is a button',
					buttonUrl: 'https://assistant.google.com/'
				}));

				resolve();
			}
		};
	});

	//xhr.open("GET", "https://htwg-konstanz.txture.io/api/v8/refactoring/informationModel/json");

	//https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/src/rich-responses
	//https://www.zoho.com/salesiq/help/developer-section/bot-dialogflow-basics.html

}


const port = process.env.PORT || 4000;

app.listen(port);