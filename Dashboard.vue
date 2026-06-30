<template>
<div class="hero-banner mb-4 text-center">
<div class="d-flex justify-content-end mb-3">
  <button
    class="btn btn-danger"
    @click="logout"
  >
    Logout
  </button>
</div>
  <img
    src="https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
    width="120"
  />
  <h1 class="mt-3 fw-bold">
    Smart Budget Planner
  </h1>

  <p class="text-muted">
    Track • Save • Grow 💰
  </p>

</div>
  <div class="container mt-4">
    <!-- Add Transaction -->
    <div class="card add-card shadow p-4 mb-4">

      <h2>💳 Add Transaction</h2>

      <input
        v-model="description"
        class="form-control mb-3"
        placeholder="Description"
      />

      <input
        v-model.number="amount"
        type="number"
        class="form-control mb-3"
        placeholder="Amount"
      />

      <select
        v-model="type"
        class="form-select mb-3"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        v-model="category"
        class="form-select mb-3"
      >
        <option value="Salary">Salary</option>
        <option value="Food">Food</option>
        <option value="Rent">Rent</option>
        <option value="Shopping">Shopping</option>
        <option value="Travel">Travel</option>
        <option value="Others">Others</option>
      </select>

      <input
        type="date"
        v-model="date"
        class="form-control mb-3"
      />

      <button
        class="btn btn-success w-100"
        @click="addTransaction"
      >
        Add Transaction
      </button>

    </div>

    <!-- Dashboard -->
    <div class="card dashboard-card shadow p-4 mb-4">

      <h2 class="text-white mb-4">📊 Dashboard</h2>

      <div class="row text-center">

        <div class="col-md-4 mb-3">
          <div class="stat income">
            <h5>Income</h5>
            <h3>₹{{ totalIncome }}</h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="stat expense">
            <h5>Expense</h5>
            <h3>₹{{ totalExpense }}</h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="stat balance">
            <h5>Balance</h5>
            <h3>₹{{ balance }}</h3>
          </div>
        </div>

      </div>

    </div>
<!-- Savings Goal -->
<div class="card shadow p-4 mb-4">

  <h2>🎯 Savings Goal</h2>

  <input
    type="number"
    class="form-control mb-3"
    placeholder="Enter Savings Goal"
    v-model.number="savingGoal"
  />

  <h5>
    Goal: ₹{{ savingGoal }}
  </h5>

  <h5>
    Current Savings: ₹{{ balance }}
  </h5>

  <div class="progress" style="height:30px">

    <div
      class="progress-bar bg-success"
      role="progressbar"
      :style="{ width: progress + '%' }"
    >

      {{ progress.toFixed(0) }}%

    </div>

  </div>

</div>
    <!-- Charts -->
    <div class="row mb-4">

      <div class="col-lg-6 mb-3">
        <PieChart
          :transactions="transactions"
        />
      </div>

      <div class="col-lg-6 mb-3">
        <BarChart
          :transactions="transactions"
        />
      </div>

    </div>

    <!-- Transaction History -->
    <div class="card history-card shadow p-4">

      <h2> 📜Transaction History</h2>

      <!-- Filters -->

      <div class="row mb-3">

        <div class="col-md-6">

          <select
            v-model="selectedCategory"
            class="form-select"
          >
            <option>All</option>
            <option>Salary</option>
            <option>Food</option>
            <option>Rent</option>
            <option>Shopping</option>
            <option>Travel</option>
            <option>Others</option>
          </select>

        </div>

        <div class="col-md-6">

          <input
            type="month"
            class="form-control"
            v-model="selectedMonth"
          />

        </div>

      </div>

      <table class="table table-hover table-striped">

        <thead>

          <tr>

            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="(item,index) in filteredTransactions"
            :key="index"
          >

            <td>{{ item.description }}</td>

            <td>{{ item.category }}</td>

            <td>{{ item.date }}</td>

            <td>

              <span
                :class="
                  item.type==='income'
                  ? 'text-success fw-bold'
                  : 'text-danger fw-bold'
                "
              >

                {{ item.type }}

              </span>

            </td>

            <td>

              ₹{{ item.amount }}

            </td>

          </tr>

          <tr
            v-if="filteredTransactions.length===0"
          >

            <td
              colspan="5"
              class="text-center"
            >
              No transactions found.
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  ref as dbRef,
  push,
  onValue
} from "firebase/database";
import { auth } from "../firebase/config";
import { db } from "../firebase/config";
import { signOut } from "firebase/auth";
import PieChart from "./PieChart.vue";
import BarChart from "./BarChart.vue";
// Form

const description = ref("");
const amount = ref(0);
const type = ref("income");
const category = ref("Salary");
const date = ref("");
const savingGoal = ref(50000);

// Transactions

const transactions = ref([]);

// Filters

const selectedCategory = ref("All");
const selectedMonth = ref("");

