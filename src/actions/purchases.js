import api from "../api";

export const addPurchase = (purchase) => (dispatch) => 
    api.purchase.addPurchase(purchase)


export const getPurchases = (purchases) => (dispatch) =>
    api.purchase.getPurchases(purchases)
