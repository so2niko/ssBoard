const v_chat = new Vue({
    el : "#chat",
    data : {
        timer : null,
        name : 'noname',
        apiKey : '936171315:AAFDPYTgVh68Uh3MRlZGi880CDFdK1keqzY',
        linkUpd : `https://api.telegram.org/bot936171315:AAFDPYTgVh68Uh3MRlZGi880CDFdK1keqzY/getUpdates`,
        linkSendMsg : `https://api.telegram.org/bot936171315:AAFDPYTgVh68Uh3MRlZGi880CDFdK1keqzY/sendMessage?`,
        remoteData : [],
        lastId : 0,
        chats : new Set(),
        sendMsg : ''
    },
    methods : {
        getUpdates : function(){
            this.timer = setInterval(()=>{
                    fetch(this.linkUpd).then(data=> data.json()).then(updObj=> this.checkUpdates(updObj.result));
                },
                1000);
        },
        checkUpdates : function (obj) {
            // console.log(obj);
            if(obj[obj.length - 1].update_id != this.lastId){
                this.lastId = obj[obj.length - 1].update_id;
                this.remoteData = obj.reverse().map(msg=> {
                        this.chats.add(msg.message.chat.id);
                        return {
                            name: msg.message.chat.first_name,
                            time: new Date(msg.message.date * 1000).toLocaleString("ru-UA", {hour12: false}),
                            info : this.getText(msg)
                        }
                    }
                );
                // console.log(this.remoteData);
            }
        },
        getText : function(msg){
            if(msg.message.hasOwnProperty('text')){
                return {
                    text: msg.message.text,
                    isLink: (msg.message.hasOwnProperty('entities'))? true: false
                };
            }

            return {
                text : msg.message.sticker.emoji,
                isLink : false
            };
        },
        sendMessage2All : function () {
            this.chats.forEach(chat => fetch(`${this.linkSendMsg}chat_id=${chat}&text=${this.sendMsg}`));
        }
    },
    created : function(){
        this.getUpdates();
    }
});

//`${this.linkSendMsg}chat_id=${chat}&text=${this.sendMsg}
// https://api.telegram.org/bot936171315:AAFDPYTgVh68Uh3MRlZGi880CDFdK1keqzY/sendMessage?chat_id=194287825&text=helloblablalba