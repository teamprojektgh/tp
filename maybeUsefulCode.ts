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
    
    