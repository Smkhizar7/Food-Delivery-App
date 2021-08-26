let cData = localStorage.getItem("Current User");
let cUser = JSON.parse(cData);
let userId = cUser.User_Id;
let username = document.getElementById('uName');
username.innerHTML = cUser.User_Name;
let getRest = () => {
    let allData;
    let div = document.getElementById("content");
    div.innerHTML = `<h3 id="load1" class="loading">Loading...</h3>`;
    firebase.database().ref('restaurants').on('child_added', (data) => {
        allData = data.val();
        load1.setAttribute("class", "hidden");
        div.innerHTML += `<div class="card rest-card-div" onclick="move('${allData.Restaurant_Id}')">
        <h3 class="card-text h3">${allData.Restaurant_Name}</h3>
    </div>`;
    })
}
let move = (restId) => {
    localStorage.setItem("Restaurant_Id", restId)
    window.location.href = "./restaurant-page.html";
}
let products = () => {
    let restId = localStorage.getItem("Restaurant_Id");
    let productContent;
    let div = document.getElementById('rest-content');
    div.innerHTML = `<h1 id="load2" class="loading">Loading...</h1>`;
    firebase.database().ref('products').child(restId).on('child_added', (data) => {
        productContent = data.val();
        load2.setAttribute("class", "hidden");
        div.innerHTML += `<div class="card" style="width: 18rem;margin:20px;">
        <img src="${productContent.Item_Img_Url}" class="card-img-top" alt="${productContent.Item_Name}">
        <div class="card-body div-flex">
            <h5 class="card-title">Item Name : ${productContent.Item_Name}</h5>
            <p class="card-text">Price : ${productContent.Item_Price}</p>
            <p class="card-text">Category : ${productContent.Item_Category}</p>
            <p class="card-text">Delivery Type : ${productContent.Delivery_Type}</p>
            <a href="javascript:void(0)" class="btn btn-primary" onclick="add('${productContent.Restaurant_Id}','${productContent.Product_Id}','${productContent.Item_Name}','${productContent.Item_Price}','${productContent.Item_Category}','${productContent.Delivery_Type}')">Add to Cart</a>
        </div>
    </div>`;
    })
}
let add = (restId, productId, itemName, itemPrice, itemCategory, itemDelivery) => {
    let alert4 = document.getElementById('alert4');
    alert4.setAttribute("class", "hidden");
    let key = firebase.database().ref("orders").child(restId).push().key;
    let obj = {
        Restaurant_Id: restId,
        Product_Id: productId,
        Customer_Id: userId,
        Item_Name: itemName,
        Item_Price: itemPrice,
        Item_Category: itemCategory,
        Item_Delivery_Type: itemDelivery,
        Order_Id: key,
        Order_Status: "Pending"
    };
    firebase.database().ref("orders").child(restId).child(key).set(obj);
    alert4.setAttribute("class", "alert alert-success");
}
let order = () => {
    let rest;
    let div = document.getElementById('cust-orders');
    div.innerHTML = `<h1 id="load3" class="loading">Loading...</h1>`;
    let content;
    let i = 1;
    content = `<table class="table table-striped">
        <thead class="thead-dark">
            <tr>
                <th scope="col">S.NO</th>
                <th scope="col">Item Name</th>
                <th scope="col">Item Price</th>
                <th scope="col">Item Category</th>
                <th scope="col">Item Delivery Type</th>
                <th scope="col">Order Status</th>
            </tr>
        </thead>
        <tbody>`;
    firebase.database().ref("orders").on("child_added", (data) => {
        rest = data.val();
        for (let key in rest) {
            if (rest[key].Customer_Id == userId) {
                content += `<tr>
                            <td scope="row">${i}</td>
                            <td>${rest[key].Item_Name}</td>
                            <td>${rest[key].Item_Price}</td>
                            <td>${rest[key].Item_Category}</td>
                            <td>${rest[key].Item_Delivery_Type}</td>
                            <td>${rest[key].Order_Status}</td>
                        </tr>`;
                i++;
            }
        }
    });
    setTimeout(() => {
        content += `</tbody></table>`;
        div.innerHTML = content;
    }, 5000);
}
let logout = () => {
    localStorage.removeItem("Current User");
    localStorage.removeItem("Restaurant_Id");
    window.location.href = "./index.html";
}