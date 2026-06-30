<template>
  <div class="card chart-card shadow p-3">
    <h4 class="text-center">🥧 Expense Breakdown</h4>

    <div style="height:320px">
      <Pie :data="chartData" :options="chartOptions" />
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { Pie } from "vue-chartjs";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const props = defineProps({
  transactions: Array
});

const chartData = computed(() => {

  const totals = {};

  props.transactions
    .filter(t => t.type === "expense")
    .forEach(t => {

      totals[t.category] =
        (totals[t.category] || 0) + t.amount;

    });

  return {

    labels: Object.keys(totals),

    datasets: [

      {

        data: Object.values(totals),

        backgroundColor: [

          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40"

        ],

        borderColor: "#ffffff",

        borderWidth: 3

      }

    ]

  };

});

const chartOptions = {

  responsive: true,

  plugins: {

    legend: {

      position: "bottom"

    }

  }

};
</script>

<style scoped>
.chart-card{
    border-radius:18px;
}
</style>