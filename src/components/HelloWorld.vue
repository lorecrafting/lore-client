
<template>
  <div class="hello">
    <p v-html="msg"></p>
   
 
    <form @submit.prevent="sendTextToEvennia">
      <input type="text" v-model="userInputTxt">
    </form>
    
  </div>
</template>

<script>
import { parse } from "himalaya";
export default {
  name: "HelloWorld",
  data() {
    return {
      socket: null,
      userInputTxt: null,
      msg: "",
      loginScreen: true,
      roomTitle: "",
      roomDesc: "",
      exits: ""
    };
  },
  created() {
    const socket = new WebSocket(wsurl);

    socket.addEventListener("open", () => {
      console.log("WS Connection Opened!");
    });

    socket.addEventListener("close", () => {
      console.log("WS Closed");
    });

    socket.addEventListener("message", e => {
      const data = JSON.parse(e.data)[1][0];
      console.log("ws data from evennia", data);

      const parsedData = data
        .replace(/&nbsp;/g, "")
        .replace(/<\/?[^>]+(>|$)+/g, "")
        .split("Exits:")
        .map(item => {
          return item.split("You see:");
        });

      console.log("parsedData", parsedData);
      let titleAndDesc = parsedData[0][0].split(/\(#[0-9]+\)/);
      let things

      let roomTitle = titleAndDesc[0];
      let roomDesc = titleAndDesc[1];
      this.roomTitle = roomTitle;
      this.roomDesc = roomDesc;
      this.msg = data;
    });
    this.$root.socket = socket;
  },
  methods: {
    sendTextToEvennia: function(e) {
      console.log("sendTextToEvennia: ", e);
      const lines = this.userInputTxt
        .trim()
        .replace(/[\r]+/, "\n")
        .replace(/[\n]+/, "\n")
        .split("\n");
      console.log("lines", lines);
      const data = ["text", lines, {}];
      if (this.userInputTxt) {
        this.$root.socket.send(JSON.stringify(data));
      }
      this.userInputTxt = null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
