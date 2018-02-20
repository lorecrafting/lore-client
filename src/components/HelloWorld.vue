
<template>
    <div id="player_location_container">
      <header id="room_title_header">
        <h2>{{ roomTitle }}</h2>
      </header>

      <RoomDesc id="room_desc_container" 
        v-bind:roomExits="roomExits" 
        v-bind:roomDesc="roomDesc" 
        v-bind:sendCommandToEvennia="sendCommandToEvennia"/>

      <section id="room_contents_container">
          <p id="room_content_item" v-for="item in roomContents" :key="item">
            {{ item }}
          </p>
      </section>
      <!-- <section id="room_exits_container">
          <div v-if="roomExits.length > 0" id="room_exits_list">
            Exits:
          <span v-for="exit in roomExits" :key="exit">
            {{ exit }} ,
          </span>
          </div>
              </section> -->
      <section v-html="roomEventLog" id="room_events_container">
      </section>

      <section id="user_input_container">
        <form @submit.prevent="userInputSubmit">
          <input type="text" v-model="userInputTxt">
          <input @click="clearEventLog"type="button" value="clear">
        </form>
      </section>
      
    </div>
</template>

<script>
import RoomDesc from "./RoomDesc";

export default {
  name: "HelloWorld",
  data() {
    return {
      userInputTxt: null,
      roomEventLog: "",
      roomTitle: "",
      roomDesc: "",
      roomContents: [],
      roomExits: []
    };
  },
  created() {
    this.initWebsocketConx(window.wsurl);
  },
  methods: {
    initWebsocketConx: function(wsurl) {
      const socket = new WebSocket(wsurl);
      socket.onopen = () => console.log("WS Connection Opened!");
      socket.onclose = () => console.log("WS Closed");
      socket.onmessage = this.handleIncomingWebsocketData
      // Attach socket instance to Vue's root scope so any component has access.
      this.$root.socket = socket;
    },
    handleIncomingWebsocketData: function(e) {
      const data = JSON.parse(e.data);
      console.log("Incoming data from Evennia: ", data);
      // Do nothing on logged_in response from Evennia
      if (data[0] === "logged_in") {
        return;
      }
      // HACKY: to squelch room update messages to event log
      if (data[1][0][0] === "*") {
        return;
      }
      // If "current_location" field exists in data from Evennia then update room.
      if (data[2].current_location) {
        this.updatePlayerLocation(data[2].current_location);
      } else {
        // Append all over messages from Evennia to event log
        this.appendEventLog(data[1][0]);
      }
    },
    userInputSubmit: function(e) {
      const lines = this.userInputTxt
        ? this.userInputTxt
        : ""
            .trim()
            .replace(/[\r]+/, "\n")
            .replace(/[\n]+/, "\n")
            .split("\n");
      this.sendCommandToEvennia(lines);
      this.userInputTxt = null;
    },
    sendCommandToEvennia: function(messageToEvennia) {
      const data = ["text", messageToEvennia, {}];
      console.log("Outgoing data to Evennia: ", data);
      this.$root.socket.send(JSON.stringify(data));
    },
    updatePlayerLocation: function(currentLocation) {
      console.log("CurrentLocation being updated to: ", currentLocation);
      this.roomTitle = currentLocation.name;
      this.roomDesc = currentLocation.desc;
      this.roomContents = currentLocation.contents;
      this.roomExits = currentLocation.exits;
      this.clearEventLog();
    },
    appendEventLog: function(data) {
      this.roomEventLog += "<p>" + data + "</p>";
      const container = this.$el.querySelector("#room_events_container");
      container.scrollTop = container.scrollHeight;
    },
    clearEventLog: function() {
      this.roomEventLog = "";
    }
  },
  components: {
    RoomDesc
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: bold;
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
  width: 0px; /* remove scrollbar space */
  background: transparent; /* optional: just make scrollbar invisible */
}
/* optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #ffffff;
}
#player_location_container {
  width: 50%;
  margin: 0 auto;
}
#room_title_header {
  width: 650px;
  height: 50px;
  padding-left: 50px;
  padding-right: 50px;
}
#room_desc_container {
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 20px;
  text-align: left;
  width: 650px;
  height: 100px;
}
#room_contents_container {
  width: 650px;
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 20px;
  text-align: left;
}
#room_content_item {
  width: 100%;
  margin-bottom: 0px;
  margin-top: 0px;
}
#room_exits_container {
  width: 650px;
  padding-left: 50px;
  padding-right: 50px;
  text-align: center;
}
#room_events_container {
  width: 650px;
  height: 400px;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 30px;
  padding-bottom: 30px;
  text-align: left;
  overflow-y: hidden;
}
#user_input_container {
  width: 650px;
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 20px;
  text-align: center;
}
.exitText {
  font-weight: bold;
}
</style>
