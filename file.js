// installazione pacchetti
const TelegramBot = require('node-telegram-bot-api');
const http = require("http");
const mysql = require("mysql");

// DATABASE
var con = mysql.createConnection({
    host: 'localhost',
    user: 'telegrambot',
    database: 'telegrambot',
    password: 'password.123',
})
con.connect(function(err) {
    if (err) {
        console.log("Errore nella connessione");
        throw err;
    }
    console.log("Connesso al DB");
})

// Api per il collegamento con il sito
const Api = "bdf70e1a2e074c82828173df19ae45f1";

//token preso dal BotFather
const token = '5340531362:AAFGRMj0mISGgV5Pm7tSDrxGaoR0lM0DKwc';

//creazione istanza telegramBot
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Benvenuto su <b>Bot Trabucchi</b>\nIl BOT che ti tiene aggiornato su tutte le informazioni relative al mondo dell' NBA." +
        "\nPrima di iniziare ti consiglio di inserire il comando /comandi per avere informazioni sui comandi. ", { parse_mode: "HTML" });
});

// elenco dei comandi
bot.onText(/\/comandi/, (msg) => {
    bot.sendMessage(msg.chat.id, "Ecco i comandi che il BOT può eseguire:\n", {
        "reply_markup": {
            "keyboard": [
                ["elenco stadi", "stadio"],
                ["news", "partite"],
                ["squadra", "giocatore"],
                ["arbitri", "arbitro"],
                ["giocatori squadra"]
            ]
        }
    });
})

// giocatori squadra 
bot.on('message', (msg) => {
    var meteo = "giocatori squadra";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/giocatorisquadra', verranno visualizzati i nomi di tutti i giocatori di quella squadra.\n " +
            "Per esempio provare ad inserire il comando '/giocatorisquadra LAL'.[inserire il tag]");
    }
})

// Arbitri
bot.on('message', (msg) => {
    var meteo = "arbitri";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/arbitri', verranno visualizzati i nomi di tutti gli albitri della NBA.");
    }
})

// Arbitro
bot.on('message', (msg) => {
    var meteo = "arbitro";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/arbitro', verranno visualizzate le informazioni di quell'arbitro.\n" +
            "Per esempio provare ad inserire il comando '/arbitro Nick Buchert'.");
    }
})

// Squadra
bot.on('message', (msg) => {
    var meteo = "squadra";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/squadra', verranno visualizzate le informazioni di quella squadra.\n " +
            "Per esempio provare ad inserire il comando '/squadra Lakers'.");
    }
})

//Giocatore
bot.on('message', (msg) => {
    var meteo = "giocatore";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/giocatore', verranno visualizzate le informazioni di quel giocatore.\n " +
            "Per esempio provare ad inserire il comando '/giocatore James'.");
    }
})

//News
bot.on('message', (msg) => {
    var meteo = "news";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/news', verranno visualizzate le news più recenti relative all'NBA.");
    }
})

//Stadio
bot.on('message', (msg) => {
    var meteo = "stadio";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/stadio', verranno visualizzate le informazioni di quello stadio.");
    }
})

//Elenco Stadi
bot.on('message', (msg) => {
    var meteo = "elenco stadi";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/elencostadi', verra visualizzato l'elenco di tutti gli stadi dell'NBA.");
    }
})

//Partite
bot.on('message', (msg) => {
    var meteo = "partite";
    if (msg.text.toString().toLowerCase().indexOf(meteo) === 0) {
        bot.sendMessage(msg.chat.id, "Inserendo il comando '/partiteora', verrà riportato se ci sono o meno partite in corso al momento.");
    }
})

//-------------------------------------------------------------------------------------------------------------------------------------------------

