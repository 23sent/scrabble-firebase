class FirebaseChat{
    constructor(chatBoxId, chatButtonId, fireBase, username){
        this.chatBox = document.getElementById(chatBoxId);
        this.chatButton = document.getElementById(chatButtonId);
        this.fireBase = fireBase;
        this.body = this.chatBox.getElementsByClassName("chat-body")[0];
        this.name = username;
        this.messages = [];
        this.oldMessagesLength = 0;
        fireBase.on("value", function(snapshot){
            if(snapshot.val() == null){
                this.message = [];
            }else{
                this.messages = snapshot.val();
            }
                this.updateMessages();
        }, this);
    }

    showChat(id){
        this.chatBox.style.display = "block"; 
    }

    hideChat(id){
        this.chatButton.style.display = "none";
    }

    updateMessages(){
        console.log("update");
       
        while (this.body.firstChild) {
            this.body.removeChild(this.body.firstChild);
        }
        if(this.messages.length != this.oldMessagesLength){
            if(this.chatBox.style.display == "none"){
                this.chatButton.classList.remove("btn-secondary");
                this.chatButton.classList.add("btn-danger");
            }
        }
        
        this.messages.forEach(function(message){
            let msg = document.createElement("div");
            msg.appendChild(document.createTextNode(message.name+": "+message.text));
            if(message.name == this.name){
                msg.classList.add("mine");
            }
            else{
                msg.classList.add("other");
            }
            this.body.appendChild(msg);
        }, this)
        this.oldMessagesLength = this.messages.length;
    }

    sendMessages(){
        let text = this.chatBox.getElementsByTagName("input")[0].value;
        this.chatBox.getElementsByTagName("input")[0].value = "";

        if(text){
            let name = this.name;
            let message = {name, text};
            this.messages.push(message);
            this.fireBase.set(this.messages);
        }
    }
}