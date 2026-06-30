<template>
  <div class="card chart-card shadow p-3">

    <h4 class="text-center">
      📊 Income vs Expense
    </h4>

    <div style="height:320px">
      <Bar
        :data="chartData"
        :options="chartOptions"
      />
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";

import { Bar } from "vue-chartjs";

import {

Chart as ChartJS,

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend

} from "chart.js";

ChartJS.register(

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend

);

const props = defineProps({

transactions:Array

});

const chartData = computed(()=>{

const income = props.transactions

.filter(t=>t.type==="income")

.reduce((sum,t)=>sum+t.amount,0);

const expense = props.transactions

.filter(t=>t.type==="expense")

.reduce((sum,t)=>sum+t.amount,0);

return{

labels:["Income","Expense"],

datasets:[

{

label:"Amount",

data:[income,expense],

backgroundColor:[

"#00c853",

"#ff1744"

],

borderRadius:12

}

]

};

});

const chartOptions={

responsive:true,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:true

}

}

};
</script>

<style scoped>
.chart-card{
border-radius:18px;
}
</style>