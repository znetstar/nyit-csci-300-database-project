<template>
  <div>
    <NotifyBar :key="this.hasMessage" :has-message="this.hasMessage" :is-done="closeMessage" :message="this.message"></NotifyBar>
    <md-dialog id="edit-dialog" :md-active.sync="isOpen">
      <md-dialog-title :v-if="selectedItem.num !== 0">{{ selectedItem.id !== -1 ? 'Edit' : 'Create' }} {{this.label()}}</md-dialog-title>

      <md-dialog-content :v-if="type === 'to_supply' || (selectedItem.num !== 0)">
        <div v-if="type === 'to_supply'">
          <InputThingy
            :no-edit="true"
            type="item"
            :id="selectedItem.item_id"
            :on-change="onToSupplyItemChange(selectedItem)"
          ></InputThingy>

          <md-field>
            <label>Contract Price</label>
            <md-input required v-model="selectedItem.contract_price" type="number"></md-input>
          </md-field>


        </div>
        <div v-else>
          <md-field>
            <label>{{ this.label() }} Num</label>
            <md-input required v-model="selectedItem.num" type="number"></md-input>
          </md-field>

          <md-field>
            <label>{{ this.label() }} Name</label>
            <md-input required v-model="selectedItem.name" type="text"></md-input>
          </md-field>

          <div v-if="type === 'item'">
            <md-field>
              <label>Description</label>
              <md-input required v-model="selectedItem.desc" type="text"></md-input>
            </md-field>
<!--            <InputThingy type="supplier" :no-edit="true"></InputThingy>-->
          </div>

          <div v-else-if="type === 'supplier'">
            <md-field>
              <label>Address</label>
              <md-input required v-model="selectedItem.supplier_add" type="text"></md-input>
            </md-field>
          </div>

          <div v-else-if="type === 'project'">
            <md-field>
              <label>Data</label>
              <md-input required v-model="selectedItem.data" type="text"></md-input>
            </md-field>
          </div>

        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="close()">Close</md-button>
        <md-button class="md-primary" @click="save()">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import InputThingy from "./InputThingy";
export default {
  name: "ThingyEditor",
  components: {InputThingy},
  props: [
    'type',
    'selectedItem',
    'isOpen',
    'isDone'
  ],
  methods: {
    closeMessage() {
      this.hasMessage = false;
      this.message = null;
    },
    onToSupplyItemChange(toSupply) {
      return (item) => {
        toSupply.item_id = item.id;
      }
    },
    async getThingys(term) {

    },
    label() {
      return this.type ? (this.type[0]).toUpperCase()+this.type.substr(1) : '';
    },
    async save() {
      // New so POST
      let resp;
      if (this.selectedItem.id === -1) {
        resp = await fetch(`/api/db-app/${this.type}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.selectedItem)
        });
      } else {
        resp = await fetch(`/api/db-app/${this.type}/${this.selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.selectedItem)
        });
      }

      if (resp.status !== 201 && resp.status !== 204) {
        this.message = '❌ ';
        if (resp.headers.get('content-type') && resp.headers.get('content-type').indexOf('application/json') !== -1) {
          this.message += (await resp.json()).message;
        } else {
          this.message +=  `HTTP ${resp.status}`;
        }
        this.hasMessage = true;
        this.$forceUpdate();
        return;
      } else {
        this.message = '✅ '+(resp.status === 201 ? 'Create' : 'Save')+' successful';
        this.hasMessage = true;
        this.$forceUpdate();
      }

      if (resp.status === 201) {
        let id = resp.headers.get('location');
        id = id.split('/').slice(-1)[0];
        this.selectedItem.id = Number(id);
      }

      this.isDone(this.selectedItem);
    },
    close() {
      this.isDone(this.selectedItem);
    }
  },
  data: () => {
    return {
      message: null,
      hasMessage: false
    };
  }
}
</script>

<style lang="css" scoped>
/*.md-dialog /deep/.md-dialog-container {*/
/*  max-width: 768px;*/
/*}*/
  #edit-dialog {
    padding: 25px;
  }
</style>
