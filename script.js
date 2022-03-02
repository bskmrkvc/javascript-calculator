$(document).ready(function() {
    const display = $('#display')
    let currentDisplay = '0';
    
    // trigger events
    $('.btn-numbers').on('click', insertNumbers)
    $('.btn-operation').on('click', insertOperation)
    $('#equals').on('click', getTheResult)
    $('#clear').on('click', clearDisplay)
    $('#decimal').on('click', insertDecimal)
    $('#zero').on('click', insertZero)

    function findIndexOfLastOperation (currentDisplay) {
      let lastIndex=0;
      for (let i of '+−×÷'){
        let ind = currentDisplay.lastIndexOf(i)
        if (lastIndex < ind) lastIndex = ind
      }
      return lastIndex
    }
    function isDisplayEndingWithOperator (currentDisplay) {
      return '+−×÷'.includes(currentDisplay.slice(-1))
    }
  
 
    function clearDisplay() {
      currentDisplay = '0'
      display.animate({'font-size': '0'}, 10)
      display.animate({'font-size': '35px'}, 200)
      display.text(currentDisplay)
    }
    
    function insertNumbers() {
      if (currentDisplay === '0') {
        currentDisplay = $(this).text()
      } else {
        currentDisplay += $(this).text()
      }
      display.text(currentDisplay)
    }
  
   
    function insertZero() {
      if (currentDisplay.length === 1 && currentDisplay !== '0'){
        currentDisplay += '0'
      } else if (currentDisplay.slice(-1) === '0'){
        if (!isDisplayEndingWithOperator(currentDisplay.slice(0, -1))){
          currentDisplay += '0'
        }
      } else {
        currentDisplay += '0'
      }
      display.text(currentDisplay)
    }
  
    function insertDecimal() {
      if (!currentDisplay.slice(findIndexOfLastOperation(currentDisplay)).includes('.')){
        if(isDisplayEndingWithOperator(currentDisplay)) {
        currentDisplay += '0.' 
        }else {
          currentDisplay += '.'
        }
        display.text(currentDisplay)
      }
    }
   
    function insertOperation() {
      if(currentDisplay !== '0'){
        if (currentDisplay.endsWith('.')){
          currentDisplay += '0'
        }
        display.css('font-size', '1px')
        display.animate({'font-size': '35px'}, 100)
        currentDisplay += $(this).text()
        display.text(currentDisplay)
      }
    }
   
    function getTheResult() {
      const parseEntry = currentDisplay => {
        let operators = []
        let operands = []
        
       
        operators = currentDisplay.split(/[0-9]+\.?[0-9]*/).filter(item => item !== '')
        
        
        operands = currentDisplay.split(/[+−×÷]+/).filter(item => item !== '')
        
      
        
        operators = operators.map(item => (
            (item[item.length-1] ==='−' && item.length > 1) ?
            item.slice(item.length-2) :
            item[item.length-1]
          )
        )
        
        
        let combinedResult = ''
        for (let i=0; i<operands.length; i++){
          combinedResult += operands[i]
          if (i < operators.length){
            combinedResult += operators[i]
          }
        }
        
        // Change [−×÷] to [-*/]
        let parsedResult = ''
        for (let i of combinedResult){
          if (i==='−')
            parsedResult += '-'
          else if (i==='×')
            parsedResult += '*'
          else if (i==='÷')
            parsedResult += '/'
          else
            parsedResult += i
        }
        return parsedResult.replace('--', '+')
       
      }
      console.log(parseEntry(currentDisplay))
      let finalResult;
      try {
        finalResult = eval(parseEntry(currentDisplay))
      } catch(err){
        alert('Bad input!')
        return
      }
  
      // Round off 
      let decimalPart = finalResult.toString().split('.')[1]
      if (decimalPart && decimalPart.length >= 5){
        finalResult = finalResult.toFixed(4)
      }
      
      display.css('font-size', '1px')
      display.animate({'font-size': '50px'}, 250)
      display.animate({'font-size': '35px'}, 250)
      currentDisplay = finalResult.toString()
      display.text(finalResult)
    }
  })