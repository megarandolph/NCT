  ///////////////////////
  // Global const
  ///////////////////////

const transactions = []
  
const updateFormButton = document.querySelector("button#updateitem")
const createButton = document.querySelector("button#createitem")
const mainHome = document.querySelector("main#Home")
const mainDetail = document.querySelector("main#Detail")
const SelectAccount = document.querySelector("Select#AccountId")

  
  ///////////////////////
  // Functions
  ///////////////////////
  const GetTransactions = () =>{

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "fa0d372d-a00f-47c5-b945-22b22005a669");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("http://63.135.170.173:5000/transactions", requestOptions)
    .then(response => response.json())
    .then(result => {
        if(result.success){
            var data = result.data;
            for(var i=0; i < data.length; i++){
                transactions.push(data[i])
                
            }
            console.log(transactions)
            renderData()           
        }else{
            console.log(result.errorMessage)
        }
    }
    )
    .catch(error => console.log('error', error));
  }
  
  const GetTransactionsById = (id) =>{
   var transactionDetail = transactions.find(x => x.id === id);
    const myTransactionString = JSON.stringify(transactionDetail);
    localStorage.setItem('transactionDetail', myTransactionString);
  }

  const renderData = () => {
    
    mainHome.innerHTML = ""
  

    transactions.forEach((transaction, index) => {
      const transactionDiv = document.createElement("div")
        transactionDiv.className = "card text-white bg-dark mb-3 col-md-4 m-2"
        transactionDiv.setAttribute("style","max-width: 18rem;")

      transactionDiv.innerHTML = 
      `<div class="card-header">${transaction.concept}</div>
      ` 

      const ButtonContainer = document.createElement("div")
      ButtonContainer.className = "row justify-content-center"

      const deleteButton = document.createElement(`button`)
      deleteButton.id = index
      deleteButton.className = "btn btn-danger col-md-4 m-2"
      deleteButton.innerText = "Delete" 
      deleteButton.addEventListener("click", event => {
        transactions.splice(index, 1) 
        renderData() 
        
      })
      ButtonContainer.appendChild(deleteButton) 
  

      const updateButton = document.createElement(`button`) 
      updateButton.id = transaction.id
      updateButton.className = "btn btn-primary col-md-4 m-2"
      updateButton.innerText = "Detail" 
      updateButton.addEventListener("click", event => {
        GetTransactionsById(updateButton.id)
        window.location = 'Description.html'

      })
      ButtonContainer.appendChild(updateButton) 

      transactionDiv.appendChild(ButtonContainer)

      mainHome.appendChild(transactionDiv) 
    })
  }
  
  const renderDataDetail = () =>{

    const myTransactionString = localStorage.getItem('transactionDetail');
    const transactionDetail = JSON.parse(myTransactionString);
    console.log(transactionDetail);

    mainDetail.innerHTML = ""
    const transactionDiv = document.createElement("div")
      transactionDiv.className = "card text-white bg-dark mb-3 col-md-4 m-2"
      transactionDiv.setAttribute("style","max-width: 18rem;")

    transactionDiv.innerHTML = 
    `<div class="card-header">${transactionDetail.concept}</div>`

    mainDetail.appendChild(transactionDiv) 
  }

  const createData = () => {
    
    renderData() 
  }
  
  const updateData = event => {
    
    renderData() 
  }
  
  ////////////////////
  // Main App Logic
  ////////////////////
  

  if(window.location.pathname.split("/").pop() == "Home.html"){
    GetTransactions()
  }
  else{
    renderDataDetail()
  }