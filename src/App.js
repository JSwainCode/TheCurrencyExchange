import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL ='https://api.exchangeratesapi.io/latest';


function App() {

  const[currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const[ amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency ){
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }


  useEffect(() => {
    fetch(BASE_URL)
    .then(results => results.json())
    .then (data => {
      const firstCurrrency = Object.keys(data.rates)[0]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrrency)
      setExchangeRate(data.rates[firstCurrrency]) 
      })
    }, [])

    useEffect(() => { 
      if(fromCurrency != null && toCurrency != null){
        fetch (`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
          .then(results => results.json())
          .then(data => setExchangeRate(data.rates[toCurrency]))
      }
 
    }, [fromCurrency, toCurrency])


    function handleFromAmountChange(e){
      setAmount(e.target.value)
      setAmountInFromCurrency(true)
    }

    function handleToAmountChange(e){
      setAmount(e.target.value)
      setAmountInFromCurrency(false)
    }

  return (
    <>
    

    <div className="box">
      <h1> Currency Exchange </h1> 
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency ={fromCurrency}
        onChangeCurrency = {e => setFromCurrency (e.target.value)}
        onChangeAmount = {handleFromAmountChange}
        amount = {fromAmount}

      />
      <div className="equals">=</div>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency ={toCurrency}
        onChangeCurrency = {e => setToCurrency (e.target.value)}
        onChangeAmount = {handleToAmountChange}
        amount={toAmount}
      />
      </div>

      <footer>Developed by Jaland Swain</footer>
    </>
  );
}

export default App;
