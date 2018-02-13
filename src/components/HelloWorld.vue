
<template>
  <div> 
    <div id="player_location_container">
      <header id="room_title_header">
        <h2>{{ roomTitle }}</h2>
      </header>
      <RoomDesc id="room_contents_container" v-bind:roomDesc="roomDesc"/>
      <section id="room_exits_container">
          <div v-if="roomExits.length > 0" id="room_exits_list">
            Exits:
          <span v-for="exit in roomExits" :key="exit">
            {{ exit }} ,
          </span>
          </div>
              </section>
      <section v-html="roomEventLog" id="room_events_container">
      </section>

      <section id="user_input_container">
        <form @submit.prevent="sendTextToEvennia">
          <input type="text" v-model="userInputTxt">
          <input @click="clearEventLog"type="button" value="clear">
        </form>
      </section>
      
      
    </div>
  </div>
</template>

<script>
import RoomDesc from './RoomDesc'
export default {
  name: "HelloWorld",
  data() {
    return {
      socket: null,
      userInputTxt: null,
      roomEventLog: "",
      loginScreen: true,
      roomTitle: "",
      roomDesc: "",
      roomContents: [],
      roomExits: ""
    };
  },
  computed: {
    parsedRoomDesc: function() {
      let parsedRoomDescStr = this.roomDesc;

      if (this.roomExits.length === 0) {
        return this.roomDesc;
      } else {
        console.log("room has exits");
        this.roomExits.forEach(function(exitString) {
          parsedRoomDescStr = parsedRoomDescStr.replace(
            exitString,
            `<span class="exitText" @click="traverseExit" data-exitName="${exitString}">` +
              exitString +
              "</span>"
          );
        });
        console.log("parsedRoomDescStr", parsedRoomDescStr);
        return parsedRoomDescStr;
      }
    }
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
        const currentLocation = data[2].current_location;
        console.log("currentLocation", currentLocation);

        this.changeLocation(currentLocation);
      } else {
        // HACKY: to squelch room update messages to event log
        if (data[1][0][0] === "*") {
          return;
        }
        this.roomEventLog += "<p>" + data[1][0] + "</p>";
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
        ? this.userInputTxt
        : ""
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
    traverseExit: function(exitString) {
      console.log("traverseExit executed");
    },
    changeLocation: function(currentLocation) {
      this.roomTitle = currentLocation.name;
      this.roomDesc = currentLocation.desc;
      this.roomContents = currentLocation.contents;
      this.roomExits = currentLocation.exits;
      this.clearEventLog();
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
