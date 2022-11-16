//обработчик событии, который отслеживает загрузку контента
document.addEventListener('DOMContentLoaded', function () {
  const btnOpenModal = document.querySelector('#btnOpenModal');
  const modalBlock = document.querySelector('#modalBlock');
  const closeModal = document.querySelector('#closeModal');
  const questionTitle = document.querySelector('#question');
  const formAnswers = document.querySelector('#formAnswers');
  const nextButton = document.querySelector('#next');
  const prevButton = document.querySelector('#prev');
  const sendButton = document.querySelector('#send');

  const firebaseConfig = {
    apiKey: 'AIzaSyAORpKz4l6WSuZKVcq4KwmhSY3mcaWLch4',
    authDomain: 'web5-bd509.firebaseapp.com',
    databaseURL: 'https://web5-bd509-default-rtdb.firebaseio.com',
    projectId: 'web5-bd509',
    storageBucket: 'web5-bd509.appspot.com',
    messagingSenderId: '512681031250',
    appId: '1:512681031250:web:e9af04f8140e8915a7118b',
    measurementId: 'G-J4YE9T9LZE',
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const getData = () => {
    formAnswers.textContent = 'LOAD';

    nextButton.classList.add('d-none');
    prevButton.classList.add('d-none');

    setTimeout(() => {
      firebase
        .database()
        .ref()
        .child('questions')
        .once('value')
        .then((snap) => playTest(snap.val()));
    }, 500);
  };

  // обработчики событий открытия/закрытия модального окна
  btnOpenModal.addEventListener('click', () => {
    modalBlock.classList.add('d-block');
    getData();
  });

  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
  });

  // функция запуска тестирования
  const playTest = (questions) => {
    const finalAnswers = [];
    let numberQuestion = 0;

    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
        const answerItem = document.createElement('div');

        answerItem.classList.add(
          'answers-item',
          'd-flex',
          'justify-content-center'
        );
        answerItem.innerHTML = `
        <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
          <label for="${answer.title}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src=${answer.url} alt="burger">
            <span>${answer.title}</span>
          </label>`;
        formAnswers.appendChild(answerItem);
      });
    };

    // функция рендеринга вопросов + ответов
    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = '';

      switch (true) {
        case numberQuestion >= 0 && numberQuestion <= questions.length - 1:
          questionTitle.textContent = `${questions[indexQuestion].question}`;
          renderAnswers(indexQuestion);
          nextButton.classList.remove('d-none');
          prevButton.classList.remove('d-none');
          sendButton.classList.add('d-none');
          break;
        case numberQuestion === 0:
          prevButton.classList.add('d-none');
          break;
        case numberQuestion === questions.length:
          nextButton.classList.add('d-none');
          prevButton.classList.add('d-none');
          sendButton.classList.remove('d-none');

          formAnswers.innerHTML = `
          <div class="form-group">
            <label for="numberPhone">Enter your number</label>
            <input type="phone" class="form-control" id="numberPhone"> 
          </div>`;
          break;
        default:
          formAnswers.textContent = 'Cnaсибо за пройденный тест!';
          setTimeout(() => {
            modalBlock.classList.remove('d-block');
          }, 2000);
          break;
      }
    };
    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      const obj = {};
      const inputs = [...formAnswers.elements].filter(
        (input) => input.checked || input.id === 'numberPhone'
      );

      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] = input.value;
        }
        if (numberQuestion === questions.length) {
          obj[`Hомер телеонa`] = input.value;
        }
      });
      finalAnswers.push(obj);
    };
    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    };
    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    };
    sendButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      firebase.database().ref().child('contacts').push(finalAnswers);
    };
  };
});
