const payAmount=document.querySelector('#payAmount');
const decrementBtn=document.querySelectorAll('#decrementBtn');
const incrementBtn=document.querySelectorAll('#incrementBtn');
const quantity=document.querySelectorAll('#quantity');
const priceEle=document.querySelectorAll('#price');
const totalEle=document.querySelector('#total');
const progress=document.querySelector('#progress');
const validationDefault01=document.querySelector('#validationDefault01');
const validationDefault02=document.querySelector('#validationDefault02');

for(let i=0;i<incrementBtn.length;i++){
  incrementBtn[i].addEventListener('click',function(){
    let increment=Number(this.previousElementSibling.textContent);
    increment++;
    this.previousElementSibling.textContent=increment;
    totalCalc();
  });

  decrementBtn[i].addEventListener('click',function(){
    let decrement=Number(this.nextElementSibling.textContent);
    decrement<=1 ? 1 : decrement--;
    this.nextElementSibling.textContent=decrement;
    totalCalc();
  });
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

validationDefault01.addEventListener('focusout',function(){
  if(validationDefault01.textContent!=null){
    progress.style.width="5%";
  }
  else{
    progress.style.width="0%";
  }
})
validationDefault02.addEventListener('focusout',function(){
  if(validationDefault02.textContent!=null){
    progress.style.width="10%";
  }
  else{
    progress.style.width="0%";
  }
})