// Add Transaction
async function addTransaction() {

  if (!description.value || amount.value <= 0 || !date.value) {
    alert("Please fill all fields.");
    return;
  }

  const user = auth.currentUser;

  if (!user) return;

  const newTransaction = {
    description: description.value,
    amount: amount.value,
    type: type.value,
    category: category.value,
    date: date.value
  };

  try {

    await push(
      dbRef(db, `transactions/${user.uid}`),
      newTransaction
    );

  } catch (error) {

    console.error(error);

  }

  description.value = "";
  amount.value = 0;
  type.value = "income";
  category.value = "Salary";
  date.value = "";

}
// Totals

const totalIncome = computed(() =>

  transactions.value

    .filter(t => t.type === "income")

    .reduce((sum,t)=>sum+t.amount,0)

);

const totalExpense = computed(() =>

  transactions.value

    .filter(t => t.type === "expense")

    .reduce((sum,t)=>sum+t.amount,0)

);

const balance = computed(()=>

  totalIncome.value-totalExpense.value

);
import { onAuthStateChanged } from "firebase/auth";

onMounted(() => {

  onAuthStateChanged(auth, (user) => {

    if (!user) return;

    const transactionsRef = dbRef(
      db,
      `transactions/${user.uid}`
    );

    onValue(transactionsRef, (snapshot) => {

      const data = snapshot.val();

      if (data) {

        transactions.value = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

      } else {

        transactions.value = [];

      }

    });

  });

});
const progress = computed(() => {

  if (savingGoal.value <= 0)
    return 0;

  return Math.min(
    (balance.value / savingGoal.value) * 100,
    100
  );

});
//log out 
async function logout() {
  await signOut(auth);
}
// Filters

const filteredTransactions = computed(() => {

  return transactions.value.filter((t)=>{

    const categoryMatch =

      selectedCategory.value==="All"

      ||

      t.category===selectedCategory.value;

    const monthMatch =

      !selectedMonth.value

      ||

      t.date.startsWith(selectedMonth.value);

    return categoryMatch && monthMatch;

  });

});
</script>

<style scoped>
/* Background */
.card{
    background:#ffffff;
    border-radius:18px;
    box-shadow:0 10px 25px rgba(0,0,0,.15);
}
.card{
    border:none;
    border-radius:20px;
    overflow:hidden;
    background:white;
    box-shadow:0 10px 25px rgba(0,0,0,.08);
    transition:.4s;
}

.card:hover{
    transform:translateY(-8px) scale(1.02);
    box-shadow:0 20px 40px rgba(0,0,0,.15);
}

.add-card{
    background:rgba(255,255,255,.7);
    backdrop-filter:blur(12px);
}

.dashboard-card{
    background:linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899);
}

.history-card{
    background:#fffdf5;
}

h2{
    font-weight:bold;
    color:black;
}

.stat{

    padding:25px;

    border-radius:18px;

    color:white;

    transition:.3s;

}
.stat:hover{

    transform:scale(1.08);

}
.income{

    background:#2ecc71;

}

.expense{

    background:#e74c3c;

}

.balance{

    background:#3498db;

}

.table{

    margin-top:20px;

    border-radius:15px;

    overflow:hidden;

}

.table thead{

    background:linear-gradient(90deg,#4f46e5,#7c3aed);

    color:white;

}

.table tbody tr{

    transition:.3s;

}

.table tbody tr:hover{

    background:#eef4ff;

}

.form-control,
.form-select{

    border-radius:15px;

    transition:.3s;

}
.form-control:focus,
.form-select:focus{

    border-color:#7c3aed;
    box-shadow:0 0 12px rgba(124,58,237,.3);

}
.form-control[type="date"] {
  color: black;
  background-color: white;
}
.btn-success{

    background:#00c896;

    border:none;

    font-weight:bold;

    transition:.3s;

}
.btn-success:hover{

    background:#00a67d;

    transform:scale(1.02);

}
.goal-card{

    background:linear-gradient(135deg,#fff7cc,#ffe082);

}
.progress{

    height:28px;

    border-radius:20px;

    overflow:hidden;

}
.progress-bar{

    animation:grow 1.5s ease;

    font-weight:bold;

}
@keyframes grow{

from{

width:0;

}

}
.dashboard-card{

animation:float 3s ease-in-out infinite;

}

@keyframes float{

0%{

transform:translateY(0);

}

50%{

transform:translateY(-4px);

}

100%{

transform:translateY(0);

}
}
.hero-banner{

animation:fadeIn 1s;

}

.hero-banner img{

animation:rotateIcon 6s linear infinite;

}

@keyframes rotateIcon{

100%{

transform:rotate(360deg);

}

}

@keyframes fadeIn{

from{

opacity:0;

transform:translateY(-30px);

}

to{

opacity:1;

transform:translateY(0);

}

}
</style>