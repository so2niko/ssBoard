const v_chat = new Vue({
    el : "#chat",
    data : {
        timer : null,
        name : 'noname',
        apiKey : '936171315:AAFDPYTgVh68Uh3MRlZGi880CDFdK1keqzY',
        linkUpd : `https://api.telegram.org/bot936171315:AAFDPYTgVh68Uh3MRlZGi880CDFdK1keqzY/getUpdates`,
        remoteData : [],
        lastId : 0
    },
    methods : {
        getUpdates : function(){
            this.timer = setInterval(()=>{
                    fetch(this.linkUpd).then(data=> data.json()).then(updObj=> this.checkUpdates(updObj.result));
                },
                1000);
        },
        checkUpdates : function (obj) {
            if(obj[obj.length - 1].update_id != this.lastId){
                this.lastId = obj[obj.length - 1].update_id;
                this.remoteData = obj.reverse().map(msg=> {
                        return {
                            name: msg.message.chat.first_name,
                            time: new Date(msg.message.date * 1000).toLocaleString("ru-UA", {hour12: false}),
                            text : msg.message.text
                        }
                    }
                );
                console.log(this.remoteData);
            }
        }
    },
    created : function(){
        this.getUpdates();
    }
});
