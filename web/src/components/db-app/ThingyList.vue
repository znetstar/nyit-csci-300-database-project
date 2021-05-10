<template>
  <main>
    <NotifyBar :key="this.hasMessage" :has-message="this.hasMessage" :is-done="closeMessage" :message="this.message"></NotifyBar>
    <md-card>
      <md-card-header>
        <h1>{{ label() }}</h1>
      </md-card-header>

      <md-card-content>
        <div>
          <div>{{ this.$route.params.id ? 'Edit' : 'Create' }} {{this.label()}}</div>
          <div class="contract-row">
            <md-field>
              <label>{{   this.label() }} Num</label>
              <md-input required v-model="selectedContract.num" type="number"></md-input>
            </md-field>

            <md-datepicker v-if="type === 'contract'" required v-model="selectedContract.date">
              <label>{{ this.label() }} Date</label>
            </md-datepicker>
            <md-datepicker v-if="type === 'order'" required v-model="selectedContract.date_reqd">
              <label>Date Required</label>
            </md-datepicker>
            <md-datepicker v-if="type === 'order'" required v-model="selectedContract.date_comp">
              <label>Date Completed</label>
            </md-datepicker>
          </div>
        </div>
        <div v-if="type === 'contract'">
          <md-field>
            <label>{{ this.label() }} Supplier</label>
            <InputThingy class="thingy-wrapper" :on-change="onContractChange" :key="selectedContract.supplier_id" :id="selectedContract.supplier_id" type="supplier"></InputThingy>
          </md-field>
        </div>
        <div v-if="type === 'order'">
          <div class="contract-row">
            <md-field>
              <label>{{ this.label() }} Project</label>
              <InputThingy class="thingy-wrapper" :on-change="onOrderProjectChange(selectedContract)" :key="selectedContract.project_id" :id="selectedContract.project_id" type="project"></InputThingy>
            </md-field>
            <md-field>
              <label>Contract</label>
              <md-input disabled v-model="contractName"></md-input>
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <div class="add-item">
          <md-button @click="addItem()" v-if="type === 'contract' && this.$route.params.id && !this.list.map(l => l.id).includes(-1)" class="md-primary md-raised"  >
            Add Item
          </md-button>
          <md-button @click="addOrderItem()" v-if="type === 'order' && this.$route.params.id && !this.list.map(l => l.id).includes(-1)" class="md-primary md-raised"  >
            Add Item
          </md-button>
          <md-button @click="viewOrders()" v-if="this.$route.params.id && this.type === 'contract'"  class="md-secondary md-raised"  >
            View Orders
          </md-button>
          <md-button @click="viewInvoice()" v-if="this.$route.params.id && this.type === 'contract'"  class="md-secondary md-raised"  >
            View Invoice
          </md-button>
          <md-button @click="backToContract()" v-if="this.type === 'order' && !this.$route.params.id" class="md-primary md-raised"  >
            Back to {{ contractName }}
          </md-button>
        </div>
        <md-button class="md-icon-button md-raised" v-if="this.$route.params.id" @click="remove()">
          <md-icon>delete</md-icon>
        </md-button>
        <md-button v-if="!this.$route.params.id" @click="clear()">New</md-button>
        <md-button v-else-if="type === 'contract'" @click="back(true)">Back</md-button>
        <md-button v-else-if="type === 'order'" @click="backOrder(true)">Back</md-button>
        <md-button @click="save()">Save</md-button>
      </md-card-actions>
    </md-card>
    <md-table md-card v-model="this.list" v-if="!this.$route.params.id">
      <md-table-toolbar>
