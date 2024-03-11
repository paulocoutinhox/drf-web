<script setup>
import { ref } from 'vue';
import { Client, ResponseType } from '../drf/drf.js';

defineProps({
    msg: String,
})

const count = ref(0)

function makeRequest() {
    doLogin();
}

function doLogin() {
    const loginData = {
        username: "admin",
        password: "admin",
    };

    Client.shared.request("token/", "post", loginData, ResponseType.SINGLE, result => {
        if (result.success) {
            const data = result.data.data;

            if (data) {
                Client.shared.setAuthToken(data.access);
                console.log("Login Token: ", data.access);
                doGetCustomer();
            } else {
                console.log("Login Response: ", result.data.httpCode, " - ", result.data.success, " - ", result.data.message, " - ", result.data.errors);
            }
        } else {
            console.error("Login Error: ", result.error);
        }
    });
}

function doGetCustomer() {
    Client.shared.request("customer/1", "GET", null, ResponseType.SINGLE, result => {
        if (result.success) {
            const data = result.data.data;
            if (data) {
                console.log("Customer: ", data);

                doGetCustomers();
            } else {
                console.log("Get Customer Response: ", result.data.httpCode, " - ", result.data.success, " - ", result.data.message, " - ", result.data.errors);
            }
        } else {
            console.error("Error: ", result.error);
        }
    });
}

function doGetCustomers() {
    Client.shared.request("customer/", "GET", null, ResponseType.LIST, result => {
        if (result.success) {
            const data = result.data.data;
            if (data) {
                console.log("Response data: ", data);
            } else {
                console.log("Get Customers Response: ", result.data.httpCode, " - ", result.data.success, " - ", result.data.message, " - ", result.data.errors);
            }
        } else {
            console.error("Error: ", result.error);
        }
    });
}
</script>

<template>
    <h1>Django Rest Framework - Test</h1>

    <div class="card">
        <button type="button" @click="makeRequest">Make Request</button>
    </div>
</template>

<style scoped></style>
