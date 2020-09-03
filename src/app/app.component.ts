import { Component } from '@angular/core';
import {QuizserviceService} from './quizservice.service';

interface quizQuestion {
  question: string,
  correct_answer: string,
  incorrect_answers: [string]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  quizQuestionsList: [quizQuestion]
  quizQuestionsOptionsList: [string];
  question: string;
  currentQuestionNumber:number = 0;
  options;
  isAnswerCorrect: boolean;
  correctAnswerString: string = 'Congrats! Answer Correect'
  inCorrectAnswerString: string = 'Sorry! In Correect Answer'
  optionSelected: boolean = false;
  totalQuestionsCount: number;
  isNextButtonDisabled: boolean = true;
  resultList = [];
  isQuizCompleted: boolean = false;
  correctAnswer: string;

constructor(private quizService:QuizserviceService) {
 this.getQuizQuestions()
}

getQuizQuestions = () => {
  this.quizService.getQuizQuestions().subscribe(data => {
    this.quizQuestionsList  = data['results']
    this.totalQuestionsCount = this.quizQuestionsList.length;
    this.getQuizQuestionsOptionsList( this.quizQuestionsList)
   this.question = this.quizQuestionsList[0].question;
  })
}

getQuizQuestionsOptionsList = (data) => {
  this.quizQuestionsOptionsList  = data.map(list => {
    const {correct_answer,incorrect_answers} = list;
    return [correct_answer,...incorrect_answers] 
})
this.options = this.quizQuestionsOptionsList[0];
}

getNextQuestion() {   
  this.optionSelected = false;
  ++this.currentQuestionNumber;
  if(this.currentQuestionNumber > this.quizQuestionsList.length-1) {
      this.isQuizCompleted = true;
  }
  this.question = this.quizQuestionsList[this.currentQuestionNumber].question;
  this.options = this.quizQuestionsOptionsList[this.currentQuestionNumber];
}
getPreviousQuestion() {
  this.optionSelected = false;
  --this.currentQuestionNumber;
  this.question = this.quizQuestionsList[this.currentQuestionNumber].question;
  this.options = this.quizQuestionsOptionsList[this.currentQuestionNumber];
}

checkCorrectAnswer(e, answer: String) {
  this.optionSelected = true;
  this.correctAnswer = '';
  this.isNextButtonDisabled = this.optionSelected  ? false : true;
    if (e.target.checked) {
     if(this.quizQuestionsList[this.currentQuestionNumber]['correct_answer'] === answer) {
      this.isAnswerCorrect = true 
       this.resultList.push(this.currentQuestionNumber)
     }
     else {
       this.isAnswerCorrect = false;
       this.correctAnswer = this.quizQuestionsList[this.currentQuestionNumber]['correct_answer']
     }
    }    
  }
  startAgain =  ()  => {
    this.isQuizCompleted = false;
    this.currentQuestionNumber = 0;
    this.getQuizQuestions()
  }
}