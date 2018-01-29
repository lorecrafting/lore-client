<template>
  <div class="hello">
    <p v-html="msg"></p>
   
 
    <form @submit.prevent="sendTextToEvennia">
      <input type="text" v-model="userInputTxt">
    </form>
    
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      socket: null,
      userInputTxt: null,
      msg: "",
      loginScreen: "",
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
      const data = JSON.parse(e.data)[1];
      console.log("ws data from evennia", data);
      this.msg = text[0];
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