<!--        <h2 class="md-title">{{ this.label() }}s</h2>-->
      </md-table-toolbar>

      <md-table-row slot="md-table-row"  slot-scope="{ item }">
        <md-table-cell md-label="Num" md-numeric>{{ item.num  }}</md-table-cell>
        <md-table-cell md-label="Date"  v-if="type === 'contract'">{{ item.viewDate }}</md-table-cell>
        <md-table-cell md-label="Date Required"  v-if="type === 'order'">{{ item.viewDateRequired }}</md-table-cell>
        <md-table-cell md-label="Date Completed"  v-if="type === 'order'">{{ item.viewDateCompleted }}</md-table-cell>
        <md-table-cell md-label="Supplier" v-if="type === 'contract'">{{ item.supplier_name }}</md-table-cell>
        <md-table-cell md-label="View" >
            <md-button class="md-primary md-raised" @click="openItem(item, true)">
              Open
            </md-button>
        </md-table-cell>
      </md-table-row>

    </md-table>
    <md-table md-card v-model="this.list" v-else-if="this.list.length && type === 'contract'">
      <md-table-toolbar>
        <!--        <h2 class="md-title">{{ this.label() }}s</h2>-->
      </md-table-toolbar>

      <md-table-row v-if="item.edit && type === 'contract'" slot="md-table-row"  slot-scope="{ item }">
        <md-table-cell md-label="Item" md-numeric>
          <InputThingy
            :id="item.item_id"
            type="item"
            :on-change="onContractItemItemChange(item)"
          ></InputThingy>
        </md-table-cell>
        <md-table-cell md-label="Contact Amount" md-numeric>
          <md-field>
            <label>Contract Amount</label>
            <md-input required min="0" v-model="item.contract_amt" type="number"></md-input>
          </md-field>
        </md-table-cell>
<!--        <md-table-cell md-label="Amount Remaining" md-numeric>-->
<!--          <md-field>-->
<!--            <label>Amount Remaining</label>-->
<!--            <md-input required disabled min="0" v-model="item.contract_amt_remaining" type="number"></md-input>-->
<!--          </md-field>-->
<!--        </md-table-cell>-->
        <md-table-cell md-label="Contract Price" md-numeric>
          <md-field>
            <label>Contract Price</label>
            <md-input required min="0"  v-model="item.contract_price" type="number"></md-input>
          </md-field>
        </md-table-cell>
        <md-table-cell md-label="Save" class="save-panel">
          <md-button @click="saveContractItem(item)" class="md-icon-button md-primary md-raised">
            <md-icon>done</md-icon>
          </md-button>
          <md-button @click="deleteContractItem(item)" class="md-icon-button md-secondary md-raised">
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
      <md-table-row v-else-if="type === 'contract'" slot="md-table-row"  slot-scope="{ item }">
        <md-table-cell md-label="Item" md-numeric>{{ item.item_name  }}</md-table-cell>
        <md-table-cell md-label="Contact Amount" md-numeric>{{ item.contract_amt }}</md-table-cell>
        <md-table-cell md-label="Amount Remaining" md-numeric>{{ item.contract_amt_remaining || item.contract_amt  }}</md-table-cell>
        <md-table-cell md-label="Contract Price" md-numeric>USD ${{ item.contract_price }}</md-table-cell>
        <md-table-cell md-label="Edit">
          <md-button class="md-icon-button md-primary" @click="editContractItem(item)">
            <md-icon>edit</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>

    </md-table>

    <md-table md-card v-model="this.list" v-else-if="this.list.length && type === 'order'">
      <md-table-row v-if="item.edit && type === 'order'" slot="md-table-row"  slot-scope="{ item }">
        <md-table-cell md-label="Order Item" md-numeric>
          <md-field>
            <md-autocomplete md-layout="box" v-model="item.to_supply_name" :md-options="createToSupplyPool(item)" @md-selected="setToSupply">
              <label>Contract Item</label>

              <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                <md-highlight-text :md-term="term">{{ item.item_name }}</md-highlight-text>
              </template>
            </md-autocomplete>
          </md-field>
        </md-table-cell>
        <md-table-cell md-label="Order Amount" md-numeric>
          <md-field>
            <label>Order Amount</label>
            <md-input required min="0" v-model="item.order_quan" type="number"></md-input>
          </md-field>
        </md-table-cell>
