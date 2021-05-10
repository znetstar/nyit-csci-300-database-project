<template>
  <div class="input-thingy">
    <ThingyEditor v-if="!noEdit" :is-done="isDone" :is-open="isOpen" :type="this.type" :selected-item="this.selectedItem"></ThingyEditor>
    <md-autocomplete md-layout="box" v-model="selectedItemName" :md-options="thingys" @md-changed="getThingys" @md-selected="selectItem">
      <label>{{this.label()}}</label>

      <template slot="md-autocomplete-item" slot-scope="{ item, term }">
        <md-highlight-text :md-term="term">{{ item.name }}</md-highlight-text>
      </template>

      <template v-if="Boolean(term) && !noEdit" slot="md-autocomplete-empty" slot-scope="{ term }">
        <a id="new-item" @click="selectItem({ id: -1, name: term })"><span>Add "{{ term }}"</span></a>
      </template>
    </md-autocomplete>
  </div>
</template>

<script>
import ThingyEditor from "./ThingyEditor";
export default {
  name: "InputThingy",
  components: {ThingyEditor},
  props: [
    'type',
    'id',
    'noEdit',
    'onChange'
  ],
  methods: {
    async isDone(item) {
      this.selectedItem = item;
      this.selectedItemName = item.name;
      this.isOpen = false;
      this.thingys = [ ];

      this.onChange(item);

      return this.getThingys(item.name);
    },
    selectItem(item) {
      if (!item) return;

      this.selectedItem = item;
      this.selectedItemName = item.name;

      if (item.id === -1) {
        this.isOpen = true;
      } else {
        this.onChange(item);
      }
    },
    async getThingys(term) {
      let thingyResp = await (await fetch(`/api/db-app/${this.type}?query=${term || ''}`)).json();

      this.thingys = (thingyResp || []).map(o => {
        o.toLowerCase = o.name.toLowerCase.bind(o.name);
        return o;
      });
    },
    label() {
      return this.type ? (this.type[0]).toUpperCase()+this.type.substr(1) : '';
    }
  },
  async created() {
    if (this.id && this.id !== -1 && (!this.selectedItem || this.selectedItem.id !== this.id)) {
      this.selectedItem = await (await fetch(`/api/db-app/${this.type}/${this.id}`)).json();
      this.selectedItemName = this.selectedItem.name;
    }
  },
  data: () => {
    let selectedItem = { id: 0, name: '' };

    return  {
      selectedItemName: selectedItem.name,
      selectedItem,
      isOpen: false,
      thingys: [

      ]
    }
  }
}
</script>

<style scoped>
.md-autocomplete + strong {
  margin-top: 36px;
  display: block;
}
#new-item {
  text-outline: none;
  cursor: pointer;
}
.input-thingy {
  margin-top: 25px;
}
</style>
