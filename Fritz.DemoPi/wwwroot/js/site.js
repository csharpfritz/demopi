(function () {

	var connection;
	const counter = document.getElementById("counter");
	const connectionState = document.getElementById("cxn");
	const currentSha = document.getElementById("currentSHA");

	async function initialize() {

		var links = document.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			if (link.rel === "stylesheet") { link.href += "?"; }
		}

		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			var script = scripts[i];
			script.href += "?"; 
		}

		var version = await connection.invoke("GetCurrentSha");
		currentSha.innerText = "Current SHA: " + version;

	}

	async function start() {
		try {
			await connection.start();
			connectionState.innerText = "Connected";
		} catch (err) {
			console.log(err);
			connectionState.innerText = "Error Connecting: " + err;
			setTimeout(start, 5000);
		}

		counter.innerText = await connection.invoke("GetCount");

		connection.onreconnecting(() => {
			connectionState.innerText = "Reconnecting";
			connectionState.classList.add("alert-danger");
			setTimeout(() => {
				connectionState.classList.remove("alert-danger");
			}, 5000);
		});

		connection.onreconnected(async () => {
			connectionState.innerText = "Connected";

			counter.innerText = await connection.invoke("GetCount");

			initialize();
			connectionState.classList.add("alert-primary");
			setTimeout(() => {
				connectionState.classList.remove("alert-primary");
			}, 5000);
		});

		connection.onclose(async () => {
			connectionState.innerText = "Disconnected";
			connectionState.classList.add("alert-danger");
			setTimeout(() => {
				connectionState.classList.remove("alert-danger");
			}, 5000);
			await start();
		});

	};

	const c = {

		Start: async function () {


			connection = new signalR.HubConnectionBuilder()
				.withUrl('/hub/counter')
				.withAutomaticReconnect()
				.configureLogging(signalR.LogLevel.Information)
				.build();

			await start();

			var version = await connection.invoke("GetCurrentSha");
			currentSha.innerText = "Current SHA: " + version;

		},

		HandleClick: async function (evt) {
			counter.innerText = await connection.invoke("Click");
			evt.stopPropagation();
		}



	}

	window.CounterApp = c;

	window.CounterApp.Start();

	document.querySelector('#cover').addEventListener('mouseup', window.CounterApp.HandleClick, true);

})();