<!--        <md-table-cell md-label="Order Price" md-numeric>-->
<!--          <md-field>-->
<!--            <label>Contract Price</label>-->
<!--            <md-input disabled required min="0"  v-model="item.contract_price" type="number"></md-input>-->
<!--          </md-field>-->
<!--        </md-table-cell>-->
        <md-table-cell md-label="Save" class="save-panel">
          <md-button @click="saveContractItem(item)" class="md-icon-button md-primary md-raised">
            <md-icon>done</md-icon>
          </md-button>
          <md-button @click="deleteContractItem(item)" class="md-icon-button md-secondary md-raised">
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
      <md-table-row v-else-if="type === 'order'" slot="md-table-row"  slot-scope="{ item }">
        <md-table-cell md-label="Order Item" md-numeric>{{ item.to_supply_name  }}</md-table-cell>
        <md-table-cell md-label="Order Amount" md-numeric>{{ item.order_quan }}</md-table-cell>
        <md-table-cell md-label="Item Price" md-numeric>USD ${{ item.to_supply_price }}</md-table-cell>
        <md-table-cell md-label="Edit">
          <md-button class="md-icon-button md-primary" @click="editContractItem(item)">
            <md-icon>edit</md-icon>
          </md-button>
        </md-table-cell>
    </md-table-row>
    </md-table>

  </main>
</template>

