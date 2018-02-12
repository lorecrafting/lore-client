
<template>
  <div> 
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
            {{ exit }} ,
          </span>
          </div>
              </section>
      <section id="room_events_container">
        <p v-html="msg"></p>
      </section>

      <form @submit.prevent="sendTextToEvennia">
        <input type="text" v-model="userInputTxt">
      </form>

      <input @click="clearEventLog"type="button" value="clear">
      
    </div>
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

    

      console.log("data from evennia", data);

      if (data[2].current_location) {
        const currentLocation = data[2].current_location
        console.log('currentLocation', currentLocation)

        this.roomTitle = currentLocation.name;
        this.roomDesc = currentLocation.desc;
        this.roomContents = currentLocation.contents;
        this.roomExits = currentLocation.exits;


      } else {
        this.msg += "<p>" + data[1][0] + "</p>";
        const container = this.$el.querySelector("#room_events_container");
        container.scrollTop = container.scrollHeight;
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
    },
    clearEventLog: function() {
      this.msg = "";
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
html {
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
}
::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}
/* optional: show position indicator in red */
::-webkit-scrollbar-thumb {
    background: #FF0000;
}
#player_location_container {
  width: 50%;
  margin: 0 auto;

}
#room_title_header {
  width: 700px;
  height: 50px;
  padding-left: 50px;
  padding-right: 50px;
}
#room_desc_container {
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 20px;
  text-align: left;
  width: 700px;
  height: 100px;

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
  padding-bottom: 50px;
  text-align: center;
}
#room_events_container {
  padding-left: 50px;
  padding-right: 50px;
  text-align: left;
  height: 400px;
  display: inline-block;
  position: relative;
  overflow-y: hidden;
}
</style>
