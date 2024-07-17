  ///////////////////////
  // Global const
  ///////////////////////

var transactions = []
  
const updateFormButton = document.querySelector("button#updateitem")
const createButton = document.querySelector("button#createitem")
const mainHome = document.querySelector("main#Home")
const mainDetail = document.querySelector("main#Detail")
const SelectAccount = document.querySelector("Select#AccountId")
const TextSearch = document.querySelector("input#TextSearch")
const ButtonSearch = document.querySelector("button#ButtonSearch")
var OrderAsc = true;


  
  ///////////////////////
  // Functions
  ///////////////////////
  const GetTransactions = () =>{
    transactions.length = 0
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
            if(OrderAsc){
              transactions.sort((a, b) => {
                if (a.concept.charAt(0) < b.concept.charAt(0)) {
                  return -1;
                }
                if (a.concept.charAt(0) > b.concept.charAt(0)) {
                  return 1;
                }
                return 0;
              }); 
            }     else{
              transactions.sort((a, b) => {
                if (a.concept.charAt(0) > b.concept.charAt(0)) {
                  return -1;
                }
                if (a.concept.charAt(0) < b.concept.charAt(0)) {
                  return 1;
                }
                return 0;
              });         
            } 
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

  const GetAccounts = () =>{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "fa0d372d-a00f-47c5-b945-22b22005a669");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://63.135.170.173:5000/accounts", requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.success){
          var data = result.data;
          for(var i=0; i < data.length; i++){
            const option = document.createElement('option');
            option.text = data[i].type+' '+data[i].currency;
            option.value = data[i].id;
            SelectAccount.add(option);
              
          }      
          }else{
            swal("Error", result.errorMessage, "error");
          }
        })
      .catch(error => console.log('error', error));
  }
  
  const PostTransaction = (raw) =>{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "fa0d372d-a00f-47c5-b945-22b22005a669");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://63.135.170.173:5000/transactions", requestOptions)
      .then(response => response.json())
      .then(result =>{
        if(result.success){
          swal("Successfully saved!", "click here to ok!", "success")
          .then(() => {
            $("#MyModal").modal('hide');
            CleanPostForm();
            GetTransactions();
          });
        }else{
          swal("Error", result.errorMessage, "error");
        }
      })
      .catch(error => console.log('error', error));
  }

  const PutTransaction = (raw) =>{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "fa0d372d-a00f-47c5-b945-22b22005a669");
    myHeaders.append("Content-Type", "application/json");
    
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      mode: 'cors'
    };
    
    fetch("http://63.135.170.173:5000/transactions", requestOptions)
      .then(response => response.json())
      .then(result =>{
        if(result.success){
          swal("Successfully edited!", "click here to ok!", "success")
                .then(() => {
                  window.location = 'index.html'
          });
        }else{
          swal("Error", result.errorMessage, "error");
        }
      })
      .catch(error => console.log('error', error));
  }


  const DeleteTransaction = (id)=>{
    var myHeaders = new Headers();
        myHeaders.append("Authorization", "fa0d372d-a00f-47c5-b945-22b22005a669");

        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch("http://63.135.170.173:5000/transactions/"+id, requestOptions)
          .then(response => response.json())
          .then(result => {
            if(result.success){
              swal("Successfully deleted!", "click here to ok!", "success")
              .then(() => {
                GetTransactions();
              });
            }else{
              swal("Can't delete", result.errorMessage, "error");
            }
          })
          .catch(error => console.log('error', error));
  }

  const CleanPostForm = ()=>{
    document.querySelector('input#Concept').value = '';
    document.querySelector('input#Description').value = '';
    document.querySelector('input#Ammount').value = '';
    document.querySelector('input#Date').value = '';
    document.querySelector('select#AccountId').value = '';
    document.querySelector('.needs-validation').classList.remove('was-validated');
  }

  const FillTransactionDetails = (transactionDetail) =>{

    var date = new Date(transactionDetail.date);

    var day = ("0" + (date.getDate() + 1)).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var today = date.getFullYear()+"-"+(month)+"-"+(day);

    document.querySelector('input#Concept').value = transactionDetail.concept;
    document.querySelector('input#Description').value = transactionDetail.description;
    document.querySelector('input#Ammount').value = transactionDetail.ammount;
    document.querySelector('input#Date').value = today;
  }

  const SearchTransaction = () =>{
    var concept = TextSearch.value;
    if(concept.length > 0){
      document.querySelector('label#NotFound').innerHTML = '';
      var transactionDetail = transactions.filter(x => x.concept === concept);  
      if(transactionDetail.length > 0){
        transactions.length = 0;
        transactionDetail.forEach((transaction, index)=>{
        transactions.push(transaction)
        })  
      }else{
        document.querySelector('label#NotFound').innerHTML = 'Not Found!';
      }
      renderData();

    }
    else{
      document.querySelector('label#NotFound').innerHTML = '';
      GetTransactions();
    }

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
      deleteButton.id = transaction.id
      deleteButton.className = "btn btn-danger col-md-4 m-2"
      deleteButton.innerText = "Delete" 
      deleteButton.addEventListener("click", event => {    
        DeleteTransaction(deleteButton.id);
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
    FillTransactionDetails(transactionDetail);
  }
  
  function check(e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)){
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }else{
      swal("Special characters are not allowed","","warning")
    }
  }

  ////////////////////
  // Main App Logic
  ////////////////////
  if(window.location.pathname.split("/").pop() == "index.html"){
    GetTransactions()
    GetAccounts()
    
    document.querySelector("button#myInput").addEventListener("click", event => {
      $("#MyModal").modal('show');
    })
    document.querySelector("button#ModalClose").addEventListener("click", event => {
      $("#MyModal").modal('hide');
    })    
    document.querySelector("button#Order").addEventListener("click", event => {
      if(OrderAsc){
        OrderAsc = false;
      }else{
        OrderAsc = true;
      }
      GetTransactions()
    })

    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {       
        event.preventDefault()
        event.stopPropagation()

      }else{
        event.preventDefault()
        var raw = JSON.stringify({
          "concept": document.querySelector('input#Concept').value,
          "description": document.querySelector('input#Description').value,
          "ammount": parseInt(document.querySelector('input#Ammount').value),
          "date": document.querySelector('input#Date').value,
          "accountId": document.querySelector('select#AccountId').value,
          "candidateId": "fa0d372d-a00f-47c5-b945-22b22005a669"
        });
        
        PostTransaction(raw);
        
      }
      form.classList.add('was-validated')

    }, false)});

    document.querySelector("button#ButtonSearch").addEventListener("click", event => {
      SearchTransaction();
    }) 

  }
  else{
    renderDataDetail()

    const myTransactionString = localStorage.getItem('transactionDetail');
    const transactionDetail = JSON.parse(myTransactionString);

    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {       
        event.preventDefault()
        event.stopPropagation()

      }else{
        event.preventDefault()
        var raw = JSON.stringify({
          "id": transactionDetail.id,
          "concept": document.querySelector('input#Concept').value,
          "description": document.querySelector('input#Description').value,
          "ammount": parseInt(document.querySelector('input#Ammount').value),
          "date": document.querySelector('input#Date').value        
        });
        
        PutTransaction(raw);
        
      }
      form.classList.add('was-validated')

    }, false)});
    
  }

 

  


  
