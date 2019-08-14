const questionEl = document.querySelector('.survey-question')
const surveyNumEl = document.querySelector('.survey-num')
const choicesEl = document.querySelector('.choices')
const buttonEl = document.querySelector('.nav-buttons')
const containerEl = document.querySelector('.container')


const survey = [
    {
        id: 1,
        question: 'Expression C=i++ causes',
        choices: ['Value of i assigned to C and then i incremented by 1', 'i to be incremented by 1 and then value of i assigned to C','Value of i assigned to C', 'i to be incremented by 1'],
        correctAnswer: 'i to be incremented by 1 and then value of i assigned to C',
        answer: null
    },
    {
        id: 2,
        question: 'Which looping process is best used when the number of iterations is known?',
        choices: ['for', 'while', 'do-while', 'all looping processes require that the iterations be known'],
        correctAnswer: 'do-while',
        answer: null
    },
    {
        id: 3,
        question: 'What’s wrong? while( (i < 10) && (i > 24))',
        choices: ['the logical operator && cannot be used in a test condition', 'the while loop is an exit-condition loop', 'the test condition is always false', 'the test condition is always true'],
        correctAnswer: 'the test condition is always false',
        answer: null
    },
  {
        id: 4,
        question: 'A continue statement causes execution to skip to',
        choices: ['the return 0; statement', 'the first statement after the loop', 'the next iteration of the loop', 'the statement following the continue statement'],
        correctAnswer: 'the next iteration of the loop',
        answer: null
    },
  {
        id: 5,
        question: 'What’s wrong? for (int k = 2, k <=12, k++)',
        choices: ['the increment should always be ++k', 'the variable must always be the letter i when using a for loop', 'there should be a semicolon at the end of the statement', 'the commas should be semicolons'],
        correctAnswer: 'the commas should be semicolons',
        answer: null
    },
  {
        id: 6,
        question: 'Each pass through a loop is called a/an',
        choices: ['enumeration', 'iteration', 'culmination', 'pass through'],
        correctAnswer: 'iteration',
        answer: null
    },
  {
        id: 7,
        question: 'In C language, a hexadecimal number is represented by writing',
        choices: ['x', 'xo', 'ox','h'],
        correctAnswer: 'ox',
        answer: null
    },
  {
        id: 8,
        question: 'If a member needs to have unique value for all the objects of that same class, declare the member as',
        choices: ['Global variable outside class', 'Local variable inside constructor', 'Static variable inside class', 'Dynamic variable inside class'],
        correctAnswer: 'Global variable outside class',
        answer: null
    },
  {
        id: 9,
        question: 'In a group of nested loops, which loop is executed the most number of times?',
        choices: ['the outermost loop', 'the innermost loop', 'all loops are executed the same number of times', 'cannot be determined without knowing the size of the loops'],
        correctAnswer: 'all loops are executed the same number of times',
        answer: null
    },
  {
        id: 10,
        question: 'If there is more than one statement in the block of a for loop, which of the following must be placed at the beginning and the ending of the loop block?',
        choices: ['parentheses ( )', 'braces { }', 'brackets [ ].', 'arrows < >'],
        correctAnswer: '',
        answer: null
    }
]


const surveyState = {
    currentQuestion: 1
}


const navigateButtonClick = (e) => {
    if(e.target.id == 'next') {
        surveyState.currentQuestion++
        initialSurvey()
    }

    if(e.target.id == 'prev') {
        surveyState.currentQuestion--
        initialSurvey()
    }
}

const checkBoxHandler = (e, question) => {    
    //Check if the chekbox has selected before if it is remove selected
    if(!e.target.checked) {
        e.target.checked = false
        question.answer = null
        return
    }
    
    const allCheckBoxes = choicesEl.querySelectorAll('input')
    allCheckBoxes.forEach(checkBox => checkBox.checked = false)
    e.target.checked = true
    question.answer = e.target.value    
}

const getResults = () => {
    const correctAnswerCount = survey.filter(question => question.answer == question.correctAnswer).length
    const emptyQuestionCount = survey.filter(question => question.answer === null).length
    const wrongQuestionCount = survey.filter(question => question.answer !== null && question.answer != question.correctAnswer).length


    return {
        correct: correctAnswerCount,
        empty: emptyQuestionCount,
        wrong: wrongQuestionCount
    }
}


const renderQuestion = (question) => {    
    //Last question of survey
    const lastQuestion = survey[survey.length - 1]

    //Check if the all questions are answered if then insert some message
    if(surveyState.currentQuestion > lastQuestion.id) {
        const results = getResults()
        containerEl.innerHTML = `<h1 class="test-completed">Good Job! You have completed the mini quiz</h1>
        <p class="results-info"> You have <strong>${results.correct}</strong> correct, <strong>${results.wrong}</strong> wrong, <strong>${results.empty}</strong> empty answers</p>                        
        <span class="tick"></span>`
        return
                                
    }

    // Clean innerHTML before append
    surveyNumEl.innerHTML = ''
    choicesEl.innerHTML = ''
    buttonEl.innerHTML = ''
    // Render question and question id
    surveyNumEl.textContent = question.id + '-'
    questionEl.textContent = question.question
    // Render choices
    question.choices.forEach(choice => {
        const questionRowEl = document.createElement('p')
        questionRowEl.setAttribute('class','question-row')
        questionRowEl.innerHTML = `<label class="label">                                        
                                        <span class="choise">${choice}</span>
                                    </label>`
        //Create checkbox input
        const checkBoxEl = document.createElement('input')
        checkBoxEl.setAttribute('type', 'checkbox')
        // Bind checkboxHandler with event and current question
        checkBoxEl.addEventListener('change', (e) => checkBoxHandler(e, question))
        //Add answer to the input as a value
        checkBoxEl.value = choice
        //If question has answer already make it checked again
        if(question.answer === choice) {
            checkBoxEl.checked = true
        }
        //Insert into question row
        questionRowEl.firstChild.prepend(checkBoxEl)
        //Insert row to the wrapper
        choicesEl.appendChild(questionRowEl)                                    
    })

    //Next & Previous Buttons
    const prevButton = document.createElement('button')
    prevButton.classList.add('nav-button')
    prevButton.classList.add('prev')
    prevButton.id = 'prev'
    prevButton.textContent = 'Previous'
    prevButton.addEventListener('click', navigateButtonClick)

    const nextButton = document.createElement('button')
    nextButton.classList.add('nav-button')
    nextButton.classList.add('next')
    nextButton.id = 'next'
    nextButton.textContent = 'Next'
    nextButton.addEventListener('click', navigateButtonClick)



    //Display buttons according to survey current question
    if(question.id == 1){        
        buttonEl.appendChild(nextButton)
    } else if (surveyState.currentQuestion == lastQuestion) {
        buttonEl.appendChild(prevButton)
    } else {
        buttonEl.appendChild(prevButton)
        buttonEl.appendChild(nextButton)
    }   
    
}

const initialSurvey = () => {
    //Get the current question
    const currentQuestion = survey.find(question => question.id === surveyState.currentQuestion)
    // Render the currentQuestion
    renderQuestion(currentQuestion)    

}

initialSurvey()