<script>
import InputThingy from "./InputThingy";
export default {
  name: "ThingyList",
  components: {InputThingy},
  props: [
  ],
  methods: {
    async remove() {
      let resp = await fetch(`/api/db-app/${this.type}/${this.$route.params.id}`, {
        method: 'DELETE'
      });
      if (resp && resp.status !== 204) {
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
        this.message = '✅ Delete successful';
        this.hasMessage = true;
        if (this.type === 'order') {
          await this.backOrder(true);
        } else {
          await this.back(true);
        }
      }
    },
    setToSupply(item) {
      let selectedItem = item.selectedItem;
      selectedItem.to_supply_id = item.id;
      selectedItem.to_supply_name = item.item.name;
      selectedItem.to_supply_price = item.contract_price;
      selectedItem.to_supply = item;
      selectedItem.to_supply_quantity = item.contract_amt;

      this.list.filter(f => f.id === selectedItem.id)[0] = selectedItem;
    },
     onOrderProjectChange(order) {
      return async (project) => {
        order.project = project;
        order.project_id = project.id;
        order.project_name = project.name;
      }
    },
    async backToContract() {
      document.location = this.$route.query.contract ? `/contract/${this.$route.query.contract}` : '/invoice/'+this.$route.query.invoice;
    },
    async editContractItem(item) {
      item.edit = true;
      this.$forceUpdate();
    },
    async saveContractItem(item) {
      let body = { ...item };

      if (this.type === 'order') {
        delete body.to_supply.selectedItem;
      }

      let resp;

      if (item.id !== -1) {
        resp = await fetch(`/api/db-app/${this.selectedItemType}/${item.id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        resp = await fetch(`/api/db-app/${this.selectedItemType}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json'
          }
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
        this.message = `✅ ${resp.status === 201 ? 'Create' : 'Save'} successful`;
        this.hasMessage = true;
      }

      if (resp.status === 201) {
        let id = resp.headers.get('location');
        id = id.split('/').slice(-1)[0];
        item.id = Number(id);
      }

      item.edit = false;
      this.$forceUpdate();
    },
    async deleteContractItem(item) {
      let resp;
      if (item.id !== -1) {
        await fetch(`/api/db-app/${this.selectedItemType}/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }


      if (resp && resp.status !== 204) {
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
        this.message = '✅ Delete successful';
        this.hasMessage = true;

        let i = -1;
        for (let ii = 0; ii < this.list.length; ii++) {
          if (this.list[ii].id === item.id) {
            i = ii;

            break;
          }
        }
        if (i !== -1) {
          this.list.splice(i, 1);
        }
        item.edit = false;
        this.$forceUpdate();
      }
    },
    onContractItemItemChange(contractItem) {
      return async (item) => {
          contractItem.item_id = item.id;
          contractItem.item_name = item.name;
          contractItem.item = item;
          console.log(contractItem, item)
      }
    },
    async loadOrders() {
      this.list = await (await fetch(`/api/db-app/order?contract=${this.$route.query.contract}`)).json();
      this.$forceUpdate();
    },
    async viewOrders() {
      document.location = `/order?contract=${this.$route.params.id}`;
    },
    async viewInvoice() {
      document.location = `/invoice/${this.$route.params.id}`;
    },
    createToSupplyPool(item) {
      let existingNames = this.list.map(l => l.to_supply_name);
      return this.toSupplyPool.slice(0).filter(f => !existingNames.includes(f.to_supply_name || f.item.name)).map(t => {
        t.selectedItem = item;
        return t;
      });
    },
    addItem() {
      this.isOpen = true;
      this.list.unshift({ id: -1, edit: true, contract_id: this.$route.params.id });
    },
    addOrderItem() {
      this.isOpen = true;
      this.list.unshift({ id: -1, edit: true, order_id: this.$route.params.id, to_supply_id: 0 });
    },
    closeMessage() {
      this.hasMessage = false;
      this.message = null;
    },
    onContractChange(item) {
      this.selectedContract.supplier.id = item.id;
      this.selectedContract.supplier_id = item.id;
      this.selectedContract.supplier_name = item.name;
    },
    async save() {
      let resp;

      if (this.type === 'order') {
        if (!this.contractId) throw new Error(`Must have id`);
        this.selectedContract.contract_id = this.contractId;
      }

      if (this.selectedContract.id !== -1) {
        resp = await fetch(`/api/db-app/${this.type}/${this.selectedContract.id}`, {
          method: 'PUT',
          body: JSON.stringify(this.selectedContract),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        resp = await fetch(`/api/db-app/${this.type}`, {
          method: 'POST',
          body: JSON.stringify(this.selectedContract),
          headers: {
            'Content-Type': 'application/json'
          }
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
        this.message = `✅ ${resp.status === 201 ? 'Create' : 'Save'} successful`;
        this.hasMessage = true;
        this.$forceUpdate();
      }

      if (resp.status === 201) {
        let id = resp.headers.get('location');
        id = id.split('/').slice(-1)[0];
        this.selectedContract.id = Number(id);

        this.list.unshift(this.selectedContract);

        if (this.type === 'order')
          this.list = this.list.map((v) => {
            v.viewDateRequired = require('moment')(v.date_reqd).format('MM/DD/YYYY');
            v.viewDateCompleted = require('moment')(v.date_comp).format('MM/DD/YYYY');
            return v;
          });
        else if (this.type === 'contract')
          this.list = this.list.map((v) => {
            v.viewDate = require('moment')(v.date).format('MM/DD/YYYY');
            return v;
          });
      }
    },
    async back(hardRidr = false) {


      document.location = (!hardRidr ? '/#' : '')+'/contract';
      this.list = await (await fetch(`/api/db-app/contract`)).json();
      this.list = this.list.map((v) => {
        v.viewDate = require('moment')(v.date).format('MM/DD/YYYY');
        return v;
      });
    },
    async backOrder(hardRidr = false) {
      if (hardRidr) {
        document.location = `/order?${this.$route.query.item ? 'item' : 'contract'}=${this.$route.query.item || this.$route.query.contract}`;
        return;
      }

      if (this.$route.query.contract) {
        this.orderContract = await (await fetch(`/api/db-app/contract/${this.$route.query.contract}`)).json();
        this.contractName = `Contract No. ${this.orderContract.num}`;
        this.contractId = this.orderContract.id;
      } else if (this.$route.query.item) {
        this.orderContract = await (await fetch(`/api/db-app/contract/${this.$route.query.invoice}`)).json();
        this.contractName = `Invoice No. ${this.orderContract.num}`;
        this.contractId = this.orderContract.id;
      }



      this.list = await (await fetch(`/api/db-app/order?`+(!this.$route.query.item ? `contract=${this.contractId}` : `item=${this.$route.query.item}`))).json();
      this.list = this.list.map((v) => {
        v.viewDateRequired = require('moment')(v.date_reqd).format('MM/DD/YYYY');
        v.viewDateCompleted = require('moment')(v.date_comp).format('MM/DD/YYYY');
        v.to_supply_price = v.to_supply.price;
        return v;
      });
    },
    async openItem(item, hardRedirect) {
      document.location = (!hardRedirect ? '/#' : '') + '/'+this.type+'/'+item.id+(this.type === 'order' ? ( '?' + (this.$route.query.item ? ('item=' + this.$route.query.item)  : ('contract='+this.$route.query.contract))) : '');
      this.selectedContract = await (await fetch(`/api/db-app/${this.type}/${item.id}`)).json();


      if (this.type === 'contract') {
        this.selectedContract.date = new Date(this.selectedContract.date);
        this.selectedContract.viewDate = require('moment')(this.selectedContract.date).format('MM/DD/YYYY');
      } else if (this.type === 'order') {
        this.orderContract = this.selectedContract.contract;
        this.contractId = this.selectedContract.contract_id;
        this.contractName = `Contract No. ${this.contractId}`;
        this.selectedContract.date_reqd = new Date(this.selectedContract.date_reqd);
        this.selectedContract.viewDateRequired = require('moment')(this.selectedContract.date_reqd).format('MM/DD/YYYY');

        this.selectedContract.date_comp = new Date(this.selectedContract.date_comp);
        this.selectedContract.viewDateCompleted = require('moment')(this.selectedContract.date_comp).format('MM/DD/YYYY');
        this.toSupplyPool = await (await fetch(`/api/db-app/to_supply?contract=${this.contractId}`)).json();
        this.toSupplyPool = this.toSupplyPool.map(o => {
          o.toLowerCase = o.item.name.toLowerCase.bind(o.item);
          return o;
        });
      }

      this.selectedItemType = this.type === 'order' ? 'made' : 'to_supply',

      this.list = await (await fetch(`/api/db-app/${this.selectedItemType}?${this.type}=${this.$route.params.id}`)).json()
    },
    clear() {
      this.selectedContract = this.type === 'contract' ? { id: -1 , supplier: { id: 0 }, supplier_name: '' } : { id: -1, project: { id: 0 }, contract: this.orderContract, contract_id: this.orderContract.id, project_id: 0 } ;
    },
    label() {
      return this.type ? (this.type[0]).toUpperCase()+this.type.substr(1) : '';
    }
  },
  async created() {
    if (this.type === 'contract') {
      if (!this.$route.params.id) {
        await this.back();
      } else {
        await this.openItem({id: this.$route.params.id});
      }
    } else {
      if (!this.$route.params.id) {
        await this.backOrder();
      } else {
        await this.openItem({id: this.$route.params.id});
      }
    }

    this.$forceUpdate();
  },
  data() {
    let list = [];
    let type = this.$route.path.split('/')[1].split('?').shift();
    let selectedItem = type === 'contract' ? { id: 0, name: '' } : {
      id: 0,
      to_supply_id: 0,
      order_id: this.$route.params.id ? this.$route.params.id : 0
    };
    return  {
      list,
      contractName: null,
      isList: !this.$route.params.id,
      hasMessage: false,
      isOpen: false,
      toSupplyPool: [],
      message: null,
      type,
      selectedItemName: selectedItem.name,
      selectedItem,
      selectedItemType: this.type === 'order' ? 'made' : 'to_supply',
      selectedContract: { id: -1 , supplier: { id: 0 }, supplier_name: '' }
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

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 10px 20px;
}

main > div {
  margin: 10px 0;
}

.thingy-wrapper {
  margin-top: 24px;
}

.contract-row {
  display:flex;
}
.contract-row > div {
  padding: 0px 10px;
}
.md-field {
  padding-top: 20px !important;
}
.add-item {
  float: left;
  position: absolute;
  left: 15px;
  display:flex;
  flex-direction: row;
}
</style>