// Are Games In Progress
bot.onText(/\/games/, (msg) => {
    const chatId = msg.chat.id;

    http.get("http://api.sportsdata.io/v3/nba/scores/json/News" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                message.push("Titolo:\n " + parsedData[0].Title);
                message.push("Data: " + parsedData[0].Updated);
                message.push(parsedData[0].TimeAgo + "\n");
                message.push("Contenuto:\n " + parsedData[0].Content);
                message.push("Url: \n" + parsedData[0].Url);

                console.table(message);
                bot.sendMessage(chatId, message.join("\n"));
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

//Informazioni stadio in base al nome
bot.onText(/\/stadio (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1] ? match[1] : "";
    var lat = 0;
    var long = 0;

    http.get("http://api.sportsdata.io/v3/nba/scores/json/Stadiums" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                parsedData.forEach(element => {
                    if (element.Name == name) {
                        message.push("<b>" + element.Name + "</b>");
                        message.push("Indirizzo: " + element.Address);
                        message.push("Città: " + element.City);
                        message.push("Stato: " + element.State);
                        message.push("Capacità: " + element.Capacity + " persone");
                        lat = element.GeoLat;
                        long = element.GeoLong;
                    }
                });

                console.table(message);
                bot.sendMessage(chatId, message.join("\n"), { parse_mode: "HTML" });
                bot.sendLocation(chatId, lat, long);
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

//Informazioni stadi
bot.onText(/\/elencostadi/, (msg) => {
    const chatId = msg.chat.id;

    http.get("http://api.sportsdata.io/v3/nba/scores/json/Stadiums" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                message.push("<b>Elenco stadi NBA:</b>");
                parsedData.forEach(element => {
                    message.push(element.Name);
                });

                console.table(message);
                bot.sendMessage(chatId, message.join("\n"), { parse_mode: "HTML" });
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

//News
bot.onText(/\/news/, (msg) => {
    const chatId = msg.chat.id;

    http.get("http://api.sportsdata.io/v3/nba/scores/json/News" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                message.push("Titolo:\n " + parsedData[0].Title);
                message.push("Data: " + parsedData[0].Updated);
                message.push(parsedData[0].TimeAgo + "\n");
                message.push("Contenuto:\n " + parsedData[0].Content);
                message.push("Url: \n" + parsedData[0].Url);

                console.table(message);
                bot.sendMessage(chatId, message.join("\n"));
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

//Partite che si svolgono al momento
bot.onText(/\/partiteora/, (msg) => {
    const chatId = msg.chat.id;

    http.get("http://api.sportsdata.io/v3/nba/scores/json/AreAnyGamesInProgress" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                if (parsedData == true) {
                    bot.sendMessage(chatId, "Ci sono partite che si stanno svolgendo ora");
                } else {
                    bot.sendMessage(chatId, "Non ci sono partite che si stanno svolgendo ora");
                }

                console.table(parsedData);
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

//Informazioni squadra in base al nome
bot.onText(/\/squadra (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1] ? match[1] : "";

    var imageReferee = "";
    con.query("SELECT immagine FROM squadre WHERE nome LIKE ?", [name], function(err, result) {
        if (err) throw err;
        imageReferee = result[0];
    })

    http.get("http://api.sportsdata.io/v3/nba/scores/json/AllTeams" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                parsedData.forEach(element => {
                    if (element.Name == name) {
                        message.push("<b>" + element.Name + "</b>");
                        message.push("Key: " + element.Key);
                        message.push("Conference: " + element.Conference);
                        message.push("Città: " + element.City);
                        message.push("Divisione: " + element.Division);
                    }
                });

                console.table(message);
                console.log(imageReferee.immagine);
                bot.sendMessage(chatId, message.join("\n"), { parse_mode: "HTML" });
                bot.sendPhoto(chatId, imageReferee.immagine);
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

//Informazioni giocatore in base al Nome (2419 giocatori)
bot.onText(/\/giocatore (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1] ? match[1] : "";
    let giocatore = 0;
    image = "";
    http.get("http://api.sportsdata.io/v3/nba/scores/json/Players" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];
                parsedData.forEach(element => {
                    if (element.LastName == name) {
                        giocatore = element.PlayerID;

                        message.push("<b> " + element.FirstName + "</b> " + "<b>" + element.LastName + "</b>");
                        message.push("🏀 Team: " + element.Team);
                        message.push("🥇 Categoria: " + element.PositionCategory);
                        message.push("📏 Altezza: " + parseInt(parseInt(element.Height) * 2.54) + " cm");
                        message.push("⚖️ Peso: " + parseInt(parseInt(element.Weight) * 0.454) + " Kg");
                        message.push("📅 Data di nascita: " + element.BirthDate.split("T")[0]);
                        message.push("🏠 BirthCity: " + element.BirthCity);
                        message.push("💸 Salary: " + element.Salary + " $ / anno");
                        message.push("📊 Esperienza: " + element.Experience + " anni");
                        image = element.PhotoUrl;
                    }
                });
                if (message.length === 0) {
                    bot.sendMessage("CAIHDwaid");

                } else {
                    console.table(message);
                    console.log(giocatore);
                    bot.sendMessage(chatId, message.join("\n"), { parse_mode: "HTML" });
                    bot.sendPhoto(chatId, image);
                }

            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

// Players by Team
bot.onText(/\/giocatorisquadra (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1] ? match[1] : "";

    http.get("http://api.sportsdata.io/v3/nba/scores/json/Players/" + name + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                message.push("<b>Elenco giocatori " + name + ":</b>");
                parsedData.forEach(element => {
                    message.push(element.FirstName + " " + element.LastName);
                });

                console.table(message);
                bot.sendMessage(chatId, message.join("\n"), { parse_mode: "HTML" });
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
});

// Referees
bot.onText(/\/arbitri/, (msg) => {
    const chatId = msg.chat.id;

    http.get("http://api.sportsdata.io/v3/nba/scores/json/Referees" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                message.push("<b>Elenco degli arbitri</b>");
                parsedData.forEach(element => {
                    message.push(element.Name);
                });

                console.table(message);
                bot.sendMessage(chatId, message.join("\n"), { parse_mode: "HTML" });
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
})

// Referee detail
bot.onText(/\/arbitro (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1] ? match[1] : "";

    var imageReferee = "";
    con.query("SELECT immagine FROM albitri WHERE nome LIKE ?", [name], function(err, result) {
        if (err) throw err;
        imageReferee = result[0];
    })
    http.get("http://api.sportsdata.io/v3/nba/scores/json/Referees" + "?key=" + Api, (res) => {
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                var message = [];

                parsedData.forEach(element => {
                    if (element.Name == name) {
                        message.push("<b>" + element.Name + "</b>");
                        message.push("Number: " + element.Number);
                    }
                });

                console.table(message);
                bot.sendMessage(chatId, message.join("\n"), { parse_mode: "HTML" });
                bot.sendPhoto(chatId, imageReferee.immagine);
            } catch (e) {
                bot.sendMessage(chatId, "errore: " + e.message);
            }
        })
    }).on("errore", (e) => {
        bot.sendMessage(chatId, "errore: " + e.message);
    });
})