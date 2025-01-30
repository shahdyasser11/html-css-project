
const decrementBtn=document.querySelectorAll('#decrementBtn');
const incrementBtn=document.querySelectorAll('#incrementBtn');
const quantity=document.querySelectorAll('#quantity');
const priceEle=document.querySelectorAll('#price');
const totalEle = document.getElementById("total");
const progress=document.querySelector('#progress');
const validationFields = ['#validationDefault01','#validationDefault02','#validationDefault03','#validationDefault04','#validationDefault05','#validationDefault06','#validationDefault07','#validationDefault08','#validationDefault09','#exampleFormControlTextarea1'].map(selector => document.querySelector(selector));
let alertMesg=document.getElementById('alertMesg');

window.onload = addProductsToTable;




for(let i=0;i<incrementBtn.length;i++){
  incrementBtn[i].addEventListener('click',function(){
    let increment=Number(this.previousElementSibling.textContent);
    increment++;
    this.previousElementSibling.textContent=increment;
    totalCalc();
  })

  decrementBtn[i].addEventListener('click',function(){
    let decrement=Number(this.nextElementSibling.textContent);
    decrement<=1 ? 1 : decrement--;
    this.nextElementSibling.textContent=decrement;
    totalCalc();
  })
}

const totalCalc=function(){
  let total=0;
  let price=0;
  for(let i=0;i<quantity.length;i++){
    total += Number(quantity[i].textContent) * Number(priceEle[i].textContent);
  }
  totalEle.textContent=total.toFixed(2);
  payAmount.textContent=total.toFixed(2);
}


const ProgressBar = function () {
  let filledFields = 0;
  validationFields.forEach((field) => {
    if (field && field.value && field.value.trim() !== null) {
      filledFields++;
    }
  })
  const progressPercentage = (filledFields / validationFields.length) * 100;
  progress.style.width = `${progressPercentage}%`;
}

validationFields.forEach((field) => {
  if (field) {
    field.addEventListener('focusout',ProgressBar);
  }
})


function showMessage(){
  validationFields.forEach((field) => {
    if (field && field.value && field.value.trim() !== null ){
             
      let htmlData = `<div class="alert alert-success" role="alert">
      <strong>Success!</strong> Your order has been placed successfully
      </div> `;

      alertMesg.innerHTML=htmlData;

      setTimeout(() => {
      alertMesg.innerHTML = "";
      }, 5000);
            
    }else{
      let htmlData = `<div class="alert alert-danger" role="alert">
      <strong>Failed!</strong> Please fill all the fields
      </div> `;

      alertMesg.innerHTML=htmlData;

      setTimeout(() => {
      alertMesg.innerHTML = "";
      }, 5000);
    }
  })
}

function addProductsToTable() {
  let price = 10;
  let totalPrice = 0; 
  payElements.innerHTML = ""; 
  let addedItems = []; 

  for (let i = 0; i < productArray.length; i++) {
    let item = productArray[i];
    let itemCount = 0;

    if (addedItems.includes(item.strCategory)) {
      continue;
    }

    for (let j = 0; j < productArray.length; j++) {
      if (productArray[j].strCategory === item.strCategory) {
        itemCount++;
      }
    }

    addedItems.push(item.strCategory);

    const itemTotalPrice = price * itemCount;

    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    if(itemCount>1){
      nameCell.innerHTML = `${itemCount} x ${item.strCategory}`;

    }else{
      nameCell.innerHTML = item.strCategory;
    }
   
    const priceCell = document.createElement("td");
    priceCell.textContent = `${itemTotalPrice} $`;
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    payElements.appendChild(row);
    totalPrice += itemTotalPrice;
    price++;
  }
  totalEle.innerHTML = `${totalPrice} `;
}













