<template>
  <main>
    <md-card>
      <md-card-header>
        <h1>{{ this.contract_name }}</h1>
      </md-card-header>
      <md-card-content>
        <p><b>Total Contract Cost:</b> <span>USD ${{contract_cost}}</span></p>
        <div class="bar">
          <md-button class="md-raised md-primary" @click="backToContract()">
            Back to {{ this.contract_name }}
          </md-button>
        </div>
      </md-card-content>
    </md-card>

    <div>
        <md-card class="order-card">
          <md-card-header>
<!--            <h2 class="">Order No. {{ order.order.id }}</h2>-->
<!--            <h3 class="">Project No. {{ order.order.project_id }}</h3>-->
          </md-card-header>
          <md-card-content>
            <md-table v-model="items">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Item No" md-numeric>{{ item.to_supply.item_id }}</md-table-cell>
                <md-table-cell md-label="Item Name">{{ item.to_supply.item.name }}</md-table-cell>
                <md-table-cell md-label="Order Quantity" md-numeric>{{ item.total_quan }}</md-table-cell>
                <md-table-cell md-label="Item Price" md-numeric>USD ${{ item.to_supply.contract_price }}</md-table-cell>
                <md-table-cell md-label="Edit" md-numeric><md-button @click="viewOrders(item)" class="md-raised md-secondary">View Orders With This Item</md-button></md-table-cell>
                <!--            <md-table-cell md-label="Job Title" md-sort-by="title">{{ item.title }}</md-table-cell>-->
              </md-table-row>
            </md-table>
        </md-card-content>
      </md-card>
    </div>
  </main>
</template>

<script>
export default {
  name: "Invoice",
  methods: {
    backToContract() {
      document.location.href = `/contract/${this.$route.params.id}`
    },
    viewOrders(item) {
      document.location.href = `/order?item=${item.to_supply.item_id}&invoice=${this.$route.params.id}`;
    }
  },
  async created() {
    let invoiceId = this.$route.params.id;
    let [
      $contract,
      to_supplies
    ] = await Promise.all([
      (await fetch(`/api/db-app/contract/${invoiceId}`)).json(),
      (await fetch(`/api/db-app/to_supply?contract=${invoiceId}`)).json()
    ]);

    let contract = this.contract = $contract;
    this.contract_id = contract.id;
    this.contract_name = contract.name = `Contract No. ${contract.id}`;
    let contract_cost = 0;

    let orderMap = new Map();
    let itemMap = new Map();

    for (let to_supply of to_supplies) {
      let orderItems = await (await fetch(`/api/db-app/made?to_supply=${to_supply.id}`)).json();

      let itemDelta = itemMap.get(to_supply.id);
      if (!itemDelta) {
        itemDelta = {
          to_supply,
          items: [],
          itemCost: 0,
          itemQuantity: 0,
          total_quan: 0
        }

        itemMap.set(to_supply.id, itemDelta);
      }

      for (let orderItem of orderItems) {
        let set = orderMap.get(orderItem.order_id);
        if (!set) {
          set = { order: orderItem.order, items: [], order_cost: 0 };
          itemDelta.items = set.items;
          orderMap.set(orderItem.order_id, set);
        }

        set.items.push(orderItem);

        orderItem.price = (orderItem.to_supply.contract_price * orderItem.order_quan);

        itemDelta.itemQuantity += orderItem.order_quan;
        itemDelta.itemCost += orderItem.price;
        itemDelta.total_quan += orderItem.order_quan;

        set.order_cost = (set.order_cost || 0)+orderItem.price;
        contract_cost += set.order_cost;
      }
    }
    this.contract_cost = contract.contract_cost = contract_cost;
    this.orders = Array.from(orderMap.values());
    this.items = Array.from(itemMap.values());
    console.log(this.orders)
    this.$forceUpdate();
  },
  data() {
    return {
      invoice: {
        id: 0
      },
      orders: [],
      items: []
    }
  }
}
</script>

    <style scoped>
      main {
        max-width: 960px;
        margin: 0 auto;
        padding: 10px 20px;
      }

      main > div {
        margin: 10px 0;
      }
      .footer {
        text-align: left;
        padding: 10px;
      }
      .bar {
        display: flex;
        justify-content: left;
      }
      .order-card {
        margin: 10px 0;
      }
    </style>
