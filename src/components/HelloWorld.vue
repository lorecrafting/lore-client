
<template>
  
  <div id="player_location_container">
    <header id="room_title_header">
      <h2>{{ roomTitle }}</h2>
    </header>
    <section id="room_desc_container"> {{ roomDesc }}</section>
    <section id="room_contents_container">
        <p id="room_content_item" v-for="item in roomContents" :key="item">
          {{ item }}
        </p>
    </section>
    <section id="room_exits_container">
        <div v-if="roomExits.length > 0" id="room_exits_list">
          Exits:
         <span v-for="exit in roomExits" :key="exit">
          {{ exit }}
        </span>
        </div>
            </section>
    <section id="room_events_container">
      <p v-html="msg"></p>
    </section>




    

   
 
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
      loginScreen: true,
      roomTitle: "",
      roomDesc: "",
      roomContents: [],
      roomExits: ""
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
      const data = JSON.parse(e.data);
      this.msg = data[1][0];

      console.log("data from evennia", data);

      if (data[2].player_location_update) {
        const {
          room_title,
          room_desc,
          room_contents,
          room_exits
        } = data[2].player_location_update;

        this.roomTitle = room_title;
        this.roomDesc = room_desc;
        this.roomContents = room_contents;
        this.roomExits = room_exits;


      }
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
#room_desc_container {
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 20px;
  text-align: left;
}
#room_contents_container {
  padding-left: 50px;
  padding-right: 50px;
  text-align: left;
}
#room_content_item {
  margin-bottom: 0px;
  margin-top: 0px;
}
#room_exits_container {
  padding-top: 20px;
  padding-left: 50px;
  padding-right: 50px;
  text-align: center;
}
#room_events_container {
  padding-left: 50px;
  padding-right: 50px;
  text-align: left;
}
</style>
