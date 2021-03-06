var express = require('express');

const fs = require('fs');
const tmi = require('tmi.js');

const NOME_DO_BOT = 'RsHBinaBOT';
const NOME_DO_CANAL_QUE_O_BOT_VAI_FICAR = 'binarush';
/* const NOME_DO_CANAL_QUE_O_BOT_VAI_FICAR = 'jaksonfives'; */
const TOKEN = 'oauth:bdfek0zpzgyxucsjp4td2ff3txqpj1';


/* var app = express();

app.listen(process.env.PORT || 5000); */

const opts = {
    identity: {
    username: NOME_DO_BOT,
    password: TOKEN
    },
    channels: [ NOME_DO_CANAL_QUE_O_BOT_VAI_FICAR ]
  };

// Cria um cliente tmi com  nossas opções
const client = new tmi.client(opts);

//intercepta mensagem do chat
function mensagemChegou(alvo, contexto, mensagem, ehBot) {

    var rawdata = fs.readFileSync('dados.json');

    if (ehBot) {
        return; //se for mensagens do nosso bot ele não faz nada
    } 
    
    const nomeDoComando = mensagem.trim();
    
    // checando o nosso comando
    if (nomeDoComando === '!fila') {
        var nicks = JSON.parse(rawdata);

        //usuário que chamou o comando
        var nick = contexto.username;

        var new_nick = {
                "user" : nick
        }

        var dados_arr = nicks.nicks.map(function(num) {     
            return num.user;
        });

        var nick_was_add = false;

        for(i=0;i<dados_arr.length;i++){
            if(dados_arr[i]===nick){
                nick_was_add = true;
            }
        }

        if(nick_was_add){
            client.say(alvo, "/me "+nick+", você já estava na lista. Aguarde sua vez VoHiYo ");
        }else{
            nicks.nicks.push(new_nick);

            fs.writeFileSync('dados.json', JSON.stringify(nicks));
    
            client.say(alvo, "/me "+nick+", você foi adicionado na lista. Digite !lista para ver a lista de pessoas para jogar.");
        }
    } else if(nomeDoComando === '!lista'){
        var nicks = JSON.parse(rawdata);
        var dados_arr = nicks.nicks.map(function(num) {    
            return num.user;
        });

        if(dados_arr.length>0){
            var txt = "";

            for(i=0;i<dados_arr.length; i++){
                if(i==0){
                    txt = ' '+(i+1)+'º - '+dados_arr[i] + ' |';
                }else{
                    txt += ' '+(i+1)+'º - '+dados_arr[i] + ' |';
                }
                
            }
            
            client.say(alvo, "/me LISTA PARA JOGAR: "+txt);
        }else{
            client.say(alvo, "/me A lista está vazia no momento. Digite !fila e venha jogar com a Bina! TwitchUnity");
        }
    
        

    }else if(nomeDoComando === "!removeNick"){
        if(contexto.mod || contexto.badges.broadcaster === '1'){
            var nicks = JSON.parse(rawdata);
            var removido = nicks.nicks.shift();
            console.log(nicks);
            fs.writeFileSync('dados.json', JSON.stringify(nicks));
            client.say(alvo, "/me "+removido.user+"  foi removido da lista.");
        }else{
            client.say(alvo, "Você não tem autorização para esse comando.");
        }
        
    }else if(nomeDoComando === "!limparLista"){
        if(contexto.mod || contexto.badges.broadcaster === '1'){
            var nicks = JSON.parse(rawdata);
            var dados_arr = nicks.nicks.map(function(num) {    
                return num.user;
            });

            if(dados_arr.length>0){
                for(i=0;i<=dados_arr.length;i++){
                    nicks.nicks.pop();
                    console.log(nicks);
                }
                fs.writeFileSync('dados.json', JSON.stringify(nicks));
                client.say(alvo, "A lista agora está vazia :)");
            }else{
                client.say(alvo, "A lista já está vazia NotLikeThis "); 
            }
        }
    }
}
  
function entrouNoChatDaTwitch(endereco, porta) {
    console.log(`* Bot entrou no endereço ${endereco}:${porta}`);
}

// Connecta na Twitch:
client.connect();

// Registra nossas funções
client.on('message', mensagemChegou);
client.on('connected', entrouNoChatDaTwitch);
